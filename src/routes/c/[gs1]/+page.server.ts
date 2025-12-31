import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getCouponByGs1 } from '$lib/services/coupon-assignment';

export const load: PageServerLoad = async ({ params }) => {
    const coupon = await getCouponByGs1(params.gs1);

    if (!coupon) {
        throw error(404, 'Coupon not found');
    }

    if (coupon.status === 'expired') {
        throw error(410, 'This coupon has expired');
    }

    return {
        gs1: params.gs1,
        coupon: {
            ...coupon,
            campaign: {
                ...coupon.campaign,
                brand: coupon.campaign.brand,
                product: coupon.campaign.product,
                retailer: coupon.campaign.retailer
            }
        }
    };
};
