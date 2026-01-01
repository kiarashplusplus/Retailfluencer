import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// POST /api/customers/capture - Capture customer (demo: no-op)
export const POST: RequestHandler = async ({ request }) => {
    const data = await request.json();
    return json({
        success: true,
        customerId: `cust-${Date.now()}`,
        isNewCustomer: true
    });
};
