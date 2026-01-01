<script lang="ts">
    import { onMount } from 'svelte';
    import { fade, fly } from 'svelte/transition';

    let { data } = $props();

    let copied = $state(false);

    async function copyLink() {
        try {
            await navigator.clipboard.writeText(window.location.href);
            copied = true;
            setTimeout(() => copied = false, 2000);
        } catch (e) {
            console.error('Failed to copy', e);
        }
    }

    // Track affiliate visit (would send to backend in production)
    onMount(() => {
        // In production, this would track the visit
        console.log(`Affiliate visit tracked: ${data.code}`);
    });
</script>

<svelte:head>
    <title>Shop with {data.affiliate.name} | Retailfluencer</title>
</svelte:head>

<div class="page" in:fade={{ duration: 300 }}>
    <div class="container">
        <div class="card" in:fly={{ y: 20, duration: 400, delay: 100 }}>
            <div class="avatar">
                {data.affiliate.name.charAt(0)}
            </div>
            
            <h1>Shop with {data.affiliate.name}!</h1>
            <p class="subtitle">You've been referred by a trusted advocate</p>

            <div class="benefits">
                <div class="benefit">
                    <span class="icon">🎁</span>
                    <span>Exclusive offers</span>
                </div>
                <div class="benefit">
                    <span class="icon">💰</span>
                    <span>Special discounts</span>
                </div>
                <div class="benefit">
                    <span class="icon">⭐</span>
                    <span>Quality guaranteed</span>
                </div>
            </div>

            <div class="code-display">
                <span class="label">Your referral code</span>
                <span class="code">{data.code}</span>
            </div>

            <div class="actions">
                <a href="/about" class="btn-primary">
                    Browse Products
                </a>
                <button class="btn-secondary" onclick={copyLink}>
                    {copied ? '✓ Copied!' : 'Share This Link'}
                </button>
            </div>

            <p class="note">
                This link tracks your referral. When you make a purchase, {data.affiliate.name.split(' ')[0]} earns a commission!
            </p>
        </div>

        <div class="footer">
            <span>Powered by</span>
            <a href="/about">Retailfluencer</a>
        </div>
    </div>
</div>

<style>
    .page {
        min-height: 100vh;
        background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
    }

    .container {
        width: 100%;
        max-width: 480px;
    }

    .card {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 1.5rem;
        padding: 2.5rem;
        text-align: center;
    }

    .avatar {
        width: 80px;
        height: 80px;
        background: linear-gradient(135deg, #7c3aed, #a855f7);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        font-weight: 700;
        color: #fff;
        margin: 0 auto 1.5rem;
        box-shadow: 0 8px 32px rgba(124, 58, 237, 0.3);
    }

    h1 {
        font-size: 1.75rem;
        font-weight: 700;
        color: #fff;
        margin: 0 0 0.5rem;
    }

    .subtitle {
        color: #9ca3af;
        margin: 0 0 2rem;
    }

    .benefits {
        display: flex;
        justify-content: center;
        gap: 1.5rem;
        margin-bottom: 2rem;
    }

    .benefit {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.375rem;
    }

    .benefit .icon {
        font-size: 1.5rem;
    }

    .benefit span:last-child {
        font-size: 0.75rem;
        color: #9ca3af;
    }

    .code-display {
        background: rgba(124, 58, 237, 0.15);
        border: 1px dashed rgba(124, 58, 237, 0.4);
        border-radius: 0.75rem;
        padding: 1rem;
        margin-bottom: 2rem;
    }

    .code-display .label {
        display: block;
        font-size: 0.6875rem;
        color: #9ca3af;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        margin-bottom: 0.25rem;
    }

    .code-display .code {
        font-family: monospace;
        font-size: 1.5rem;
        font-weight: 700;
        color: #a855f7;
        letter-spacing: 0.1em;
    }

    .actions {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin-bottom: 1.5rem;
    }

    .btn-primary {
        display: block;
        padding: 1rem 1.5rem;
        background: linear-gradient(135deg, #7c3aed, #a855f7);
        border: none;
        border-radius: 0.75rem;
        color: #fff;
        font-size: 1rem;
        font-weight: 600;
        text-decoration: none;
        cursor: pointer;
        transition: all 0.2s;
    }

    .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(124, 58, 237, 0.4);
    }

    .btn-secondary {
        padding: 0.875rem 1.5rem;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 0.75rem;
        color: #e5e7eb;
        font-size: 0.9375rem;
        cursor: pointer;
        transition: all 0.2s;
    }

    .btn-secondary:hover {
        background: rgba(255, 255, 255, 0.1);
    }

    .note {
        font-size: 0.75rem;
        color: #6b7280;
        margin: 0;
    }

    .footer {
        text-align: center;
        margin-top: 2rem;
        font-size: 0.8125rem;
        color: #6b7280;
    }

    .footer a {
        color: #a855f7;
    }
</style>
