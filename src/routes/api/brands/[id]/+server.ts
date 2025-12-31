import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';

// GET /api/brands/[id] - Get brand details
export const GET: RequestHandler = async ({ params }) => {
    const brand = await db.brand.findUnique({
        where: { id: params.id },
        include: {
            products: true,
            campaigns: {
                include: {
                    product: true,
                    retailer: true
                }
            },
            influencers: true,
            _count: {
                select: {
                    products: true,
                    campaigns: true,
                    influencers: true,
                    customers: true
                }
            }
        }
    });

    if (!brand) {
        throw error(404, 'Brand not found');
    }

    return json(brand);
};

// PATCH /api/brands/[id] - Update brand
export const PATCH: RequestHandler = async ({ params, request }) => {
    const data = await request.json();

    const brand = await db.brand.update({
        where: { id: params.id },
        data: {
            name: data.name,
            logoUrl: data.logoUrl,
            tcbFunderId: data.tcbFunderId
        }
    });

    return json(brand);
};

// DELETE /api/brands/[id] - Delete brand
export const DELETE: RequestHandler = async ({ params }) => {
    await db.brand.delete({
        where: { id: params.id }
    });

    return json({ success: true });
};
