import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { mockProducts } from '$lib/mock-data';

// GET /api/products/[id]
export const GET: RequestHandler = async ({ params }) => {
    const product = mockProducts.find(p => p.id === params.id);
    if (!product) {
        return json({ error: 'Product not found' }, { status: 404 });
    }
    return json(product);
};

// PATCH /api/products/[id]
export const PATCH: RequestHandler = async ({ params, request }) => {
    const data = await request.json();
    return json({ id: params.id, ...data });
};

// DELETE /api/products/[id]
export const DELETE: RequestHandler = async () => {
    return json({ success: true });
};
