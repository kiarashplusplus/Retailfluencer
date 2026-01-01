import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { mockInfluencers } from '$lib/mock-data';

// GET /api/influencers - List influencers
export const GET: RequestHandler = async ({ url }) => {
    const brandId = url.searchParams.get('brandId');
    const influencers = brandId
        ? mockInfluencers.filter(i => i.brandId === brandId || brandId === 'demo-brand-001')
        : mockInfluencers;
    return json(influencers);
};

// POST /api/influencers - Create a new influencer (demo: no-op)
export const POST: RequestHandler = async ({ request }) => {
    const data = await request.json();
    const newInfluencer = {
        id: `inf-${Date.now()}`,
        ...data,
        totalRedemptions: 0,
        brand: { name: 'HealthyLife Organics', slug: 'healthylife-organics' },
        _count: { couponAssignments: 0, redemptions: 0 }
    };
    return json(newInfluencer, { status: 201 });
};
