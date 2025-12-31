<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { auth, user, isAuthenticated, isLoading } from '$lib/stores/auth';
  import { onMount } from 'svelte';

  let { children } = $props();

  let sidebarCollapsed = $state(false);

  onMount(() => {
    // Redirect to login if not authenticated (after loading completes)
    const unsubscribe = auth.subscribe(state => {
      if (!state.isLoading && !state.user) {
        goto('/login');
      }
    });
    return unsubscribe;
  });

  const navItems = [
    { href: '/dashboard', label: 'Overview', icon: '◈' },
    { href: '/dashboard/products', label: 'Products', icon: '◇' },
    { href: '/dashboard/retailers', label: 'Retailers', icon: '◆' },
    { href: '/dashboard/campaigns', label: 'Campaigns', icon: '▣' },
    { href: '/dashboard/influencers', label: 'Influencers', icon: '★' },
    { href: '/dashboard/analytics', label: 'Analytics', icon: '◉' },
    { href: '/dashboard/settings', label: 'Settings', icon: '⚙' },
  ];

  function isActive(href: string): boolean {
    if (href === '/dashboard') {
      return $page.url.pathname === '/dashboard';
    }
    return $page.url.pathname.startsWith(href);
  }

  function handleLogout() {
    auth.logout();
    goto('/login');
  }
</script>

<svelte:head>
  <title>Dashboard | Retailfluencer</title>
</svelte:head>

{#if $isLoading}
  <div class="loading-screen">
    <div class="loader"></div>
  </div>
{:else if $isAuthenticated}
  <div class="dashboard-layout" class:collapsed={sidebarCollapsed}>
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <span class="logo-icon">◈</span>
          {#if !sidebarCollapsed}
            <span class="logo-text">Retailfluencer</span>
          {/if}
        </div>
        <button class="collapse-btn" onclick={() => sidebarCollapsed = !sidebarCollapsed}>
          {sidebarCollapsed ? '→' : '←'}
        </button>
      </div>

      <nav class="sidebar-nav">
        {#each navItems as item}
          <a 
            href={item.href} 
            class="nav-item"
            class:active={isActive(item.href)}
          >
            <span class="nav-icon">{item.icon}</span>
            {#if !sidebarCollapsed}
              <span class="nav-label">{item.label}</span>
            {/if}
          </a>
        {/each}
      </nav>

      <div class="sidebar-footer">
        {#if !sidebarCollapsed}
          <div class="user-info">
            <div class="user-avatar">
              {$user?.name?.charAt(0) || 'U'}
            </div>
            <div class="user-details">
              <span class="user-name">{$user?.name}</span>
              <span class="user-brand">{$user?.brandName}</span>
            </div>
          </div>
        {/if}
        <button class="logout-btn" onclick={handleLogout} title="Logout">
          ⎋
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <main class="main-content">
      {@render children()}
    </main>
  </div>
{/if}

<style>
  .loading-screen {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #0a0a0f;
  }

  .loader {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(124, 58, 237, 0.2);
    border-top-color: #7c3aed;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .dashboard-layout {
    display: grid;
    grid-template-columns: 260px 1fr;
    min-height: 100vh;
    background: #0a0a0f;
    transition: grid-template-columns 0.3s ease;
  }

  .dashboard-layout.collapsed {
    grid-template-columns: 80px 1fr;
  }

  /* Sidebar */
  .sidebar {
    background: linear-gradient(180deg, #12121a 0%, #0d0d14 100%);
    border-right: 1px solid rgba(255, 255, 255, 0.06);
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
  }

  .sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .logo-icon {
    font-size: 1.5rem;
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .logo-text {
    font-size: 1.125rem;
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.02em;
    white-space: nowrap;
  }

  .collapse-btn {
    background: rgba(255, 255, 255, 0.05);
    border: none;
    width: 28px;
    height: 28px;
    border-radius: 6px;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s;
  }

  .collapse-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }

  .sidebar-nav {
    flex: 1;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    color: #9ca3af;
    text-decoration: none;
    border-radius: 0.75rem;
    transition: all 0.2s ease;
  }

  .nav-item:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #fff;
  }

  .nav-item.active {
    background: linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(168, 85, 247, 0.1));
    color: #a855f7;
  }

  .nav-icon {
    font-size: 1.125rem;
    width: 24px;
    text-align: center;
  }

  .nav-label {
    font-size: 0.875rem;
    font-weight: 500;
    white-space: nowrap;
  }

  .sidebar-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .user-info {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-width: 0;
  }

  .user-avatar {
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-weight: 600;
    font-size: 0.875rem;
    flex-shrink: 0;
  }

  .user-details {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .user-name {
    font-size: 0.875rem;
    font-weight: 500;
    color: #fff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .user-brand {
    font-size: 0.75rem;
    color: #6b7280;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .logout-btn {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.2);
    width: 36px;
    height: 36px;
    border-radius: 8px;
    color: #f87171;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .logout-btn:hover {
    background: rgba(239, 68, 68, 0.2);
  }

  /* Main content */
  .main-content {
    padding: 2rem;
    overflow-y: auto;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .dashboard-layout {
      grid-template-columns: 1fr;
    }

    .sidebar {
      position: fixed;
      left: -260px;
      width: 260px;
      z-index: 100;
      transition: left 0.3s ease;
    }

    .sidebar.open {
      left: 0;
    }
  }
</style>
