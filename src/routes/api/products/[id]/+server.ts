import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// GET /api/products/[id] - Get a single product
export const GET: RequestHandler = async ({ params, locals }) => {
    const product = await locals.db.product.findUnique({
        where: { id: params.id },
        include: {
            brand: true,
            campaigns: {
                select: { id: true, name: true, status: true }
            }
        }
    });

    if (!product) {
        throw error(404, 'Product not found');
    }

    return json(product);
};

// PATCH /api/products/[id] - Update a product
export const PATCH: RequestHandler = async ({ params, request, locals }) => {
    const data = await request.json();

    const product = await locals.db.product.update({
        where: { id: params.id },
        data: {
            name: data.name,
            sku: data.sku,
            gtin: data.gtin,
            cogs: data.cogs,
            retailPrice: data.retailPrice,
            imageUrl: data.imageUrl
        }
    });

    return json(product);
};

// DELETE /api/products/[id] - Delete a product
export const DELETE: RequestHandler = async ({ params, locals }) => {
    await locals.db.product.delete({
        where: { id: params.id }
    });

    return json({ success: true });
};
