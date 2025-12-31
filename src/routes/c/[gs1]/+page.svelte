<script lang="ts">
	import { fade, fly } from 'svelte/transition';

	let { data } = $props();

	let email = $state('');
	let showCoupon = $state(false);
	let isLoading = $state(false);
	let error = $state('');

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		isLoading = true;
		error = '';

		try {
			const response = await fetch('/api/customers/capture', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					gs1: data.gs1,
					email
				})
			});

			if (!response.ok) {
				throw new Error('Failed to capture email');
			}

			showCoupon = true;
		} catch (err) {
			// Still show coupon even if capture fails
			showCoupon = true;
		} finally {
			isLoading = false;
		}
	}

	function skipCapture() {
		showCoupon = true;
	}
</script>

<svelte:head>
	<title>{data.coupon.campaign.product.name} Coupon | {data.coupon.campaign.brand.name}</title>
</svelte:head>

<div class="container">
	{#if showCoupon}
		<div class="coupon-display" in:fade={{ duration: 300 }}>
			<div class="brand-header">
				{#if data.coupon.campaign.brand.logoUrl}
					<img src={data.coupon.campaign.brand.logoUrl} alt={data.coupon.campaign.brand.name} class="brand-logo" />
				{:else}
					<h2 class="brand-name">{data.coupon.campaign.brand.name}</h2>
				{/if}
			</div>

			<div class="product-info">
				{#if data.coupon.campaign.product.imageUrl}
					<img src={data.coupon.campaign.product.imageUrl} alt={data.coupon.campaign.product.name} class="product-image" />
				{/if}
				<h1 class="product-name">{data.coupon.campaign.product.name}</h1>
			</div>

			<div class="discount-badge">
				{#if data.coupon.campaign.discountType === 'percent'}
					<span class="discount-value">{data.coupon.campaign.discountValue}%</span>
					<span class="discount-label">OFF</span>
				{:else if data.coupon.campaign.discountType === 'fixed'}
					<span class="discount-value">${data.coupon.campaign.discountValue}</span>
					<span class="discount-label">OFF</span>
				{:else}
					<span class="discount-value">BOGO</span>
					<span class="discount-label">Buy One Get One</span>
				{/if}
			</div>

			<div class="barcode-section">
				<p class="scan-instruction">SCAN FROM PHONE TO REDEEM</p>
				{#if data.coupon.qrCodeUrl}
					<img src={data.coupon.qrCodeUrl} alt="QR Code" class="qr-code" />
				{/if}
				<p class="gs1-code">{data.gs1}</p>
			</div>

			{#if data.coupon.campaign.retailer}
				<p class="retailer-info">
					Valid at <strong>{data.coupon.campaign.retailer.name}</strong>
				</p>
			{/if}

			<p class="expiry">
				Valid until {new Date(data.coupon.campaign.campaignEnd).toLocaleDateString()}
			</p>
		</div>
	{:else}
		<form
			onsubmit={handleSubmit}
			class="capture-form"
			in:fly={{ y: 20, duration: 400 }}
		>
			<div class="form-header">
				{#if data.coupon.campaign.brand.logoUrl}
					<img src={data.coupon.campaign.brand.logoUrl} alt={data.coupon.campaign.brand.name} class="brand-logo-small" />
				{/if}
				<h1>Unlock Your Exclusive Coupon</h1>
				<p class="subtitle">
					Get <strong>
						{#if data.coupon.campaign.discountType === 'percent'}
							{data.coupon.campaign.discountValue}% off
						{:else if data.coupon.campaign.discountType === 'fixed'}
							${data.coupon.campaign.discountValue} off
						{:else}
							BOGO
						{/if}
					</strong> on {data.coupon.campaign.product.name}
				</p>
			</div>

			{#if error}
				<div class="error-message">{error}</div>
			{/if}

			<div class="input-group">
				<input
					type="email"
					bind:value={email}
					placeholder="Enter your email"
					required
					class="email-input"
				/>
			</div>

			<button type="submit" class="submit-btn" disabled={isLoading}>
				{#if isLoading}
					<span class="spinner"></span>
					Loading...
				{:else}
					Get My Coupon
				{/if}
			</button>

			<button type="button" class="skip-btn" onclick={skipCapture}>
				Skip and view coupon
			</button>
		</form>
	{/if}
</div>

<style>
	.container {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	}

	.capture-form,
	.coupon-display {
		background: white;
		border-radius: 1.5rem;
		padding: 2rem;
		max-width: 400px;
		width: 100%;
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
	}

	.form-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.form-header h1 {
		font-size: 1.5rem;
		font-weight: 700;
		color: #1f2937;
		margin: 0.5rem 0;
	}

	.subtitle {
		color: #6b7280;
		margin: 0;
	}

	.brand-logo-small {
		height: 40px;
		width: auto;
		margin-bottom: 1rem;
	}

	.input-group {
		margin-bottom: 1rem;
	}

	.email-input {
		width: 100%;
		padding: 0.875rem 1rem;
		border: 2px solid #e5e7eb;
		border-radius: 0.75rem;
		font-size: 1rem;
		transition: border-color 0.2s;
		box-sizing: border-box;
	}

	.email-input:focus {
		outline: none;
		border-color: #667eea;
	}

	.submit-btn {
		width: 100%;
		padding: 1rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border: none;
		border-radius: 0.75rem;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: transform 0.2s, box-shadow 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
	}

	.submit-btn:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 10px 20px -5px rgba(102, 126, 234, 0.4);
	}

	.submit-btn:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.skip-btn {
		width: 100%;
		padding: 0.75rem;
		background: transparent;
		color: #6b7280;
		border: none;
		font-size: 0.875rem;
		cursor: pointer;
		margin-top: 0.5rem;
		transition: color 0.2s;
	}

	.skip-btn:hover {
		color: #374151;
	}

	.spinner {
		width: 1rem;
		height: 1rem;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: white;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	/* Coupon Display Styles */
	.coupon-display {
		text-align: center;
	}

	.brand-header {
		margin-bottom: 1.5rem;
	}

	.brand-logo {
		height: 50px;
		width: auto;
	}

	.brand-name {
		font-size: 1.25rem;
		color: #374151;
		margin: 0;
	}

	.product-info {
		margin-bottom: 1.5rem;
	}

	.product-image {
		width: 150px;
		height: 150px;
		object-fit: contain;
		margin-bottom: 1rem;
	}

	.product-name {
		font-size: 1.25rem;
		font-weight: 600;
		color: #1f2937;
		margin: 0;
	}

	.discount-badge {
		background: linear-gradient(135deg, #10b981 0%, #059669 100%);
		color: white;
		padding: 1rem;
		border-radius: 1rem;
		margin-bottom: 1.5rem;
	}

	.discount-value {
		font-size: 2rem;
		font-weight: 700;
		display: block;
	}

	.discount-label {
		font-size: 0.875rem;
		opacity: 0.9;
	}

	.barcode-section {
		background: #f9fafb;
		padding: 1.5rem;
		border-radius: 1rem;
		margin-bottom: 1rem;
	}

	.scan-instruction {
		font-size: 0.75rem;
		font-weight: 600;
		color: #6b7280;
		letter-spacing: 0.1em;
		margin: 0 0 1rem 0;
	}

	.qr-code {
		width: 200px;
		height: 200px;
	}

	.gs1-code {
		font-family: monospace;
		font-size: 0.75rem;
		color: #9ca3af;
		margin: 1rem 0 0 0;
		word-break: break-all;
	}

	.retailer-info {
		color: #6b7280;
		margin: 0.5rem 0;
	}

	.expiry {
		font-size: 0.875rem;
		color: #9ca3af;
		margin: 0.5rem 0 0 0;
	}

	.error-message {
		background: #fef2f2;
		color: #dc2626;
		padding: 0.75rem;
		border-radius: 0.5rem;
		margin-bottom: 1rem;
		font-size: 0.875rem;
	}
</style>
