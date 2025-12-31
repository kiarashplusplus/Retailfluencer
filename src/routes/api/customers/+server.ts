import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';

// GET /api/customers?brandId=xxx
export const GET: RequestHandler = async ({ url }) => {
    const brandId = url.searchParams.get('brandId');

    if (!brandId) {
        throw error(400, 'brandId query parameter is required');
    }

    const customers = await db.customer.findMany({
        where: { brandId },
        orderBy: { createdAt: 'desc' },
        include: {
            affiliate: true,
            _count: {
                select: { redemptions: true }
            }
        }
    });

    return json(customers);
};
