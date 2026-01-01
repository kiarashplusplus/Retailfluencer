import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
    createCampaignSchema,
    updateCampaignSchema,
    validateOrThrow
} from '$lib/schemas';

// GET /api/campaigns - List campaigns (requires brandId query param)
export const GET: RequestHandler = async ({ url, locals }) => {
    const brandId = url.searchParams.get('brandId');

    if (!brandId) {
        throw error(400, 'brandId query parameter is required');
    }

    const campaigns = await locals.db.campaign.findMany({
        where: { brandId },
        include: {
            product: { select: { id: true, name: true } },
            retailer: { select: { id: true, name: true } },
            _count: {
                select: {
                    couponAssignments: true,
                    redemptions: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return json(campaigns);
};

// POST /api/campaigns - Create a new campaign
export const POST: RequestHandler = async ({ request, locals }) => {
    const rawData = await request.json();

    // Validate input
    let data: ReturnType<typeof createCampaignSchema.parse>;
    try {
        data = validateOrThrow(createCampaignSchema, rawData);
    } catch (err) {
        throw error(400, err instanceof Error ? err.message : 'Invalid input');
    }

    try {
        const campaign = await locals.db.campaign.create({
            data: {
                brandId: data.brandId,
                productId: data.productId,
                retailerId: data.retailerId,
                name: data.name,
                discountType: data.discountType,
                discountValue: data.discountValue,
                campaignStart: new Date(data.startDate),
                campaignEnd: new Date(data.endDate),
                totalCirculation: data.maxRedemptions,
                status: 'active'
            }
        });

        return json(campaign, { status: 201 });
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create campaign';
        throw error(500, message);
    }
};
