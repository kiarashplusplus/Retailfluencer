import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';

// GET /api/dashboard?brandId=xxx - Get dashboard analytics for a brand
export const GET: RequestHandler = async ({ url }) => {
    const brandId = url.searchParams.get('brandId');

    if (!brandId) {
        throw error(400, 'brandId query parameter is required');
    }

    const [
        totalRedemptions,
        activeCampaigns,
        totalInfluencers,
        topInfluencers,
        recentActivity,
        campaignStats
    ] = await Promise.all([
        // Total redemptions
        db.redemption.count({
            where: { campaign: { brandId } }
        }),

        // Active campaigns
        db.campaign.count({
            where: { brandId, status: 'active' }
        }),

        // Total influencers
        db.influencer.count({
            where: { brandId }
        }),

        // Top influencers by redemptions
        db.influencer.findMany({
            where: { brandId },
            orderBy: { totalRedemptions: 'desc' },
            take: 10,
            select: {
                id: true,
                name: true,
                totalRedemptions: true,
                instagramHandle: true,
                tiktokHandle: true
            }
        }),

        // Recent redemptions
        db.redemption.findMany({
            where: { campaign: { brandId } },
            orderBy: { redeemedAt: 'desc' },
            take: 20,
            include: {
                influencer: {
                    select: { name: true }
                },
                campaign: {
                    select: { name: true }
                }
            }
        }),

        // Campaign performance
        db.campaign.findMany({
            where: { brandId },
            select: {
                id: true,
                name: true,
                status: true,
                _count: {
                    select: {
                        couponAssignments: true,
                        redemptions: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 10
        })
    ]);

    return json({
        totalRedemptions,
        activeCampaigns,
        totalInfluencers,
        topInfluencers,
        recentActivity,
        campaignStats
    });
};
