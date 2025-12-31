import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';

// GET /api/retailers/[id] - Get a single retailer
export const GET: RequestHandler = async ({ params }) => {
    const retailer = await db.retailer.findUnique({
        where: { id: params.id }
    });

    if (!retailer) {
        throw error(404, 'Retailer not found');
    }

    return json(retailer);
};

// PATCH /api/retailers/[id] - Update a retailer
export const PATCH: RequestHandler = async ({ params, request }) => {
    const data = await request.json();

    const retailer = await db.retailer.update({
        where: { id: params.id },
        data: {
            name: data.name,
            logoUrl: data.logoUrl,
            supports8112: data.supports8112,
            regions: data.regions ? JSON.stringify(data.regions) : undefined
        }
    });

    return json(retailer);
};

// DELETE /api/retailers/[id] - Delete a retailer
export const DELETE: RequestHandler = async ({ params }) => {
    await db.retailer.delete({
        where: { id: params.id }
    });

    return json({ success: true });
};
