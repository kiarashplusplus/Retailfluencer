import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { mockRetailers } from '$lib/mock-data';

// GET /api/retailers - List all retailers
export const GET: RequestHandler = async () => {
    return json(mockRetailers);
};

// POST /api/retailers - Create a new retailer (demo: no-op)
export const POST: RequestHandler = async ({ request }) => {
    const data = await request.json();
    const newRetailer = {
        id: `ret-${Date.now()}`,
        ...data,
        _count: { campaigns: 0, redemptions: 0 }
    };
    return json(newRetailer, { status: 201 });
};
