<script lang="ts">
  import { user } from '$lib/stores/auth';
  import { onMount } from 'svelte';

  interface DashboardStats {
    totalRedemptions: number;
    activeCampaigns: number;
    totalInfluencers: number;
    revenue: number;
  }

  let stats = $state<DashboardStats>({
    totalRedemptions: 0,
    activeCampaigns: 0,
    totalInfluencers: 0,
    revenue: 0,
  });

  let recentActivity = $state<any[]>([]);
  let isLoading = $state(true);

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
          revenue: data.revenue || 0,
        };
        recentActivity = data.recentActivity || [];
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      isLoading = false;
    }
  });

  const statCards = [
    { key: 'totalRedemptions', label: 'Total Redemptions', icon: '◎', color: '#7c3aed' },
    { key: 'activeCampaigns', label: 'Active Campaigns', icon: '▣', color: '#10b981' },
    { key: 'totalInfluencers', label: 'Total Influencers', icon: '★', color: '#f59e0b' },
    { key: 'revenue', label: 'Revenue Tracked', icon: '$', color: '#3b82f6', prefix: '$' },
  ] as const;
</script>

<div class="dashboard-page">
  <header class="page-header">
    <div>
      <h1>Welcome back, {$user?.name?.split(' ')[0] || 'User'}</h1>
      <p>Here's what's happening with your campaigns</p>
    </div>
    <div class="header-actions">
      <a href="/dashboard/campaigns/new" class="btn-primary">
        + New Campaign
      </a>
    </div>
  </header>

  <!-- Stats Grid -->
  <div class="stats-grid">
    {#each statCards as card}
      <div class="stat-card" style="--accent: {card.color}">
        <div class="stat-icon">{card.icon}</div>
        <div class="stat-content">
          <span class="stat-value">
            {#if isLoading}
              <span class="skeleton"></span>
            {:else}
              {card.prefix || ''}{stats[card.key].toLocaleString()}
            {/if}
          </span>
          <span class="stat-label">{card.label}</span>
        </div>
      </div>
    {/each}
  </div>

  <div class="content-grid">
    <!-- Quick Actions -->
    <section class="card">
      <h2>Quick Actions</h2>
      <div class="quick-actions">
        <a href="/dashboard/products/new" class="action-card">
          <span class="action-icon">◇</span>
          <span class="action-label">Add Product</span>
        </a>
        <a href="/dashboard/influencers/new" class="action-card">
          <span class="action-icon">★</span>
          <span class="action-label">Add Influencer</span>
        </a>
        <a href="/dashboard/campaigns/new" class="action-card">
          <span class="action-icon">▣</span>
          <span class="action-label">Create Campaign</span>
        </a>
        <a href="/dashboard/analytics" class="action-card">
          <span class="action-icon">◉</span>
          <span class="action-label">View Analytics</span>
        </a>
      </div>
    </section>

    <!-- Recent Activity -->
    <section class="card">
      <h2>Recent Activity</h2>
      {#if isLoading}
        <div class="activity-skeleton">
          {#each Array(5) as _}
            <div class="skeleton-row"></div>
          {/each}
        </div>
      {:else if recentActivity.length === 0}
        <div class="empty-state">
          <p>No recent activity yet</p>
          <p class="empty-hint">Start by creating a campaign and assigning influencers</p>
        </div>
      {:else}
        <ul class="activity-list">
          {#each recentActivity as activity}
            <li class="activity-item">
              <span class="activity-icon">◎</span>
              <div class="activity-content">
                <span class="activity-text">{activity.description}</span>
                <span class="activity-time">{activity.time}</span>
              </div>
            </li>
          {/each}
        </ul>
      {/if}
    </section>
  </div>
</div>

<style>
  .dashboard-page {
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
    letter-spacing: -0.02em;
  }

  .page-header p {
    color: #6b7280;
    margin: 0;
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    border: none;
    border-radius: 0.75rem;
    color: #fff;
    font-size: 0.875rem;
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(124, 58, 237, 0.4);
  }

  /* Stats Grid */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .stat-card {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01));
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 1rem;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: all 0.3s ease;
  }

  .stat-card:hover {
    border-color: var(--accent);
    box-shadow: 0 0 30px rgba(124, 58, 237, 0.1);
    transform: translateY(-2px);
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 80%, white));
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    color: #fff;
  }

  .stat-content {
    display: flex;
    flex-direction: column;
  }

  .stat-value {
    font-size: 1.75rem;
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.02em;
  }

  .stat-label {
    font-size: 0.875rem;
    color: #6b7280;
  }

  .skeleton {
    display: inline-block;
    width: 60px;
    height: 28px;
    background: linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 100%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 4px;
  }

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* Content Grid */
  .content-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }

  @media (max-width: 1024px) {
    .content-grid {
      grid-template-columns: 1fr;
    }
  }

  .card {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01));
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 1rem;
    padding: 1.5rem;
  }

  .card h2 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #fff;
    margin: 0 0 1.25rem;
  }

  /* Quick Actions */
  .quick-actions {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .action-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    padding: 1.25rem;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 0.75rem;
    text-decoration: none;
    transition: all 0.2s ease;
  }

  .action-card:hover {
    background: rgba(124, 58, 237, 0.1);
    border-color: rgba(124, 58, 237, 0.3);
    transform: translateY(-2px);
  }

  .action-icon {
    font-size: 1.5rem;
    color: #a855f7;
  }

  .action-label {
    font-size: 0.875rem;
    color: #9ca3af;
    font-weight: 500;
  }

  /* Activity */
  .activity-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .activity-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 0.75rem;
  }

  .activity-icon {
    color: #7c3aed;
    font-size: 1rem;
  }

  .activity-content {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .activity-text {
    font-size: 0.875rem;
    color: #e5e7eb;
  }

  .activity-time {
    font-size: 0.75rem;
    color: #6b7280;
  }

  .empty-state {
    text-align: center;
    padding: 2rem;
    color: #6b7280;
  }

  .empty-hint {
    font-size: 0.875rem;
    margin-top: 0.5rem;
    opacity: 0.7;
  }

  .activity-skeleton {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .skeleton-row {
    height: 48px;
    background: linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 100%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 0.75rem;
  }
</style>
