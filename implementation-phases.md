# Retailfluencer Implementation Phases

## Executive Summary

This document outlines the phased implementation plan for Retailfluencer, a SaaS platform enabling influencer-to-retail sales attribution using TCB's 8112 digital coupon infrastructure.

**Strategy:** Build the full platform with mock TCB integration first. Real TCB APIs are swapped in once partnership is established.

**Design Goal:** Awwwards-worthy UI with exceptional performance, smooth animations, and premium micro-interactions.

---

## Technical Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              RETAILFLUENCER                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐  │
│  │  SvelteKit   │   │  SvelteKit   │   │   Node.js    │   │  Cloudflare  │  │
│  │   Frontend   │──▶│  API Routes  │──▶│   Services   │──▶│    Queues    │  │
│  │  (Svelte 5)  │   │   (Server)   │   │              │   │              │  │
│  └──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘  │
│         │                  │                  │                  │          │
│         ▼                  ▼                  ▼                  ▼          │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         PostgreSQL (Primary DB)                      │    │
│  │   • brands, products, retailers, campaigns, influencers             │    │
│  │   • redemptions, customers, affiliates, automations                 │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│         │                                                                    │
│         ▼                                                                    │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐                     │
│  │ Cloudflare   │   │ Cloudflare   │   │    Azure     │                     │
│  │   KV/Queues  │   │     R2       │   │   (Analytics)│                     │
│  │              │   │   (Assets)   │   │              │                     │
│  └──────────────┘   └──────────────┘   └──────────────┘                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
              ┌───────────────────────┼───────────────────────┐
              ▼                       ▼                       ▼
      ┌──────────────┐        ┌──────────────┐        ┌──────────────┐
      │  TCB API     │        │    Azure     │        │    Azure     │
      │  (Mock →     │        │   Comms Svc  │        │   Comms Svc  │
      │   Real)      │        │   (Email)    │        │    (SMS)     │
      └──────────────┘        └──────────────┘        └──────────────┘
```

### Recommended Tech Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Frontend | **Svelte 5 + SvelteKit** | Tiny bundles, built-in transitions, best-in-class performance |
| Styling | Custom CSS/SCSS | Maximum creative control for award-worthy design |
| Animations | GSAP + Lenis + Svelte transitions | Smooth scroll, premium micro-interactions |
| Backend | SvelteKit API routes + Node.js | Unified stack, server functions |
| Database | Azure PostgreSQL + Prisma | Managed, reliable, great ORM |
| Cache | Cloudflare KV | Global, low-latency key-value |
| Queue | Cloudflare Queues | Serverless job processing |
| Object Storage | Cloudflare R2 | Zero egress fees, S3-compatible |
| Auth | Clerk or Lucia | Multi-tenant, Svelte-native options |
| Hosting | Cloudflare Pages | Edge deployment, native SvelteKit adapter |
| Email/SMS | Azure Communication Services | Unified communications platform |

### Design Excellence Requirements

| Aspect | Target |
|--------|--------|
| Lighthouse Performance | 95+ |
| First Contentful Paint | < 1.2s |
| Largest Contentful Paint | < 2.5s |
| Interaction to Next Paint | < 200ms |
| Page transitions | Smooth cross-fade with View Transitions API |
| Micro-interactions | Hover states, loading states, feedback animations |

---

## Phase 1: Core Platform (No TCB Required)

> **Goal:** Build the entire SaaS shell with mock coupon generation.

### 1.1 Database Schema & Project Setup

```sql
-- Core entities
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  logo_url TEXT,
  tcb_funder_id VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id),
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100),
  gtin VARCHAR(14),  -- Global Trade Item Number for 8112
  cogs DECIMAL(10,2),
  retail_price DECIMAL(10,2),
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE retailers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  logo_url TEXT,
  supports_8112 BOOLEAN DEFAULT true,
  regions JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id),
  product_id UUID REFERENCES products(id),
  retailer_id UUID REFERENCES retailers(id),
  name VARCHAR(255) NOT NULL,
  discount_type VARCHAR(20),  -- 'fixed' | 'percent' | 'bogo'
  discount_value DECIMAL(10,2),
  base_gs1 VARCHAR(50),
  tcb_mof_id VARCHAR(100),
  campaign_start TIMESTAMPTZ NOT NULL,
  campaign_end TIMESTAMPTZ NOT NULL,
  total_circulation INTEGER,
  status VARCHAR(20) DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE influencers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  instagram_handle VARCHAR(100),
  tiktok_handle VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE coupon_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id),
  influencer_id UUID REFERENCES influencers(id),
  serialized_gs1 VARCHAR(100) UNIQUE NOT NULL,
  tracking_link TEXT,
  qr_code_url TEXT,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_assignment_id UUID REFERENCES coupon_assignments(id),
  campaign_id UUID REFERENCES campaigns(id),
  influencer_id UUID REFERENCES influencers(id),
  serialized_gs1 VARCHAR(100) NOT NULL,
  redeemed_at TIMESTAMPTZ NOT NULL,
  retailer_location TEXT,
  customer_id UUID REFERENCES customers(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id),
  email VARCHAR(255),
  phone VARCHAR(50),
  total_redemptions INTEGER DEFAULT 0,
  is_affiliate BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_coupon_assignments_gs1 ON coupon_assignments(serialized_gs1);
CREATE INDEX idx_redemptions_campaign ON redemptions(campaign_id, redeemed_at);
CREATE INDEX idx_redemptions_influencer ON redemptions(influencer_id, redeemed_at);
```

**Project Structure:**
```
retailfluencer/
├── src/
│   ├── routes/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── (dashboard)/
│   │   │   ├── products/
│   │   │   ├── retailers/
│   │   │   ├── campaigns/
│   │   │   ├── influencers/
│   │   │   ├── analytics/
│   │   │   └── settings/
│   │   ├── api/
│   │   │   ├── webhooks/tcb/
│   │   │   ├── campaigns/
│   │   │   └── coupons/
│   │   └── c/[gs1]/           # Coupon redemption pages
│   ├── lib/
│   │   ├── tcb/              # TCB client (mock → real)
│   │   ├── server/           # Server-only utilities
│   │   └── components/       # Reusable Svelte components
│   └── app.css               # Global styles
├── prisma/
├── static/                   # Static assets
└── svelte.config.js          # Cloudflare adapter config
```

### 1.2 Products & Retailers Module

**API Endpoints (SvelteKit +server.ts):**
```typescript
// src/routes/api/products/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';

export const GET: RequestHandler = async ({ url }) => {
  const products = await db.product.findMany();
  return json(products);
};

export const POST: RequestHandler = async ({ request }) => {
  const data = await request.json();
  const product = await db.product.create({ data });
  return json(product, { status: 201 });
};
```

### 1.3 Campaign Builder with Mock Coupon Generation

**The Key Abstraction — TCB Client Interface:**
```typescript
// lib/tcb/client.ts

export interface TCBClient {
  deposit(params: DepositParams): Promise<DepositResponse>;
  createFetchCode(params: FetchCodeParams): Promise<FetchCodeResponse>;
  getMasterOfferFiles(): Promise<MasterOfferFile[]>;
}

// Start with mock, swap to real later
export const tcbClient: TCBClient = process.env.TCB_MODE === 'live'
  ? new RealTCBClient()
  : new MockTCBClient();
```

**Mock TCB Client:**
```typescript
// lib/tcb/mock-client.ts

export class MockTCBClient implements TCBClient {
  private counter = 0;

  async deposit(params: DepositParams): Promise<DepositResponse> {
    // Generate fake but realistic serialized GS1s
    const gs1s = params.gs1s.map((baseGs1) => {
      this.counter++;
      const serial = String(this.counter).padStart(12, '0');
      return `${baseGs1}${serial}`;
    });

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));

    return {
      success: true,
      gs1s,
      client_txn_id: params.client_txn_id,
    };
  }

  async createFetchCode(params: FetchCodeParams): Promise<FetchCodeResponse> {
    // Generate 16-digit mock fetch code
    const fetchCode = Array.from({ length: 16 }, () => 
      Math.floor(Math.random() * 10)
    ).join('');

    return {
      fetch_code: fetchCode,
      expires_at: new Date(Date.now() + params.validity_in_seconds * 1000),
    };
  }

  async getMasterOfferFiles(): Promise<MasterOfferFile[]> {
    return []; // Return empty for mock
  }
}
```

**Campaign Creation Service:**
```typescript
// lib/services/campaign.ts

export async function createCampaign(input: CreateCampaignInput) {
  // Generate base GS1 (mock format matching TCB structure)
  const baseGs1 = generateBaseGs1(input.product.gtin, input.funderId || 'MOCK01');

  const campaign = await db.campaign.create({
    data: {
      brandId: input.brandId,
      productId: input.productId,
      retailerId: input.retailerId,
      name: input.name,
      discountType: input.discountType,
      discountValue: input.discountValue,
      baseGs1,
      campaignStart: input.startDate,
      campaignEnd: input.endDate,
      totalCirculation: input.maxRedemptions,
      status: 'active',
    },
  });

  return campaign;
}

function generateBaseGs1(gtin: string, funderId: string): string {
  const prefix = '8112';
  const offerCode = gtin.slice(-10);
  return `${prefix}${offerCode}${funderId}`;
}
```

### 1.4 Influencer Attribution

**Assign Coupon to Influencer:**
```typescript
// lib/services/coupon-assignment.ts

export async function assignCouponToInfluencer(
  campaignId: string,
  influencerId: string
): Promise<CouponAssignment> {
  const campaign = await db.campaign.findUnique({ where: { id: campaignId } });

  // Uses mock or real TCB client based on config
  const depositResponse = await tcbClient.deposit({
    gs1s: [campaign.baseGs1],
    mode: 'base_gs1',
    client_txn_id: `${campaignId}-${influencerId}-${Date.now()}`,
  });

  const serializedGs1 = depositResponse.gs1s[0];
  const trackingLink = `${process.env.APP_URL}/c/${serializedGs1}`;
  const qrCodeUrl = await generateQRCode(serializedGs1);

  return db.couponAssignment.create({
    data: {
      campaignId,
      influencerId,
      serializedGs1,
      trackingLink,
      qrCodeUrl,
      status: 'active',
    },
  });
}
```

### 1.5 Simulated Redemption System

**Admin Tool to Simulate Redemptions (for testing):**
```typescript
// src/routes/api/admin/simulate-redemption/+server.ts
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import { triggerAutomations } from '$lib/server/automation';

export const POST: RequestHandler = async ({ request }) => {
  if (env.NODE_ENV === 'production' && env.TCB_MODE === 'live') {
    throw error(403, 'Disabled in production');
  }

  const { serializedGs1 } = await request.json();

  const assignment = await db.couponAssignment.findUnique({
    where: { serializedGs1 },
    include: { campaign: true, influencer: true },
  });

  if (!assignment) {
    throw error(404, 'Coupon not found');
  }

  const redemption = await db.redemption.create({
    data: {
      couponAssignmentId: assignment.id,
      campaignId: assignment.campaignId,
      influencerId: assignment.influencerId,
      serializedGs1,
      redeemedAt: new Date(),
      retailerLocation: 'Simulated - Target Store #1234',
    },
  });

  await db.couponAssignment.update({
    where: { id: assignment.id },
    data: { status: 'redeemed' },
  });

  await triggerAutomations('coupon_redeemed', {
    redemptionId: redemption.id,
    campaignId: assignment.campaignId,
    influencerId: assignment.influencerId,
  });

  return json({ success: true, redemption });
};
```

### 1.6 Dashboard & Analytics

```typescript
// app/api/dashboard/route.ts

export async function GET(req: NextRequest) {
  const brandId = getBrandId(req);

  const [totalRedemptions, activeCampaigns, topInfluencers, recentActivity] = 
    await Promise.all([
      db.redemption.count({ where: { campaign: { brandId } } }),
      db.campaign.count({ where: { brandId, status: 'active' } }),
      db.influencer.findMany({
        where: { brandId },
        orderBy: { totalRedemptions: 'desc' },
        take: 10,
      }),
      db.redemption.findMany({
        where: { campaign: { brandId } },
        orderBy: { redeemedAt: 'desc' },
        take: 20,
        include: { influencer: true, campaign: true },
      }),
    ]);

  return NextResponse.json({
    totalRedemptions,
    activeCampaigns,
    topInfluencers,
    recentActivity,
  });
}
```

---

## Phase 2: Automation & Growth Engine (No TCB Required)

> **Goal:** Build the "snowball" system that converts buyers into affiliates.

### 2.1 Customer Data Capture

**Email Capture Page (Svelte 5 with runes):**
```svelte
<!-- src/routes/c/[gs1]/+page.svelte -->
<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import CouponDisplay from '$lib/components/CouponDisplay.svelte';
  
  let { data } = $props();
  
  let email = $state('');
  let showCoupon = $state(false);
  let isLoading = $state(false);

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    isLoading = true;
    
    await fetch('/api/customers/capture', {
      method: 'POST',
      body: JSON.stringify({ gs1: data.gs1, email }),
    });
    
    isLoading = false;
    showCoupon = true;
  }
</script>

{#if showCoupon}
  <div in:fade={{ duration: 300 }}>
    <CouponDisplay gs1={data.gs1} />
  </div>
{:else}
  <form 
    onsubmit={handleSubmit}
    class="coupon-capture"
    in:fly={{ y: 20, duration: 400 }}
  >
    <h1>Unlock Your Coupon</h1>
    <input 
      type="email" 
      bind:value={email}
      placeholder="you@example.com"
      required
    />
    <button type="submit" disabled={isLoading}>
      {isLoading ? 'Loading...' : 'Get Coupon'}
    </button>
    <button type="button" onclick={() => showCoupon = true}>
      Skip
    </button>
  </form>
{/if}

<style>
  .coupon-capture {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    animation: fadeIn 0.3s ease-out;
  }
</style>
```

### 2.2 Automation Engine

**Schema:**
```sql
CREATE TABLE automations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id),
  name VARCHAR(255) NOT NULL,
  trigger_type VARCHAR(50) NOT NULL,  -- 'coupon_redeemed' | 'customer_created'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE automation_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  automation_id UUID REFERENCES automations(id),
  step_order INTEGER NOT NULL,
  action_type VARCHAR(50) NOT NULL,  -- 'send_email' | 'send_sms' | 'create_affiliate'
  action_config JSONB NOT NULL,
  delay_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Executor:**
```typescript
// lib/services/automation.ts

export async function triggerAutomations(triggerType: string, eventData: any) {
  const automations = await db.automation.findMany({
    where: { triggerType, isActive: true, brandId: eventData.brandId },
    include: { steps: { orderBy: { stepOrder: 'asc' } } },
  });

  for (const automation of automations) {
    await automationQueue.add('execute', {
      automationId: automation.id,
      eventData,
      stepIndex: 0,
    });
  }
}
```

### 2.3 Affiliate System

```typescript
// lib/services/affiliate.ts

export async function createAffiliate(customerId: string, config: AffiliateConfig) {
  const customer = await db.customer.findUnique({ where: { id: customerId } });
  const code = generateAffiliateCode(customer.id);

  const affiliate = await db.affiliate.create({
    data: {
      customerId,
      brandId: customer.brandId,
      code,
      commissionPercent: config.commissionPercent || 10,
    },
  });

  // Send invitation email
  await sendEmail({
    to: customer.email,
    template: 'affiliate-invitation',
    data: { affiliateLink: `${process.env.APP_URL}/a/${code}` },
  });

  return affiliate;
}
```

---

## Phase 3: TCB Integration (After Partnership)

> **Goal:** Swap mock client for real TCB APIs.

### 3.1 Prerequisites

> ⚠️ **TCB does not have self-service registration.** You must contact them directly.

**How to Get Started with TCB:**

1. **Submit a contact request:**
   - [Get Connected](https://www.thecouponbureau.org/contactus)
   - [Get Certified](https://www.thecouponbureau.org/getcertified)

2. **Mention in your inquiry:**
   - You want to become a **Certified Distribution Provider**
   - You're building an influencer-to-retail attribution platform
   - Request access to the **try server** for testing

3. **Once approved**, you'll get access to:
   - https://try.thecouponbureau.org
   - API credentials (access_key + secret_key)

### 3.2 Real TCB Client

```typescript
// lib/tcb/real-client.ts

export class RealTCBClient implements TCBClient {
  private baseUrl = process.env.TCB_API_URL;
  private accessKey = process.env.TCB_ACCESS_KEY;
  private secretKey = process.env.TCB_SECRET_KEY;

  private async getAccessToken(): Promise<string> {
    const response = await fetch(`${this.baseUrl}/access_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.accessKey,
      },
      body: JSON.stringify({
        access_key: this.accessKey,
        secret_key: this.secretKey,
      }),
    });
    const { access_token } = await response.json();
    return access_token;
  }

  async deposit(params: DepositParams): Promise<DepositResponse> {
    const token = await this.getAccessToken();

    const response = await fetch(`${this.baseUrl}/provider/deposit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.accessKey,
        'x-access-token': token,
      },
      body: JSON.stringify({
        gs1s: params.gs1s,
        mode: params.mode || 'base_gs1',
        client_txn_id: params.client_txn_id,
      }),
    });

    return response.json();
  }

  async createFetchCode(params: FetchCodeParams): Promise<FetchCodeResponse> {
    const token = await this.getAccessToken();

    const response = await fetch(`${this.baseUrl}/provider/time_bound_fetch_code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.accessKey,
        'x-access-token': token,
      },
      body: JSON.stringify(params),
    });

    return response.json();
  }
}
```

### 3.3 Webhook Handler for Real Redemptions

```typescript
// app/api/webhooks/tcb/route.ts

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('x-tcb-signature');

  // Verify webhook (only in live mode)
  if (process.env.TCB_MODE === 'live' && !verifyTcbSignature(body, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const payload = JSON.parse(body);

  if (payload.event_type === 'redemption') {
    await redemptionQueue.add('process', {
      serializedGs1: payload.gs1,
      transactionId: payload.transaction_id,
      redeemedAt: payload.timestamp,
      retailerLocation: payload.location,
    });
  }

  return NextResponse.json({ received: true });
}
```

### 3.4 TCB Certification Checklist

| Requirement | Status |
|-------------|--------|
| Deposit non-sequential serialized GS1s | ⬜ |
| Consumer experience with barcode + fetch code | ⬜ |
| Documentation: auth, bundling, security | ⬜ |
| "SCAN FROM PHONE TO REDEEM" text visible | ⬜ |

---

## Phase 4: Advanced Features (Post-Launch)

### 4.1 Advanced Analytics
- Campaign ROI calculator
- Influencer performance scoring
- ClickHouse for high-speed queries
- Cohort analysis

### 4.2 Integrations
- Klaviyo / Mailchimp (email sync)
- HubSpot / Salesforce (CRM)
- Ampifi / Modash (influencer platforms)
- Zapier / Make (webhooks)

### 4.3 Enterprise Features
- Multi-brand dashboards
- White-label support
- Custom domains per brand
- API access for partners

---

## Development Priority Order

| Priority | Module | TCB Required? |
|----------|--------|---------------|
| 1 | Auth + Brand onboarding | ❌ |
| 2 | Products & Retailers CRUD | ❌ |
| 3 | Campaign builder + Mock coupons | ❌ |
| 4 | Influencer management | ❌ |
| 5 | QR code generation | ❌ |
| 6 | Simulated redemption system | ❌ |
| 7 | Dashboard & analytics | ❌ |
| 8 | Email capture flow | ❌ |
| 9 | Automation engine | ❌ |
| 10 | Affiliate system | ❌ |
| 11 | **Real TCB integration** | ✅ |
| 12 | Webhook handler | ✅ |
| 13 | TCB certification | ✅ |

---

## Resource Estimates

### Team
| Role | MVP | Scale |
|------|-----|-------|
| Full-stack Engineer | 2 | 3-4 |
| Backend Engineer | 1 | 2 |
| DevOps | 0.5 | 1 |
| Designer | 0.5 | 1 |

### Monthly Infrastructure (Cloudflare + Azure)
| Service | MVP | Scale |
|---------|-----|-------|
| Cloudflare Pages (Pro) | $20 | $20 |
| Cloudflare R2 (Storage) | $5 | $50 |
| Cloudflare KV + Queues | $5 | $50 |
| Azure PostgreSQL | $50 | $200 |
| Azure Communication Services | $25 | $150 |
| Monitoring (Azure Monitor) | $20 | $80 |
| **Total** | **~$125** | **~$550** |

---

*Document created: December 31, 2024*  
*Version: 3.0 — Mock-First Approach*
