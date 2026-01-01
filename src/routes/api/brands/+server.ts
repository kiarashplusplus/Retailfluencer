import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// GET /api/brands - List all brands
export const GET: RequestHandler = async ({ locals }) => {
    const brands = await locals.db.brand.findMany({
        include: {
            _count: {
                select: {
                    products: true,
                    campaigns: true,
                    influencers: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return json(brands);
};

// POST /api/brands - Create a new brand
export const POST: RequestHandler = async ({ request, locals }) => {
    const data = await request.json();

    if (!data.name || !data.slug) {
        throw error(400, 'Missing required fields: name, slug');
    }

    // Check for duplicate slug
    const existing = await locals.db.brand.findUnique({
        where: { slug: data.slug }
    });

    if (existing) {
        throw error(409, 'Brand with this slug already exists');
    }

    const brand = await locals.db.brand.create({
        data: {
            name: data.name,
            slug: data.slug,
            logoUrl: data.logoUrl,
            tcbFunderId: data.tcbFunderId
        }
    });

    return json(brand, { status: 201 });
};
