<script lang="ts">
  import { Card, Button, Input } from '$lib/components/ui';
  import { user, auth, DEMO_USER } from '$lib/stores/auth';
  import { goto } from '$app/navigation';

  let isSaving = $state(false);
  let saveSuccess = $state(false);

  // Brand settings
  let brandSettings = $state({
    name: 'Demo Brand',
    slug: 'demo-brand',
    logoUrl: '',
    tcbFunderId: ''
  });

  // Notification settings
  let notifications = $state({
    emailOnRedemption: true,
    emailDailyDigest: false,
    emailWeeklyReport: true,
    pushNotifications: false
  });

  async function handleSave() {
    isSaving = true;
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    isSaving = false;
    saveSuccess = true;
    setTimeout(() => saveSuccess = false, 3000);
  }

  function handleLogout() {
    auth.logout();
    goto('/login');
  }

  const settingsSections = [
    {
      id: 'brand',
      title: 'Brand Profile',
      description: 'Configure your brand identity and TCB integration'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Manage how you receive alerts and updates'
    },
    {
      id: 'integrations',
      title: 'Integrations',
      description: 'Connect third-party services'
    },
    {
      id: 'account',
      title: 'Account',
      description: 'Manage your login and security settings'
    }
  ];

  let activeSection = $state('brand');
</script>

<div class="page">
  <header class="page-header">
    <div>
      <h1>Settings</h1>
      <p>Manage your account and brand configuration</p>
    </div>
    <Button loading={isSaving} onclick={handleSave}>
      {saveSuccess ? '✓ Saved' : 'Save Changes'}
    </Button>
  </header>

  <div class="settings-layout">
    <!-- Sidebar Navigation -->
    <aside class="settings-nav">
      {#each settingsSections as section}
        <button 
          class="nav-item" 
          class:active={activeSection === section.id}
          onclick={() => activeSection = section.id}
        >
          <span class="nav-title">{section.title}</span>
          <span class="nav-description">{section.description}</span>
        </button>
      {/each}
    </aside>

    <!-- Content -->
    <div class="settings-content">
      {#if activeSection === 'brand'}
        <Card>
          <div class="section">
            <h2>Brand Profile</h2>
            <p class="section-description">
              Update your brand information and TCB funder details
            </p>

            <div class="form-grid">
              <Input 
                label="Brand Name" 
                bind:value={brandSettings.name}
                placeholder="Your brand name"
              />
              <Input 
                label="Slug" 
                bind:value={brandSettings.slug}
                placeholder="your-brand"
                hint="URL-friendly identifier"
              />
            </div>

            <Input 
              label="Logo URL" 
              bind:value={brandSettings.logoUrl}
              placeholder="https://..."
            />

            <div class="logo-preview">
              {#if brandSettings.logoUrl}
                <img src={brandSettings.logoUrl} alt="Brand logo preview" />
              {:else}
                <div class="logo-placeholder">
                  <span>◈</span>
                  <span class="placeholder-text">No logo uploaded</span>
                </div>
              {/if}
            </div>

            <div class="divider"></div>

            <h3>TCB Integration</h3>
            <p class="section-description">
              Configure your connection to The Coupon Bureau
            </p>

            <Input 
              label="TCB Funder ID" 
              bind:value={brandSettings.tcbFunderId}
              placeholder="FUNDER-XXXX"
              hint="Your assigned funder ID from TCB"
            />

            <div class="tcb-status">
              <span class="status-indicator mock"></span>
              <span class="status-text">Mock Mode Active</span>
              <span class="status-hint">Using simulated TCB integration for demo</span>
            </div>
          </div>
        </Card>

      {:else if activeSection === 'notifications'}
        <Card>
          <div class="section">
            <h2>Notification Preferences</h2>
            <p class="section-description">
              Choose how and when you want to be notified
            </p>

            <div class="toggle-list">
              <label class="toggle-item">
                <div class="toggle-info">
                  <span class="toggle-title">Redemption Alerts</span>
                  <span class="toggle-description">Get notified when a coupon is redeemed</span>
                </div>
                <input type="checkbox" class="toggle" bind:checked={notifications.emailOnRedemption} />
              </label>

              <label class="toggle-item">
                <div class="toggle-info">
                  <span class="toggle-title">Daily Digest</span>
                  <span class="toggle-description">Receive a daily summary of activity</span>
                </div>
                <input type="checkbox" class="toggle" bind:checked={notifications.emailDailyDigest} />
              </label>

              <label class="toggle-item">
                <div class="toggle-info">
                  <span class="toggle-title">Weekly Report</span>
                  <span class="toggle-description">Get a weekly performance report</span>
                </div>
                <input type="checkbox" class="toggle" bind:checked={notifications.emailWeeklyReport} />
              </label>

              <label class="toggle-item">
                <div class="toggle-info">
                  <span class="toggle-title">Push Notifications</span>
                  <span class="toggle-description">Enable browser push notifications</span>
                </div>
                <input type="checkbox" class="toggle" bind:checked={notifications.pushNotifications} />
              </label>
            </div>
          </div>
        </Card>

      {:else if activeSection === 'integrations'}
        <Card>
          <div class="section">
            <h2>Integrations</h2>
            <p class="section-description">
              Connect third-party services to extend functionality
            </p>

            <div class="integrations-grid">
              <div class="integration-card">
                <div class="integration-icon">📧</div>
                <div class="integration-info">
                  <span class="integration-name">Klaviyo</span>
                  <span class="integration-status">Not Connected</span>
                </div>
                <Button variant="secondary" size="sm">Connect</Button>
              </div>

              <div class="integration-card">
                <div class="integration-icon">📊</div>
                <div class="integration-info">
                  <span class="integration-name">Google Analytics</span>
                  <span class="integration-status">Not Connected</span>
                </div>
                <Button variant="secondary" size="sm">Connect</Button>
              </div>

              <div class="integration-card">
                <div class="integration-icon">🔗</div>
                <div class="integration-info">
                  <span class="integration-name">Zapier</span>
                  <span class="integration-status">Not Connected</span>
                </div>
                <Button variant="secondary" size="sm">Connect</Button>
              </div>

              <div class="integration-card">
                <div class="integration-icon">💼</div>
                <div class="integration-info">
                  <span class="integration-name">HubSpot</span>
                  <span class="integration-status">Not Connected</span>
                </div>
                <Button variant="secondary" size="sm">Connect</Button>
              </div>
            </div>
          </div>
        </Card>

      {:else if activeSection === 'account'}
        <Card>
          <div class="section">
            <h2>Account Settings</h2>
            <p class="section-description">
              Manage your login credentials and security
            </p>

            <div class="account-info">
              <div class="avatar">
                {$user?.name?.charAt(0) || 'U'}
              </div>
              <div class="account-details">
                <span class="account-name">{$user?.name || 'Demo User'}</span>
                <span class="account-email">{$user?.email || 'demo@example.com'}</span>
              </div>
            </div>

            <div class="divider"></div>

            <div class="danger-zone">
              <h3>Danger Zone</h3>
              <p class="section-description">
                Irreversible actions — proceed with caution
              </p>

              <div class="danger-actions">
                <Button variant="danger" onclick={handleLogout}>
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </Card>
      {/if}
    </div>
  </div>
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

  .settings-layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 2rem;
  }

  /* Sidebar */
  .settings-nav {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
    padding: 1rem;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 0.75rem;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s;
  }

  .nav-item:hover {
    background: rgba(255, 255, 255, 0.03);
    border-color: rgba(255, 255, 255, 0.06);
  }

  .nav-item.active {
    background: rgba(124, 58, 237, 0.1);
    border-color: rgba(124, 58, 237, 0.3);
  }

  .nav-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: #fff;
  }

  .nav-item.active .nav-title {
    color: #a855f7;
  }

  .nav-description {
    font-size: 0.75rem;
    color: #6b7280;
  }

  /* Content */
  .section {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .section h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #fff;
    margin: 0;
  }

  .section h3 {
    font-size: 1rem;
    font-weight: 600;
    color: #fff;
    margin: 0;
  }

  .section-description {
    font-size: 0.875rem;
    color: #6b7280;
    margin: -0.5rem 0 0.5rem;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }

  .logo-preview {
    width: 120px;
    height: 120px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px dashed rgba(255, 255, 255, 0.1);
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .logo-preview img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .logo-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    color: #6b7280;
    font-size: 2rem;
  }

  .placeholder-text {
    font-size: 0.625rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .divider {
    height: 1px;
    background: rgba(255, 255, 255, 0.06);
    margin: 0.5rem 0;
  }

  .tcb-status {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background: rgba(245, 158, 11, 0.1);
    border: 1px solid rgba(245, 158, 11, 0.2);
    border-radius: 0.75rem;
  }

  .status-indicator {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }

  .status-indicator.mock {
    background: #f59e0b;
    box-shadow: 0 0 10px rgba(245, 158, 11, 0.4);
    animation: pulse 2s ease-in-out infinite;
  }

  .status-text {
    font-size: 0.875rem;
    font-weight: 500;
    color: #fbbf24;
  }

  .status-hint {
    flex: 1;
    font-size: 0.75rem;
    color: #6b7280;
    text-align: right;
  }

  /* Toggle List */
  .toggle-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .toggle-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 0.75rem;
    cursor: pointer;
    transition: background 0.2s;
  }

  .toggle-item:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  .toggle-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .toggle-title {
    font-size: 0.875rem;
    font-weight: 500;
    color: #fff;
  }

  .toggle-description {
    font-size: 0.75rem;
    color: #6b7280;
  }

  .toggle {
    width: 48px;
    height: 26px;
    appearance: none;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 13px;
    position: relative;
    cursor: pointer;
    transition: background 0.2s;
  }

  .toggle::before {
    content: '';
    position: absolute;
    top: 3px;
    left: 3px;
    width: 20px;
    height: 20px;
    background: #fff;
    border-radius: 50%;
    transition: transform 0.2s;
  }

  .toggle:checked {
    background: linear-gradient(135deg, #7c3aed, #a855f7);
  }

  .toggle:checked::before {
    transform: translateX(22px);
  }

  /* Integrations */
  .integrations-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .integration-card {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 0.75rem;
  }

  .integration-icon {
    font-size: 1.5rem;
  }

  .integration-info {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .integration-name {
    font-size: 0.875rem;
    font-weight: 500;
    color: #fff;
  }

  .integration-status {
    font-size: 0.75rem;
    color: #6b7280;
  }

  /* Account */
  .account-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 0.75rem;
  }

  .avatar {
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: 700;
    color: #fff;
  }

  .account-details {
    display: flex;
    flex-direction: column;
  }

  .account-name {
    font-size: 1rem;
    font-weight: 600;
    color: #fff;
  }

  .account-email {
    font-size: 0.875rem;
    color: #6b7280;
  }

  .danger-zone {
    padding: 1.25rem;
    background: rgba(239, 68, 68, 0.05);
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: 0.75rem;
  }

  .danger-zone h3 {
    color: #f87171;
  }

  .danger-actions {
    margin-top: 1rem;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  @media (max-width: 768px) {
    .settings-layout {
      grid-template-columns: 1fr;
    }

    .settings-nav {
      flex-direction: row;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }

    .nav-item {
      flex-shrink: 0;
      min-width: 150px;
    }

    .form-grid, .integrations-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
