import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// GET /api/retailers/[id] - Get a single retailer
export const GET: RequestHandler = async ({ params, locals }) => {
    const retailer = await locals.db.retailer.findUnique({
        where: { id: params.id }
    });

    if (!retailer) {
        throw error(404, 'Retailer not found');
    }

    return json(retailer);
};

// PATCH /api/retailers/[id] - Update a retailer
export const PATCH: RequestHandler = async ({ params, request, locals }) => {
    const data = await request.json();

    const retailer = await locals.db.retailer.update({
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
export const DELETE: RequestHandler = async ({ params, locals }) => {
    await locals.db.retailer.delete({
        where: { id: params.id }
    });

    return json({ success: true });
};
