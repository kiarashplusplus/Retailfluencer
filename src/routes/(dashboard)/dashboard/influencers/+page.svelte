<script lang="ts">
  import { onMount } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import { Card, Button, Input, Modal, Badge, EmptyState } from '$lib/components/ui';
  import { page } from '$app/stores';
  import { user } from '$lib/stores/auth';

  interface Influencer {
    id: string;
    name: string;
    email: string | null;
    instagramHandle: string | null;
    tiktokHandle: string | null;
    totalRedemptions: number;
    createdAt: string;
    _count?: { couponAssignments: number; redemptions: number };
  }

  interface Campaign {
    id: string;
    name: string;
    product?: { name: string };
  }

  let influencers = $state<Influencer[]>([]);
  let isLoading = $state(true);
  let showModal = $state(false);
  let searchQuery = $state('');
  let isSubmitting = $state(false);

  let formData = $state({
    name: '',
    email: '',
    instagramHandle: '',
    tiktokHandle: ''
  });

  // Assignment state
  let campaigns = $state<Campaign[]>([]);
  let showAssignModal = $state(false);
  let assignData = $state({
    influencerId: '',
    campaignId: ''
  });

  onMount(async () => {
    if ($page.url.searchParams.get('action') === 'new') {
      showModal = true;
    }
    await fetchInfluencers();
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
    }
  }

  async function fetchInfluencers() {
    try {
      const brandId = $user?.brandId;
      const res = await fetch(`/api/influencers?brandId=${brandId}`);
      if (res.ok) {
        influencers = await res.json();
      }
    } catch (error) {
      console.error('Failed to fetch influencers:', error);
    } finally {
      isLoading = false;
    }
  }

  async function handleSubmit() {
    isSubmitting = true;
    try {
      const res = await fetch('/api/influencers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandId: $user?.brandId,
          name: formData.name,
          email: formData.email || null,
          instagramHandle: formData.instagramHandle || null,
          tiktokHandle: formData.tiktokHandle || null
        })
      });

      if (res.ok) {
        const newInfluencer = await res.json();
        influencers = [newInfluencer, ...influencers];
        showModal = false;
        resetForm();
      }
    } catch (error) {
      console.error('Failed to create influencer:', error);
    } finally {
      isSubmitting = false;
    }
  }

  async function handleAssign() {
    isSubmitting = true;
    try {
      const res = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandId: $user?.brandId,
          influencerId: assignData.influencerId,
          campaignId: assignData.campaignId
        })
      });

      if (res.ok) {
        const assignment = await res.json();
        // Update local state to reflect new count
        const idx = influencers.findIndex(i => i.id === assignData.influencerId);
        if (idx !== -1) {
          if (!influencers[idx]._count) influencers[idx]._count = { couponAssignments: 0, redemptions: 0 };
          influencers[idx]._count!.couponAssignments++;
        }
        showAssignModal = false;
        assignData = { influencerId: '', campaignId: '' };
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to assign coupon');
      }
    } catch (error) {
      console.error('Failed to assign coupon:', error);
    } finally {
      isSubmitting = false;
    }
  }

  function openAssignModal(influencerId: string) {
    assignData.influencerId = influencerId;
    if (campaigns.length > 0) {
      assignData.campaignId = campaigns[0].id; // Default to first
    }
    showAssignModal = true;
  }

  function resetForm() {
    formData = { name: '', email: '', instagramHandle: '', tiktokHandle: '' };
  }

  function getInitials(name: string): string {
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
  }

  function getAvatarColor(name: string): string {
    const colors = ['#7c3aed', '#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  }

  let filteredInfluencers = $derived(
    influencers.filter(inf => 
      inf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inf.instagramHandle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inf.tiktokHandle?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
</script>

<div class="page">
  <header class="page-header">
    <div>
      <h1>Influencers</h1>
      <p>Manage your influencer network and track their performance</p>
    </div>
    <Button icon="+" onclick={() => showModal = true}>Add Influencer</Button>
  </header>

  <div class="toolbar">
    <div class="search-box">
      <span class="search-icon">🔍</span>
      <input 
        type="text" 
        placeholder="Search by name or handle..." 
        bind:value={searchQuery}
        class="search-input"
      />
    </div>
    <div class="summary-stats">
      <span class="summary-item">
        <strong>{influencers.length}</strong> Total
      </span>
      <span class="summary-item">
        <strong>{influencers.reduce((sum, inf) => sum + inf.totalRedemptions, 0)}</strong> Redemptions
      </span>
    </div>
  </div>

  {#if isLoading}
    <div class="influencer-grid">
      {#each Array(8) as _, i}
        <Card>
          <div class="skeleton-influencer" in:fade={{ delay: i * 40 }}>
            <div class="skeleton skeleton-avatar"></div>
            <div class="skeleton skeleton-name"></div>
            <div class="skeleton skeleton-handle"></div>
            <div class="skeleton skeleton-stats"></div>
          </div>
        </Card>
      {/each}
    </div>
  {:else if filteredInfluencers.length === 0}
    <Card>
      <EmptyState
        icon="★"
        title={searchQuery ? 'No influencers found' : 'No influencers yet'}
        description={searchQuery ? 'Try a different search term' : 'Add influencers to assign them coupon codes and track their sales'}
        actionLabel={searchQuery ? undefined : 'Add Influencer'}
        onaction={() => showModal = true}
      />
    </Card>
  {:else}
    <div class="influencer-grid">
      {#each filteredInfluencers as influencer, i}
        <div class="grid-item" in:fly={{ y: 20, delay: i * 40, duration: 300 }}>
          <Card hover class="h-full">
            <div class="influencer-card">
              <div class="influencer-avatar" style="background: {getAvatarColor(influencer.name)}">
                {getInitials(influencer.name)}
              </div>

              <h3 class="influencer-name">{influencer.name}</h3>

              <div class="social-handles">
                {#if influencer.instagramHandle}
                  <a href="https://instagram.com/{influencer.instagramHandle}" target="_blank" class="social-link instagram">
                    <span class="social-icon">📷</span>
                    @{influencer.instagramHandle}
                  </a>
                {/if}
                {#if influencer.tiktokHandle}
                  <a href="https://tiktok.com/@{influencer.tiktokHandle}" target="_blank" class="social-link tiktok">
                    <span class="social-icon">🎵</span>
                    @{influencer.tiktokHandle}
                  </a>
                {/if}
              </div>

              <div class="influencer-stats">
                <div class="stat">
                  <span class="stat-value">{influencer._count?.couponAssignments || 0}</span>
                  <span class="stat-label">Campaigns</span>
                </div>
                <div class="stat">
                  <span class="stat-value">{influencer.totalRedemptions}</span>
                  <span class="stat-label">Redemptions</span>
                </div>
              </div>

              <div class="influencer-actions">
                <button class="action-btn primary" onclick={() => openAssignModal(influencer.id)}>Assign Coupon</button>
                <button class="action-btn">View</button>
              </div>
            </div>
          </Card>
        </div>
      {/each}
    </div>
  {/if}
</div>

<Modal bind:open={showModal} title="Add New Influencer" size="sm">
  <form class="form" onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
    <Input 
      label="Full Name" 
      placeholder="e.g. Sarah Johnson"
      bind:value={formData.name}
      required
    />
    
    <Input 
      label="Email" 
      type="email"
      placeholder="sarah@example.com"
      bind:value={formData.email}
    />

    <Input 
      label="Instagram Handle" 
      placeholder="@username (without @)"
      bind:value={formData.instagramHandle}
      icon="📷"
    />

    <Input 
      label="TikTok Handle" 
      placeholder="@username (without @)"
      bind:value={formData.tiktokHandle}
      icon="🎵"
    />
  </form>

  {#snippet footer()}
    <Button variant="secondary" onclick={() => showModal = false}>Cancel</Button>
    <Button loading={isSubmitting} onclick={handleSubmit}>Add Influencer</Button>
  {/snippet}
</Modal>

<Modal bind:open={showAssignModal} title="Assign Coupon" size="sm">
  <div class="form">
    <p style="color: #9ca3af; margin-bottom: 1rem;">
      Select a campaign to generate a unique tracking coupon for this influencer.
    </p>

    <div class="form-group">
      <label for="campaign-select" style="display: block; color: #d1d5db; font-size: 0.875rem; margin-bottom: 0.5rem;">Select Campaign</label>
      <select 
        id="campaign-select"
        bind:value={assignData.campaignId}
        style="width: 100%; padding: 0.75rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; color: #fff;"
      >
        {#each campaigns as campaign}
          <option value={campaign.id}>{campaign.name}</option>
        {/each}
      </select>
    </div>
  </div>

  {#snippet footer()}
    <Button variant="secondary" onclick={() => showAssignModal = false}>Cancel</Button>
    <Button loading={isSubmitting} onclick={handleAssign}>Assign Coupon</Button>
  {/snippet}
</Modal>

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
    max-width: 400px;
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
    padding: 0.75rem 1rem 0.75rem 2.75rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.75rem;
    color: #fff;
    font-size: 0.875rem;
    transition: all 0.2s;
  }

  .search-input:focus {
    outline: none;
    border-color: #7c3aed;
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.2);
  }

  .summary-stats {
    display: flex;
    gap: 1.5rem;
  }

  .summary-item {
    font-size: 0.875rem;
    color: #9ca3af;
  }

  .summary-item strong {
    color: #fff;
    font-weight: 600;
  }

  .influencer-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1.25rem;
  }

  .influencer-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.75rem;
  }

  .influencer-avatar {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: 700;
    color: #fff;
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
  }

  .influencer-name {
    font-size: 1.125rem;
    font-weight: 600;
    color: #fff;
    margin: 0;
  }

  .social-handles {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  .social-link {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.8125rem;
    color: #9ca3af;
    transition: color 0.2s;
  }

  .social-link:hover {
    color: #fff;
  }

  .social-icon {
    font-size: 0.75rem;
  }

  .influencer-stats {
    display: flex;
    gap: 2rem;
    padding: 1rem 0;
    width: 100%;
    justify-content: center;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    margin-top: 0.5rem;
  }

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
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

  .influencer-actions {
    display: flex;
    gap: 0.5rem;
    width: 100%;
  }

  .action-btn {
    flex: 1;
    padding: 0.625rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.5rem;
    color: #9ca3af;
    font-size: 0.8125rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .action-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }

  .action-btn.primary {
    background: rgba(124, 58, 237, 0.15);
    border-color: rgba(124, 58, 237, 0.3);
    color: #a855f7;
  }

  .action-btn.primary:hover {
    background: rgba(124, 58, 237, 0.25);
  }

  /* Form */
  .form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  /* Skeleton */
  .skeleton-influencer {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem;
  }

  .skeleton {
    background: linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 100%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  .skeleton-avatar { width: 72px; height: 72px; border-radius: 50%; }
  .skeleton-name { height: 20px; width: 60%; border-radius: 0.5rem; }
  .skeleton-handle { height: 14px; width: 40%; border-radius: 0.5rem; }
  .skeleton-stats { height: 40px; width: 100%; border-radius: 0.5rem; margin-top: 0.5rem; }

  /* Equal height cards */
  .grid-item {
    height: 100%;
  }

  :global(.h-full) {
    height: 100%;
  }

  .influencer-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.75rem;
    height: 100%;
  }

  .influencer-actions {
    display: flex;
    gap: 0.5rem;
    width: 100%;
    margin-top: auto; /* Push to bottom */
    padding-top: 1rem;
  }

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
</style>
