import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createInfluencerSchema, updateInfluencerSchema, validateOrThrow } from '$lib/schemas';

// GET /api/influencers - List influencers (optionally filter by brandId)
export const GET: RequestHandler = async ({ url, locals }) => {
    const brandId = url.searchParams.get('brandId');

    const influencers = await locals.db.influencer.findMany({
        where: brandId ? { brandId } : undefined,
        include: {
            brand: {
                select: { name: true, slug: true }
            },
            _count: {
                select: {
                    couponAssignments: true,
                    redemptions: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return json(influencers);
};

// POST /api/influencers - Create a new influencer
export const POST: RequestHandler = async ({ request, locals }) => {
    const rawData = await request.json();

    // Validate input
    let data: ReturnType<typeof createInfluencerSchema.parse>;
    try {
        data = validateOrThrow(createInfluencerSchema, rawData);
    } catch (err) {
        throw error(400, err instanceof Error ? err.message : 'Invalid input');
    }

    const influencer = await locals.db.influencer.create({
        data: {
            brandId: data.brandId,
            name: data.name,
            email: data.email,
            instagramHandle: data.instagramHandle,
            tiktokHandle: data.tiktokHandle
        }
    });

    return json(influencer, { status: 201 });
};
