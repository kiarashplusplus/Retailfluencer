<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';

  interface Props extends HTMLButtonAttributes {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    icon?: string;
    iconPosition?: 'left' | 'right';
    fullWidth?: boolean;
    children: Snippet;
  }

  let { 
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    disabled,
    children,
    ...restProps
  }: Props = $props();
</script>

<button
  class="btn btn--{variant} btn--{size}"
  class:btn--full={fullWidth}
  class:btn--loading={loading}
  disabled={disabled || loading}
  {...restProps}
>
  {#if loading}
    <span class="spinner"></span>
  {:else if icon && iconPosition === 'left'}
    <span class="btn-icon">{icon}</span>
  {/if}
  
  <span class="btn-text">
    {@render children()}
  </span>
  
  {#if !loading && icon && iconPosition === 'right'}
    <span class="btn-icon">{icon}</span>
  {/if}
</button>

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-weight: 600;
    border-radius: 0.75rem;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    white-space: nowrap;
    border: none;
    position: relative;
    overflow: hidden;
  }

  .btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%);
    opacity: 0;
    transition: opacity 0.2s;
  }

  .btn:hover::before {
    opacity: 1;
  }

  /* Variants */
  .btn--primary {
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    color: #fff;
  }

  .btn--primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(124, 58, 237, 0.4);
  }

  .btn--secondary {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #e5e7eb;
  }

  .btn--secondary:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
  }

  .btn--ghost {
    background: transparent;
    color: #9ca3af;
  }

  .btn--ghost:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.05);
    color: #fff;
  }

  .btn--danger {
    background: linear-gradient(135deg, #dc2626, #ef4444);
    color: #fff;
  }

  .btn--danger:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
  }

  /* Sizes */
  .btn--sm {
    padding: 0.5rem 1rem;
    font-size: 0.8125rem;
  }

  .btn--md {
    padding: 0.75rem 1.25rem;
    font-size: 0.875rem;
  }

  .btn--lg {
    padding: 1rem 1.75rem;
    font-size: 1rem;
  }

  .btn--full {
    width: 100%;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn--loading {
    pointer-events: none;
  }

  .spinner {
    width: 1em;
    height: 1em;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .btn-icon {
    font-size: 1.125em;
    line-height: 1;
  }
</style>
