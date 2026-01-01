import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { mockCampaigns } from '$lib/mock-data';

// GET /api/campaigns/[id]
export const GET: RequestHandler = async ({ params }) => {
    const campaign = mockCampaigns.find(c => c.id === params.id);
    if (!campaign) {
        return json({ error: 'Campaign not found' }, { status: 404 });
    }
    return json(campaign);
};

// PATCH /api/campaigns/[id]
export const PATCH: RequestHandler = async ({ params, request }) => {
    const data = await request.json();
    return json({ id: params.id, ...data });
};

// DELETE /api/campaigns/[id]
export const DELETE: RequestHandler = async () => {
    return json({ success: true });
};
