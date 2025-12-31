import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import {
    createCampaignSchema,
    updateCampaignSchema,
    validateOrThrow
} from '$lib/schemas';
import { createCampaign, listCampaigns } from '$lib/services/campaign';

// GET /api/campaigns - List campaigns (requires brandId query param)
export const GET: RequestHandler = async ({ url }) => {
    const brandId = url.searchParams.get('brandId');

    if (!brandId) {
        throw error(400, 'brandId query parameter is required');
    }

    const campaigns = await listCampaigns(brandId);
    return json(campaigns);
};

// POST /api/campaigns - Create a new campaign
export const POST: RequestHandler = async ({ request }) => {
    const rawData = await request.json();

    // Validate input
    let data: ReturnType<typeof createCampaignSchema.parse>;
    try {
        data = validateOrThrow(createCampaignSchema, rawData);
    } catch (err) {
        throw error(400, err instanceof Error ? err.message : 'Invalid input');
    }

    try {
        const campaign = await createCampaign({
            brandId: data.brandId,
            productId: data.productId,
            retailerId: data.retailerId,
            name: data.name,
            discountType: data.discountType,
            discountValue: data.discountValue,
            startDate: data.startDate,
            endDate: data.endDate,
            maxRedemptions: data.maxRedemptions,
            funderId: data.funderId
        });

        return json(campaign, { status: 201 });
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create campaign';
        throw error(500, message);
    }
};
