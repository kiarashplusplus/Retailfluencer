<script lang="ts">
  interface Props {
    variant?: 'default' | 'success' | 'warning' | 'error' | 'purple';
    size?: 'sm' | 'md';
    dot?: boolean;
  }

  let { variant = 'default', size = 'sm', dot = false }: Props = $props();
</script>

<span class="badge badge--{variant} badge--{size}" class:badge--dot={dot}>
  {#if dot}
    <span class="dot"></span>
  {/if}
  <slot />
</span>

<style>
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    font-weight: 500;
    border-radius: 9999px;
    white-space: nowrap;
  }

  .badge--sm {
    padding: 0.25rem 0.625rem;
    font-size: 0.75rem;
  }

  .badge--md {
    padding: 0.375rem 0.875rem;
    font-size: 0.8125rem;
  }

  /* Variants */
  .badge--default {
    background: rgba(255, 255, 255, 0.08);
    color: #9ca3af;
  }

  .badge--success {
    background: rgba(16, 185, 129, 0.15);
    color: #34d399;
  }

  .badge--warning {
    background: rgba(245, 158, 11, 0.15);
    color: #fbbf24;
  }

  .badge--error {
    background: rgba(239, 68, 68, 0.15);
    color: #f87171;
  }

  .badge--purple {
    background: rgba(124, 58, 237, 0.15);
    color: #a855f7;
  }

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
</style>
