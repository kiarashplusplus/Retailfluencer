<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { isAuthenticated, isLoading } from '$lib/stores/auth';

  onMount(() => {
    // Redirect based on auth state
    const unsubscribe = isLoading.subscribe(loading => {
      if (!loading) {
        isAuthenticated.subscribe(authed => {
          if (authed) {
            goto('/dashboard');
          } else {
            goto('/login');
          }
        });
      }
    });
    return unsubscribe;
  });
</script>

<div class="landing">
  <div class="loader"></div>
  <p>Loading...</p>
</div>

<style>
  .landing {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #0a0a0f;
    color: #9ca3af;
    gap: 1rem;
  }

  .loader {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(124, 58, 237, 0.2);
    border-top-color: #7c3aed;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
