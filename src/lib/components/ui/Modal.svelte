<script lang="ts">
  import type { Snippet } from 'svelte';
  import { fade, scale } from 'svelte/transition';

  interface Props {
    open?: boolean;
    title?: string;
    size?: 'sm' | 'md' | 'lg';
    onclose?: () => void;
    children: Snippet;
    footer?: Snippet;
  }

  let {
    open = $bindable(false),
    title,
    size = 'md',
    onclose,
    children,
    footer
  }: Props = $props();

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      open = false;
      onclose?.();
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      open = false;
      onclose?.();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
  <div 
    class="modal-backdrop" 
    onclick={handleBackdropClick}
    transition:fade={{ duration: 200 }}
    role="dialog"
    aria-modal="true"
  >
    <div 
      class="modal modal--{size}" 
      transition:scale={{ duration: 200, start: 0.95 }}
    >
      {#if title}
        <header class="modal-header">
          <h2 class="modal-title">{title}</h2>
          <button class="modal-close" onclick={() => { open = false; onclose?.(); }}>
            ✕
          </button>
        </header>
      {/if}
      
      <div class="modal-body">
        {@render children()}
      </div>
      
      {#if footer}
        <footer class="modal-footer">
          {@render footer()}
        </footer>
      {/if}
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    z-index: 1000;
  }

  .modal {
    background: linear-gradient(135deg, #18181f 0%, #12121a 100%);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 1.25rem;
    max-height: calc(100vh - 2rem);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 
      0 25px 50px -12px rgba(0, 0, 0, 0.5),
      0 0 100px rgba(124, 58, 237, 0.1);
  }

  .modal--sm { width: 100%; max-width: 400px; }
  .modal--md { width: 100%; max-width: 560px; }
  .modal--lg { width: 100%; max-width: 800px; }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }

  .modal-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #fff;
    margin: 0;
  }

  .modal-close {
    background: rgba(255, 255, 255, 0.05);
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    color: #9ca3af;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal-close:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }

  .modal-body {
    padding: 1.5rem;
    overflow-y: auto;
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    padding: 1rem 1.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    background: rgba(0, 0, 0, 0.2);
  }
</style>
