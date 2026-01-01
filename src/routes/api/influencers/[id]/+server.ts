import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { mockInfluencers } from '$lib/mock-data';

// GET /api/influencers/[id]
export const GET: RequestHandler = async ({ params }) => {
    const influencer = mockInfluencers.find(i => i.id === params.id);
    if (!influencer) {
        return json({ error: 'Influencer not found' }, { status: 404 });
    }
    return json(influencer);
};

// PATCH /api/influencers/[id]
export const PATCH: RequestHandler = async ({ params, request }) => {
    const data = await request.json();
    return json({ id: params.id, ...data });
};

// DELETE /api/influencers/[id]
export const DELETE: RequestHandler = async () => {
    return json({ success: true });
};
