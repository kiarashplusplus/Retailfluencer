<script lang="ts">
  import { onMount } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import { Card, Badge } from '$lib/components/ui';
  import { user } from '$lib/stores/auth';

  interface DashboardStats {
    totalRedemptions: number;
    activeCampaigns: number;
    totalInfluencers: number;
    totalProducts: number;
    conversionRate: number;
    revenueTracked: number;
  }

  let stats = $state<DashboardStats>({
    totalRedemptions: 0,
    activeCampaigns: 0,
    totalInfluencers: 0,
    totalProducts: 0,
    conversionRate: 0,
    revenueTracked: 0
  });

  let isLoading = $state(true);
  let timeRange = $state<'7d' | '30d' | '90d'>('30d');

  // Mock chart data
  const redemptionTrend = [42, 55, 38, 72, 61, 88, 95, 78, 102, 89, 115, 125];
  const topInfluencers = [
    { name: 'Sarah Johnson', redemptions: 234, revenue: 4680 },
    { name: 'Mike Chen', redemptions: 189, revenue: 3780 },
    { name: 'Emma Davis', redemptions: 156, revenue: 3120 },
    { name: 'Jake Wilson', redemptions: 142, revenue: 2840 },
    { name: 'Lisa Rodriguez', redemptions: 128, revenue: 2560 },
  ];

  const campaignPerformance = [
    { name: 'Summer Sale 2024', redemptions: 456, target: 500, status: 'active' },
    { name: 'Back to School', redemptions: 289, target: 400, status: 'active' },
    { name: 'Holiday Promo', redemptions: 178, target: 300, status: 'draft' },
  ];

  onMount(async () => {
    try {
      const brandId = $user?.brandId;
      const res = await fetch(`/api/dashboard?brandId=${brandId}`);
      if (res.ok) {
        const data = await res.json();
        stats = {
          totalRedemptions: data.totalRedemptions || 0,
          activeCampaigns: data.activeCampaigns || 0,
          totalInfluencers: data.totalInfluencers || 0,
          totalProducts: data.totalProducts || 0,
          conversionRate: 3.2,
          revenueTracked: data.revenue || 0
        };
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      isLoading = false;
    }
  });

  const statCards = [
    { key: 'totalRedemptions', label: 'Total Redemptions', icon: '◎', color: '#7c3aed', trend: '+12%' },
    { key: 'activeCampaigns', label: 'Active Campaigns', icon: '▣', color: '#10b981', trend: '+2' },
    { key: 'totalInfluencers', label: 'Influencers', icon: '★', color: '#f59e0b', trend: '+5' },
    { key: 'conversionRate', label: 'Conversion Rate', icon: '%', color: '#3b82f6', suffix: '%', trend: '+0.3%' },
  ] as const;

  function getMaxValue(arr: number[]): number {
    return Math.max(...arr);
  }
</script>

<div class="page">
  <header class="page-header">
    <div>
      <h1>Analytics</h1>
      <p>Track campaign performance and influencer ROI</p>
    </div>
    <div class="time-filter">
      {#each ['7d', '30d', '90d'] as range}
        <button 
          class="time-btn" 
          class:active={timeRange === range}
          onclick={() => timeRange = range as typeof timeRange}
        >
          {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
        </button>
      {/each}
    </div>
  </header>

  <!-- Stats Overview -->
  <div class="stats-grid" in:fade={{ duration: 300 }}>
    {#each statCards as card, i}
      <div in:fly={{ y: 20, delay: i * 80, duration: 400 }}>
        <Card variant="glass" hover>
          <div class="stat-card" style="--accent: {card.color}">
            <div class="stat-header">
              <span class="stat-icon">{card.icon}</span>
              <span class="stat-trend positive">{card.trend}</span>
            </div>
            <div class="stat-value">
              {#if isLoading}
                <span class="skeleton-inline"></span>
              {:else}
                {stats[card.key].toLocaleString()}{card.suffix || ''}
              {/if}
            </div>
            <div class="stat-label">{card.label}</div>
          </div>
        </Card>
      </div>
    {/each}
  </div>

  <div class="analytics-grid">
    <!-- Redemption Trend Chart -->
    <Card>
      <div class="chart-section">
        <div class="section-header">
          <h3>Redemption Trend</h3>
          <Badge variant="purple">Last 12 weeks</Badge>
        </div>
        <div class="chart-container">
          <div class="bar-chart">
            {#each redemptionTrend as value, i}
              <div 
                class="bar-wrapper"
                in:fly={{ y: 20, delay: 300 + i * 40, duration: 400 }}
              >
                <div 
                  class="bar" 
                  style="height: {(value / getMaxValue(redemptionTrend)) * 100}%"
                >
                  <span class="bar-tooltip">{value}</span>
                </div>
                <span class="bar-label">W{i + 1}</span>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </Card>

    <!-- Top Influencers -->
    <Card>
      <div class="section-header">
        <h3>Top Influencers</h3>
        <a href="/dashboard/influencers" class="view-all">View all →</a>
      </div>
      <div class="leaderboard">
        {#each topInfluencers as influencer, i}
          <div 
            class="leaderboard-row"
            in:fly={{ x: -20, delay: 300 + i * 60, duration: 400 }}
          >
            <span class="rank" class:gold={i === 0} class:silver={i === 1} class:bronze={i === 2}>
              {i + 1}
            </span>
            <div class="influencer-info">
              <span class="name">{influencer.name}</span>
              <span class="stats">{influencer.redemptions} redemptions</span>
            </div>
            <span class="revenue">${influencer.revenue.toLocaleString()}</span>
          </div>
        {/each}
      </div>
    </Card>

    <!-- Campaign Performance -->
    <Card>
      <div class="section-header">
        <h3>Campaign Performance</h3>
        <a href="/dashboard/campaigns" class="view-all">View all →</a>
      </div>
      <div class="campaign-list">
        {#each campaignPerformance as campaign, i}
          <div 
            class="campaign-row"
            in:fly={{ x: -20, delay: 400 + i * 60, duration: 400 }}
          >
            <div class="campaign-info">
              <span class="campaign-name">{campaign.name}</span>
              <div class="campaign-progress">
                <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    style="width: {(campaign.redemptions / campaign.target) * 100}%"
                  ></div>
                </div>
                <span class="progress-text">{campaign.redemptions} / {campaign.target}</span>
              </div>
            </div>
            <Badge variant={campaign.status === 'active' ? 'success' : 'default'}>
              {campaign.status}
            </Badge>
          </div>
        {/each}
      </div>
    </Card>

    <!-- Quick Metrics -->
    <Card>
      <div class="section-header">
        <h3>Quick Metrics</h3>
      </div>
      <div class="metrics-grid">
        <div class="metric-card">
          <span class="metric-icon">👁</span>
          <span class="metric-value">24.5K</span>
          <span class="metric-label">Link Clicks</span>
        </div>
        <div class="metric-card">
          <span class="metric-icon">📱</span>
          <span class="metric-value">8.2K</span>
          <span class="metric-label">QR Scans</span>
        </div>
        <div class="metric-card">
          <span class="metric-icon">📧</span>
          <span class="metric-value">2.1K</span>
          <span class="metric-label">Emails Captured</span>
        </div>
        <div class="metric-card">
          <span class="metric-icon">🔄</span>
          <span class="metric-value">340</span>
          <span class="metric-label">Repeat Buyers</span>
        </div>
      </div>
    </Card>
  </div>
</div>

<style>
  .page {
    max-width: 1400px;
    margin: 0 auto;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2rem;
  }

  .page-header h1 {
    font-size: 1.75rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 0.25rem;
  }

  .page-header p {
    color: #6b7280;
    margin: 0;
  }

  .time-filter {
    display: flex;
    gap: 0.25rem;
    background: rgba(255, 255, 255, 0.05);
    padding: 0.25rem;
    border-radius: 0.625rem;
  }

  .time-btn {
    padding: 0.5rem 1rem;
    background: transparent;
    border: none;
    border-radius: 0.5rem;
    color: #6b7280;
    font-size: 0.8125rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .time-btn.active, .time-btn:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
  }

  .time-btn.active {
    background: rgba(124, 58, 237, 0.2);
    color: #a855f7;
  }

  /* Stats Grid */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.25rem;
    margin-bottom: 1.5rem;
  }

  .stat-card {
    position: relative;
  }

  .stat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }

  .stat-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 70%, white));
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    color: #fff;
  }

  .stat-trend {
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
  }

  .stat-trend.positive {
    background: rgba(16, 185, 129, 0.15);
    color: #34d399;
  }

  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.02em;
    margin-bottom: 0.25rem;
  }

  .stat-label {
    font-size: 0.875rem;
    color: #6b7280;
  }

  .skeleton-inline {
    display: inline-block;
    width: 80px;
    height: 32px;
    background: linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 100%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 6px;
  }

  /* Analytics Grid */
  .analytics-grid {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: 1.25rem;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.25rem;
  }

  .section-header h3 {
    font-size: 1rem;
    font-weight: 600;
    color: #fff;
    margin: 0;
  }

  .view-all {
    font-size: 0.8125rem;
    color: #a855f7;
    transition: color 0.2s;
  }

  .view-all:hover {
    color: #c084fc;
  }

  /* Chart */
  .chart-section {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .chart-container {
    flex: 1;
    min-height: 200px;
    display: flex;
    align-items: flex-end;
  }

  .bar-chart {
    display: flex;
    gap: 0.5rem;
    width: 100%;
    height: 180px;
    align-items: flex-end;
  }

  .bar-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    height: 100%;
    justify-content: flex-end;
  }

  .bar {
    width: 100%;
    background: linear-gradient(180deg, #7c3aed, #a855f7);
    border-radius: 4px 4px 0 0;
    position: relative;
    transition: height 0.5s ease;
    min-height: 4px;
  }

  .bar:hover {
    filter: brightness(1.2);
  }

  .bar-tooltip {
    position: absolute;
    top: -24px;
    left: 50%;
    transform: translateX(-50%);
    background: #1a1a2e;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.625rem;
    color: #fff;
    opacity: 0;
    transition: opacity 0.2s;
    pointer-events: none;
  }

  .bar:hover .bar-tooltip {
    opacity: 1;
  }

  .bar-label {
    font-size: 0.625rem;
    color: #6b7280;
  }

  /* Leaderboard */
  .leaderboard {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .leaderboard-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 0.75rem;
    transition: background 0.2s;
  }

  .leaderboard-row:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  .rank {
    width: 28px;
    height: 28px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 600;
    color: #9ca3af;
  }

  .rank.gold { background: linear-gradient(135deg, #f59e0b, #fbbf24); color: #fff; }
  .rank.silver { background: linear-gradient(135deg, #6b7280, #9ca3af); color: #fff; }
  .rank.bronze { background: linear-gradient(135deg, #92400e, #b45309); color: #fff; }

  .influencer-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .name {
    font-size: 0.875rem;
    font-weight: 500;
    color: #fff;
  }

  .stats {
    font-size: 0.75rem;
    color: #6b7280;
  }

  .revenue {
    font-size: 0.875rem;
    font-weight: 600;
    color: #10b981;
  }

  /* Campaign List */
  .campaign-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .campaign-row {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .campaign-info {
    flex: 1;
  }

  .campaign-name {
    font-size: 0.875rem;
    font-weight: 500;
    color: #fff;
    display: block;
    margin-bottom: 0.5rem;
  }

  .campaign-progress {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .progress-bar {
    flex: 1;
    height: 6px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 3px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #7c3aed, #a855f7);
    border-radius: 3px;
    transition: width 0.5s ease;
  }

  .progress-text {
    font-size: 0.75rem;
    color: #6b7280;
  }

  /* Metrics Grid */
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .metric-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.375rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 0.75rem;
    transition: background 0.2s;
  }

  .metric-card:hover {
    background: rgba(255, 255, 255, 0.06);
  }

  .metric-icon {
    font-size: 1.25rem;
  }

  .metric-value {
    font-size: 1.25rem;
    font-weight: 700;
    color: #fff;
  }

  .metric-label {
    font-size: 0.6875rem;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  @media (max-width: 1024px) {
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .analytics-grid { grid-template-columns: 1fr; }
  }

  @media (max-width: 640px) {
    .stats-grid { grid-template-columns: 1fr; }
  }
</style>
