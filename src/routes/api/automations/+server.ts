import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// GET /api/automations?brandId=xxx
export const GET: RequestHandler = async () => {
    // Return empty automations for demo
    return json([]);
};

// POST /api/automations - Create new automation (demo: no-op)
export const POST: RequestHandler = async ({ request }) => {
    const data = await request.json();
    return json({ id: `auto-${Date.now()}`, ...data }, { status: 201 });
};

// PATCH /api/automations - Toggle automation (demo: no-op)
export const PATCH: RequestHandler = async ({ request }) => {
    const data = await request.json();
    return json({ id: data.id, isActive: data.isActive });
};
