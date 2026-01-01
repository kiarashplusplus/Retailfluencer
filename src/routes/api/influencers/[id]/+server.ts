import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// GET /api/influencers/[id] - Get influencer details with assignments
export const GET: RequestHandler = async ({ params, locals }) => {
    const influencer = await locals.db.influencer.findUnique({
        where: { id: params.id },
        include: {
            brand: true,
            couponAssignments: {
                include: {
                    campaign: {
                        select: { id: true, name: true, status: true }
                    }
                }
            }
        }
    });

    if (!influencer) {
        throw error(404, 'Influencer not found');
    }

    return json(influencer);
};

// PATCH /api/influencers/[id] - Update influencer
export const PATCH: RequestHandler = async ({ params, request, locals }) => {
    const data = await request.json();

    const influencer = await locals.db.influencer.update({
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
export const DELETE: RequestHandler = async ({ params, locals }) => {
    await locals.db.influencer.delete({
        where: { id: params.id }
    });

    return json({ success: true });
};
