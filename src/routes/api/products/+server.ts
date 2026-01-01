import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { mockProducts } from '$lib/mock-data';

// GET /api/products - List all products
export const GET: RequestHandler = async ({ url }) => {
    const brandId = url.searchParams.get('brandId');
    const products = brandId
        ? mockProducts.filter(p => p.brandId === brandId || brandId === 'demo-brand-001')
        : mockProducts;
    return json(products);
};

// POST /api/products - Create a new product (demo: no-op)
export const POST: RequestHandler = async ({ request }) => {
    const data = await request.json();
    const newProduct = {
        id: `prod-${Date.now()}`,
        ...data,
        brand: { name: 'HealthyLife Organics', slug: 'healthylife-organics' }
    };
    return json(newProduct, { status: 201 });
};
