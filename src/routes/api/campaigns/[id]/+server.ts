import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// GET /api/campaigns/[id] - Get campaign details
export const GET: RequestHandler = async ({ params, locals }) => {
    const campaign = await locals.db.campaign.findUnique({
        where: { id: params.id },
        include: {
            product: true,
            retailer: true,
            couponAssignments: {
                include: { influencer: true }
            },
            _count: {
                select: { redemptions: true, couponAssignments: true }
            }
        }
    });

    if (!campaign) {
        throw error(404, 'Campaign not found');
    }

    return json(campaign);
};

// PATCH /api/campaigns/[id] - Update campaign
export const PATCH: RequestHandler = async ({ params, request, locals }) => {
    const data = await request.json();

    const campaign = await locals.db.campaign.update({
        where: { id: params.id },
        data: {
            name: data.name,
            discountType: data.discountType,
            discountValue: data.discountValue,
            campaignStart: data.startDate ? new Date(data.startDate) : undefined,
            campaignEnd: data.endDate ? new Date(data.endDate) : undefined,
            totalCirculation: data.maxRedemptions,
            status: data.status
        }
    });

    return json(campaign);
};

// DELETE /api/campaigns/[id] - Delete campaign
export const DELETE: RequestHandler = async ({ params, locals }) => {
    await locals.db.campaign.delete({
        where: { id: params.id }
    });

    return json({ success: true });
};
