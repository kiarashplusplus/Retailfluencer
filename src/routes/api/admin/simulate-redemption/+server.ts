import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { findAssignmentByGs1, simulateRedemption, mockCouponAssignments, mockInfluencers, mockCampaigns } from '$lib/mock-data';

// POST /api/admin/simulate-redemption - Simulate a coupon redemption for demo purposes
export const POST: RequestHandler = async ({ request }) => {
    const { serializedGs1 } = await request.json();

    if (!serializedGs1) {
        throw error(400, 'Missing serializedGs1 in request body');
    }

    // Look up the assignment
    const assignment = findAssignmentByGs1(serializedGs1);

    if (!assignment) {
        // For demo flexibility, create a mock redemption even without assignment
        // This allows testing with any GS1 code
        throw error(404, `Coupon assignment not found for GS1: ${serializedGs1}. Available GS1s: ${mockCouponAssignments.map(a => a.serializedGs1).join(', ')}`);
    }

    if (assignment.status === 'redeemed') {
        throw error(400, 'Coupon has already been redeemed');
    }

    // Simulate the redemption
    const redemption = simulateRedemption(assignment);

    // Get updated data for the response
    const influencer = mockInfluencers.find(i => i.id === assignment.influencerId);
    const campaign = mockCampaigns.find(c => c.id === assignment.campaignId);

    return json({
        success: true,
        redemption: {
            ...redemption,
            influencer: influencer ? { name: influencer.name } : null,
            campaign: campaign ? { name: campaign.name } : null
        },
        message: `Redemption simulated successfully. ${influencer?.name || 'Influencer'} now has ${influencer?.totalRedemptions || 0} total redemptions.`
    });
};

// GET /api/admin/simulate-redemption - List available coupon assignments
export const GET: RequestHandler = async () => {
    return json({
        availableAssignments: mockCouponAssignments.map(a => ({
            id: a.id,
            serializedGs1: a.serializedGs1,
            status: a.status,
            trackingLink: a.trackingLink,
            campaignId: a.campaignId,
            influencerId: a.influencerId
        })),
        usage: 'POST to this endpoint with { "serializedGs1": "<gs1_code>" } to simulate a redemption'
    });
};
