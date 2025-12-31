<script lang="ts">
  import { onMount } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import { Card, Button, Badge, EmptyState } from '$lib/components/ui';
  import { user } from '$lib/stores/auth';

  interface Affiliate {
    id: string;
    code: string;
    commissionPercent: number;
    totalEarnings: number;
    createdAt: string;
    customer: {
      id: string;
      email: string | null;
      totalRedemptions: number;
      createdAt: string;
    };
  }

  let affiliates = $state<Affiliate[]>([]);
  let isLoading = $state(true);
  let copiedCode = $state<string | null>(null);

  onMount(async () => {
    await fetchAffiliates();
  });

  async function fetchAffiliates() {
    try {
      const brandId = $user?.brandId;
      const res = await fetch(`/api/affiliates?brandId=${brandId}`);
      if (res.ok) {
        affiliates = await res.json();
      }
    } catch (error) {
      console.error('Failed to fetch affiliates:', error);
    } finally {
      isLoading = false;
    }
  }

  function getAffiliateLink(code: string): string {
    return `${window.location.origin}/a/${code}`;
  }

  async function copyToClipboard(code: string) {
    try {
      await navigator.clipboard.writeText(getAffiliateLink(code));
      copiedCode = code;
      setTimeout(() => copiedCode = null, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  }

  function formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  // Summary stats
  let totalEarnings = $derived(affiliates.reduce((sum, a) => sum + a.totalEarnings, 0));
  let avgCommission = $derived(
    affiliates.length > 0 
      ? affiliates.reduce((sum, a) => sum + a.commissionPercent, 0) / affiliates.length 
      : 0
  );
</script>

<div class="page">
  <header class="page-header">
    <div>
      <h1>Affiliates</h1>
      <p>Customers converted to brand advocates with unique referral links</p>
    </div>
  </header>

  <!-- Summary Stats -->
  <div class="stats-row">
    <div class="stat-card">
      <span class="stat-value">{affiliates.length}</span>
      <span class="stat-label">Total Affiliates</span>
    </div>
    <div class="stat-card">
      <span class="stat-value">${totalEarnings.toFixed(2)}</span>
      <span class="stat-label">Total Earnings</span>
    </div>
    <div class="stat-card">
      <span class="stat-value">{avgCommission.toFixed(1)}%</span>
      <span class="stat-label">Avg Commission</span>
    </div>
  </div>

  <div class="info-banner">
    <span class="icon">🤝</span>
    <div>
      <strong>How Affiliates Work</strong>
      <p>Affiliates are created automatically via automations when customers redeem coupons. Each affiliate gets a unique referral link.</p>
    </div>
  </div>

  {#if isLoading}
    <div class="list">
      {#each Array(4) as _, i}
        <Card>
          <div class="skeleton-row" in:fade={{ delay: i * 50 }}>
            <div class="skeleton skeleton-avatar"></div>
            <div class="skeleton-content">
              <div class="skeleton skeleton-title"></div>
              <div class="skeleton skeleton-text"></div>
            </div>
          </div>
        </Card>
      {/each}
    </div>
  {:else if affiliates.length === 0}
    <Card>
      <EmptyState
        icon="🤝"
        title="No affiliates yet"
        description="Affiliates are created when automations convert customers. Set up an automation with the 'Create Affiliate' action."
        actionLabel="Go to Automations"
        actionHref="/dashboard/automations"
      />
    </Card>
  {:else}
    <div class="list">
      {#each affiliates as affiliate, i}
        <div in:fly={{ x: -20, delay: i * 50, duration: 300 }}>
          <Card hover>
            <div class="affiliate-row">
              <div class="affiliate-avatar">
                {affiliate.customer.email?.charAt(0).toUpperCase() || 'A'}
              </div>

              <div class="affiliate-info">
                <div class="affiliate-header">
                  <span class="affiliate-email">{affiliate.customer.email || 'No email'}</span>
                  <Badge variant="purple">{affiliate.commissionPercent}% commission</Badge>
                </div>

                <div class="affiliate-code">
                  <span class="code">{affiliate.code}</span>
                  <button 
                    class="copy-btn" 
                    onclick={() => copyToClipboard(affiliate.code)}
                  >
                    {copiedCode === affiliate.code ? '✓ Copied' : 'Copy Link'}
                  </button>
                </div>
              </div>

              <div class="affiliate-stats">
                <div class="stat">
                  <span class="stat-value">${affiliate.totalEarnings.toFixed(2)}</span>
                  <span class="stat-label">Earnings</span>
                </div>
                <div class="stat">
                  <span class="stat-value">{affiliate.customer.totalRedemptions}</span>
                  <span class="stat-label">Referrals</span>
                </div>
              </div>

              <div class="affiliate-date">
                <span class="date-label">Joined</span>
                <span class="date-value">{formatDate(affiliate.createdAt)}</span>
              </div>
            </div>
          </Card>
        </div>
      {/each}
    </div>
  {/if}
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

  /* Stats Row */
  .stats-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .stat-card {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01));
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 0.75rem;
    padding: 1.25rem;
    text-align: center;
  }

  .stat-card .stat-value {
    font-size: 1.5rem;
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

  .info-banner {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem 1.25rem;
    background: linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(124, 58, 237, 0.05));
    border: 1px solid rgba(124, 58, 237, 0.2);
    border-radius: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .info-banner .icon {
    font-size: 1.5rem;
  }

  .info-banner strong {
    color: #a855f7;
    font-size: 0.875rem;
  }

  .info-banner p {
    color: #9ca3af;
    font-size: 0.8125rem;
    margin: 0.25rem 0 0;
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .affiliate-row {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .affiliate-avatar {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    font-weight: 700;
    color: #fff;
    flex-shrink: 0;
  }

  .affiliate-info {
    flex: 1;
    min-width: 0;
  }

  .affiliate-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
  }

  .affiliate-email {
    font-size: 0.9375rem;
    font-weight: 500;
    color: #fff;
  }

  .affiliate-code {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .code {
    font-family: monospace;
    font-size: 0.8125rem;
    color: #9ca3af;
    background: rgba(255, 255, 255, 0.05);
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
  }

  .copy-btn {
    padding: 0.25rem 0.625rem;
    background: rgba(124, 58, 237, 0.15);
    border: none;
    border-radius: 0.375rem;
    color: #a855f7;
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .copy-btn:hover {
    background: rgba(124, 58, 237, 0.25);
  }

  .affiliate-stats {
    display: flex;
    gap: 2rem;
  }

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .stat .stat-value {
    font-size: 1.125rem;
    font-weight: 600;
    color: #10b981;
  }

  .stat .stat-label {
    font-size: 0.6875rem;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .affiliate-date {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    text-align: right;
  }

  .date-label {
    font-size: 0.6875rem;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .date-value {
    font-size: 0.8125rem;
    color: #9ca3af;
  }

  /* Skeleton */
  .skeleton-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem;
  }

  .skeleton {
    background: linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 100%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  .skeleton-avatar { width: 48px; height: 48px; border-radius: 50%; flex-shrink: 0; }
  .skeleton-content { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
  .skeleton-title { height: 18px; width: 40%; border-radius: 0.5rem; }
  .skeleton-text { height: 12px; width: 25%; border-radius: 0.5rem; }

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  @media (max-width: 768px) {
    .affiliate-stats { display: none; }
    .affiliate-date { display: none; }
    .stats-row { grid-template-columns: 1fr; }
  }
</style>
