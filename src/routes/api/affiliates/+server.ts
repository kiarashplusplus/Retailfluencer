import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// GET /api/affiliates?brandId=xxx
export const GET: RequestHandler = async () => {
    // Return empty affiliates for demo
    return json([]);
};

// POST /api/affiliates - Create affiliate (demo: no-op)
export const POST: RequestHandler = async ({ request }) => {
    const data = await request.json();
    return json({
        id: `aff-${Date.now()}`,
        code: `REF${Date.now().toString(36).toUpperCase()}`,
        ...data
    }, { status: 201 });
};
