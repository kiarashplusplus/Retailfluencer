<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';

  interface Props extends Omit<HTMLInputAttributes, 'value'> {
    label?: string;
    error?: string;
    hint?: string;
    icon?: string;
    value?: string | number;
  }

  let { 
    label,
    error,
    hint,
    icon,
    value = $bindable(''),
    id,
    type = 'text',
    ...restProps
  }: Props = $props();

  let inputId = id || `input-${Math.random().toString(36).slice(2)}`;
  let focused = $state(false);
</script>

<div class="input-group" class:has-error={error} class:has-icon={icon}>
  {#if label}
    <label for={inputId} class="input-label" class:floating={focused || value}>
      {label}
    </label>
  {/if}
  
  <div class="input-wrapper">
    {#if icon}
      <span class="input-icon">{icon}</span>
    {/if}
    
    <input
      {id}
      {type}
      bind:value
      class="input"
      onfocus={() => focused = true}
      onblur={() => focused = false}
      {...restProps}
    />
  </div>
  
  {#if error}
    <span class="input-error">{error}</span>
  {:else if hint}
    <span class="input-hint">{hint}</span>
  {/if}
</div>

<style>
  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    position: relative;
  }

  .input-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #9ca3af;
    transition: all 0.2s ease;
  }

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .input {
    width: 100%;
    padding: 0.875rem 1rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.75rem;
    color: #fff;
    font-size: 1rem;
    transition: all 0.2s ease;
  }

  .has-icon .input {
    padding-left: 2.75rem;
  }

  .input:focus {
    outline: none;
    border-color: #7c3aed;
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.2);
  }

  .input::placeholder {
    color: #4b5563;
  }

  .has-error .input {
    border-color: #ef4444;
  }

  .has-error .input:focus {
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
  }

  .input-icon {
    position: absolute;
    left: 1rem;
    color: #6b7280;
    font-size: 1rem;
    pointer-events: none;
  }

  .input-error {
    font-size: 0.8125rem;
    color: #f87171;
  }

  .input-hint {
    font-size: 0.8125rem;
    color: #6b7280;
  }
</style>
