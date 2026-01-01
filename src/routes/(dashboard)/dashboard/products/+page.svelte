<script lang="ts">
  import { onMount } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import { Card, Button, Input, Modal, Badge, EmptyState } from '$lib/components/ui';
  import { page } from '$app/stores';
  import { user } from '$lib/stores/auth';

  interface Product {
    id: string;
    name: string;
    sku: string | null;
    gtin: string | null;
    retailPrice: number | null;
    cogs: number | null;
    imageUrl: string | null;
    createdAt: string;
    brand?: { name: string };
    retailers?: { id: string; name: string; logoUrl?: string }[];
    influencers?: { id: string; name: string; instagramHandle?: string; tiktokHandle?: string; totalRedemptions: number }[];
  }

  let products = $state<Product[]>([]);
  let isLoading = $state(true);
  let showModal = $state(false);
  let searchQuery = $state('');

  let isSubmitting = $state(false);
  let editingId = $state<string | null>(null);

  // Form state
  let formData = $state({
    name: '',
    sku: '',
    gtin: '',
    retailPrice: '',
    cogs: '',
    imageUrl: ''
  });

  onMount(async () => {
    if ($page.url.searchParams.get('action') === 'new') {
      showModal = true;
    }
    await fetchProducts();
  });

  async function fetchProducts() {
    try {
      const brandId = $user?.brandId;
      const res = await fetch(`/api/products?brandId=${brandId}`);
      if (res.ok) {
        products = await res.json();
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      isLoading = false;
    }
  }

  async function handleSubmit() {
    isSubmitting = true;
    try {
      const url = editingId ? `/api/products/${editingId}` : '/api/products';
      const method = editingId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandId: $user?.brandId,
          name: formData.name,
          sku: formData.sku || null,
          gtin: formData.gtin || null,
          retailPrice: formData.retailPrice ? parseFloat(formData.retailPrice) : null,
          cogs: formData.cogs ? parseFloat(formData.cogs) : null,
          imageUrl: formData.imageUrl || null
        })
      });

      if (res.ok) {
        const savedProduct = await res.json();
        if (editingId) {
          products = products.map(p => p.id === editingId ? savedProduct : p);
        } else {
          products = [savedProduct, ...products];
        }
        showModal = false;
        resetForm();
      }
    } catch (error) {
      console.error('Failed to save product:', error);
    } finally {
      isSubmitting = false;
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        products = products.filter(p => p.id !== id);
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  }

  function openCreateModal() {
    resetForm();
    editingId = null;
    showModal = true;
  }

  function openEditModal(product: Product) {
    formData = {
      name: product.name,
      sku: product.sku || '',
      gtin: product.gtin || '',
      retailPrice: product.retailPrice?.toString() || '',
      cogs: product.cogs?.toString() || '',
      imageUrl: product.imageUrl || ''
    };
    editingId = product.id;
    showModal = true;
  }

  function resetForm() {
    formData = { name: '', sku: '', gtin: '', retailPrice: '', cogs: '', imageUrl: '' };
  }

  let filteredProducts = $derived(
    products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
</script>

<div class="page">
  <header class="page-header">
    <div>
      <h1>Products</h1>
      <p>Manage your product catalog for campaigns</p>
    </div>

    <Button icon="+" onclick={openCreateModal}>Add Product</Button>
  </header>

  <div class="toolbar">
    <div class="search-box">
      <span class="search-icon">🔍</span>
      <input 
        type="text" 
        placeholder="Search products..." 
        bind:value={searchQuery}
        class="search-input"
      />
    </div>
    <div class="view-toggle">
      <button class="toggle-btn active">◫</button>
      <button class="toggle-btn">☰</button>
    </div>
  </div>

  {#if isLoading}
    <div class="grid">
      {#each Array(6) as _, i}
        <Card>
          <div class="skeleton-card" in:fade={{ delay: i * 50 }}>
            <div class="skeleton skeleton-image"></div>
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-text"></div>
          </div>
        </Card>
      {/each}
    </div>
  {:else if filteredProducts.length === 0}
    <Card>
      <EmptyState
        icon="◇"
        title={searchQuery ? 'No products found' : 'No products yet'}
        description={searchQuery ? 'Try a different search term' : 'Add your first product to start creating campaigns'}
        actionLabel={searchQuery ? undefined : 'Add Product'}
        onaction={openCreateModal}
      />
    </Card>
  {:else}
    <div class="grid">
      {#each filteredProducts as product, i}
        <div in:fly={{ y: 20, delay: i * 50, duration: 300 }}>
          <Card hover>
            <div class="product-card">
              <div class="product-image" style="background-image: url({product.imageUrl || ''})">
                {#if !product.imageUrl}
                  <span class="placeholder-icon">◇</span>
                {/if}
              </div>
              <div class="product-info">
                <h3 class="product-name">{product.name}</h3>
                {#if product.sku}
                  <span class="product-sku">SKU: {product.sku}</span>
                {/if}
                <div class="product-meta">
                  {#if product.retailPrice}
                    <span class="product-price">${product.retailPrice.toFixed(2)}</span>
                  {/if}
                  {#if product.gtin}
                    <Badge variant="purple">GTIN</Badge>
                  {/if}
                </div>
                
                <!-- Retailers -->
                {#if product.retailers && product.retailers.length > 0}
                  <div class="product-section">
                    <span class="section-label">Sold at</span>
                    <div class="retailer-tags">
                      {#each product.retailers as retailer}
                        <span class="retailer-tag">
                          <span class="retailer-name">{retailer.name}</span>
                        </span>
                      {/each}
                    </div>
                  </div>
                {/if}
                
                <!-- Influencers -->
                {#if product.influencers && product.influencers.length > 0}
                  <div class="product-section">
                    <span class="section-label">Influencers ({product.influencers.length})</span>
                    <div class="influencer-list">
                      {#each product.influencers as inf}
                        <div class="influencer-chip">
                          <span class="influencer-avatar">★</span>
                          <div class="influencer-details">
                            <span class="influencer-name">{inf.name}</span>
                            <span class="influencer-handle">
                              {inf.instagramHandle ? `@${inf.instagramHandle}` : inf.tiktokHandle ? `@${inf.tiktokHandle}` : ''}
                            </span>
                          </div>
                          <span class="influencer-redemptions">{inf.totalRedemptions} sales</span>
                        </div>
                      {/each}
                    </div>
                  </div>
                {/if}
              </div>
              <div class="product-actions">
                <button class="action-btn" onclick={() => openEditModal(product)}>Edit</button>
                <button class="action-btn action-btn--danger" onclick={() => handleDelete(product.id)}>Delete</button>
              </div>
            </div>
          </Card>
        </div>
      {/each}
    </div>
  {/if}
</div>



<Modal bind:open={showModal} title={editingId ? 'Edit Product' : 'Add New Product'} size="md">
  <form class="form" onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
    <Input 
      label="Product Name" 
      placeholder="e.g. Organic Protein Bar"
      bind:value={formData.name}
      required
    />
    
    <div class="form-row">
      <Input 
        label="SKU" 
        placeholder="ABC-123"
        bind:value={formData.sku}
      />
      <Input 
        label="GTIN" 
        placeholder="14-digit code"
        bind:value={formData.gtin}
      />
    </div>

    <div class="form-row">
      <Input 
        label="Retail Price" 
        type="number"
        placeholder="0.00"
        bind:value={formData.retailPrice}
        icon="$"
      />
      <Input 
        label="COGS" 
        type="number"
        placeholder="0.00"
        bind:value={formData.cogs}
        icon="$"
      />
    </div>

    <Input 
      label="Image URL" 
      placeholder="https://..."
      bind:value={formData.imageUrl}
    />
  </form>

  {#snippet footer()}
    <Button variant="secondary" onclick={() => showModal = false}>Cancel</Button>
    <Button loading={isSubmitting} onclick={handleSubmit}>{editingId ? 'Save Changes' : 'Create Product'}</Button>
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

  .view-toggle {
    display: flex;
    gap: 0.25rem;
    background: rgba(255, 255, 255, 0.05);
    padding: 0.25rem;
    border-radius: 0.5rem;
  }

  .toggle-btn {
    padding: 0.5rem 0.75rem;
    background: transparent;
    border: none;
    color: #6b7280;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .toggle-btn.active, .toggle-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .product-card {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .product-image {
    height: 160px;
    background: linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(168, 85, 247, 0.05));
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background-size: cover;
    background-position: center;
  }

  .placeholder-icon {
    font-size: 2.5rem;
    opacity: 0.3;
  }

  .product-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .product-name {
    font-size: 1rem;
    font-weight: 600;
    color: #fff;
    margin: 0;
  }

  .product-sku {
    font-size: 0.75rem;
    color: #6b7280;
  }

  .product-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .product-price {
    font-size: 1.125rem;
    font-weight: 600;
    color: #10b981;
  }

  .product-section {
    margin-top: 1rem;
    padding-top: 0.75rem;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
  }

  .section-label {
    font-size: 0.75rem;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    display: block;
    margin-bottom: 0.5rem;
  }

  .retailer-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
  }

  .retailer-tag {
    padding: 0.25rem 0.625rem;
    background: rgba(124, 58, 237, 0.15);
    border: 1px solid rgba(124, 58, 237, 0.25);
    border-radius: 9999px;
    font-size: 0.75rem;
    color: #c4b5fd;
  }

  .influencer-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .influencer-chip {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 0.5rem;
  }

  .influencer-avatar {
    width: 28px;
    height: 28px;
    background: linear-gradient(135deg, #f59e0b, #d97706);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    color: #fff;
  }

  .influencer-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .influencer-name {
    font-size: 0.8125rem;
    font-weight: 500;
    color: #e5e7eb;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .influencer-handle {
    font-size: 0.6875rem;
    color: #6b7280;
  }

  .influencer-redemptions {
    font-size: 0.6875rem;
    color: #10b981;
    background: rgba(16, 185, 129, 0.1);
    padding: 0.125rem 0.5rem;
    border-radius: 9999px;
    white-space: nowrap;
  }

  .product-actions {
    display: flex;
    gap: 0.5rem;
    padding-top: 0.75rem;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
  }

  .action-btn {
    flex: 1;
    padding: 0.5rem;
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

  .action-btn--danger:hover {
    background: rgba(239, 68, 68, 0.1);
    border-color: rgba(239, 68, 68, 0.3);
    color: #f87171;
  }

  /* Form styles */
  .form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  /* Skeleton loading */
  .skeleton-card {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .skeleton {
    background: linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 100%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 0.5rem;
  }

  .skeleton-image { height: 160px; border-radius: 0.75rem; }
  .skeleton-title { height: 20px; width: 70%; }
  .skeleton-text { height: 14px; width: 40%; }

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
</style>
