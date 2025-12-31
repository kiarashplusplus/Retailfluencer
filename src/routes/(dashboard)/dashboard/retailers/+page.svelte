<script lang="ts">
  import { onMount } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import { Card, Button, Input, Modal, Badge, EmptyState } from '$lib/components/ui';

  interface Retailer {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
    supports8112: boolean;
    regions: string | null;
    createdAt: string;
  }

  let retailers = $state<Retailer[]>([]);
  let isLoading = $state(true);
  let showModal = $state(false);
  let searchQuery = $state('');
  let isSubmitting = $state(false);

  let formData = $state({
    name: '',
    slug: '',
    logoUrl: '',
    supports8112: true
  });

  onMount(async () => {
    await fetchRetailers();
  });

  async function fetchRetailers() {
    try {
      const res = await fetch('/api/retailers');
      if (res.ok) {
        retailers = await res.json();
      }
    } catch (error) {
      console.error('Failed to fetch retailers:', error);
    } finally {
      isLoading = false;
    }
  }

  async function handleSubmit() {
    isSubmitting = true;
    try {
      const res = await fetch('/api/retailers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
          logoUrl: formData.logoUrl || null,
          supports8112: formData.supports8112
        })
      });

      if (res.ok) {
        const newRetailer = await res.json();
        retailers = [newRetailer, ...retailers];
        showModal = false;
        resetForm();
      }
    } catch (error) {
      console.error('Failed to create retailer:', error);
    } finally {
      isSubmitting = false;
    }
  }

  function resetForm() {
    formData = { name: '', slug: '', logoUrl: '', supports8112: true };
  }

  let filteredRetailers = $derived(
    retailers.filter(r => 
      r.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Auto-generate slug from name
  $effect(() => {
    if (formData.name && !formData.slug) {
      formData.slug = formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
  });
</script>

<div class="page">
  <header class="page-header">
    <div>
      <h1>Retailers</h1>
      <p>Partner retailers supporting 8112 digital coupons</p>
    </div>
    <Button icon="+" onclick={() => showModal = true}>Add Retailer</Button>
  </header>

  <div class="toolbar">
    <div class="search-box">
      <span class="search-icon">🔍</span>
      <input 
        type="text" 
        placeholder="Search retailers..." 
        bind:value={searchQuery}
        class="search-input"
      />
    </div>
    <div class="filter-pills">
      <button class="pill active">All</button>
      <button class="pill">8112 Enabled</button>
    </div>
  </div>

  {#if isLoading}
    <div class="list">
      {#each Array(5) as _, i}
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
  {:else if filteredRetailers.length === 0}
    <Card>
      <EmptyState
        icon="◆"
        title={searchQuery ? 'No retailers found' : 'No retailers yet'}
        description={searchQuery ? 'Try a different search term' : 'Add partner retailers to distribute your coupons'}
        actionLabel={searchQuery ? undefined : 'Add Retailer'}
        onaction={() => showModal = true}
      />
    </Card>
  {:else}
    <div class="list">
      {#each filteredRetailers as retailer, i}
        <div in:fly={{ x: -20, delay: i * 40, duration: 300 }}>
          <Card hover padding="sm">
            <div class="retailer-row">
              <div class="retailer-logo" style="background-image: url({retailer.logoUrl || ''})">
                {#if !retailer.logoUrl}
                  <span class="logo-initial">{retailer.name.charAt(0)}</span>
                {/if}
              </div>
              
              <div class="retailer-info">
                <h3 class="retailer-name">{retailer.name}</h3>
                <span class="retailer-slug">/{retailer.slug}</span>
              </div>

              <div class="retailer-badges">
                {#if retailer.supports8112}
                  <Badge variant="success" dot>8112 Enabled</Badge>
                {:else}
                  <Badge variant="default">Standard</Badge>
                {/if}
              </div>

              <div class="retailer-stats">
                <div class="stat">
                  <span class="stat-value">{retailer._count?.campaigns || 0}</span>
                  <span class="stat-label">Campaigns</span>
                </div>
                <div class="stat">
                  <span class="stat-value">{retailer._count?.redemptions || 0}</span>
                  <span class="stat-label">Redemptions</span>
                </div>
              </div>

              <div class="retailer-actions">
                <button class="icon-btn" title="Edit">✎</button>
                <button class="icon-btn" title="View">↗</button>
              </div>
            </div>
          </Card>
        </div>
      {/each}
    </div>
  {/if}
</div>

<Modal bind:open={showModal} title="Add New Retailer" size="sm">
  <form class="form" onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
    <Input 
      label="Retailer Name" 
      placeholder="e.g. Target, Walmart"
      bind:value={formData.name}
      required
    />
    
    <Input 
      label="Slug" 
      placeholder="target"
      bind:value={formData.slug}
      hint="URL-friendly identifier"
    />

    <Input 
      label="Logo URL" 
      placeholder="https://..."
      bind:value={formData.logoUrl}
    />

    <label class="checkbox-field">
      <input type="checkbox" bind:checked={formData.supports8112} />
      <span class="checkbox-label">Supports 8112 Digital Coupons</span>
    </label>
  </form>

  {#snippet footer()}
    <Button variant="secondary" onclick={() => showModal = false}>Cancel</Button>
    <Button loading={isSubmitting} onclick={handleSubmit}>Create Retailer</Button>
  {/snippet}
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

  .filter-pills {
    display: flex;
    gap: 0.5rem;
  }

  .pill {
    padding: 0.5rem 1rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 9999px;
    color: #9ca3af;
    font-size: 0.8125rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .pill.active, .pill:hover {
    background: rgba(124, 58, 237, 0.15);
    border-color: rgba(124, 58, 237, 0.3);
    color: #a855f7;
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .retailer-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem;
  }

  .retailer-logo {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(168, 85, 247, 0.1));
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background-size: cover;
    background-position: center;
  }

  .logo-initial {
    font-size: 1.25rem;
    font-weight: 700;
    color: #a855f7;
  }

  .retailer-info {
    flex: 1;
    min-width: 0;
  }

  .retailer-name {
    font-size: 1rem;
    font-weight: 600;
    color: #fff;
    margin: 0;
  }

  .retailer-slug {
    font-size: 0.75rem;
    color: #6b7280;
  }

  .retailer-badges {
    display: flex;
    gap: 0.5rem;
  }

  .retailer-stats {
    display: flex;
    gap: 2rem;
  }

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .stat-value {
    font-size: 1.125rem;
    font-weight: 600;
    color: #fff;
  }

  .stat-label {
    font-size: 0.6875rem;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .retailer-actions {
    display: flex;
    gap: 0.5rem;
  }

  .icon-btn {
    width: 36px;
    height: 36px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: #9ca3af;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }

  /* Form styles */
  .form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .checkbox-field {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
  }

  .checkbox-field input {
    width: 18px;
    height: 18px;
    accent-color: #7c3aed;
  }

  .checkbox-label {
    font-size: 0.875rem;
    color: #e5e7eb;
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
    border-radius: 0.5rem;
  }

  .skeleton-avatar { width: 48px; height: 48px; border-radius: 12px; flex-shrink: 0; }
  .skeleton-content { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
  .skeleton-title { height: 18px; width: 40%; }
  .skeleton-text { height: 12px; width: 20%; }

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  @media (max-width: 768px) {
    .retailer-stats { display: none; }
    .retailer-row { flex-wrap: wrap; }
  }
</style>
