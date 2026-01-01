<script lang="ts">
  import { fly, fade } from 'svelte/transition';
  import { Button, Input, Badge } from '$lib/components/ui';
  import { mockProducts, mockRetailers, mockInfluencers } from '$lib/mock-data';

  interface Props {
    onclose: () => void;
    oncreate: (campaign: any) => void;
  }

  let { onclose, oncreate }: Props = $props();

  let currentStep = $state(1);
  const totalSteps = 5;

  // Form data
  let formData = $state({
    name: '',
    goal: 'sales',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    productId: '',
    retailerId: '',
    discountType: 'percent' as 'percent' | 'fixed' | 'bogo',
    discountValue: 20,
    circulation: 1000,
    selectedInfluencers: [] as string[]
  });

  const goals = [
    { id: 'awareness', label: 'Brand Awareness', icon: '📢', desc: 'Increase visibility' },
    { id: 'sales', label: 'Drive Sales', icon: '💰', desc: 'Boost conversions' },
    { id: 'launch', label: 'Product Launch', icon: '🚀', desc: 'New product intro' }
  ];

  function canProceed(): boolean {
    if (currentStep === 1) return formData.name.length >= 3;
    if (currentStep === 2) return !!formData.productId && !!formData.retailerId;
    if (currentStep === 3) return formData.discountValue > 0 || formData.discountType === 'bogo';
    if (currentStep === 4) return formData.selectedInfluencers.length > 0;
    return true;
  }

  function nextStep() {
    if (currentStep < totalSteps && canProceed()) currentStep++;
  }

  function prevStep() {
    if (currentStep > 1) currentStep--;
  }

  function toggleInfluencer(id: string) {
    if (formData.selectedInfluencers.includes(id)) {
      formData.selectedInfluencers = formData.selectedInfluencers.filter(i => i !== id);
    } else {
      formData.selectedInfluencers = [...formData.selectedInfluencers, id];
    }
  }

  function handleLaunch() {
    const product = mockProducts.find(p => p.id === formData.productId);
    const retailer = mockRetailers.find(r => r.id === formData.retailerId);
    oncreate({
      id: `camp-${Date.now()}`,
      name: formData.name,
      status: 'active',
      discountType: formData.discountType,
      discountValue: formData.discountValue,
      campaignStart: formData.startDate,
      campaignEnd: formData.endDate,
      totalCirculation: formData.circulation,
      product: { name: product?.name },
      retailer: { name: retailer?.name },
      _count: { couponAssignments: formData.selectedInfluencers.length, redemptions: 0 }
    });
  }

  let selectedProduct = $derived(mockProducts.find(p => p.id === formData.productId));
  let selectedRetailer = $derived(mockRetailers.find(r => r.id === formData.retailerId));
</script>

<div class="wizard">
  <!-- Progress Bar -->
  <div class="progress-bar">
    {#each Array(totalSteps) as _, i}
      <div class="step-dot" class:active={i + 1 <= currentStep} class:current={i + 1 === currentStep}>
        {i + 1}
      </div>
      {#if i < totalSteps - 1}
        <div class="step-line" class:active={i + 1 < currentStep}></div>
      {/if}
    {/each}
  </div>

  <!-- Step Content -->
  <div class="step-content">
    {#if currentStep === 1}
      <div class="step" in:fly={{ x: 20, duration: 200 }}>
        <h3>Campaign Basics</h3>
        <p class="step-desc">Name your campaign and set the timeline</p>
        
        <div class="form-group">
          <label>Campaign Name</label>
          <input type="text" bind:value={formData.name} placeholder="e.g. Summer Hydration Promo" maxlength="50" />
          <span class="char-count">{formData.name.length}/50</span>
        </div>

        <div class="form-group">
          <label>Campaign Goal</label>
          <div class="goal-grid">
            {#each goals as goal}
              <button 
                class="goal-card" 
                class:selected={formData.goal === goal.id}
                onclick={() => formData.goal = goal.id}
              >
                <span class="goal-icon">{goal.icon}</span>
                <span class="goal-label">{goal.label}</span>
              </button>
            {/each}
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Start Date</label>
            <input type="date" bind:value={formData.startDate} />
          </div>
          <div class="form-group">
            <label>End Date</label>
            <input type="date" bind:value={formData.endDate} />
          </div>
        </div>
      </div>

    {:else if currentStep === 2}
      <div class="step" in:fly={{ x: 20, duration: 200 }}>
        <h3>Select Product & Retailer</h3>
        <p class="step-desc">Choose the product and where it will be sold</p>

        <div class="form-group">
          <label>Product</label>
          <div class="selection-grid">
            {#each mockProducts as product}
              <button 
                class="selection-card" 
                class:selected={formData.productId === product.id}
                onclick={() => formData.productId = product.id}
              >
                <div class="card-icon">◇</div>
                <div class="card-info">
                  <span class="card-name">{product.name}</span>
                  <span class="card-meta">${product.retailPrice}</span>
                </div>
              </button>
            {/each}
          </div>
        </div>

        <div class="form-group">
          <label>Retailer</label>
          <div class="selection-grid">
            {#each mockRetailers.filter(r => r._count.campaigns > 0 || r.supports8112) as retailer}
              <button 
                class="selection-card" 
                class:selected={formData.retailerId === retailer.id}
                onclick={() => formData.retailerId = retailer.id}
              >
                <div class="card-icon">◆</div>
                <div class="card-info">
                  <span class="card-name">{retailer.name}</span>
                  {#if retailer.supports8112}
                    <Badge variant="purple">8112</Badge>
                  {/if}
                </div>
              </button>
            {/each}
          </div>
        </div>
      </div>

    {:else if currentStep === 3}
      <div class="step" in:fly={{ x: 20, duration: 200 }}>
        <h3>Configure Discount</h3>
        <p class="step-desc">Set up the offer for customers</p>

        <div class="form-group">
          <label>Discount Type</label>
          <div class="toggle-group">
            <button class="toggle-btn" class:active={formData.discountType === 'percent'} onclick={() => formData.discountType = 'percent'}>% Percent</button>
            <button class="toggle-btn" class:active={formData.discountType === 'fixed'} onclick={() => formData.discountType = 'fixed'}>$ Fixed</button>
            <button class="toggle-btn" class:active={formData.discountType === 'bogo'} onclick={() => formData.discountType = 'bogo'}>BOGO</button>
          </div>
        </div>

        {#if formData.discountType !== 'bogo'}
          <div class="form-group">
            <label>{formData.discountType === 'percent' ? 'Discount Percentage' : 'Discount Amount'}</label>
            <div class="value-input">
              <span class="prefix">{formData.discountType === 'percent' ? '%' : '$'}</span>
              <input type="number" bind:value={formData.discountValue} min="1" max={formData.discountType === 'percent' ? 100 : 999} />
            </div>
          </div>
        {/if}

        <div class="form-group">
          <label>Coupon Circulation Limit</label>
          <input type="number" bind:value={formData.circulation} min="100" step="100" />
          <span class="hint">Maximum number of coupons to generate</span>
        </div>

        <div class="offer-preview">
          <span class="preview-label">Customer sees:</span>
          <span class="preview-value">
            {#if formData.discountType === 'bogo'}
              Buy One Get One Free!
            {:else if formData.discountType === 'percent'}
              {formData.discountValue}% OFF
            {:else}
              ${formData.discountValue} OFF
            {/if}
          </span>
        </div>
      </div>

    {:else if currentStep === 4}
      <div class="step" in:fly={{ x: 20, duration: 200 }}>
        <h3>Assign Influencers</h3>
        <p class="step-desc">Select influencers to promote this campaign</p>

        <div class="influencer-list">
          {#each mockInfluencers as inf}
            <button 
              class="influencer-card" 
              class:selected={formData.selectedInfluencers.includes(inf.id)}
              onclick={() => toggleInfluencer(inf.id)}
            >
              <div class="inf-avatar">★</div>
              <div class="inf-info">
                <span class="inf-name">{inf.name}</span>
                <span class="inf-handle">@{inf.instagramHandle || inf.tiktokHandle}</span>
              </div>
              <div class="inf-stats">
                <span class="inf-redemptions">{inf.totalRedemptions} sales</span>
              </div>
              <div class="inf-check">{formData.selectedInfluencers.includes(inf.id) ? '✓' : ''}</div>
            </button>
          {/each}
        </div>
        <p class="selection-count">{formData.selectedInfluencers.length} influencer(s) selected</p>
      </div>

    {:else if currentStep === 5}
      <div class="step" in:fly={{ x: 20, duration: 200 }}>
        <h3>Review & Launch</h3>
        <p class="step-desc">Confirm your campaign details</p>

        <div class="summary-card">
          <div class="summary-row">
            <span class="summary-label">Campaign</span>
            <span class="summary-value">{formData.name}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">Product</span>
            <span class="summary-value">{selectedProduct?.name || '-'}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">Retailer</span>
            <span class="summary-value">{selectedRetailer?.name || '-'}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">Discount</span>
            <span class="summary-value highlight">
              {formData.discountType === 'bogo' ? 'BOGO' : formData.discountType === 'percent' ? `${formData.discountValue}%` : `$${formData.discountValue}`} OFF
            </span>
          </div>
          <div class="summary-row">
            <span class="summary-label">Duration</span>
            <span class="summary-value">{formData.startDate} → {formData.endDate}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">Influencers</span>
            <span class="summary-value">{formData.selectedInfluencers.length} assigned</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">Circulation</span>
            <span class="summary-value">{formData.circulation.toLocaleString()} coupons</span>
          </div>
        </div>
      </div>
    {/if}
  </div>

  <!-- Navigation -->
  <div class="wizard-footer">
    <Button variant="secondary" onclick={currentStep === 1 ? onclose : prevStep}>
      {currentStep === 1 ? 'Cancel' : '← Back'}
    </Button>
    {#if currentStep < totalSteps}
      <Button onclick={nextStep} disabled={!canProceed()}>
        Next →
      </Button>
    {:else}
      <Button onclick={handleLaunch}>
        🚀 Launch Campaign
      </Button>
    {/if}
  </div>
</div>

<style>
  .wizard { display: flex; flex-direction: column; min-height: 500px; }
  
  .progress-bar { display: flex; align-items: center; justify-content: center; gap: 0; padding: 1.5rem 2rem; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .step-dot { width: 32px; height: 32px; border-radius: 50%; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 600; color: #6b7280; transition: all 0.3s; }
  .step-dot.active { background: linear-gradient(135deg, #7c3aed, #a855f7); color: #fff; }
  .step-dot.current { box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.3); }
  .step-line { width: 40px; height: 2px; background: rgba(255,255,255,0.1); }
  .step-line.active { background: #7c3aed; }

  .step-content { flex: 1; padding: 1.5rem 2rem; overflow-y: auto; }
  .step h3 { font-size: 1.25rem; font-weight: 600; color: #fff; margin: 0 0 0.25rem; }
  .step-desc { color: #6b7280; margin: 0 0 1.5rem; font-size: 0.875rem; }

  .form-group { margin-bottom: 1.25rem; }
  .form-group label { display: block; font-size: 0.8125rem; color: #9ca3af; margin-bottom: 0.5rem; }
  .form-group input[type="text"], .form-group input[type="date"], .form-group input[type="number"] { width: 100%; padding: 0.75rem 1rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.625rem; color: #fff; font-size: 0.875rem; }
  .form-group input:focus { outline: none; border-color: #7c3aed; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .char-count { font-size: 0.75rem; color: #6b7280; float: right; margin-top: 0.25rem; }
  .hint { font-size: 0.75rem; color: #6b7280; margin-top: 0.25rem; display: block; }

  .goal-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; }
  .goal-card { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; padding: 1rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 0.75rem; cursor: pointer; transition: all 0.2s; }
  .goal-card:hover { background: rgba(255,255,255,0.06); }
  .goal-card.selected { border-color: #7c3aed; background: rgba(124, 58, 237, 0.15); }
  .goal-icon { font-size: 1.5rem; }
  .goal-label { font-size: 0.75rem; color: #e5e7eb; font-weight: 500; }

  .selection-grid { display: grid; grid-template-columns: 1fr; gap: 0.625rem; }
  .selection-card { display: flex; align-items: center; gap: 0.75rem; padding: 0.875rem 1rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 0.625rem; cursor: pointer; text-align: left; transition: all 0.2s; }
  .selection-card:hover { background: rgba(255,255,255,0.06); }
  .selection-card.selected { border-color: #7c3aed; background: rgba(124, 58, 237, 0.15); }
  .card-icon { width: 36px; height: 36px; background: rgba(124, 58, 237, 0.2); border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; color: #a855f7; }
  .card-info { flex: 1; display: flex; flex-direction: column; gap: 0.125rem; }
  .card-name { font-size: 0.875rem; color: #fff; font-weight: 500; }
  .card-meta { font-size: 0.75rem; color: #6b7280; }

  .toggle-group { display: flex; gap: 0.5rem; }
  .toggle-btn { flex: 1; padding: 0.75rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 0.5rem; color: #9ca3af; font-size: 0.8125rem; cursor: pointer; transition: all 0.2s; }
  .toggle-btn.active { background: rgba(124, 58, 237, 0.2); border-color: #7c3aed; color: #fff; }

  .value-input { position: relative; }
  .value-input .prefix { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #6b7280; }
  .value-input input { padding-left: 2.5rem; }

  .offer-preview { margin-top: 1.5rem; padding: 1.25rem; background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05)); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 0.75rem; text-align: center; }
  .preview-label { font-size: 0.75rem; color: #6b7280; display: block; margin-bottom: 0.5rem; }
  .preview-value { font-size: 1.5rem; font-weight: 700; color: #10b981; }

  .influencer-list { display: flex; flex-direction: column; gap: 0.625rem; }
  .influencer-card { display: flex; align-items: center; gap: 0.75rem; padding: 0.875rem 1rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 0.625rem; cursor: pointer; transition: all 0.2s; }
  .influencer-card:hover { background: rgba(255,255,255,0.06); }
  .influencer-card.selected { border-color: #10b981; background: rgba(16, 185, 129, 0.1); }
  .inf-avatar { width: 36px; height: 36px; background: linear-gradient(135deg, #f59e0b, #d97706); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; }
  .inf-info { flex: 1; display: flex; flex-direction: column; }
  .inf-name { font-size: 0.875rem; color: #fff; font-weight: 500; }
  .inf-handle { font-size: 0.75rem; color: #6b7280; }
  .inf-stats { text-align: right; }
  .inf-redemptions { font-size: 0.75rem; color: #10b981; background: rgba(16, 185, 129, 0.1); padding: 0.25rem 0.5rem; border-radius: 9999px; }
  .inf-check { width: 24px; height: 24px; border-radius: 50%; background: rgba(16, 185, 129, 0.2); color: #10b981; display: flex; align-items: center; justify-content: center; font-size: 0.875rem; font-weight: bold; }
  .selection-count { text-align: center; font-size: 0.875rem; color: #6b7280; margin-top: 1rem; }

  .summary-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 0.75rem; overflow: hidden; }
  .summary-row { display: flex; justify-content: space-between; padding: 0.875rem 1rem; border-bottom: 1px solid rgba(255,255,255,0.04); }
  .summary-row:last-child { border-bottom: none; }
  .summary-label { font-size: 0.8125rem; color: #6b7280; }
  .summary-value { font-size: 0.875rem; color: #fff; font-weight: 500; }
  .summary-value.highlight { color: #10b981; }

  .wizard-footer { display: flex; justify-content: space-between; padding: 1rem 2rem; border-top: 1px solid rgba(255,255,255,0.06); }
</style>
