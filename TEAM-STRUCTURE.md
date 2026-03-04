# Any Website Builder — Organization Structure

## Company: Any Website Builder Platform
**Mission:** Spin up a complete digital presence for any local business in any domain.

---

## Arc 1: SCOUT (Research & Intelligence)

> **Purpose:** Gather all data about a business and its industry before building anything.
> **When:** Runs FIRST when a new business is onboarded.
> **Output:** Research package that feeds into the Build arc.

### Team 1.1: Business Intelligence

| Role | Agent | What They Do |
|------|-------|-------------|
| **Instagram Scraper** | `instagram-scraper` | Scrapes the business Instagram — post captions, product types, hashtags, tone, follower count. Outputs `instagram-data.json` + `instagram-analysis.md` |
| **Google Reviews Analyst** | `google-reviews-scraper` | Pulls Google Maps reviews, rating, sentiment. Identifies what customers buy and praise. Outputs `google-reviews.json` + `reviews-analysis.md` |

### Team 1.2: Industry Research

| Role | Agent | What They Do |
|------|-------|-------------|
| **Domain Researcher** | `scout-researcher` | Studies top 5-10 websites in the industry. Extracts design patterns, fonts, colors, layouts, SEO keywords, content tone. Outputs `design-baseline.md` |
| **Competitor Analyzer** | `competitor-analyzer` | Deep-dives competitor sites (Tanishq, Malabar, Kalyan, etc.). Maps section structures, grabs image references, analyzes navigation and conversion patterns. Outputs `competitor-sections.md` + `image-library.json` |
| **Visual Critic** | `visual-critic` | Analyzes screenshots of competitors + business social media. Produces design critique with hierarchy, whitespace, typography, imagery recommendations. Outputs `design-critique.md` |

---

## Arc 2: BUILD (Engineering & Design)

> **Purpose:** Build the actual website, backend systems, and all integrations.
> **When:** Runs AFTER Scout arc delivers the research package.
> **Output:** Working, deployable website with all features.

### Team 2.1: Architecture & Config

| Role | Agent | What They Do |
|------|-------|-------------|
| **Domain Config Builder** | `domain-config-builder` | Creates the domain configuration system — theme tokens (colors, fonts), section definitions, AI prompts, SEO templates for each industry (jewelry, healthcare, restaurant, salon). Builds the data access layer (Supabase client, product CRUD, org loader). Defines all shared TypeScript types. |

### Team 2.2: Frontend

| Role | Agent | What They Do |
|------|-------|-------------|
| **Frontend Developer** | `frontend-dev` | Builds all UI components (Header, Hero, ProductGrid, ProductCard, ReviewMarquee, InstagramFeed, ChatWidget, BookingForm, etc.) and all pages (Homepage, Collections, About, Contact, Booking). Ensures responsive design, animations, and luxury aesthetic. |

### Team 2.3: Backend & Integrations

| Role | Agent | What They Do |
|------|-------|-------------|
| **Backend Engineer** | `backend-engineer` | Builds all core library modules — WhatsApp Cloud API client + webhook + CMS commands, AI chat agent (Anthropic SDK), vision/product identification, human handover logic, visual search with embeddings, booking system (calendar, slots, confirmation), and scraper utilities (Google Maps, Instagram, website analyzer, review aggregator). |

### Team 2.4: Styling & Tooling

| Role | Agent | What They Do |
|------|-------|-------------|
| **Styles & Scripts Builder** | `styles-scripts-builder` | Creates the CSS variable theming system (domain-switchable), Tailwind config, Google Fonts integration, keyframe animations, utility classes. Builds CLI scripts (`scout.ts`, `generate-site.ts`, `deploy.ts`). Updates Next.js config for images/fonts. |

---

## Arc 3: QA (Quality Assurance & Testing)

> **Purpose:** Test everything — pages, APIs, components, data integrity, code quality.
> **When:** Runs AFTER Build arc delivers the site.
> **Output:** QA report with pass/fail for every test, prioritized issue list.

### Team 3.1: Testing

| Role | Agent | What They Do |
|------|-------|-------------|
| **QA Tester** | `qa-tester` | Comprehensive testing across 6 phases: page load testing (every route), API endpoint testing (chat, booking, search, WhatsApp, gold-price, contact), component presence verification, data integrity checks (products.json, data.json), TypeScript compilation check, production build test. Outputs `qa-report.md` with pass/fail matrix. |

---

## Arc 4: DEPLOY (Launch & Operations)

> **Purpose:** Deploy the site and manage post-launch operations.
> **When:** Runs AFTER QA arc signs off.
> **Output:** Live URL, monitoring, ongoing updates.

### Team 4.1: Deployment *(handled by CEO/Coordinator)*

| Role | Agent | What They Do |
|------|-------|-------------|
| **Deployer** | `coordinator` | Runs `vercel` deployment, sets environment variables, configures custom domain, verifies live site. |

### Team 4.2: Support *(Phase 2 — not yet built)*

| Role | Agent | What They Do |
|------|-------|-------------|
| **Site Monitor** | *planned* | Monitors uptime, performance, error rates |
| **Content Updater** | *planned* | Processes WhatsApp CMS commands, updates products |
| **Customer Router** | *planned* | Routes AI handovers to the right human |

---

## Arc 5: CEO (Coordination & Strategy)

> **Purpose:** Orchestrate all arcs, review outputs, make decisions.
> **When:** Always active.

### Team 5.1: Command

| Role | Agent | What They Do |
|------|-------|-------------|
| **CEO / Team Lead** | `coordinator` (you + me) | Triggers new business onboarding, reviews research, approves designs, manages task dependencies, fixes build errors, handles cross-team issues, makes architecture decisions. |

---

## Summary

| Arc | Teams | Agents | Status |
|-----|-------|--------|--------|
| **1. SCOUT** | 2 teams | 5 roles | Done |
| **2. BUILD** | 4 teams | 4 roles | Done |
| **3. QA** | 1 team | 1 role | Running |
| **4. DEPLOY** | 2 teams | 1 built, 3 planned | Phase 2 |
| **5. CEO** | 1 team | 1 role | Active |
| **Total** | **10 teams** | **15 roles** (11 built, 4 planned) | |

---

## Quick Reference: Who Owns What

| File / Module | Owner Agent | Arc |
|---------------|-------------|-----|
| `research/davis-resta/*` | scout-researcher, instagram-scraper, google-reviews-scraper, competitor-analyzer | Scout |
| `domains/*/` | domain-config-builder | Build |
| `src/types/` | domain-config-builder | Build |
| `src/lib/data/` | domain-config-builder | Build |
| `src/components/` | frontend-dev | Build |
| `src/app/` (pages) | frontend-dev | Build |
| `src/app/api/` (routes) | frontend-dev | Build |
| `src/lib/whatsapp/` | backend-engineer | Build |
| `src/lib/ai/` | backend-engineer | Build |
| `src/lib/visual-search/` | backend-engineer | Build |
| `src/lib/booking/` | backend-engineer | Build |
| `src/lib/scraper/` | backend-engineer | Build |
| `src/app/globals.css` | styles-scripts-builder | Build |
| `scripts/` | styles-scripts-builder | Build |
| `qa-report.md` | qa-tester | QA |
| `orgs/davis-resta/` | scout-researcher + domain-config-builder | Scout + Build |

---

## Execution Flow

```
CEO says "GO" on a new business
        │
        ▼
   ┌─────────┐
   │ ARC 1   │  Scout (parallel)
   │ SCOUT   │  ├── instagram-scraper
   │         │  ├── google-reviews-scraper
   │         │  ├── scout-researcher
   │         │  ├── competitor-analyzer
   │         │  └── visual-critic
   └────┬────┘
        │ Research package ready
        ▼
   ┌─────────┐
   │ ARC 2   │  Build (domain-config first, then parallel)
   │ BUILD   │  ├── domain-config-builder  ──► FIRST
   │         │  ├── frontend-dev           ──┐
   │         │  ├── backend-engineer       ──┤ PARALLEL
   │         │  └── styles-scripts-builder ──┘
   └────┬────┘
        │ Site built
        ▼
   ┌─────────┐
   │ ARC 3   │  QA
   │ QA      │  └── qa-tester
   └────┬────┘
        │ All tests pass
        ▼
   ┌─────────┐
   │ ARC 4   │  Deploy
   │ DEPLOY  │  └── coordinator → Live URL
   └─────────┘
```
