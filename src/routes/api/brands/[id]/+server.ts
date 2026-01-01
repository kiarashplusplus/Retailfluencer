import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { mockBrand } from '$lib/mock-data';

// GET /api/brands/[id]
export const GET: RequestHandler = async ({ params }) => {
    if (params.id === mockBrand.id || params.id === 'demo-brand-001') {
        return json(mockBrand);
    }
    return json({ error: 'Brand not found' }, { status: 404 });
};

// PATCH /api/brands/[id]
export const PATCH: RequestHandler = async ({ params, request }) => {
    const data = await request.json();
    return json({ id: params.id, ...data });
};

// DELETE /api/brands/[id]
export const DELETE: RequestHandler = async () => {
    return json({ success: true });
};
