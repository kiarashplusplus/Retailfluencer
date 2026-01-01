import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { mockRetailers } from '$lib/mock-data';

// GET /api/retailers/[id]
export const GET: RequestHandler = async ({ params }) => {
    const retailer = mockRetailers.find(r => r.id === params.id);
    if (!retailer) {
        return json({ error: 'Retailer not found' }, { status: 404 });
    }
    return json(retailer);
};

// PATCH /api/retailers/[id]
export const PATCH: RequestHandler = async ({ params, request }) => {
    const data = await request.json();
    return json({ id: params.id, ...data });
};

// DELETE /api/retailers/[id]
export const DELETE: RequestHandler = async () => {
    return json({ success: true });
};
