import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// POST /api/customers/capture - Capture customer email during coupon view
export const POST: RequestHandler = async ({ request, locals }) => {
    const data = await request.json();

    if (!data.gs1 || !data.email) {
        throw error(400, 'Missing required fields: gs1, email');
    }

    // Get coupon to find brand
    const coupon = await locals.db.couponAssignment.findFirst({
        where: { serializedGs1: data.gs1 },
        include: { campaign: true }
    });

    if (!coupon) {
        throw error(404, 'Coupon not found');
    }

    // Check if customer already exists
    let customer = await locals.db.customer.findFirst({
        where: {
            brandId: coupon.campaign.brandId,
            email: data.email
        }
    });

    let isNewCustomer = false;

    if (!customer) {
        // Create new customer
        customer = await locals.db.customer.create({
            data: {
                brandId: coupon.campaign.brandId,
                email: data.email,
                phone: data.phone
            }
        });
        isNewCustomer = true;
    }

    return json({
        success: true,
        customerId: customer.id,
        isNewCustomer
    });
};
