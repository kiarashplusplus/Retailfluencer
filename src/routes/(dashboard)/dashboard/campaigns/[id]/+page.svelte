<script lang="ts">
    import { Card, Badge } from '$lib/components/ui';
    import { fly, fade } from 'svelte/transition';

    let { data } = $props();

    function formatDate(dateStr: string): string {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function getInfluencerHandle(inf: { instagramHandle?: string | null; tiktokHandle?: string | null }): string {
        if (inf.instagramHandle) return `@${inf.instagramHandle}`;
        if (inf.tiktokHandle) return `@${inf.tiktokHandle}`;
        return '';
    }

    function getTimeSince(dateStr: string): string {
        const diff = Date.now() - new Date(dateStr).getTime();
        const minutes = Math.floor(diff / 60000);
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    }
</script>

<svelte:head>
    <title>{data.campaign.name} | Retailfluencer</title>
</svelte:head>

<div class="page" in:fade={{ duration: 200 }}>
    <header class="page-header">
        <div>
            <a href="/dashboard/campaigns" class="back-link">← Back to Campaigns</a>
            <h1>{data.campaign.name}</h1>
            <p>{data.campaign.product?.name} • {data.campaign.retailer?.name}</p>
        </div>
        <Badge variant={data.campaign.status === 'active' ? 'success' : 'default'}>
            {data.campaign.status}
        </Badge>
    </header>

    <!-- Stats Overview -->
    <div class="stats-grid" in:fly={{ y: 20, duration: 300, delay: 100 }}>
        <Card>
            <div class="stat-card">
                <span class="stat-value">{data.stats.totalAssignments}</span>
                <span class="stat-label">Influencers</span>
            </div>
        </Card>
        <Card>
            <div class="stat-card">
                <span class="stat-value">{data.stats.totalRedemptions}</span>
                <span class="stat-label">Redemptions</span>
            </div>
        </Card>
        <Card>
            <div class="stat-card">
                <span class="stat-value">{data.stats.conversionRate}%</span>
                <span class="stat-label">Conversion</span>
            </div>
        </Card>
        <Card>
            <div class="stat-card">
                <span class="stat-value">{data.campaign.discountType}</span>
                <span class="stat-label">Discount</span>
            </div>
        </Card>
    </div>

    <div class="content-grid">
        <!-- Influencer Tracking Links -->
        <section in:fly={{ x: -20, duration: 300, delay: 200 }}>
            <Card>
                <h2>Influencer Tracking Links</h2>
                {#if data.assignments.length === 0}
                    <p class="empty-text">No influencers assigned to this campaign yet.</p>
                {:else}
                    <div class="assignments-list">
                        {#each data.assignments as assignment, i}
                            <div class="assignment-row" in:fly={{ x: -10, delay: 300 + i * 50, duration: 200 }}>
                                <div class="influencer-info">
                                    <span class="name">{assignment.influencer?.name || 'Unknown'}</span>
                                    <span class="handle">{assignment.influencer ? getInfluencerHandle(assignment.influencer) : ''}</span>
                                </div>
                                <div class="tracking-link">
                                    <code>{assignment.trackingLink}</code>
                                    <Badge variant={assignment.status === 'redeemed' ? 'success' : 'purple'}>
                                        {assignment.status}
                                    </Badge>
                                </div>
                            </div>
                        {/each}
                    </div>
                {/if}
            </Card>
        </section>

        <!-- Redemption Timeline -->
        <section in:fly={{ x: 20, duration: 300, delay: 200 }}>
            <Card>
                <h2>Redemption Timeline</h2>
                {#if data.redemptions.length === 0}
                    <p class="empty-text">No redemptions recorded yet.</p>
                {:else}
                    <div class="timeline">
                        {#each data.redemptions as redemption, i}
                            <div class="timeline-item" in:fly={{ y: 10, delay: 300 + i * 50, duration: 200 }}>
                                <div class="timeline-dot"></div>
                                <div class="timeline-content">
                                    <span class="timeline-title">
                                        {redemption.influencer?.name || 'Unknown'} generated a sale
                                    </span>
                                    <span class="timeline-details">
                                        {redemption.retailerLocation}
                                    </span>
                                    <span class="timeline-time">
                                        {getTimeSince(redemption.redeemedAt)}
                                    </span>
                                </div>
                            </div>
                        {/each}
                    </div>
                {/if}
            </Card>
        </section>
    </div>
</div>

<style>
    .page {
        max-width: 1200px;
        margin: 0 auto;
    }

    .page-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 2rem;
    }

    .back-link {
        font-size: 0.8125rem;
        color: #6b7280;
        display: inline-block;
        margin-bottom: 0.5rem;
        transition: color 0.2s;
    }

    .back-link:hover {
        color: #a855f7;
    }

    .page-header h1 {
        font-size: 1.75rem;
        font-weight: 700;
        color: #fff;
        margin: 0 0 0.25rem;
    }

    .page-header p {
        color: #9ca3af;
        margin: 0;
    }

    /* Stats Grid */
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .stat-card {
        text-align: center;
        padding: 0.5rem;
    }

    .stat-card .stat-value {
        font-size: 1.75rem;
        font-weight: 700;
        color: #fff;
        display: block;
    }

    .stat-card .stat-label {
        font-size: 0.75rem;
        color: #6b7280;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    /* Content Grid */
    .content-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
    }

    section h2 {
        font-size: 1rem;
        font-weight: 600;
        color: #fff;
        margin: 0 0 1rem;
    }

    .empty-text {
        color: #6b7280;
        font-size: 0.875rem;
    }

    /* Assignments List */
    .assignments-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .assignment-row {
        padding: 0.75rem;
        background: rgba(255, 255, 255, 0.03);
        border-radius: 0.5rem;
    }

    .influencer-info {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
    }

    .influencer-info .name {
        font-weight: 500;
        color: #fff;
    }

    .influencer-info .handle {
        font-size: 0.8125rem;
        color: #6b7280;
    }

    .tracking-link {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .tracking-link code {
        font-size: 0.75rem;
        color: #9ca3af;
        background: rgba(0, 0, 0, 0.2);
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    /* Timeline */
    .timeline {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .timeline-item {
        display: flex;
        gap: 0.75rem;
        padding-left: 0.5rem;
    }

    .timeline-dot {
        width: 10px;
        height: 10px;
        background: linear-gradient(135deg, #10b981, #34d399);
        border-radius: 50%;
        flex-shrink: 0;
        margin-top: 0.25rem;
    }

    .timeline-content {
        flex: 1;
    }

    .timeline-title {
        display: block;
        font-size: 0.875rem;
        color: #fff;
        margin-bottom: 0.125rem;
    }

    .timeline-details {
        display: block;
        font-size: 0.75rem;
        color: #6b7280;
        margin-bottom: 0.125rem;
    }

    .timeline-time {
        font-size: 0.6875rem;
        color: #4b5563;
    }

    @media (max-width: 768px) {
        .stats-grid {
            grid-template-columns: repeat(2, 1fr);
        }
        .content-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
