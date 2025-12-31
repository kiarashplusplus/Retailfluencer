<script lang="ts">
  interface Props {
    icon?: string;
    title: string;
    description?: string;
    actionLabel?: string;
    actionHref?: string;
    onaction?: () => void;
  }

  let { icon = '◇', title, description, actionLabel, actionHref, onaction }: Props = $props();
</script>

<div class="empty-state">
  <div class="empty-icon">{icon}</div>
  <h3 class="empty-title">{title}</h3>
  {#if description}
    <p class="empty-description">{description}</p>
  {/if}
  {#if actionLabel}
    {#if actionHref}
      <a href={actionHref} class="empty-action">{actionLabel}</a>
    {:else if onaction}
      <button class="empty-action" onclick={onaction}>{actionLabel}</button>
    {/if}
  {/if}
</div>

<style>
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 2rem;
    text-align: center;
  }

  .empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.3;
  }

  .empty-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #e5e7eb;
    margin: 0 0 0.5rem;
  }

  .empty-description {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0 0 1.5rem;
    max-width: 300px;
  }

  .empty-action {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    border: none;
    border-radius: 0.75rem;
    color: #fff;
    font-size: 0.875rem;
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .empty-action:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(124, 58, 237, 0.4);
  }
</style>
