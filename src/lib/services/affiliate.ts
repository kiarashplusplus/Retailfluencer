import { db } from '$lib/server/db';

export interface AffiliateConfig {
    commissionPercent?: number;
}

/**
 * Generate a unique affiliate code from customer ID
 */
export function generateAffiliateCode(customerId: string): string {
    // Use first 8 chars of UUID + random suffix for uniqueness
    const prefix = customerId.replace(/-/g, '').slice(0, 6).toUpperCase();
    const suffix = Math.random().toString(36).slice(2, 5).toUpperCase();
    return `${prefix}${suffix}`;
}

/**
 * Create an affiliate from an existing customer
 */
export async function createAffiliate(
    customerId: string,
    config: AffiliateConfig = {}
): Promise<{
    id: string;
    code: string;
    commissionPercent: number;
    affiliateLink: string;
}> {
    // Get customer to access brandId
    const customer = await db.customer.findUnique({
        where: { id: customerId },
    });

    if (!customer) {
        throw new Error('Customer not found');
    }

    // Check if already an affiliate
    const existing = await db.affiliate.findUnique({
        where: { customerId },
    });

    if (existing) {
        return {
            id: existing.id,
            code: existing.code,
            commissionPercent: existing.commissionPercent,
            affiliateLink: `${process.env.APP_URL || 'http://localhost:5173'}/a/${existing.code}`,
        };
    }

    // Generate unique code
    let code = generateAffiliateCode(customerId);

    // Ensure uniqueness
    let attempts = 0;
    while (attempts < 5) {
        const existing = await db.affiliate.findUnique({ where: { code } });
        if (!existing) break;
        code = generateAffiliateCode(customerId);
        attempts++;
    }

    // Create affiliate
    const affiliate = await db.affiliate.create({
        data: {
            customerId,
            brandId: customer.brandId,
            code,
            commissionPercent: config.commissionPercent || 10,
        },
    });

    // Mark customer as affiliate
    await db.customer.update({
        where: { id: customerId },
        data: { isAffiliate: true },
    });

    console.log(`[Affiliate] Created affiliate ${code} for customer ${customerId}`);

    return {
        id: affiliate.id,
        code: affiliate.code,
        commissionPercent: affiliate.commissionPercent,
        affiliateLink: `${process.env.APP_URL || 'http://localhost:5173'}/a/${affiliate.code}`,
    };
}

/**
 * Get affiliate by code
 */
export async function getAffiliateByCode(code: string) {
    return db.affiliate.findUnique({
        where: { code },
        include: {
            customer: {
                select: {
                    id: true,
                    email: true,
                    totalRedemptions: true,
                },
            },
        },
    });
}

/**
 * List affiliates for a brand
 */
export async function listAffiliates(brandId: string) {
    return db.affiliate.findMany({
        where: { brandId },
        include: {
            customer: {
                select: {
                    id: true,
                    email: true,
                    totalRedemptions: true,
                    createdAt: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    });
}

/**
 * Update affiliate earnings (called when referred customer redeems)
 */
export async function recordAffiliateEarning(
    affiliateId: string,
    amount: number
) {
    return db.affiliate.update({
        where: { id: affiliateId },
        data: {
            totalEarnings: {
                increment: amount,
            },
        },
    });
}
