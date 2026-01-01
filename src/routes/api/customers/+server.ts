import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// GET /api/customers?brandId=xxx
export const GET: RequestHandler = async ({ url, locals }) => {
    const brandId = url.searchParams.get('brandId');

    if (!brandId) {
        throw error(400, 'brandId query parameter is required');
    }

    const customers = await locals.db.customer.findMany({
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
