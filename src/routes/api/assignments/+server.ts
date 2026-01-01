import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createMockAssignment, mockInfluencers, mockCampaigns, mockCouponAssignments } from '$lib/mock-data';

// POST /api/assignments - Assign a coupon to an influencer
export const POST: RequestHandler = async ({ request }) => {
    const data = await request.json();

    if (!data.campaignId || !data.influencerId) {
        throw error(400, 'Missing campaignId or influencerId');
    }

    // Verify campaign exists
    const campaign = mockCampaigns.find(c => c.id === data.campaignId);
    if (!campaign) {
        throw error(404, `Campaign not found: ${data.campaignId}`);
    }

    // Verify influencer exists
    const influencer = mockInfluencers.find(i => i.id === data.influencerId);
    if (!influencer) {
        throw error(404, `Influencer not found: ${data.influencerId}`);
    }

    // Create the assignment with proper GS1 and tracking link
    const assignment = createMockAssignment(data.campaignId, data.influencerId);

    return json({
        ...assignment,
        campaign: { name: campaign.name, product: campaign.product },
        influencer: { name: influencer.name }
    }, { status: 201 });
};

// GET /api/assignments - List all assignments
export const GET: RequestHandler = async ({ url }) => {
    const campaignId = url.searchParams.get('campaignId');
    const influencerId = url.searchParams.get('influencerId');

    let filtered = mockCouponAssignments;

    if (campaignId) {
        filtered = filtered.filter(a => a.campaignId === campaignId);
    }
    if (influencerId) {
        filtered = filtered.filter(a => a.influencerId === influencerId);
    }

    // Enrich with campaign and influencer info
    const enriched = filtered.map(a => {
        const campaign = mockCampaigns.find(c => c.id === a.campaignId);
        const influencer = mockInfluencers.find(i => i.id === a.influencerId);
        return {
            ...a,
            campaign: campaign ? { name: campaign.name, product: campaign.product } : null,
            influencer: influencer ? { name: influencer.name } : null
        };
    });

    return json(enriched);
};
