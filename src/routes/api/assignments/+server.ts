import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// POST /api/assignments - Assign a coupon (demo: no-op)
export const POST: RequestHandler = async ({ request }) => {
    const data = await request.json();
    return json({
        id: `assign-${Date.now()}`,
        campaignId: data.campaignId,
        influencerId: data.influencerId,
        serializedGs1: `01${'0'.repeat(14)}${Date.now().toString().slice(-6)}`,
        status: 'active'
    }, { status: 201 });
};
