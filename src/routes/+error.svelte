<script lang="ts">
  import { page } from '$app/stores';
  import { Button } from '$lib/components/ui';
</script>

<svelte:head>
  <title>{$page.status} | Retailfluencer</title>
</svelte:head>

<div class="error-page">
  <div class="glass-container">
    <div class="error-code">{$page.status}</div>
    
    <h1>
      {#if $page.status === 404}
        Page Not Found
      {:else}
        Something Went Wrong
      {/if}
    </h1>
    
    <p class="message">
      {#if $page.status === 404}
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      {:else}
        {$page.error?.message || "An unexpected error occurred. Please try again later."}
      {/if}
    </p>

    <div class="actions">
      <Button href="/dashboard" variant="primary">Go to Dashboard</Button>
      <Button href="/" variant="secondary">Back to Home</Button>
    </div>

    <div class="help-links">
      <a href="/about">About Us</a>
      <span class="separator">•</span>
      <a href="mailto:support@retailfluencer.com">Contact Support</a>
    </div>
  </div>

  <div class="background-globes">
    <div class="globe globe-1"></div>
    <div class="globe globe-2"></div>
  </div>
</div>

<style>
  .error-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #0a0a0f;
    color: #fff;
    padding: 2rem;
    position: relative;
    overflow: hidden;
  }

  .glass-container {
    position: relative;
    z-index: 10;
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 1.5rem;
    padding: 4rem 3rem;
    max-width: 500px;
    width: 100%;
    text-align: center;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  }

  .error-code {
    font-size: 6rem;
    font-weight: 800;
    line-height: 1;
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 1rem;
    font-variant-numeric: tabular-nums;
  }

  h1 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1rem;
    letter-spacing: -0.02em;
  }

  .message {
    color: #9ca3af;
    margin-bottom: 2.5rem;
    line-height: 1.6;
  }

  .actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-bottom: 2.5rem;
  }

  .help-links {
    font-size: 0.875rem;
    color: #6b7280;
  }

  .help-links a {
    color: #9ca3af;
    text-decoration: none;
    transition: color 0.2s;
  }

  .help-links a:hover {
    color: #fff;
  }

  .separator {
    margin: 0 0.5rem;
    color: #4b5563;
  }

  /* Background animation */
  .background-globes {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .globe {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.4;
  }

  .globe-1 {
    top: -10%;
    left: -10%;
    width: 400px;
    height: 400px;
    background: #7c3aed;
    animation: float 10s ease-in-out infinite;
  }

  .globe-2 {
    bottom: -10%;
    right: -10%;
    width: 500px;
    height: 500px;
    background: #10b981;
    animation: float 15s ease-in-out infinite reverse;
  }

  @keyframes float {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(30px, 50px); }
  }

  @media (max-width: 640px) {
    .glass-container {
      padding: 3rem 1.5rem;
    }

    .error-code {
      font-size: 4rem;
    }

    .actions {
      flex-direction: column;
    }
  }
</style>
