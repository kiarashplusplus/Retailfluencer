import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { createProductSchema, updateProductSchema, validateOrThrow } from '$lib/schemas';

// GET /api/products - List all products (optionally filter by brandId)
export const GET: RequestHandler = async ({ url }) => {
    const brandId = url.searchParams.get('brandId');

    const products = await db.product.findMany({
        where: brandId ? { brandId } : undefined,
        include: {
            brand: {
                select: { name: true, slug: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return json(products);
};

// POST /api/products - Create a new product
export const POST: RequestHandler = async ({ request }) => {
    const rawData = await request.json();

    // Validate input
    let data: ReturnType<typeof createProductSchema.parse>;
    try {
        data = validateOrThrow(createProductSchema, rawData);
    } catch (err) {
        throw error(400, err instanceof Error ? err.message : 'Invalid input');
    }

    const product = await db.product.create({
        data: {
            brandId: data.brandId,
            name: data.name,
            sku: data.sku,
            gtin: data.gtin,
            cogs: data.cogs,
            retailPrice: data.retailPrice,
            imageUrl: data.imageUrl
        }
    });

    return json(product, { status: 201 });
};
