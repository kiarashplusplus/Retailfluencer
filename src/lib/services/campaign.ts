import { db } from '$lib/server/db';
import type { CampaignStatus, DiscountType } from '$lib/schemas';

export interface CreateCampaignInput {
    brandId: string;
    productId: string;
    retailerId?: string;
    name: string;
    discountType: DiscountType;
    discountValue: number;
    startDate: Date;
    endDate: Date;
    maxRedemptions?: number;
    funderId?: string;
}

/**
 * Create a new campaign with auto-generated base GS1 code
 */
export async function createCampaign(input: CreateCampaignInput) {
    // Get product for GTIN
    const product = await db.product.findUnique({
        where: { id: input.productId }
    });

    if (!product) {
        throw new Error('Product not found');
    }

    // Validate dates
    if (input.endDate <= input.startDate) {
        throw new Error('End date must be after start date');
    }

    // Generate base GS1 (mock format matching TCB structure)
    const baseGs1 = generateBaseGs1(product.gtin || 'UNKNOWN', input.funderId || 'MOCK01');

    const campaign = await db.campaign.create({
        data: {
            brandId: input.brandId,
            productId: input.productId,
            retailerId: input.retailerId,
            name: input.name,
            discountType: input.discountType,
            discountValue: input.discountValue,
            baseGs1,
            campaignStart: input.startDate,
            campaignEnd: input.endDate,
            totalCirculation: input.maxRedemptions,
            status: 'active'
        }
    });

    return campaign;
}

/**
 * Generate a base GS1 code following 8112 format
 * Format: 8112 + offer code (10 digits from GTIN) + funder ID
 */
function generateBaseGs1(gtin: string, funderId: string): string {
    const prefix = '8112';
    const offerCode = gtin.slice(-10).padStart(10, '0');
    return `${prefix}${offerCode}${funderId}`;
}

/**
 * Get campaign by ID with relations
 */
export async function getCampaign(id: string) {
    return db.campaign.findUnique({
        where: { id },
        include: {
            brand: true,
            product: true,
            retailer: true,
            couponAssignments: {
                include: {
                    influencer: true
                }
            }
        }
    });
}

/**
 * List campaigns for a brand
 */
export async function listCampaigns(brandId: string) {
    return db.campaign.findMany({
        where: { brandId },
        include: {
            product: true,
            retailer: true,
            _count: {
                select: {
                    couponAssignments: true,
                    redemptions: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
}

/**
 * Update campaign status with type-safe enum
 */
export async function updateCampaignStatus(id: string, status: CampaignStatus) {
    return db.campaign.update({
        where: { id },
        data: { status }
    });
}
