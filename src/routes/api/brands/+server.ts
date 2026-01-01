import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { mockBrand } from '$lib/mock-data';

// GET /api/brands - List all brands
export const GET: RequestHandler = async () => {
    return json([{
        ...mockBrand,
        _count: {
            products: 3,
            campaigns: 3,
            influencers: 4
        }
    }]);
};

// POST /api/brands - Create a new brand (demo: no-op)
export const POST: RequestHandler = async ({ request }) => {
    const data = await request.json();
    const newBrand = {
        id: `brand-${Date.now()}`,
        ...data,
        _count: { products: 0, campaigns: 0, influencers: 0 }
    };
    return json(newBrand, { status: 201 });
};
