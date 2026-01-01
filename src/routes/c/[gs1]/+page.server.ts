import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { mockCampaigns, mockBrand, mockProducts, mockRetailers } from '$lib/mock-data';

export const load: PageServerLoad = async ({ params }) => {
    // For demo, return mock coupon data
    const campaign = mockCampaigns[0];
    const product = mockProducts.find(p => p.id === campaign.productId);
    const retailer = mockRetailers.find(r => r.id === campaign.retailerId);

    return {
        gs1: params.gs1,
        coupon: {
            id: `coupon-${params.gs1}`,
            serializedGs1: params.gs1,
            status: 'active',
            campaign: {
                ...campaign,
                brand: mockBrand,
                product,
                retailer
            }
        }
    };
};
