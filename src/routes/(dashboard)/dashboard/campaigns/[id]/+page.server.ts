import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { mockCampaigns, mockInfluencers, mockCouponAssignments, mockRedemptions, mockProducts, mockRetailers } from '$lib/mock-data';

export const load: PageServerLoad = async ({ params }) => {
    const campaign = mockCampaigns.find(c => c.id === params.id);

    if (!campaign) {
        throw error(404, `Campaign not found: ${params.id}`);
    }

    // Get product and retailer info
    const product = mockProducts.find(p => p.id === campaign.productId);
    const retailer = mockRetailers.find(r => r.id === campaign.retailerId);

    // Get assignments for this campaign
    const assignments = mockCouponAssignments.filter(a => a.campaignId === campaign.id);

    // Get redemptions for this campaign
    const redemptions = mockRedemptions.filter(r => r.campaignId === campaign.id);

    // Enrich assignments with influencer info
    const influencerAssignments = assignments.map(a => {
        const influencer = mockInfluencers.find(i => i.id === a.influencerId);
        return {
            ...a,
            influencer: influencer ? {
                name: influencer.name,
                instagramHandle: influencer.instagramHandle,
                tiktokHandle: influencer.tiktokHandle
            } : null
        };
    });

    return {
        campaign: {
            ...campaign,
            product,
            retailer
        },
        assignments: influencerAssignments,
        redemptions: redemptions.map(r => ({
            ...r,
            influencer: mockInfluencers.find(i => i.id === r.influencerId)
        })),
        stats: {
            totalAssignments: assignments.length,
            totalRedemptions: campaign._count?.redemptions || 0,
            conversionRate: assignments.length > 0
                ? ((campaign._count?.redemptions || 0) / assignments.length * 100).toFixed(1)
                : '0'
        }
    };
};
