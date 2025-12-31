import { db } from '$lib/server/db';
import { tcbClient } from '$lib/tcb';
import { generateQRCode } from './qr-generator';

const APP_URL = process.env.APP_URL || 'http://localhost:5173';

export interface AssignCouponInput {
    campaignId: string;
    influencerId: string;
}

/**
 * Assign a unique coupon to an influencer for a campaign
 * Uses TCB client (mock or real) to generate serialized GS1 codes
 */
export async function assignCouponToInfluencer(
    input: AssignCouponInput
): Promise<{
    assignment: Awaited<ReturnType<typeof db.couponAssignment.create>>;
    trackingLink: string;
    qrCodeUrl: string;
}> {
    const campaign = await db.campaign.findUnique({
        where: { id: input.campaignId }
    });

    if (!campaign) {
        throw new Error('Campaign not found');
    }

    if (!campaign.baseGs1) {
        throw new Error('Campaign does not have a base GS1 code');
    }

    // Check if influencer already has assignment for this campaign
    const existing = await db.couponAssignment.findFirst({
        where: {
            campaignId: input.campaignId,
            influencerId: input.influencerId
        }
    });

    if (existing) {
        throw new Error('Influencer already has a coupon for this campaign');
    }

    // Use TCB client (mock or real) to deposit and get serialized GS1
    const depositResponse = await tcbClient.deposit({
        gs1s: [campaign.baseGs1],
        mode: 'base_gs1',
        client_txn_id: `${input.campaignId}-${input.influencerId}-${Date.now()}`
    });

    if (!depositResponse.success) {
        throw new Error(depositResponse.error || 'Failed to deposit coupon');
    }

    const serializedGs1 = depositResponse.gs1s[0];
    const trackingLink = `${APP_URL}/c/${serializedGs1}`;
    const qrCodeUrl = await generateQRCode(serializedGs1);

    const assignment = await db.couponAssignment.create({
        data: {
            campaignId: input.campaignId,
            influencerId: input.influencerId,
            serializedGs1,
            trackingLink,
            qrCodeUrl,
            status: 'active'
        }
    });

    return { assignment, trackingLink, qrCodeUrl };
}

/**
 * Get coupon assignment by GS1 code
 */
export async function getCouponByGs1(gs1: string) {
    return db.couponAssignment.findUnique({
        where: { serializedGs1: gs1 },
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
}

/**
 * List all assignments for an influencer
 */
export async function getInfluencerAssignments(influencerId: string) {
    return db.couponAssignment.findMany({
        where: { influencerId },
        include: {
            campaign: {
                include: {
                    brand: true,
                    product: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
}
