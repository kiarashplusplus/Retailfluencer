import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {
    const coupon = await locals.db.couponAssignment.findFirst({
        where: { serializedGs1: params.gs1 },
        include: {
            campaign: {
                include: {
                    brand: true,
                    product: true,
                    retailer: true
                }
            },
            influencer: true
        }
    });

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
