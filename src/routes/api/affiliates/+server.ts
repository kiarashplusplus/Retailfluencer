import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { listAffiliates, createAffiliate } from '$lib/services/affiliate';

// GET /api/affiliates?brandId=xxx
export const GET: RequestHandler = async ({ url }) => {
    const brandId = url.searchParams.get('brandId');

    if (!brandId) {
        throw error(400, 'brandId query parameter is required');
    }

    const affiliates = await listAffiliates(brandId);

    return json(affiliates);
};

// POST /api/affiliates - Create affiliate from customer
export const POST: RequestHandler = async ({ request }) => {
    const data = await request.json();

    if (!data.customerId) {
        throw error(400, 'Missing required field: customerId');
    }

    try {
        const affiliate = await createAffiliate(data.customerId, {
            commissionPercent: data.commissionPercent || 10,
        });

        return json(affiliate, { status: 201 });
    } catch (err) {
        throw error(400, err instanceof Error ? err.message : 'Failed to create affiliate');
    }
};
