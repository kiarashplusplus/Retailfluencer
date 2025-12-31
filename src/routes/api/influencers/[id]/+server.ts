import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { getInfluencerAssignments } from '$lib/services/coupon-assignment';

// GET /api/influencers/[id] - Get influencer details with assignments
export const GET: RequestHandler = async ({ params }) => {
    const influencer = await db.influencer.findUnique({
        where: { id: params.id },
        include: {
            brand: true
        }
    });

    if (!influencer) {
        throw error(404, 'Influencer not found');
    }

    const assignments = await getInfluencerAssignments(params.id);

    return json({
        ...influencer,
        assignments
    });
};

// PATCH /api/influencers/[id] - Update influencer
export const PATCH: RequestHandler = async ({ params, request }) => {
    const data = await request.json();

    const influencer = await db.influencer.update({
        where: { id: params.id },
        data: {
            name: data.name,
            email: data.email,
            instagramHandle: data.instagramHandle,
            tiktokHandle: data.tiktokHandle
        }
    });

    return json(influencer);
};

// DELETE /api/influencers/[id] - Delete influencer
export const DELETE: RequestHandler = async ({ params }) => {
    await db.influencer.delete({
        where: { id: params.id }
    });

    return json({ success: true });
};
