<script lang="ts">
  import { Button } from '$lib/components/ui';
</script>

<svelte:head>
  <title>About | Retailfluencer</title>
</svelte:head>

<div class="about-page">
  <div class="hero">
    <div class="content max-w">
      <div class="logo">
        <span class="logo-icon">◈</span>
        <span class="logo-text">Retailfluencer</span>
      </div>
      
      <h1>The Missing Link Between <br/> <span class="highlight">Influencers & Retail</span></h1>
      <p class="subtitle">
        The first platform to attribute social media views to brick-and-mortar sales using 8112 digital coupons.
      </p>

      <div class="cta-row">
        <Button size="lg" href="/login">Get Started</Button>
      </div>
    </div>
  </div>

  <div class="features-grid max-w">
    <div class="feature-card">
      <div class="icon">🎯</div>
      <h3>True Attribution</h3>
      <p>Finally proving ROI for influencers driving traffic to Target, Walmart, and CVS.</p>
    </div>
    <div class="feature-card">
      <div class="icon">❄️</div>
      <h3>Snowball Effect</h3>
      <p>Automatically turn happy customers into new affiliates after they redeem a coupon.</p>
    </div>
    <div class="feature-card">
      <div class="icon">🎫</div>
      <h3>8112 Coupons</h3>
      <p>Using the new GS1 standard for single-use, secure, and trackable digital offers.</p>
    </div>
  </div>

  <div class="section max-w">
    <div class="diagram">
      <div class="step">Influencer Shares</div>
      <div class="arrow">↓</div>
      <div class="step">Customer Redeems</div>
      <div class="arrow">↓</div>
      <div class="step">Sale Attributed</div>
      <div class="arrow">↓</div>
      <div class="step">Automated Growth</div>
    </div>
    
    <div class="text-block">
      <h2>Why Retailfluencer?</h2>
      <p>
        For years, CPG brands have relied on ecommerce for data but generic retail marketing for volume. 
        Retailfluencer bridges this gap. We empower brands to run performance-based influencer campaigns 
        driving traffic directly to physical aisles, with the same granular tracking as a Shopify store.
      </p>
    </div>
  </div>

  <footer class="footer">
    <a href="/login">Login</a>
  </footer>
</div>

<style>
  .about-page {
    min-height: 100vh;
    background: #0a0a0f;
    color: #fff;
    padding-bottom: 4rem;
  }

  .max-w {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 1.5rem;
  }

  .hero {
    padding: 6rem 0 4rem;
    text-align: center;
    background: radial-gradient(circle at 50% 0%, rgba(124, 58, 237, 0.15) 0%, transparent 60%);
  }

  .logo {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 2rem;
  }

  .logo-icon {
    font-size: 2rem;
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .logo-text {
    font-size: 1.5rem;
    font-weight: 700;
  }

  h1 {
    font-size: 3.5rem;
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 1.5rem;
    letter-spacing: -0.02em;
  }

  .highlight {
    background: linear-gradient(135deg, #7c3aed, #3b82f6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .subtitle {
    font-size: 1.25rem;
    color: #9ca3af;
    max-width: 600px;
    margin: 0 auto 2.5rem;
    line-height: 1.6;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-bottom: 4rem;
  }

  .feature-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
    padding: 2rem;
    border-radius: 1rem;
    transition: transform 0.2s;
  }

  .feature-card:hover {
    transform: translateY(-4px);
    background: rgba(255, 255, 255, 0.05);
  }

  .feature-card .icon {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .feature-card h3 {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
    color: #fff;
  }

  .feature-card p {
    color: #9ca3af;
    line-height: 1.5;
  }

  .section {
    display: flex;
    gap: 4rem;
    align-items: center;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 1.5rem;
    padding: 3rem;
  }

  .diagram {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: #6b7280;
    min-width: 200px;
  }

  .step {
    padding: 0.75rem 1.25rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 0.5rem;
    width: 100%;
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .text-block {
    flex: 1;
  }

  .text-block h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .text-block p {
    color: #9ca3af;
    line-height: 1.7;
    font-size: 1.125rem;
  }

  .footer {
    margin-top: 4rem;
    text-align: center;
    padding-top: 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    color: #4b5563;
  }

  .footer a {
    color: #6b7280;
    margin-left: 1rem;
    text-decoration: none;
    transition: color 0.2s;
  }

  .footer a:hover {
    color: #fff;
  }

  @media (max-width: 768px) {
    .section {
      flex-direction: column;
      text-align: center;
      gap: 2rem;
    }
    
    h1 { font-size: 2.5rem; }
  }
</style>
