import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// POST /api/campaigns/[id]/assign - Assign coupon (demo: no-op)
export const POST: RequestHandler = async ({ params, request }) => {
    const data = await request.json();
    return json({
        assignment: {
            id: `assign-${Date.now()}`,
            campaignId: params.id,
            influencerId: data.influencerId,
            serializedGs1: `01${'0'.repeat(14)}${Date.now().toString().slice(-6)}`,
            status: 'active'
        },
        trackingLink: `/a/assign-${Date.now()}`,
        qrCodeUrl: null
    }, { status: 201 });
};

// GET /api/campaigns/[id]/assign - List assignments (demo: empty)
export const GET: RequestHandler = async () => {
    return json([]);
};
