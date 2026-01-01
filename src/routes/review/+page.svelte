<script lang="ts">
  import { fly, fade } from 'svelte/transition';

  // Lightbox state
  let lightboxOpen = $state(false);
  let lightboxSrc = $state('');
  let lightboxAlt = $state('');

  function openLightbox(src: string, alt: string) {
    lightboxSrc = src;
    lightboxAlt = alt;
    lightboxOpen = true;
  }

  function closeLightbox() {
    lightboxOpen = false;
  }

  // Demo data matching the actual implementation
  const features = [
    { icon: '✅', label: 'Dashboard with metrics', notes: '82 Redemptions, $366.68 Revenue' },
    { icon: '✅', label: 'Products CRUD', notes: '3 products with images, SKU, COGS' },
    { icon: '✅', label: 'Retailers with 8112 flags', notes: '6 retailers, all 8112 enabled' },
    { icon: '✅', label: 'Campaign Builder', notes: 'Full 5-step wizard' },
    { icon: '✅', label: 'Influencer CRM', notes: '4 influencers with performance data' },
    { icon: '✅', label: 'Affiliate System', notes: 'Referral codes, commissions' },
    { icon: '✅', label: 'Customer CRM', notes: 'List + detail view with timeline' },
    { icon: '✅', label: 'Automations', notes: 'Email, SMS, Wait, Create Affiliate' },
    { icon: '✅', label: 'Coupon Pages', notes: 'QR code + email capture' },
    { icon: '✅', label: 'Analytics Charts', notes: 'Revenue by Product, Snowball Growth' },
    { icon: '✅', label: 'Settings', notes: 'Brand profile, TCB config' },
  ];

  const enhancements = [
    { category: 'Bug Fixes', items: ['Fixed "Invalid Date" bug - Added createdAt to all customers'] },
    { category: 'Analytics', items: ['Revenue by Product chart', 'Snowball Growth funnel visualization'] },
    { category: 'Security', items: ['Updated to strong demo password'] },
  ];
</script>

<svelte:head>
  <title>Demo Review | Retailfluencer</title>
  <meta name="description" content="Retailfluencer platform demo review and stakeholder presentation" />
</svelte:head>

<div class="page">
  <header class="hero" in:fade={{ duration: 500 }}>
    <div class="hero-glow"></div>
    <div class="badge">For Stakeholder Review — January 2026</div>
    <h1>
      <span class="title-line">Retailfluencer</span>
      <span class="title-accent">Demo Review</span>
    </h1>
    <p class="tagline">
      The missing link between <span class="highlight">influencer content</span> and <span class="highlight">retail checkout</span>
    </p>
    <p class="subtitle">
      Finally attribute in-store purchases to the creators who drove them using GS1 8112 universal digital coupons that work at Target, Walmart, CVS, Whole Foods, and 50,000+ retail locations.
    </p>
    
    <div class="hero-stats">
      <div class="hero-stat" in:fly={{ y: 20, delay: 300, duration: 400 }}>
        <span class="stat-number">4</span>
        <span class="stat-label">Influencers</span>
        <span class="stat-desc">Active creators</span>
      </div>
      <div class="hero-stat featured" in:fly={{ y: 20, delay: 400, duration: 400 }}>
        <span class="stat-number">$366</span>
        <span class="stat-label">Revenue</span>
        <span class="stat-desc">Attributed sales</span>
      </div>
      <div class="hero-stat" in:fly={{ y: 20, delay: 500, duration: 400 }}>
        <span class="stat-number">82</span>
        <span class="stat-label">Redemptions</span>
        <span class="stat-desc">Verified purchases</span>
      </div>
      <div class="hero-stat" in:fly={{ y: 20, delay: 600, duration: 400 }}>
        <span class="stat-number">3</span>
        <span class="stat-label">Campaigns</span>
        <span class="stat-desc">Live promotions</span>
      </div>
    </div>


    <div class="hero-cta" in:fly={{ y: 20, delay: 700, duration: 400 }}>
      <a href="/login" class="btn btn-primary btn-lg">Try the Demo →</a>
      <a href="/about" class="btn btn-ghost">Read the Story</a>
    </div>
  </header>

  <section class="section" in:fly={{ y: 30, delay: 200, duration: 400 }}>
    <h2>Platform Overview</h2>
    <div class="overview-grid">
      <div class="overview-card">
        <span class="card-icon">🎯</span>
        <h3>Attribution Layer</h3>
        <p>Connect influencer marketing to physical retail sales with true ROI measurement</p>
      </div>
      <div class="overview-card">
        <span class="card-icon">🎟️</span>
        <h3>8112 Coupons</h3>
        <p>GS1 standard digital coupons that work at Target, Walmart, CVS, and more</p>
      </div>
      <div class="overview-card">
        <span class="card-icon">❄️</span>
        <h3>Snowball Effect</h3>
        <p>Automatically convert customers into affiliates, creating exponential growth</p>
      </div>
    </div>
  </section>

  <section class="section" in:fly={{ y: 30, delay: 300, duration: 400 }}>
    <h2>Feature Checklist</h2>
    <div class="feature-grid">
      {#each features as feature, i}
        <div 
          class="feature-item"
          in:fly={{ x: -20, delay: 350 + i * 40, duration: 300 }}
        >
          <span class="feature-icon">{feature.icon}</span>
          <div class="feature-content">
            <span class="feature-label">{feature.label}</span>
            <span class="feature-notes">{feature.notes}</span>
          </div>
        </div>
      {/each}
    </div>
  </section>


  <section class="section cta-section" in:fly={{ y: 30, delay: 600, duration: 400 }}>
    <h2>Try the Demo</h2>
    <p>Experience the full platform yourself</p>
    <div class="cta-buttons">
      <a href="/login" class="btn btn-primary">Login to Dashboard</a>
      <a href="/about" class="btn btn-secondary">Product Story</a>
    </div>
    <p class="demo-hint">💡 Demo credentials are available on the login page</p>
  </section>

  <section class="section" in:fly={{ y: 30, delay: 700, duration: 400 }}>
    <h2>📸 Screenshots Gallery</h2>
    <p class="section-desc">Click any image to view full size</p>
    <div class="gallery-grid">
      <button class="gallery-item" onclick={() => openLightbox('/review/login_page_professional_1767259382822.png', 'Login Page')}>
        <img src="/review/login_page_professional_1767259382822.png" alt="Login Page" loading="lazy" />
        <span class="gallery-label">Login Page</span>
      </button>
      <button class="gallery-item" onclick={() => openLightbox('/review/campaigns_page_1767258786125.png', 'Campaigns Dashboard')}>
        <img src="/review/campaigns_page_1767258786125.png" alt="Campaigns Dashboard" loading="lazy" />
        <span class="gallery-label">Campaigns Dashboard</span>
      </button>
      <button class="gallery-item" onclick={() => openLightbox('/review/campaign_builder_step1_1767258802096.png', 'Campaign Builder')}>
        <img src="/review/campaign_builder_step1_1767258802096.png" alt="Campaign Builder" loading="lazy" />
        <span class="gallery-label">Campaign Builder</span>
      </button>
      <button class="gallery-item" onclick={() => openLightbox('/review/automations_page_1767259075285.png', 'Automations')}>
        <img src="/review/automations_page_1767259075285.png" alt="Automations" loading="lazy" />
        <span class="gallery-label">Automations</span>
      </button>
      <button class="gallery-item" onclick={() => openLightbox('/review/analytics_new_charts_1767260597543.png', 'Analytics Charts')}>
        <img src="/review/analytics_new_charts_1767260597543.png" alt="Analytics Charts" loading="lazy" />
        <span class="gallery-label">Analytics Charts</span>
      </button>
      <button class="gallery-item" onclick={() => openLightbox('/review/customers_page_fixed_dates_1767260565715.png', 'Customers')}>
        <img src="/review/customers_page_fixed_dates_1767260565715.png" alt="Customers" loading="lazy" />
        <span class="gallery-label">Customers</span>
      </button>
      <button class="gallery-item" onclick={() => openLightbox('/review/coupon_redemption_page_final_1767259190657.png', 'Coupon Page')}>
        <img src="/review/coupon_redemption_page_final_1767259190657.png" alt="Coupon Page" loading="lazy" />
        <span class="gallery-label">Coupon Page</span>
      </button>
      <button class="gallery-item" onclick={() => openLightbox('/review/affiliate_referral_page_1767259223147.png', 'Affiliate Landing')}>
        <img src="/review/affiliate_referral_page_1767259223147.png" alt="Affiliate Landing" loading="lazy" />
        <span class="gallery-label">Affiliate Landing</span>
      </button>
      <button class="gallery-item" onclick={() => openLightbox('/review/about_page_product_story_1767259297675.png', 'About Page')}>
        <img src="/review/about_page_product_story_1767259297675.png" alt="About Page" loading="lazy" />
        <span class="gallery-label">About Page</span>
      </button>
    </div>
  </section>

  <section class="section" in:fly={{ y: 30, delay: 800, duration: 400 }}>
    <h2>🎬 Walkthrough Recordings</h2>
    <p class="section-desc">Animated demos of key platform flows (click to view)</p>
    <div class="video-grid">
      <button class="video-item" onclick={() => openLightbox('/review/dashboard_overview_1767258607496.webp', 'Dashboard Overview')}>
        <img src="/review/dashboard_overview_1767258607496.webp" alt="Dashboard Overview" loading="lazy" />
        <span class="video-label">Dashboard Overview</span>
      </button>
      <button class="video-item" onclick={() => openLightbox('/review/products_retailers_1767258677303.webp', 'Products & Retailers')}>
        <img src="/review/products_retailers_1767258677303.webp" alt="Products & Retailers" loading="lazy" />
        <span class="video-label">Products & Retailers</span>
      </button>
      <button class="video-item" onclick={() => openLightbox('/review/campaigns_influencers_1767258764337.webp', 'Campaign Builder')}>
        <img src="/review/campaigns_influencers_1767258764337.webp" alt="Campaign Builder" loading="lazy" />
        <span class="video-label">Campaign Builder</span>
      </button>
      <button class="video-item" onclick={() => openLightbox('/review/automations_settings_1767259060957.webp', 'Automations & Settings')}>
        <img src="/review/automations_settings_1767259060957.webp" alt="Automations & Settings" loading="lazy" />
        <span class="video-label">Automations & Settings</span>
      </button>
      <button class="video-item" onclick={() => openLightbox('/review/public_pages_1767259155328.webp', 'Public Pages')}>
        <img src="/review/public_pages_1767259155328.webp" alt="Public Pages" loading="lazy" />
        <span class="video-label">Public Pages</span>
      </button>
      <button class="video-item" onclick={() => openLightbox('/review/verify_fixes_1767260521718.webp', 'Recent Fixes')}>
        <img src="/review/verify_fixes_1767260521718.webp" alt="Recent Fixes" loading="lazy" />
        <span class="video-label">Recent Fixes</span>
      </button>
    </div>
  </section>

  <footer class="footer">
    <div class="footer-cta">
      <h3>Ready to see it in action?</h3>
      <a href="/login" class="btn btn-primary">Start Demo →</a>
    </div>
    <div class="footer-info">
      <p>Prepared by Retailfluencer Development Team</p>
      <p>January 1, 2026</p>
    </div>
  </footer>
</div>

<!-- Lightbox Overlay -->
{#if lightboxOpen}
  <div 
    class="lightbox-overlay" 
    onclick={closeLightbox}
    onkeydown={(e) => e.key === 'Escape' && closeLightbox()}
    role="button"
    tabindex="0"
    transition:fade={{ duration: 200 }}
  >
    <button class="lightbox-close" onclick={closeLightbox}>✕</button>
    <div class="lightbox-content" onclick={(e) => e.stopPropagation()}>
      <img src={lightboxSrc} alt={lightboxAlt} />
      <p class="lightbox-caption">{lightboxAlt}</p>
    </div>
  </div>
{/if}

<style>
  .page {
    min-height: 100vh;
    background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%);
    color: #fff;
    padding: 2rem;
  }

  .hero {
    text-align: center;
    padding: 2.5rem 2rem 3rem;
    max-width: 900px;
    margin: 0 auto 2rem;
    position: relative;
  }

  .hero-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    height: 40px;
    background: radial-gradient(ellipse, rgba(124, 58, 237, 0.15) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  .hero > * {
    position: relative;
    z-index: 1;
  }

  .badge {
    display: inline-block;
    background: rgba(124, 58, 237, 0.2);
    color: #a855f7;
    padding: 0.5rem 1rem;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 1.5rem;
  }

  h1 {
    font-size: 3.5rem;
    font-weight: 800;
    margin: 0 0 1.25rem;
    line-height: 1.1;
  }

  .title-line {
    display: block;
    background: linear-gradient(135deg, #fff 0%, #e0e0e0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .title-accent {
    display: block;
    background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-size: 2.5rem;
    margin-top: 0.25rem;
  }

  .tagline {
    font-size: 1.375rem;
    color: #fff;
    font-weight: 500;
    margin: 0 0 1rem;
    line-height: 1.5;
  }

  .subtitle {
    font-size: 1rem;
    color: #9ca3af;
    line-height: 1.7;
    margin: 0 0 2.5rem;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
  }

  .highlight {
    color: #a855f7;
    font-weight: 600;
  }

  .hero-stats {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }

  .hero-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem 1.5rem;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 1rem;
    min-width: 120px;
  }

  .hero-stat.featured {
    background: rgba(124, 58, 237, 0.15);
    border-color: rgba(124, 58, 237, 0.3);
    transform: scale(1.1);
  }

  .hero-stat .stat-number {
    font-size: 1.75rem;
    font-weight: 800;
    color: #fff;
  }

  .hero-stat.featured .stat-number {
    color: #a855f7;
  }

  .hero-stat .stat-label {
    font-size: 0.75rem;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-top: 0.25rem;
  }

  .hero-stat .stat-desc {
    font-size: 0.6875rem;
    color: #6b7280;
    margin-top: 0.25rem;
  }

  .hero-divider {
    color: #4b5563;
    font-size: 1.25rem;
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(16, 185, 129, 0.15);
    border: 1px solid rgba(16, 185, 129, 0.3);
    color: #34d399;
    padding: 0.75rem 1.5rem;
    border-radius: 0.75rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
  }

  .hero-cta {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .btn-lg {
    padding: 1rem 2.5rem;
    font-size: 1rem;
  }

  .btn-ghost {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #9ca3af;
    padding: 1rem 2rem;
    border-radius: 0.75rem;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.2s;
  }

  .btn-ghost:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #fff;
    border-color: rgba(255, 255, 255, 0.3);
  }

  .section {
    max-width: 1000px;
    margin: 0 auto 4rem;
  }

  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 1.5rem;
    text-align: center;
  }

  .overview-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }

  .overview-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 1rem;
    padding: 1.5rem;
    text-align: center;
    transition: all 0.3s;
  }

  .overview-card:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-4px);
  }

  .card-icon {
    font-size: 2.5rem;
    display: block;
    margin-bottom: 1rem;
  }

  .overview-card h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #fff;
    margin: 0 0 0.5rem;
  }

  .overview-card p {
    font-size: 0.875rem;
    color: #9ca3af;
    margin: 0;
    line-height: 1.5;
  }

  .feature-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  .feature-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 0.75rem;
    padding: 1rem;
  }

  .feature-icon {
    font-size: 1.25rem;
  }

  .feature-content {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .feature-label {
    font-weight: 500;
    color: #fff;
  }

  .feature-notes {
    font-size: 0.8125rem;
    color: #6b7280;
  }

  .enhancements-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }

  .enhancement-card {
    background: rgba(16, 185, 129, 0.1);
    border: 1px solid rgba(16, 185, 129, 0.2);
    border-radius: 1rem;
    padding: 1.25rem;
  }

  .enhancement-card h3 {
    font-size: 1rem;
    font-weight: 600;
    color: #34d399;
    margin: 0 0 0.75rem;
  }

  .enhancement-card ul {
    margin: 0;
    padding-left: 1.25rem;
  }

  .enhancement-card li {
    font-size: 0.875rem;
    color: #9ca3af;
    margin-bottom: 0.375rem;
  }

  .demo-flow {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .flow-step {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 0.75rem;
    padding: 1rem 1.25rem;
    transition: all 0.2s;
  }

  .flow-step:hover {
    background: rgba(255, 255, 255, 0.06);
  }

  .step-number {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    font-weight: 700;
    flex-shrink: 0;
  }

  .step-content {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .step-title {
    font-weight: 600;
    color: #fff;
  }

  .step-desc {
    font-size: 0.8125rem;
    color: #6b7280;
  }

  .cta-section {
    text-align: center;
    background: rgba(124, 58, 237, 0.1);
    border: 1px solid rgba(124, 58, 237, 0.2);
    border-radius: 1.5rem;
    padding: 3rem 2rem;
  }

  .cta-section p {
    color: #9ca3af;
    margin: 0 0 1.5rem;
  }

  .cta-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .btn {
    padding: 0.875rem 2rem;
    border-radius: 0.75rem;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s;
  }

  .btn-primary {
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    color: #fff;
  }

  .btn-primary:hover {
    filter: brightness(1.1);
    transform: translateY(-2px);
  }

  .btn-secondary {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: #fff;
  }

  .btn-secondary:hover {
    background: rgba(255, 255, 255, 0.12);
  }

  .credentials {
    color: #6b7280;
    font-size: 0.875rem;
  }

  .credentials code {
    background: rgba(255, 255, 255, 0.1);
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
    font-family: monospace;
    color: #a855f7;
  }

  .footer {
    text-align: center;
    padding: 3rem 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    margin-top: 3rem;
  }

  .footer-cta {
    margin-bottom: 2rem;
  }

  .footer-cta h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #fff;
    margin: 0 0 1rem;
  }

  .footer-info p {
    color: #6b7280;
    margin: 0.25rem 0;
    font-size: 0.875rem;
  }

  .demo-hint {
    color: #6b7280;
    font-size: 0.875rem;
    margin-top: 1rem;
  }

  @media (max-width: 768px) {
    h1 { font-size: 2rem; }
    .overview-grid { grid-template-columns: 1fr; }
    .feature-grid { grid-template-columns: 1fr; }
    .enhancements-grid { grid-template-columns: 1fr; }
    .gallery-grid { grid-template-columns: repeat(2, 1fr); }
    .video-grid { grid-template-columns: 1fr; }
  }

  /* Screenshots Gallery */
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  .gallery-item {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 0.75rem;
    overflow: hidden;
    transition: all 0.3s;
    text-decoration: none;
    display: block;
  }

  .gallery-item:hover {
    transform: translateY(-4px);
    border-color: rgba(124, 58, 237, 0.4);
    box-shadow: 0 8px 32px rgba(124, 58, 237, 0.15);
  }

  .gallery-item img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    display: block;
  }

  .gallery-label {
    display: block;
    padding: 0.75rem;
    font-size: 0.8125rem;
    font-weight: 500;
    color: #9ca3af;
    text-align: center;
    background: rgba(0, 0, 0, 0.2);
  }

  /* Video Walkthroughs */
  .section-desc {
    text-align: center;
    color: #6b7280;
    margin: -1rem 0 1.5rem;
    font-size: 0.9375rem;
  }

  .video-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }

  .video-item {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 0.75rem;
    overflow: hidden;
    transition: all 0.3s;
    text-decoration: none;
    display: block;
  }

  .video-item:hover {
    border-color: rgba(124, 58, 237, 0.4);
    box-shadow: 0 8px 32px rgba(124, 58, 237, 0.15);
    transform: translateY(-2px);
  }

  .video-item img {
    width: 100%;
    height: 220px;
    object-fit: cover;
    display: block;
    background: #0f0f1a;
  }

  .video-label {
    display: block;
    padding: 0.875rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #fff;
    text-align: center;
    background: rgba(0, 0, 0, 0.3);
  }

  /* Lightbox Styles */
  .lightbox-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    cursor: pointer;
    padding: 2rem;
  }

  .lightbox-close {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #fff;
    font-size: 1.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  .lightbox-close:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }

  .lightbox-content {
    max-width: 90vw;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: default;
  }

  .lightbox-content img {
    max-width: 100%;
    max-height: calc(85vh - 3rem);
    object-fit: contain;
    border-radius: 0.75rem;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  }

  .lightbox-caption {
    margin-top: 1rem;
    font-size: 1rem;
    color: #9ca3af;
    text-align: center;
  }

  /* Button reset for gallery/video items */
  button.gallery-item,
  button.video-item {
    border: none;
    font: inherit;
    cursor: pointer;
    padding: 0;
    text-align: left;
  }
</style>
