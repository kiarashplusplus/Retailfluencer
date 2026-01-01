import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { mockDashboardData } from '$lib/mock-data';

// GET /api/dashboard?brandId=xxx - Get dashboard analytics for a brand
export const GET: RequestHandler = async () => {
    return json(mockDashboardData);
};
