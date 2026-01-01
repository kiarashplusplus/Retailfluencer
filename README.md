# Retailfluencer

**SaaS platform enabling influencer-to-retail sales attribution using 8112 universal digital coupons.**

Retailfluencer bridges the gap between influencer marketing and physical retail sales. By leveraging the new GS1 8112 standard, we enable brands to issue single-use, trackable coupons that influencers (affiliates) can distribute to their audience. When a shopper redeems the coupon at a physical store POS (e.g., Target, Walmart), the sale is attributed back to the specific influencer, unlocking true ROI measurement for offline CPG sales.

---

## 🚀 Features (Implemented)

### Phase 1: Core Platform & Dashboard
- **Premium Dashboard UI:** Award-worthy, glassmorphic design system.
- **Product Management:** Create and manage CPG products with GS1/SKU data.
- **Campaign Management:** Run influencer campaigns with specific discount rules.
- **Influencer CRM:** Track influencer partnerships and performance.
- **Retailer Management:** Database of retailers supporting 8112 coupons.
- **Analytics:** Real-time dashboards showing redemptions, spend, and ROI.
- **Role-based Access:** Brand admins can manage their organization settings.

### Phase 2: Automation & Growth Engine
- **Automation Workflows:**
  - Create triggers (e.g., "New Customer," "Coupon Redeemed").
  - Define actions (Send Email, Send SMS, Wait).
  - **Affiliate Conversion:** Automatically invite customers to become affiliates after successful redemption ("Snowball Effect").
- **Affiliate System:**
  - Unique affiliate referral links (`/a/[code]`).
  - Commission tracking logic.
  - Public promo landing pages for referred customers (`/promo`).
- **Customer CRM:** Capture and track end-customer data from coupon redemptions.

### Phase 3: TCB Integration (Planned)
- Integration with The Coupon Bureau (TCB) API for real 8112 serialization.

---

## 🛠 Tech Stack

- **Frontend:** Svelte 5 (Runes), SvelteKit, TypeScript
- **Styling:** Custom CSS with Glassmorphism
- **Database:** Prisma ORM, PostgreSQL (Azure Database in prod)
- **Deployment:** Cloudflare Pages / Vercel
- **State Management:** Svelte Stores

---

## 🚦 Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database (or Docker container)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/retailfluencer.git
   cd retailfluencer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Database**
   ```bash
   # Create .env file with DATABASE_URL
   cp .env.example .env
   
   # Push schema to DB
   npx prisma db push
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Open Dashboard**
   Navigate to `http://localhost:5173`.
   - Use "Demo Credentials" on the login page to sign in.

---

## 📱 Key Routes

| Route | Description |
|-------|-------------|
| `/dashboard` | Brand Admin Dashboard (Overview) |
| `/dashboard/automations` | Manage automation workflows |
| `/dashboard/affiliates` | Manage affiliates and commissions |
| `/c/[gs1]` | Public Coupon Redemption Page |
| `/a/[code]` | Affiliate Referral Redirect |
| `/promo` | Public Promo Landing Page |

---

## 🚀 Deployment

### Cloudflare Pages

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Cloudflare Pages**
   ```bash
   npx wrangler pages deploy .svelte-kit/cloudflare --project-name=retailfluencer
   ```

3. **Or deploy in one command**
   ```bash
   npm run build && npx wrangler pages deploy .svelte-kit/cloudflare --project-name=retailfluencer
   ```

### Environment Setup

- Ensure `wrangler.toml` is configured with your project settings
- The app uses static mock data for demo (no database required for deployment)
- Production URL: https://retailfluencer.pages.dev

---

## 🧪 Testing

- **Simulate Redemption:** Use the Admin API to simulate a POS scan event.
- **Test Automation:** Create an automation triggers on "New Customer" and use the coupon capture page (`/c/01...`) to fire it.

