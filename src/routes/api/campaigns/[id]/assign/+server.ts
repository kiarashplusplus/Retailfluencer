import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// POST /api/campaigns/[id]/assign - Assign coupon to influencer
export const POST: RequestHandler = async ({ params, request, locals }) => {
    const data = await request.json();

    if (!data.influencerId) {
        throw error(400, 'influencerId is required');
    }

    try {
        // Get campaign with product for GTIN
        const campaign = await locals.db.campaign.findUnique({
            where: { id: params.id },
            include: { product: true }
        });

        if (!campaign) {
            throw error(404, 'Campaign not found');
        }

        // Generate GS1 code
        const gtin = campaign.product?.gtin || '00000000000000';
        const serial = Date.now().toString().slice(-6) + Math.random().toString().slice(2, 5);
        const serializedGs1 = `01${gtin}${serial}`;

        const assignment = await locals.db.couponAssignment.create({
            data: {
                campaignId: params.id,
                influencerId: data.influencerId,
                serializedGs1,
                status: 'active'
            }
        });

        // Generate tracking link
        const trackingLink = `/a/${assignment.id}`;

        return json({
            assignment,
            trackingLink,
            qrCodeUrl: null // QR generation would happen here
        }, { status: 201 });
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to assign coupon';
        throw error(400, message);
    }
};

// GET /api/campaigns/[id]/assign - List all assignments for campaign
export const GET: RequestHandler = async ({ params, locals }) => {
    const assignments = await locals.db.couponAssignment.findMany({
        where: { campaignId: params.id },
        include: {
            influencer: true
        },
        orderBy: { createdAt: 'desc' }
    });

    return json(assignments);
};
