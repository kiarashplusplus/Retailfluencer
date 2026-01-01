<script lang="ts">
  import { fly, fade } from 'svelte/transition';

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

  const demoFlow = [
    { step: 1, title: 'Login', desc: 'Show demo credentials, trust metrics' },
    { step: 2, title: 'Dashboard', desc: 'Highlight key performance indicators' },
    { step: 3, title: 'Products', desc: 'CPG catalog with margin tracking' },
    { step: 4, title: 'Campaigns', desc: 'Walk through 5-step builder' },
    { step: 5, title: 'Analytics', desc: 'Revenue by Product and Snowball Growth' },
    { step: 6, title: 'Coupon Page', desc: 'Show public /c/[gs1] with QR' },
    { step: 7, title: 'Automations', desc: 'Demonstrate "Snowball" workflow' },
    { step: 8, title: 'Affiliates', desc: 'Show converted customers' },
    { step: 9, title: 'About', desc: 'Close with investor pitch' },
  ];

  const enhancements = [
    { category: 'Bug Fixes', items: ['Fixed "Invalid Date" bug - Added createdAt to all customers'] },
    { category: 'Analytics', items: ['Revenue by Product chart', 'Snowball Growth funnel visualization'] },
    { category: 'Security', items: ['Strong demo password (Rf@2026Demo!)'] },
  ];
</script>

<svelte:head>
  <title>Demo Review | Retailfluencer</title>
  <meta name="description" content="Retailfluencer platform demo review and stakeholder presentation" />
</svelte:head>

<div class="page">
  <header class="hero" in:fade={{ duration: 500 }}>
    <div class="badge">For Stakeholder Review — January 2026</div>
    <h1>Retailfluencer Demo Review</h1>
    <p class="subtitle">
      SaaS platform enabling <span class="highlight">influencer-to-retail sales attribution</span> 
      using 8112 universal digital coupons
    </p>
    <div class="status-badge ready">
      <span class="status-icon">✅</span>
      Demo Status: Ready for Presentation
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

  <section class="section" in:fly={{ y: 30, delay: 400, duration: 400 }}>
    <h2>Completed Enhancements</h2>
    <div class="enhancements-grid">
      {#each enhancements as category}
        <div class="enhancement-card">
          <h3>✅ {category.category}</h3>
          <ul>
            {#each category.items as item}
              <li>{item}</li>
            {/each}
          </ul>
        </div>
      {/each}
    </div>
  </section>

  <section class="section" in:fly={{ y: 30, delay: 500, duration: 400 }}>
    <h2>Recommended Demo Flow</h2>
    <div class="demo-flow">
      {#each demoFlow as step, i}
        <div 
          class="flow-step"
          in:fly={{ y: 20, delay: 550 + i * 50, duration: 300 }}
        >
          <div class="step-number">{step.step}</div>
          <div class="step-content">
            <span class="step-title">{step.title}</span>
            <span class="step-desc">{step.desc}</span>
          </div>
        </div>
      {/each}
    </div>
  </section>

  <section class="section cta-section" in:fly={{ y: 30, delay: 600, duration: 400 }}>
    <h2>Try the Demo</h2>
    <p>Experience the full platform with demo credentials</p>
    <div class="cta-buttons">
      <a href="/login" class="btn btn-primary">Login to Dashboard</a>
      <a href="/about" class="btn btn-secondary">Product Story</a>
    </div>
    <div class="credentials">
      <code>demo@retailfluencer.com</code> / <code>Rf@2026Demo!</code>
    </div>
  </section>

  <section class="section" in:fly={{ y: 30, delay: 700, duration: 400 }}>
    <h2>📸 Screenshots Gallery</h2>
    <div class="gallery-grid">
      <div class="gallery-item">
        <img src="/review/login_page_professional_1767259382822.png" alt="Login Page" loading="lazy" />
        <span class="gallery-label">Login Page</span>
      </div>
      <div class="gallery-item">
        <img src="/review/campaigns_page_1767258786125.png" alt="Campaigns Dashboard" loading="lazy" />
        <span class="gallery-label">Campaigns Dashboard</span>
      </div>
      <div class="gallery-item">
        <img src="/review/campaign_builder_step1_1767258802096.png" alt="Campaign Builder" loading="lazy" />
        <span class="gallery-label">Campaign Builder</span>
      </div>
      <div class="gallery-item">
        <img src="/review/automations_page_1767259075285.png" alt="Automations" loading="lazy" />
        <span class="gallery-label">Automations</span>
      </div>
      <div class="gallery-item">
        <img src="/review/analytics_new_charts_1767260597543.png" alt="Analytics Charts" loading="lazy" />
        <span class="gallery-label">Analytics Charts</span>
      </div>
      <div class="gallery-item">
        <img src="/review/customers_page_fixed_dates_1767260565715.png" alt="Customers" loading="lazy" />
        <span class="gallery-label">Customers</span>
      </div>
      <div class="gallery-item">
        <img src="/review/coupon_redemption_page_final_1767259190657.png" alt="Coupon Page" loading="lazy" />
        <span class="gallery-label">Coupon Page</span>
      </div>
      <div class="gallery-item">
        <img src="/review/affiliate_referral_page_1767259223147.png" alt="Affiliate Landing" loading="lazy" />
        <span class="gallery-label">Affiliate Landing</span>
      </div>
      <div class="gallery-item">
        <img src="/review/about_page_product_story_1767259297675.png" alt="About Page" loading="lazy" />
        <span class="gallery-label">About Page</span>
      </div>
    </div>
  </section>

  <section class="section" in:fly={{ y: 30, delay: 800, duration: 400 }}>
    <h2>🎬 Video Walkthroughs</h2>
    <p class="section-desc">Recorded demos of key platform flows</p>
    <div class="video-grid">
      <div class="video-item">
        <video src="/review/dashboard_overview_1767258607496.webp" autoplay loop muted playsinline></video>
        <span class="video-label">Dashboard Overview</span>
      </div>
      <div class="video-item">
        <video src="/review/products_retailers_1767258677303.webp" autoplay loop muted playsinline></video>
        <span class="video-label">Products & Retailers</span>
      </div>
      <div class="video-item">
        <video src="/review/campaigns_influencers_1767258764337.webp" autoplay loop muted playsinline></video>
        <span class="video-label">Campaign Builder</span>
      </div>
      <div class="video-item">
        <video src="/review/automations_settings_1767259060957.webp" autoplay loop muted playsinline></video>
        <span class="video-label">Automations & Settings</span>
      </div>
      <div class="video-item">
        <video src="/review/public_pages_1767259155328.webp" autoplay loop muted playsinline></video>
        <span class="video-label">Public Pages</span>
      </div>
      <div class="video-item">
        <video src="/review/verify_fixes_1767260521718.webp" autoplay loop muted playsinline></video>
        <span class="video-label">Recent Fixes</span>
      </div>
    </div>
  </section>

  <footer class="footer">
    <p>Prepared by Retailfluencer Development Team</p>
    <p>January 1, 2026</p>
  </footer>
</div>

<style>
  .page {
    min-height: 100vh;
    background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%);
    color: #fff;
    padding: 2rem;
  }

  .hero {
    text-align: center;
    padding: 4rem 2rem;
    max-width: 800px;
    margin: 0 auto 3rem;
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
    font-size: 3rem;
    font-weight: 800;
    background: linear-gradient(135deg, #fff, #a855f7);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 1rem;
  }

  .subtitle {
    font-size: 1.25rem;
    color: #9ca3af;
    line-height: 1.6;
    margin: 0 0 2rem;
  }

  .highlight {
    color: #a855f7;
    font-weight: 600;
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
    padding: 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    margin-top: 2rem;
  }

  .footer p {
    color: #6b7280;
    margin: 0.25rem 0;
    font-size: 0.875rem;
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
  }

  .video-item:hover {
    border-color: rgba(124, 58, 237, 0.4);
    box-shadow: 0 8px 32px rgba(124, 58, 237, 0.15);
  }

  .video-item video, .video-item img {
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
</style>
