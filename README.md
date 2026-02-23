# 🦅 Talons — Crypto Market Intelligence

> Real-time cryptocurrency market dashboard with live prices, charts, portfolio simulation, and crypto news.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/talons)
![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel)

---

## ✨ Features

| Feature | Description |
|---|---|
| 📊 **Global Market Header** | Live Market Cap, 24h Volume, BTC & ETH dominance |
| 📋 **Live Asset Table** | Top 250 coins — sortable, paginated, with sparklines |
| 🕯️ **Interactive Charts** | 1D / 7D / 1M / 1Y area charts per coin |
| 💼 **Portfolio Simulator** | Add coins with buy price & quantity, track P&L |
| 📰 **Crypto News** | Integrated CryptoPanic feed with sentiment tags |
| 😨 **Fear & Greed Index** | Animated gauge from Alternative.me |
| 🔍 **Command Search** | `CMD+K` instant search across all coins |
| 🏆 **Top Movers** | Real-time biggest 24h gainers/losers |
| 📈 **Market Dominance** | Visual BTC/ETH/altcoin dominance bars |

---

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + Glassmorphism design system
- **Data Fetching**: TanStack Query v5 (SSR + client-side caching)
- **Charts**: Recharts
- **APIs**: CoinGecko · Alternative.me · CryptoPanic
- **Deployment**: Vercel (Edge runtime on API routes)
- **CI/CD**: GitHub Actions → Vercel auto-deploy

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/talons.git
cd talons
npm install
```

### 2. Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
# Required for news feed — free at https://cryptopanic.com/developers/api/
CRYPTOPANIC_TOKEN=your_token_here

# Optional — CoinGecko Pro key for higher rate limits
# COINGECKO_API_KEY=your_key_here

# Your deployed URL (for metadata)
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### 3. Run

```bash
npm run dev
# → http://localhost:3000
```

---

## 🌐 Deploy to Vercel

### Option A: One-Click (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/talons&env=CRYPTOPANIC_TOKEN,NEXT_PUBLIC_APP_URL&envDescription=API%20tokens%20for%20Talons&envLink=https://github.com/YOUR_USERNAME/talons%23environment-variables)

### Option B: Manual via Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

### Option C: GitHub Actions Auto-Deploy

Set these secrets in your GitHub repo → **Settings → Secrets → Actions**:

| Secret | Where to get it |
|---|---|
| `VERCEL_TOKEN` | [vercel.com/account/tokens](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | Run `vercel link` locally → `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | Same as above |

Then every push to `main` auto-deploys to production. PRs get preview URLs.

---

## 📁 Project Structure

```
talons/
├── app/
│   ├── api/
│   │   ├── coins/route.ts          # GET /api/coins
│   │   ├── global/route.ts         # GET /api/global
│   │   ├── coin/[id]/route.ts      # GET /api/coin/:id
│   │   ├── news/route.ts           # GET /api/news
│   │   ├── fear-greed/route.ts     # GET /api/fear-greed
│   │   └── health/route.ts         # GET /api/health
│   ├── coin/[id]/page.tsx          # SSR coin detail page
│   ├── layout.tsx                  # Root layout + metadata
│   ├── page.tsx                    # SSR home page
│   └── globals.css
├── components/
│   ├── Dashboard.tsx               # Main client dashboard
│   ├── Providers.tsx               # TanStack Query provider
│   ├── layout/
│   │   ├── GlobalHeader.tsx        # Market stats bar
│   │   ├── Sidebar.tsx             # Fear & Greed, movers, dominance
│   │   └── CommandBar.tsx          # CMD+K search modal
│   ├── market/
│   │   ├── CoinTable.tsx           # Sortable/paginated table
│   │   └── Sparkline.tsx           # 7d mini chart
│   ├── detail/
│   │   ├── CoinDetailPage.tsx      # Full coin detail view
│   │   └── PriceChart.tsx          # Interactive area chart
│   ├── portfolio/
│   │   ├── PortfolioView.tsx       # P&L portfolio table
│   │   └── AddPositionModal.tsx    # Add coin modal
│   ├── news/
│   │   └── NewsCard.tsx            # News article card
│   └── ui/
│       ├── GlassCard.tsx           # Glassmorphism card
│       ├── Skeleton.tsx            # Loading skeleton
│       ├── PctBadge.tsx            # % change badge
│       └── FearGreedGauge.tsx      # SVG radial gauge
├── hooks/
│   ├── useCoins.ts
│   ├── useGlobal.ts
│   ├── useCoinDetail.ts
│   ├── useNews.ts
│   ├── useFearGreed.ts
│   └── usePortfolio.ts             # localStorage portfolio
├── services/
│   ├── coingecko.ts               # CoinGecko API client
│   ├── cryptopanic.ts             # CryptoPanic client
│   └── alternativeMe.ts           # Fear & Greed client
├── types/
│   ├── coin.ts
│   ├── global.ts
│   ├── news.ts
│   └── portfolio.ts
├── lib/
│   ├── format.ts                  # fmt.usd, fmt.pct, fmt.supply
│   └── utils.ts                   # cn() utility
├── .github/
│   └── workflows/
│       ├── deploy.yml             # Production deploy on push to main
│       └── ci.yml                 # Type check + lint on every PR
├── vercel.json                    # Vercel config
├── next.config.mjs                # Next.js config
└── tailwind.config.ts
```

---

## 🔌 API Reference

All API routes are proxied through Next.js — your API tokens stay server-side and are never exposed to the client.

| Route | Method | Description | Cache |
|---|---|---|---|
| `/api/coins` | GET | Market list (page, per_page params) | 60s |
| `/api/global` | GET | Global market statistics | 120s |
| `/api/coin/:id` | GET | Coin detail or chart (action param) | 30s |
| `/api/news` | GET | CryptoPanic news feed | 5min |
| `/api/fear-greed` | GET | Fear & Greed index | 1hr |
| `/api/health` | GET | Health check | no-cache |

---

## 📊 Rate Limits (Free Tier)

| API | Rate Limit | Notes |
|---|---|---|
| CoinGecko | 30 req/min | Use COINGECKO_API_KEY for Pro |
| Alternative.me | No limit | Cached 1hr |
| CryptoPanic | 5 req/min | Cached 5min |

---

## 🔑 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `CRYPTOPANIC_TOKEN` | Recommended | Get free at [cryptopanic.com](https://cryptopanic.com/developers/api/) |
| `COINGECKO_API_KEY` | Optional | Pro key for higher rate limits |
| `NEXT_PUBLIC_APP_URL` | Recommended | Your deployed URL for SEO metadata |

---

## 📜 License

MIT © Talons
