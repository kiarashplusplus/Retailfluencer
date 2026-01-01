<script lang="ts">
  import { onMount } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import { Card, Button, Input, Modal, Badge, EmptyState } from '$lib/components/ui';
  import CampaignBuilder from '$lib/components/CampaignBuilder.svelte';
  import { page } from '$app/stores';
  import { user } from '$lib/stores/auth';

  interface Campaign {
    id: string;
    name: string;
    status: string;
    discountType: string;
    discountValue: number;
    campaignStart: string;
    campaignEnd: string;
    totalCirculation: number | null;
    baseGs1: string | null;
    product?: { name: string; imageUrl: string | null };
    retailer?: { name: string } | null;
    _count?: { couponAssignments: number; redemptions: number };
  }

  let campaigns = $state<Campaign[]>([]);
  let isLoading = $state(true);
  let showModal = $state(false);
  let searchQuery = $state('');
  let statusFilter = $state<string>('all');

  onMount(async () => {
    if ($page.url.searchParams.get('action') === 'new') {
      showModal = true;
    }
    await fetchCampaigns();
  });

  async function fetchCampaigns() {
    try {
      const brandId = $user?.brandId;
      const res = await fetch(`/api/campaigns?brandId=${brandId}`);
      if (res.ok) {
        campaigns = await res.json();
      }
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    } finally {
      isLoading = false;
    }
  }

  function getStatusVariant(status: string): 'success' | 'warning' | 'error' | 'default' {
    switch (status) {
      case 'active': return 'success';
      case 'draft': return 'default';
      case 'paused': return 'warning';
      case 'ended': return 'error';
      default: return 'default';
    }
  }

  function formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  }

  function formatDiscount(type: string, value: number): string {
    if (type === 'percent') return `${value}% OFF`;
    if (type === 'fixed') return `$${value} OFF`;
    if (type === 'bogo') return 'BOGO';
    return `${value}`;
  }

  let filteredCampaigns = $derived(
    campaigns.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
  );

  const statusOptions = [
    { value: 'all', label: 'All Campaigns' },
    { value: 'active', label: 'Active' },
    { value: 'draft', label: 'Drafts' },
    { value: 'paused', label: 'Paused' },
    { value: 'ended', label: 'Ended' },
  ];
</script>

<div class="page">
  <header class="page-header">
    <div>
      <h1>Campaigns</h1>
      <p>Create and manage coupon campaigns with influencer attribution</p>
    </div>
    <Button icon="+" onclick={() => showModal = true}>New Campaign</Button>
  </header>

  <div class="toolbar">
    <div class="search-box">
      <span class="search-icon">🔍</span>
      <input 
        type="text" 
        placeholder="Search campaigns..." 
        bind:value={searchQuery}
        class="search-input"
      />
    </div>
    <div class="filter-tabs">
      {#each statusOptions as option}
        <button 
          class="tab" 
          class:active={statusFilter === option.value}
          onclick={() => statusFilter = option.value}
        >
          {option.label}
        </button>
      {/each}
    </div>
  </div>

  {#if isLoading}
    <div class="campaigns-list">
      {#each Array(4) as _, i}
        <Card>
          <div class="skeleton-campaign" in:fade={{ delay: i * 50 }}>
            <div class="skeleton skeleton-badge"></div>
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-meta"></div>
            <div class="skeleton skeleton-bar"></div>
          </div>
        </Card>
      {/each}
    </div>
  {:else if filteredCampaigns.length === 0}
    <Card>
      <EmptyState
        icon="▣"
        title={searchQuery || statusFilter !== 'all' ? 'No campaigns found' : 'No campaigns yet'}
        description={searchQuery ? 'Try different search terms' : 'Create your first campaign to start tracking influencer-driven sales'}
        actionLabel={searchQuery ? undefined : 'Create Campaign'}
        onaction={() => showModal = true}
      />
    </Card>
  {:else}
    <div class="campaigns-list">
      {#each filteredCampaigns as campaign, i}
        <div in:fly={{ y: 20, delay: i * 60, duration: 300 }}>
          <Card hover padding="none">
            <div class="campaign-card">
              <div class="campaign-header">
                <Badge variant={getStatusVariant(campaign.status)} dot>
                  {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                </Badge>
                <span class="campaign-discount">
                  {formatDiscount(campaign.discountType, campaign.discountValue)}
                </span>
              </div>

              <div class="campaign-body">
                <h3 class="campaign-name">{campaign.name}</h3>
                <div class="campaign-meta">
                  {#if campaign.product}
                    <span class="meta-item">◇ {campaign.product.name}</span>
                  {/if}
                  {#if campaign.retailer}
                    <span class="meta-item">◆ {campaign.retailer.name}</span>
                  {/if}
                </div>
                <div class="campaign-dates">
                  <span class="date-range">
                    {formatDate(campaign.campaignStart)} → {formatDate(campaign.campaignEnd)}
                  </span>
                </div>
              </div>

              <div class="campaign-stats">
                <div class="stat-item">
                  <span class="stat-value">{campaign._count?.couponAssignments || 0}</span>
                  <span class="stat-label">Influencers</span>
                </div>
                <div class="stat-item">
                  <span class="stat-value">{campaign._count?.redemptions || 0}</span>
                  <span class="stat-label">Redemptions</span>
                </div>
                <div class="stat-item">
                  <span class="stat-value">
                    {campaign.totalCirculation 
                      ? Math.round((campaign._count?.redemptions || 0) / campaign.totalCirculation * 100) 
                      : 0}%
                  </span>
                  <span class="stat-label">Used</span>
                </div>
              </div>

              {#if campaign.totalCirculation}
                <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    style="width: {Math.min(100, ((campaign._count?.redemptions || 0) / campaign.totalCirculation) * 100)}%"
                  ></div>
                </div>
              {/if}

              <div class="campaign-actions">
                <button class="action-link">View Details</button>
                <button class="action-link">Add Influencers</button>
                <button class="action-link">Analytics</button>
              </div>
            </div>
          </Card>
        </div>
      {/each}
    </div>
  {/if}
</div>

<Modal bind:open={showModal} title="Create New Campaign" size="lg">
  <CampaignBuilder 
    onclose={() => showModal = false}
    oncreate={(campaign) => {
      campaigns = [campaign, ...campaigns];
      showModal = false;
    }}
  />
</Modal>

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

  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .search-box {
    position: relative;
    flex: 1;
    max-width: 300px;
  }

  .search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.875rem;
    opacity: 0.5;
  }

  .search-input {
    width: 100%;
    padding: 0.625rem 1rem 0.625rem 2.5rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.625rem;
    color: #fff;
    font-size: 0.875rem;
    transition: all 0.2s;
  }

  .search-input:focus {
    outline: none;
    border-color: #7c3aed;
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.2);
  }

  .filter-tabs {
    display: flex;
    gap: 0.25rem;
    background: rgba(255, 255, 255, 0.03);
    padding: 0.25rem;
    border-radius: 0.625rem;
  }

  .tab {
    padding: 0.5rem 1rem;
    background: transparent;
    border: none;
    border-radius: 0.5rem;
    color: #6b7280;
    font-size: 0.8125rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .tab.active, .tab:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
  }

  .tab.active {
    background: rgba(124, 58, 237, 0.2);
    color: #a855f7;
  }

  .campaigns-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    gap: 1.25rem;
  }

  .campaign-card {
    display: flex;
    flex-direction: column;
  }

  .campaign-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  }

  .campaign-discount {
    font-size: 0.875rem;
    font-weight: 700;
    color: #10b981;
  }

  .campaign-body {
    padding: 1.25rem;
  }

  .campaign-name {
    font-size: 1.125rem;
    font-weight: 600;
    color: #fff;
    margin: 0 0 0.5rem;
  }

  .campaign-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 0.75rem;
  }

  .meta-item {
    font-size: 0.8125rem;
    color: #9ca3af;
  }

  .campaign-dates {
    margin-bottom: 0;
  }

  .date-range {
    font-size: 0.75rem;
    color: #6b7280;
  }

  .campaign-stats {
    display: flex;
    gap: 1.5rem;
    padding: 1rem 1.25rem;
    background: rgba(0, 0, 0, 0.2);
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .stat-value {
    font-size: 1.25rem;
    font-weight: 700;
    color: #fff;
  }

  .stat-label {
    font-size: 0.6875rem;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .progress-bar {
    height: 3px;
    background: rgba(255, 255, 255, 0.05);
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #7c3aed, #a855f7);
    transition: width 0.5s ease;
  }

  .campaign-actions {
    display: flex;
    gap: 0.25rem;
    padding: 0.75rem 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.04);
  }

  .action-link {
    flex: 1;
    padding: 0.5rem;
    background: transparent;
    border: none;
    color: #9ca3af;
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.2s;
    border-radius: 0.375rem;
  }

  .action-link:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #fff;
  }

  /* Wizard placeholder */
  .wizard-placeholder {
    text-align: center;
    padding: 3rem 2rem;
  }

  .placeholder-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .wizard-placeholder h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #fff;
    margin: 0 0 0.5rem;
  }

  .wizard-placeholder p {
    color: #9ca3af;
    margin: 0;
  }

  .placeholder-hint {
    font-size: 0.875rem;
    color: #6b7280;
    margin-top: 0.5rem !important;
  }

  /* Skeleton */
  .skeleton-campaign {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .skeleton {
    background: linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 100%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 0.5rem;
  }

  .skeleton-badge { height: 24px; width: 80px; border-radius: 12px; }
  .skeleton-title { height: 22px; width: 60%; }
  .skeleton-meta { height: 14px; width: 80%; }
  .skeleton-bar { height: 4px; width: 100%; margin-top: 0.5rem; }

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  @media (max-width: 768px) {
    .filter-tabs { overflow-x: auto; }
    .campaigns-list { grid-template-columns: 1fr; }
  }
</style>
