import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDashboardData } from '$lib/mock-data';

// GET /api/dashboard?brandId=xxx - Get dashboard analytics for a brand
export const GET: RequestHandler = async () => {
    // Use dynamic function to get latest data including any simulated redemptions
    return json(getDashboardData());
};
