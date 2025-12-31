<script lang="ts">
  import { onMount } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import { Card, Badge, EmptyState } from '$lib/components/ui';
  import { user } from '$lib/stores/auth';

  interface Customer {
    id: string;
    email: string | null;
    phone: string | null;
    totalRedemptions: number;
    isAffiliate: boolean;
    createdAt: string;
    affiliate?: {
      code: string;
    };
    _count: {
      redemptions: number;
    };
  }

  let customers = $state<Customer[]>([]);
  let isLoading = $state(true);

  onMount(async () => {
    await fetchCustomers();
  });

  async function fetchCustomers() {
    try {
      const brandId = $user?.brandId;
      const res = await fetch(`/api/customers?brandId=${brandId}`);
      if (res.ok) {
        customers = await res.json();
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      isLoading = false;
    }
  }

  function formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
</script>

<div class="page">
  <header class="page-header">
    <div>
      <h1>Customers</h1>
      <p>People who have captured coupons or interacted with your campaigns</p>
    </div>
  </header>

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
  {:else if customers.length === 0}
    <Card>
      <EmptyState
        icon="👥"
        title="No customers yet"
        description="Customers will appear here once they capture a coupon or redeem an offer."
      />
    </Card>
  {:else}
    <div class="list">
      {#each customers as customer, i}
        <div in:fly={{ x: -20, delay: i * 50, duration: 300 }}>
          <Card hover>
            <div class="customer-row">
              <div class="customer-avatar">
                {customer.email?.charAt(0).toUpperCase() || 'C'}
              </div>

              <div class="customer-info">
                <div class="customer-header">
                  <span class="customer-email">{customer.email || 'No email provided'}</span>
                  {#if customer.isAffiliate}
                    <Badge variant="purple">Affiliate</Badge>
                  {/if}
                </div>
                {#if customer.phone}
                  <span class="customer-phone">{customer.phone}</span>
                {/if}
              </div>

              <div class="customer-stats">
                <div class="stat">
                  <span class="stat-value">{customer._count.redemptions}</span>
                  <span class="stat-label">Redemptions</span>
                </div>
              </div>

              <div class="customer-date">
                <span class="date-label">Joined</span>
                <span class="date-value">{formatDate(customer.createdAt)}</span>
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
    max-width: 1000px;
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

  .list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .customer-row {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .customer-avatar {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #3b82f6, #60a5fa);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    font-weight: 700;
    color: #fff;
    flex-shrink: 0;
  }

  .customer-info {
    flex: 1;
    min-width: 0;
  }

  .customer-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.25rem;
  }

  .customer-email {
    font-size: 0.9375rem;
    font-weight: 500;
    color: #fff;
  }

  .customer-phone {
    font-size: 0.8125rem;
    color: #9ca3af;
  }

  .customer-stats {
    padding: 0 2rem;
  }

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .stat .stat-value {
    font-size: 1.125rem;
    font-weight: 600;
    color: #fff;
  }

  .stat .stat-label {
    font-size: 0.6875rem;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .customer-date {
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
</style>
