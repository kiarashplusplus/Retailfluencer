import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { mockCampaigns } from '$lib/mock-data';

// GET /api/campaigns - List campaigns
export const GET: RequestHandler = async ({ url }) => {
    const brandId = url.searchParams.get('brandId');
    const campaigns = brandId
        ? mockCampaigns.filter(c => c.brandId === brandId || brandId === 'demo-brand-001')
        : mockCampaigns;
    return json(campaigns);
};

// POST /api/campaigns - Create a new campaign (demo: no-op)
export const POST: RequestHandler = async ({ request }) => {
    const data = await request.json();
    const newCampaign = {
        id: `camp-${Date.now()}`,
        ...data,
        status: 'active',
        product: { id: data.productId, name: 'New Product' },
        retailer: { id: data.retailerId, name: 'New Retailer' },
        _count: { couponAssignments: 0, redemptions: 0 }
    };
    return json(newCampaign, { status: 201 });
};
