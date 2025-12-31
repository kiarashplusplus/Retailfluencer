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

    const formattedActivity = recentActivity.map(r => ({
        description: `${r.influencer.name} generated a sale for ${r.campaign.name}`,
        time: getTimeAgo(new Date(r.redeemedAt))
    }));

    return json({
        totalRedemptions,
        activeCampaigns,
        totalInfluencers,
        topInfluencers,
        recentActivity: formattedActivity,
        campaignStats
    });
};

function getTimeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";

    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";

    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";

    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";

    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";

    return Math.floor(seconds) + " seconds ago";
}
