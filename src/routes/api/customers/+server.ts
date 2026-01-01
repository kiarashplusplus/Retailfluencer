import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { mockCustomers } from '$lib/mock-data';

// GET /api/customers?brandId=xxx
export const GET: RequestHandler = async ({ url }) => {
    const brandId = url.searchParams.get('brandId');
    const customers = brandId
        ? mockCustomers.filter(c => c.brandId === brandId || brandId === 'demo-brand-001')
        : mockCustomers;
    return json(customers);
};
