import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { getCouponByGs1 } from '$lib/services/coupon-assignment';

// POST /api/customers/capture - Capture customer email during coupon view
export const POST: RequestHandler = async ({ request }) => {
    const data = await request.json();

    if (!data.gs1 || !data.email) {
        throw error(400, 'Missing required fields: gs1, email');
    }

    // Get coupon to find brand
    const coupon = await getCouponByGs1(data.gs1);

    if (!coupon) {
        throw error(404, 'Coupon not found');
    }

    // Check if customer already exists
    let customer = await db.customer.findFirst({
        where: {
            brandId: coupon.campaign.brandId,
            email: data.email
        }
    });

    if (!customer) {
        // Create new customer
        customer = await db.customer.create({
            data: {
                brandId: coupon.campaign.brandId,
                email: data.email,
                phone: data.phone
            }
        });

        // TODO: Trigger automation when Phase 2 is implemented
        // await triggerAutomations('customer_created', {
        //   customerId: customer.id,
        //   brandId: coupon.campaign.brandId,
        // });
    }

    return json({
        success: true,
        customerId: customer.id
    });
};
