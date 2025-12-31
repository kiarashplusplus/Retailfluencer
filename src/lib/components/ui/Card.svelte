<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    variant?: 'default' | 'outlined' | 'elevated' | 'glass';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hover?: boolean;
    class?: string;
    children: Snippet;
  }

  let { 
    variant = 'default', 
    padding = 'md', 
    hover = false,
    class: className = '',
    children 
  }: Props = $props();
</script>

<div 
  class="card card--{variant} card--p-{padding} {className}"
  class:card--hover={hover}
>
  {@render children()}
</div>

<style>
  .card {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01));
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 1rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .card--outlined {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .card--elevated {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
    box-shadow: 
      0 4px 6px -1px rgba(0, 0, 0, 0.3),
      0 2px 4px -2px rgba(0, 0, 0, 0.2);
  }

  .card--glass {
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .card--hover:hover {
    border-color: rgba(124, 58, 237, 0.4);
    box-shadow: 0 0 40px rgba(124, 58, 237, 0.1);
    transform: translateY(-2px);
  }

  .card--p-none { padding: 0; }
  .card--p-sm { padding: 0.75rem; }
  .card--p-md { padding: 1.5rem; }
  .card--p-lg { padding: 2rem; }
</style>
