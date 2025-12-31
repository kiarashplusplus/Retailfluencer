import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';

// GET /api/retailers - List all retailers
export const GET: RequestHandler = async () => {
    const retailers = await db.retailer.findMany({
        orderBy: { name: 'asc' },
        include: {
            _count: {
                select: {
                    campaigns: true
                }
            }
        }
    });

    return json(retailers);
};

// POST /api/retailers - Create a new retailer
export const POST: RequestHandler = async ({ request }) => {
    const data = await request.json();

    if (!data.name || !data.slug) {
        throw error(400, 'Missing required fields: name, slug');
    }

    // Check for duplicate slug
    const existing = await db.retailer.findUnique({
        where: { slug: data.slug }
    });

    if (existing) {
        throw error(409, 'Retailer with this slug already exists');
    }

    const retailer = await db.retailer.create({
        data: {
            name: data.name,
            slug: data.slug,
            logoUrl: data.logoUrl,
            supports8112: data.supports8112 ?? true,
            regions: data.regions ? JSON.stringify(data.regions) : null
        }
    });

    return json(retailer, { status: 201 });
};
