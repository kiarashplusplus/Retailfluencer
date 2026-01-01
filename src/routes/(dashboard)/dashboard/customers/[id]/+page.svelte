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

    function getActivityIcon(type: string): string {
        switch (type) {
            case 'redemption': return '🏷️';
            case 'visit': return '👀';
            case 'email': return '📧';
            case 'signup': return '✨';
            case 'affiliate': return '🤝';
            case 'referral': return '💰';
            default: return '•';
        }
    }
</script>

<svelte:head>
    <title>{data.customer.name || data.customer.email} | Retailfluencer</title>
</svelte:head>

<div class="page" in:fade={{ duration: 200 }}>
    <header class="page-header">
        <div>
            <a href="/dashboard/customers" class="back-link">← Back to Customers</a>
            <div class="title-row">
                <div class="avatar">
                    {data.customer.email?.charAt(0).toUpperCase() || 'C'}
                </div>
                <div>
                    <h1>{data.customer.name || 'Unknown Customer'}</h1>
                    <p>{data.customer.email}</p>
                </div>
            </div>
        </div>
        {#if data.customer.isAffiliate}
            <Badge variant="purple">Affiliate</Badge>
        {/if}
    </header>

    <div class="content-grid">
        <!-- Sidebar Info -->
        <aside class="sidebar" in:fly={{ x: -20, duration: 300, delay: 100 }}>
            <!-- Affiliate Stats -->
            {#if data.customer.affiliateData}
                <Card>
                    <h3>Affiliate Stats</h3>
                    <div class="stats-list">
                        <div class="stat-row">
                            <span class="label">Code</span>
                            <span class="value code">{data.customer.affiliateData.code}</span>
                        </div>
                        <div class="stat-row">
                            <span class="label">Earnings</span>
                            <span class="value success">${data.customer.affiliateData.earnings.toFixed(2)}</span>
                        </div>
                        <div class="stat-row">
                            <span class="label">Referrals</span>
                            <span class="value">{data.customer.affiliateData.totalReferrals}</span>
                        </div>
                        <div class="stat-row">
                            <span class="label">Commission</span>
                            <span class="value">{data.customer.affiliateData.commission}%</span>
                        </div>
                    </div>
                </Card>
            {/if}

            <!-- Customer Details -->
            <Card>
                <h3>Customer Details</h3>
                <div class="stats-list">
                    <div class="stat-row">
                        <span class="label">Lifetime Value</span>
                        <span class="value">${data.customer.ltv.toFixed(2)}</span>
                    </div>
                    <div class="stat-row">
                        <span class="label">Total Redemptions</span>
                        <span class="value">{data.customer.totalRedemptions}</span>
                    </div>
                    <div class="stat-row">
                        <span class="label">Last Active</span>
                        <span class="value sm">{formatDate(data.customer.lastActive)}</span>
                    </div>
                    <div class="stat-row">
                        <span class="label">Joined</span>
                        <span class="value sm">{formatDate(data.customer.createdAt)}</span>
                    </div>
                </div>
            </Card>
        </aside>

        <!-- Activity Timeline -->
        <main in:fly={{ x: 20, duration: 300, delay: 100 }}>
            <Card>
                <h2>Activity Timeline</h2>
                <div class="timeline">
                    {#each data.activities as activity, i}
                        <div class="timeline-item" in:fly={{ y: 10, delay: 200 + i * 50, duration: 200 }}>
                            <div class="timeline-icon">{getActivityIcon(activity.type)}</div>
                            <div class="timeline-content">
                                <span class="timeline-desc">{activity.description}</span>
                                <span class="timeline-date">{formatDate(activity.date)}</span>
                            </div>
                        </div>
                    {/each}
                </div>
            </Card>
        </main>
    </div>
</div>

<style>
    .page {
        max-width: 1200px;
        margin: 0 auto;
    }

    .page-header {
        margin-bottom: 2rem;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
    }

    .back-link {
        font-size: 0.8125rem;
        color: #6b7280;
        display: inline-block;
        margin-bottom: 1rem;
        transition: color 0.2s;
    }

    .back-link:hover {
        color: #a855f7;
    }

    .title-row {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .avatar {
        width: 64px;
        height: 64px;
        background: linear-gradient(135deg, #7c3aed, #a855f7);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        font-weight: 700;
        color: #fff;
    }

    h1 {
        font-size: 1.75rem;
        font-weight: 700;
        color: #fff;
        margin: 0 0 0.25rem;
    }

    .page-header p {
        color: #9ca3af;
        margin: 0;
    }

    .content-grid {
        display: grid;
        grid-template-columns: 350px 1fr;
        gap: 1.5rem;
    }

    h3, h2 {
        font-size: 1rem;
        font-weight: 600;
        color: #fff;
        margin: 0 0 1rem;
    }

    .stats-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .stat-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 0.75rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .stat-row:last-child {
        border-bottom: none;
        padding-bottom: 0;
    }

    .label {
        font-size: 0.8125rem;
        color: #9ca3af;
    }

    .value {
        font-weight: 500;
        color: #fff;
    }

    .value.code {
        font-family: monospace;
        background: rgba(255, 255, 255, 0.1);
        padding: 0.125rem 0.375rem;
        border-radius: 0.25rem;
    }

    .value.success {
        color: #10b981;
    }

    .value.sm {
        font-size: 0.875rem;
    }

    /* Timeline */
    .timeline {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .timeline-item {
        display: flex;
        gap: 1rem;
        padding-left: 0.5rem;
        position: relative;
    }

    .timeline-item:not(:last-child)::before {
        content: '';
        position: absolute;
        left: 1.75rem;
        top: 2.5rem;
        bottom: -1rem;
        width: 1px;
        background: rgba(255, 255, 255, 0.1);    
    }

    .timeline-icon {
        width: 40px;
        height: 40px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
        flex-shrink: 0;
        z-index: 1;
    }

    .timeline-content {
        flex: 1;
        padding-top: 0.25rem;
    }

    .timeline-desc {
        display: block;
        color: #fff;
        margin-bottom: 0.25rem;
    }

    .timeline-date {
        font-size: 0.75rem;
        color: #6b7280;
    }

    @media (max-width: 768px) {
        .content-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
