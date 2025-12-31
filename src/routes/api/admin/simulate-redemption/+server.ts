import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { env } from '$env/dynamic/private';
import { simulateRedemptionSchema, validateOrThrow } from '$lib/schemas';
import { triggerAutomations } from '$lib/services/automation';

/**
 * POST /api/admin/simulate-redemption
 *
 * Admin endpoint to simulate coupon redemptions for testing.
 * Only available in development or when TCB_MODE is not 'live'.
 * Uses a database transaction to ensure atomicity.
 */
export const POST: RequestHandler = async ({ request }) => {
    // Block in production with live TCB
    if (env.NODE_ENV === 'production' && env.TCB_MODE === 'live') {
        throw error(403, 'Simulation disabled in production');
    }

    const rawData = await request.json();

    // Validate input
    let data: { serializedGs1: string; retailerLocation?: string };
    try {
        data = validateOrThrow(simulateRedemptionSchema, rawData);
    } catch (err) {
        throw error(400, err instanceof Error ? err.message : 'Invalid input');
    }

    // Find the coupon assignment
    const assignment = await db.couponAssignment.findUnique({
        where: { serializedGs1: data.serializedGs1 },
        include: {
            campaign: true,
            influencer: true
        }
    });

    if (!assignment) {
        throw error(404, 'Coupon not found');
    }

    if (assignment.status === 'redeemed') {
        throw error(400, 'Coupon already redeemed');
    }

    // Use transaction for atomic updates
    const redemption = await db.$transaction(async (tx) => {
        // Create the redemption
        const newRedemption = await tx.redemption.create({
            data: {
                couponAssignmentId: assignment.id,
                campaignId: assignment.campaignId,
                influencerId: assignment.influencerId,
                serializedGs1: data.serializedGs1,
                redeemedAt: new Date(),
                retailerLocation: data.retailerLocation || 'Simulated - Target Store #1234'
            }
        });

        // Update assignment status
        await tx.couponAssignment.update({
            where: { id: assignment.id },
            data: { status: 'redeemed' }
        });

        // Update influencer redemption count
        await tx.influencer.update({
            where: { id: assignment.influencerId },
            data: {
                totalRedemptions: {
                    increment: 1
                }
            }
        });

        return newRedemption;
    });

    // Trigger automation for coupon redemptions
    await triggerAutomations('coupon_redeemed', {
        brandId: assignment.campaign.brandId,
        redemptionId: redemption.id,
        campaignId: assignment.campaignId,
        influencerId: assignment.influencerId,
    });

    return json({
        success: true,
        redemption,
        message: 'Redemption simulated successfully'
    });
};

