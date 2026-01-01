import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// GET /api/affiliates?brandId=xxx
export const GET: RequestHandler = async ({ url, locals }) => {
    const brandId = url.searchParams.get('brandId');

    if (!brandId) {
        throw error(400, 'brandId query parameter is required');
    }

    const affiliates = await locals.db.affiliate.findMany({
        where: { brandId },
        include: {
            customer: {
                select: { email: true, phone: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return json(affiliates);
};

// POST /api/affiliates - Create affiliate from customer
export const POST: RequestHandler = async ({ request, locals }) => {
    const data = await request.json();

    if (!data.customerId) {
        throw error(400, 'Missing required field: customerId');
    }

    try {
        // Get customer to get brandId
        const customer = await locals.db.customer.findUnique({
            where: { id: data.customerId }
        });

        if (!customer) {
            throw error(404, 'Customer not found');
        }

        // Generate unique affiliate code
        const code = `REF${Date.now().toString(36).toUpperCase()}`;

        const affiliate = await locals.db.affiliate.create({
            data: {
                customerId: data.customerId,
                brandId: customer.brandId,
                code,
                commissionPercent: data.commissionPercent || 10
            }
        });

        // Mark customer as affiliate
        await locals.db.customer.update({
            where: { id: data.customerId },
            data: { isAffiliate: true }
        });

        return json(affiliate, { status: 201 });
    } catch (err) {
        throw error(400, err instanceof Error ? err.message : 'Failed to create affiliate');
    }
};
