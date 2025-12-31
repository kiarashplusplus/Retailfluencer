<script lang="ts">
  import { goto } from '$app/navigation';
  import { auth, authError, isLoading, DEMO_CREDENTIALS } from '$lib/stores/auth';

  let email = $state('');
  let password = $state('');
  let showPassword = $state(false);

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    const success = auth.login(email, password);
    if (success) {
      goto('/dashboard');
    }
  }

  function fillDemoCredentials() {
    email = DEMO_CREDENTIALS.email;
    password = DEMO_CREDENTIALS.password;
  }
</script>

<svelte:head>
  <title>Login | Retailfluencer</title>
</svelte:head>

<div class="login-page">
  <div class="login-container">
    <div class="login-header">
      <div class="logo">
        <span class="logo-icon">◈</span>
        <span class="logo-text">Retailfluencer</span>
      </div>
      <h1>Welcome back</h1>
      <p>Sign in to your account to continue</p>
    </div>

    <form class="login-form" onsubmit={handleSubmit}>
      {#if $authError}
        <div class="error-banner">
          <span class="error-icon">⚠</span>
          {$authError}
        </div>
      {/if}

      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          bind:value={email}
          placeholder="you@company.com"
          required
          autocomplete="email"
        />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <div class="password-input">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            bind:value={password}
            placeholder="••••••••"
            required
            autocomplete="current-password"
          />
          <button
            type="button"
            class="toggle-password"
            onclick={() => showPassword = !showPassword}
          >
            {showPassword ? '👁' : '👁‍🗨'}
          </button>
        </div>
      </div>

      <button type="submit" class="btn-primary" disabled={$isLoading}>
        {#if $isLoading}
          <span class="spinner"></span>
          Signing in...
        {:else}
          Sign in
        {/if}
      </button>

      <div class="demo-hint">
        <button type="button" class="btn-demo" onclick={fillDemoCredentials}>
          Use demo credentials
        </button>
        <p class="demo-credentials">
          <code>{DEMO_CREDENTIALS.email}</code> / <code>{DEMO_CREDENTIALS.password}</code>
        </p>
      </div>
    </form>
  </div>

  <div class="login-visual">
    <div class="visual-content">
      <div class="floating-card card-1">
        <div class="card-stat">+247%</div>
        <div class="card-label">Conversion Rate</div>
      </div>
      <div class="floating-card card-2">
        <div class="card-stat">$1.2M</div>
        <div class="card-label">Revenue Tracked</div>
      </div>
      <div class="floating-card card-3">
        <div class="card-stat">15K</div>
        <div class="card-label">Active Influencers</div>
      </div>
    </div>
  </div>
</div>

<style>
  .login-page {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: #0a0a0f;
  }

  .login-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 3rem;
    max-width: 480px;
    margin: 0 auto;
    width: 100%;
  }

  .login-header {
    margin-bottom: 2.5rem;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 2rem;
  }

  .logo-icon {
    font-size: 2rem;
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .logo-text {
    font-size: 1.5rem;
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.02em;
  }

  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 0.5rem;
    letter-spacing: -0.02em;
  }

  .login-header p {
    color: #6b7280;
    font-size: 1rem;
    margin: 0;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .error-banner {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: 0.75rem;
    color: #f87171;
    font-size: 0.875rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #9ca3af;
  }

  input {
    width: 100%;
    padding: 0.875rem 1rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.75rem;
    color: #fff;
    font-size: 1rem;
    transition: all 0.2s ease;
  }

  input:focus {
    outline: none;
    border-color: #7c3aed;
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.2);
  }

  input::placeholder {
    color: #4b5563;
  }

  .password-input {
    position: relative;
  }

  .password-input input {
    padding-right: 3rem;
  }

  .toggle-password {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.25rem;
    opacity: 0.5;
    transition: opacity 0.2s;
  }

  .toggle-password:hover {
    opacity: 1;
  }

  .btn-primary {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 1rem;
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    border: none;
    border-radius: 0.75rem;
    color: #fff;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(124, 58, 237, 0.4);
  }

  .btn-primary:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .spinner {
    width: 1rem;
    height: 1rem;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .demo-hint {
    text-align: center;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  .btn-demo {
    background: rgba(124, 58, 237, 0.1);
    border: 1px solid rgba(124, 58, 237, 0.3);
    color: #a855f7;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-demo:hover {
    background: rgba(124, 58, 237, 0.2);
  }

  .demo-credentials {
    margin-top: 0.75rem;
    font-size: 0.75rem;
    color: #6b7280;
  }

  .demo-credentials code {
    background: rgba(255, 255, 255, 0.05);
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    font-family: monospace;
  }

  /* Visual side */
  .login-visual {
    background: linear-gradient(135deg, #1a1a2e 0%, #16162a 100%);
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .login-visual::before {
    content: '';
    position: absolute;
    inset: 0;
    background: 
      radial-gradient(circle at 30% 20%, rgba(124, 58, 237, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 70% 80%, rgba(168, 85, 247, 0.1) 0%, transparent 50%);
  }

  .visual-content {
    position: relative;
    width: 300px;
    height: 400px;
  }

  .floating-card {
    position: absolute;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 1rem;
    padding: 1.5rem;
    animation: float 6s ease-in-out infinite;
  }

  .card-1 {
    top: 0;
    left: 0;
    animation-delay: 0s;
  }

  .card-2 {
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    animation-delay: -2s;
  }

  .card-3 {
    bottom: 0;
    left: 20%;
    animation-delay: -4s;
  }

  .card-stat {
    font-size: 2rem;
    font-weight: 700;
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .card-label {
    color: #9ca3af;
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  /* Responsive */
  @media (max-width: 768px) {
    .login-page {
      grid-template-columns: 1fr;
    }

    .login-visual {
      display: none;
    }

    .login-container {
      padding: 2rem 1.5rem;
    }
  }
</style>
