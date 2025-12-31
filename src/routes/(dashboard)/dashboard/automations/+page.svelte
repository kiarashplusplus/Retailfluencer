<script lang="ts">
  import { onMount } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import { Card, Button, Input, Modal, Badge, EmptyState } from '$lib/components/ui';
  import { user } from '$lib/stores/auth';

  interface AutomationStep {
    id: string;
    stepOrder: number;
    actionType: string;
    actionConfig: string;
    delaySeconds: number;
  }

  interface Automation {
    id: string;
    name: string;
    triggerType: string;
    isActive: boolean;
    createdAt: string;
    steps: AutomationStep[];
  }

  let automations = $state<Automation[]>([]);
  let isLoading = $state(true);
  let showModal = $state(false);
  let isSubmitting = $state(false);
  let submitError = $state('');

  let formData = $state({
    name: '',
    triggerType: 'customer_created' as 'customer_created' | 'coupon_redeemed',
    steps: [
      { actionType: 'send_email', actionConfig: { template: 'welcome' }, delaySeconds: 0 }
    ]
  });

  onMount(async () => {
    await fetchAutomations();
  });

  async function fetchAutomations() {
    try {
      const brandId = $user?.brandId;
      const res = await fetch(`/api/automations?brandId=${brandId}`);
      if (res.ok) {
        automations = await res.json();
      }
    } catch (error) {
      console.error('Failed to fetch automations:', error);
    } finally {
      isLoading = false;
    }
  }

  async function handleSubmit() {
    // Validate name
    if (!formData.name.trim()) {
      submitError = 'Please enter an automation name';
      return;
    }

    isSubmitting = true;
    submitError = '';
    
    try {
      const res = await fetch('/api/automations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandId: $user?.brandId,
          name: formData.name.trim(),
          triggerType: formData.triggerType,
          isActive: true,
          steps: formData.steps.map((step, i) => ({
            stepOrder: i + 1,
            ...step
          }))
        })
      });

      if (res.ok) {
        const newAutomation = await res.json();
        automations = [newAutomation, ...automations];
        showModal = false;
        resetForm();
      } else {
        const errorData = await res.json().catch(() => ({}));
        submitError = errorData.message || 'Failed to create automation';
      }
    } catch (error) {
      console.error('Failed to create automation:', error);
      submitError = 'Network error. Please try again.';
    } finally {
      isSubmitting = false;
    }
  }

  async function toggleStatus(automation: Automation) {
    try {
      const res = await fetch('/api/automations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: automation.id,
          isActive: !automation.isActive
        })
      });

      if (res.ok) {
        automations = automations.map(a => 
          a.id === automation.id ? { ...a, isActive: !a.isActive } : a
        );
      }
    } catch (error) {
      console.error('Failed to toggle automation:', error);
    }
  }

  function resetForm() {
    formData = {
      name: '',
      triggerType: 'customer_created',
      steps: [{ actionType: 'send_email', actionConfig: { template: 'welcome' }, delaySeconds: 0 }]
    };
    submitError = '';
  }

  function addStep() {
    formData.steps = [...formData.steps, { actionType: 'wait', actionConfig: { seconds: 60 }, delaySeconds: 60 }];
  }

  function removeStep(index: number) {
    formData.steps = formData.steps.filter((_, i) => i !== index);
  }

  function getTriggerLabel(type: string): string {
    switch (type) {
      case 'customer_created': return 'New Customer';
      case 'coupon_redeemed': return 'Coupon Redeemed';
      default: return type;
    }
  }

  function getActionLabel(type: string): string {
    switch (type) {
      case 'send_email': return 'Send Email';
      case 'send_sms': return 'Send SMS';
      case 'create_affiliate': return 'Create Affiliate';
      case 'wait': return 'Wait';
      default: return type;
    }
  }

  function getActionIcon(type: string): string {
    switch (type) {
      case 'send_email': return '✉';
      case 'send_sms': return '💬';
      case 'create_affiliate': return '🤝';
      case 'wait': return '⏱';
      default: return '•';
    }
  }

  const actionTypes = [
    { value: 'send_email', label: 'Send Email' },
    { value: 'send_sms', label: 'Send SMS' },
    { value: 'create_affiliate', label: 'Create Affiliate' },
    { value: 'wait', label: 'Wait / Delay' },
  ];
</script>

<div class="page">
  <header class="page-header">
    <div>
      <h1>Automations</h1>
      <p>Set up automated workflows triggered by customer actions</p>
    </div>
    <Button icon="+" onclick={() => showModal = true}>Create Automation</Button>
  </header>

  <div class="info-banner">
    <span class="icon">⚡</span>
    <div>
      <strong>Automation Triggers</strong>
      <p>Run workflows when customers are created or coupons are redeemed</p>
    </div>
  </div>

  {#if isLoading}
    <div class="list">
      {#each Array(3) as _, i}
        <Card>
          <div class="skeleton-row" in:fade={{ delay: i * 50 }}>
            <div class="skeleton skeleton-icon"></div>
            <div class="skeleton-content">
              <div class="skeleton skeleton-title"></div>
              <div class="skeleton skeleton-text"></div>
            </div>
          </div>
        </Card>
      {/each}
    </div>
  {:else if automations.length === 0}
    <Card>
      <EmptyState
        icon="⚡"
        title="No automations yet"
        description="Create your first automation to start converting customers into affiliates"
        actionLabel="Create Automation"
        onaction={() => showModal = true}
      />
    </Card>
  {:else}
    <div class="list">
      {#each automations as automation, i}
        <div in:fly={{ x: -20, delay: i * 50, duration: 300 }}>
          <Card hover>
            <div class="automation-row">
              <div class="automation-info">
                <div class="automation-header">
                  <h3>{automation.name}</h3>
                  <button 
                    class="toggle-switch" 
                    class:active={automation.isActive}
                    onclick={() => toggleStatus(automation)}
                  >
                    <span class="toggle-knob"></span>
                  </button>
                </div>
                
                <div class="trigger-badge">
                  <Badge variant={automation.triggerType === 'customer_created' ? 'success' : 'purple'}>
                    {getTriggerLabel(automation.triggerType)}
                  </Badge>
                  {#if !automation.isActive}
                    <Badge variant="default">Paused</Badge>
                  {/if}
                </div>

                <div class="steps-preview">
                  {#each automation.steps as step, i}
                    <div class="step-chip">
                      <span class="step-icon">{getActionIcon(step.actionType)}</span>
                      <span class="step-name">{getActionLabel(step.actionType)}</span>
                    </div>
                    {#if i < automation.steps.length - 1}
                      <span class="step-arrow">→</span>
                    {/if}
                  {/each}
                </div>
              </div>

              <div class="automation-actions">
                <button class="action-btn">Edit</button>
              </div>
            </div>
          </Card>
        </div>
      {/each}
    </div>
  {/if}
</div>

<Modal bind:open={showModal} title="Create Automation" size="md">
  <form class="form" onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
    {#if submitError}
      <div class="error-banner">{submitError}</div>
    {/if}
    
    <Input 
      label="Automation Name" 
      placeholder="e.g. New Customer Welcome Flow"
      bind:value={formData.name}
      error={submitError && !formData.name.trim() ? 'Required' : ''}
      required
    />

    <div class="form-group">
      <label class="form-label">Trigger</label>
      <div class="trigger-options">
        <button 
          type="button" 
          class="trigger-option" 
          class:selected={formData.triggerType === 'customer_created'}
          onclick={() => formData.triggerType = 'customer_created'}
        >
          <span class="trigger-icon">👤</span>
          <span class="trigger-name">New Customer</span>
          <span class="trigger-desc">When email is captured</span>
        </button>
        <button 
          type="button" 
          class="trigger-option" 
          class:selected={formData.triggerType === 'coupon_redeemed'}
          onclick={() => formData.triggerType = 'coupon_redeemed'}
        >
          <span class="trigger-icon">🎫</span>
          <span class="trigger-name">Coupon Redeemed</span>
          <span class="trigger-desc">When coupon is used at POS</span>
        </button>
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">Steps</label>
      <div class="steps-builder">
        {#each formData.steps as step, i}
          <div class="step-row">
            <span class="step-number">{i + 1}</span>
            <select 
              class="step-select"
              bind:value={step.actionType}
            >
              {#each actionTypes as action}
                <option value={action.value}>{action.label}</option>
              {/each}
            </select>
            {#if formData.steps.length > 1}
              <button type="button" class="remove-btn" onclick={() => removeStep(i)}>×</button>
            {/if}
          </div>
        {/each}
        <button type="button" class="add-step-btn" onclick={addStep}>
          + Add Step
        </button>
      </div>
    </div>
  </form>

  {#snippet footer()}
    <Button variant="secondary" onclick={() => showModal = false}>Cancel</Button>
    <Button loading={isSubmitting} onclick={handleSubmit}>Create Automation</Button>
  {/snippet}
</Modal>

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

  .info-banner {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem 1.25rem;
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05));
    border: 1px solid rgba(245, 158, 11, 0.2);
    border-radius: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .info-banner .icon {
    font-size: 1.5rem;
  }

  .info-banner strong {
    color: #fbbf24;
    font-size: 0.875rem;
  }

  .info-banner p {
    color: #9ca3af;
    font-size: 0.8125rem;
    margin: 0.25rem 0 0;
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .automation-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
  }

  .automation-info {
    flex: 1;
  }

  .automation-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.5rem;
  }

  .automation-header h3 {
    font-size: 1rem;
    font-weight: 600;
    color: #fff;
    margin: 0;
  }

  .toggle-switch {
    width: 44px;
    height: 24px;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 12px;
    cursor: pointer;
    position: relative;
    transition: all 0.2s;
  }

  .toggle-switch.active {
    background: linear-gradient(135deg, #10b981, #34d399);
  }

  .toggle-knob {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    background: #fff;
    border-radius: 50%;
    transition: transform 0.2s;
  }

  .toggle-switch.active .toggle-knob {
    transform: translateX(20px);
  }

  .trigger-badge {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .steps-preview {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .step-chip {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.625rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 0.375rem;
    font-size: 0.75rem;
    color: #9ca3af;
  }

  .step-icon {
    font-size: 0.75rem;
  }

  .step-arrow {
    color: #4b5563;
    font-size: 0.75rem;
  }

  .action-btn {
    padding: 0.5rem 1rem;
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

  /* Form styles */
  .form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .form-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #e5e7eb;
  }

  .trigger-options {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }

  .trigger-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1.25rem;
    background: rgba(255, 255, 255, 0.03);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.75rem;
    cursor: pointer;
    transition: all 0.2s;
    text-align: center;
  }

  .trigger-option:hover {
    border-color: rgba(255, 255, 255, 0.2);
  }

  .trigger-option.selected {
    border-color: #7c3aed;
    background: rgba(124, 58, 237, 0.1);
  }

  .trigger-icon {
    font-size: 1.5rem;
  }

  .trigger-name {
    font-size: 0.875rem;
    font-weight: 600;
    color: #fff;
  }

  .trigger-desc {
    font-size: 0.75rem;
    color: #6b7280;
  }

  .steps-builder {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .step-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .step-number {
    width: 24px;
    height: 24px;
    background: rgba(124, 58, 237, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 600;
    color: #a855f7;
  }

  .step-select {
    flex: 1;
    padding: 0.625rem 0.875rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.5rem;
    color: #fff;
    font-size: 0.875rem;
  }

  .remove-btn {
    width: 28px;
    height: 28px;
    background: rgba(239, 68, 68, 0.1);
    border: none;
    border-radius: 0.375rem;
    color: #f87171;
    cursor: pointer;
    transition: all 0.2s;
  }

  .remove-btn:hover {
    background: rgba(239, 68, 68, 0.2);
  }

  .add-step-btn {
    padding: 0.625rem;
    background: transparent;
    border: 1px dashed rgba(255, 255, 255, 0.2);
    border-radius: 0.5rem;
    color: #6b7280;
    font-size: 0.8125rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .add-step-btn:hover {
    border-color: #7c3aed;
    color: #a855f7;
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

  .skeleton-icon { width: 40px; height: 40px; border-radius: 10px; }
  .skeleton-content { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
  .skeleton-title { height: 18px; width: 40%; border-radius: 0.5rem; }
  .skeleton-text { height: 12px; width: 60%; border-radius: 0.5rem; }

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .error-banner {
    padding: 0.75rem 1rem;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 0.5rem;
    color: #f87171;
    font-size: 0.875rem;
  }
</style>
