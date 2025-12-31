<script lang="ts">
  import { page } from '$app/stores';
  import { Button, Card } from '$lib/components/ui';

  let affiliateCode = $page.url.searchParams.get('ref');

  // Hardcoded GS1 for demo purposes
  const DEMO_GS1 = '010000000000000021example';
</script>

<div class="promo-page">
  <div class="glass-container">
    <div class="content">
      <div class="logo">Retailfluencer</div>
      
      <h1>Exclusive Offer</h1>
      
      {#if affiliateCode}
        <div class="referral-badge">
          <span>Invited by friend ({affiliateCode})</span>
        </div>
      {/if}

      <p class="description">
        Unlock your exclusive discount on premium products. limited time offer for our special community members.
      </p>

      <div class="product-preview">
        <div class="product-image"></div>
        <div class="product-details">
          <h3>Premium Item</h3>
          <div class="price">
            <span class="original">$50.00</span>
            <span class="discounted">$35.00</span>
          </div>
        </div>
      </div>

      <div class="actions">
        <Button size="lg" href="/c/{DEMO_GS1}">Claim Coupon</Button>
      </div>

      <p class="terms">
        *Terms and conditions apply. One coupon per customer.
      </p>
    </div>
  </div>
</div>

<style>
  .promo-page {
    min-height: 100vh;
    background: #0a0a0f;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    background-image: 
      radial-gradient(circle at 10% 20%, rgba(124, 58, 237, 0.1) 0%, transparent 40%),
      radial-gradient(circle at 90% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 40%);
  }

  .glass-container {
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 1.5rem;
    padding: 3rem;
    max-width: 480px;
    width: 100%;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1.5rem;
  }

  .logo {
    font-size: 1.25rem;
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.02em;
    margin-bottom: 0.5rem;
  }

  h1 {
    font-size: 2.5rem;
    font-weight: 800;
    line-height: 1.1;
    background: linear-gradient(135deg, #fff 0%, #a5b4fc 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0;
  }

  .referral-badge {
    padding: 0.375rem 0.75rem;
    background: rgba(124, 58, 237, 0.15);
    border: 1px solid rgba(124, 58, 237, 0.3);
    border-radius: 2rem;
    color: #a855f7;
    font-size: 0.8125rem;
    font-weight: 500;
  }

  .description {
    color: #9ca3af;
    line-height: 1.6;
    margin: 0;
  }

  .product-preview {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 1rem;
    padding: 1rem;
    width: 100%;
    margin: 0.5rem 0;
  }

  .product-image {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    border-radius: 0.75rem;
  }

  .product-details {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .product-details h3 {
    font-size: 1rem;
    font-weight: 600;
    color: #fff;
    margin: 0;
  }

  .price {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .original {
    text-decoration: line-through;
    color: #6b7280;
    font-size: 0.875rem;
  }

  .discounted {
    color: #10b981;
    font-weight: 700;
  }

  .actions {
    width: 100%;
  }

  .terms {
    font-size: 0.75rem;
    color: #6b7280;
    margin: 0;
  }
</style>
