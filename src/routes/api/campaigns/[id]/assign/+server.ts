import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { assignCouponToInfluencer } from '$lib/services/coupon-assignment';
import { db } from '$lib/server/db';

// POST /api/campaigns/[id]/assign - Assign coupon to influencer
export const POST: RequestHandler = async ({ params, request }) => {
    const data = await request.json();

    if (!data.influencerId) {
        throw error(400, 'influencerId is required');
    }

    try {
        const result = await assignCouponToInfluencer({
            campaignId: params.id,
            influencerId: data.influencerId
        });

        return json({
            assignment: result.assignment,
            trackingLink: result.trackingLink,
            qrCodeUrl: result.qrCodeUrl
        }, { status: 201 });
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to assign coupon';
        throw error(400, message);
    }
};

// GET /api/campaigns/[id]/assign - List all assignments for campaign
export const GET: RequestHandler = async ({ params }) => {
    const assignments = await db.couponAssignment.findMany({
        where: { campaignId: params.id },
        include: {
            influencer: true
        },
        orderBy: { createdAt: 'desc' }
    });

    return json(assignments);
};
