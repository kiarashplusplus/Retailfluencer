import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// POST /api/assignments - Assign a coupon to an influencer
export const POST: RequestHandler = async ({ request, locals }) => {
    try {
        const { brandId, campaignId, influencerId } = await request.json();

        if (!brandId || !campaignId || !influencerId) {
            throw error(400, 'Missing required fields');
        }

        // Verify campaign belongs to brand
        const campaign = await locals.db.campaign.findUnique({
            where: { id: campaignId },
            include: { product: true }
        });

        if (!campaign || campaign.brandId !== brandId) {
            throw error(404, 'Campaign not found');
        }

        // Verify influencer belongs to brand
        const influencer = await locals.db.influencer.findUnique({
            where: { id: influencerId }
        });

        if (!influencer || influencer.brandId !== brandId) {
            throw error(404, 'Influencer not found');
        }

        // Check for existing active assignment
        const existing = await locals.db.couponAssignment.findFirst({
            where: {
                campaignId,
                influencerId,
                status: 'active'
            }
        });

        if (existing) {
            return json({ success: false, message: 'Influencer already assigned to this campaign', assignment: existing });
        }

        // Generate GS1 (Mock logic mimicking real standards approx)
        const gtin = campaign.product?.gtin || '00000000000000';
        const serial = Date.now().toString().slice(-6) + Math.random().toString().slice(2, 5);
        const serializedGs1 = `01${gtin}${serial}`;

        const assignment = await locals.db.couponAssignment.create({
            data: {
                campaignId,
                influencerId,
                serializedGs1,
                status: 'active'
            }
        });

        return json(assignment);
    } catch (err) {
        console.error('Assignment error:', err);
        throw error(500, 'Failed to assign coupon');
    }
};
