# QA Test Report -- Any Website Builder (Davis Resta / Devi Shresta Gold & Diamonds)

**Date:** 2026-03-02
**Tester:** QA Testing Lead (Automated)
**Environment:** localhost:3000 (Next.js 16.1.6 dev server, Turbopack)
**Org ID:** davis-resta
**Domain:** jewelry

---

## Summary

| Metric         | Count |
|----------------|-------|
| **Total Tests**    | 62    |
| **Passed**         | 44    |
| **Failed**         | 12    |
| **Warnings**       | 6     |

---

## Phase 1: Page Load Tests

| Page | Route | HTTP Status | Title/Metadata | Sections Present | Data Rendered | Issues |
|------|-------|-------------|----------------|------------------|---------------|--------|
| Homepage | `/` | 200 | `{orgData.name} \| {tagline}` = "Devi Shresta Gold & Diamonds \| Where Tradition Meets Timeless Elegance" | 9/9 (Hero, PromoBanner, CategoryShowcase, ProductGrid, AboutSnippet, ReviewMarquee, InstagramFeed, ContactSection, MapEmbed) | Business name, tagline, featured products, reviews, contact info, social links | None -- all sections render |
| Collections | `/collections` | 200 | `Collections \| {name}` | ProductGrid with filters, category tabs, product cards | 30 products with prices, filter tabs for 9 categories | Products use local image paths that do not exist (see Critical Issue #1) |
| Product Detail | `/collections/lakshmi-temple-gold-necklace` | **500** | **N/A (Error page)** | **Error page rendered** | **None** | **CRITICAL: 500 Internal Server Error on ALL product detail pages** |
| Product Detail | `/collections/diamond-choker-necklace-set` | **500** | **N/A** | **Error page** | **None** | **Same 500 error on all product slugs** |
| About | `/about` | 200 | `About Us \| {name}` | Hero image, story section, features grid (12 features), values grid (4 cards), ReviewCarousel testimonials | Business name, description, tagline, features | None |
| Contact | `/contact` | 200 | `Contact Us \| {name}` | ContactSection (form + info), MapEmbed | Phone, email, address, business hours, contact form | Map shows fallback (no Google Maps API key) |
| Booking | `/booking` | 200 | `Book an Appointment \| {name}` | BookingForm | Service dropdown, date picker, time slots | Minimal page -- just the form component |
| Book | `/book` | 200 | `Book an Appointment` | Services overview, BookingForm, business hours, testimonial | Phone, hours, services, testimonial | More complete booking page with additional context |
| Products | `/products` | 200 | `Our Collections` | ProductGrid with filters | All 30 products | Duplicate of `/collections` -- potential SEO concern |
| 404 Test | `/nonexistent` | 404 | -- | -- | -- | Properly returns 404 |

---

## Phase 2: API Endpoint Tests

| Endpoint | Method | Request | HTTP Status | Response Valid | Issues |
|----------|--------|---------|-------------|---------------|--------|
| `/api/gold-price` | GET | -- | 200 | `{"price24K":87500,"price22K":80200,"price18K":65600,"silverPrice":99500,"change24K":250,"currency":"INR","unit":"per 10g","lastUpdated":"2026-03-02T..."}` | Uses fallback prices (GOLD_API_KEY is placeholder) |
| `/api/booking` | GET | `?date=2026-03-05` (Thu) | 200 | 18 slots from 09:00-18:00, all available | Slots use DEFAULT_SCHEDULE (09:00-18:00) NOT actual business hours from data.json (10:00-21:00). See Major Issue #2 |
| `/api/booking` | GET | `?date=2026-03-09` (Sun) | 200 | `{"date":"2026-03-09","slots":[]}` | Sunday returns empty (calendar default=closed), but data.json says Sunday is open (10:00-21:00). See Major Issue #2 |
| `/api/booking` | POST | Full valid body | 200 | `{"success":true,"bookingId":"bk_1772489383225_geqcct","message":"Appointment booked successfully"}` | Booking created successfully |
| `/api/booking` | POST | Missing fields | 400 | `{"error":"All required fields must be provided"}` | Validation works correctly |
| `/api/contact` | POST | Valid body | 200 | `{"success":true,"message":"Thank you for your message. We will get back to you shortly."}` | Works (console log only, no actual email/CRM integration) |
| `/api/contact` | POST | Empty fields | 400 | `{"error":"Name, email, and message are required"}` | Validation works correctly |
| `/api/chat` | POST | `{"message":"Do you have gold necklaces?"}` | **500** | `{"error":"Failed to process chat message"}` | **CRITICAL: ANTHROPIC_API_KEY is placeholder ("your_anthropic_api_key"). ChatAgent constructor throws "Missing ANTHROPIC_API_KEY" (even though key is set, it is the literal string "your_anthropic_api_key" which is truthy but invalid)** |
| `/api/whatsapp` | GET | Webhook verify with default token | **403** | `{"error":"Verification failed"}` | WHATSAPP_VERIFY_TOKEN in .env.local is "your_verify_token" but code defaults to "any-website-builder-verify". Env value overrides default. See Major Issue #4 |
| `/api/search` | POST | `{"query":"gold necklace"}` | 200 | `{"results":[],"query":"gold necklace"}` | Returns empty -- in-memory search index is never populated on startup. See Major Issue #5 |

---

## Phase 3: Component Presence Check

### Homepage (`/`)
| Component | Present | Notes |
|-----------|---------|-------|
| Header (nav links) | YES | Links: Home, Collections, About, Contact, Book Appointment. WhatsApp icon in nav. |
| GoldPriceTicker | YES | Renders at top of body for jewelry domain. Shows 24K, 22K, 18K, Silver prices. Fetches from `/api/gold-price`. |
| Hero | YES | Unsplash background image, business name as gradient text, tagline, two CTAs |
| PromoBanner | YES | 5 promo slides: Bridal 2026, Gold Savings, Old Gold Exchange, Diamond Collection, Temple Jewelry Festival |
| CategoryShowcase | YES | 9 categories from orgData.categories |
| ProductGrid | YES | Featured products (8 featured), limit=6, no filter tabs shown |
| AboutSnippet | YES | Business name, description, tagline, features array |
| ReviewMarquee | YES | 10 Google reviews, overall rating 4.6/5, 185 reviews |
| InstagramFeed | YES | 8 Instagram posts with Unsplash images, links to real Instagram reels/posts |
| ContactSection | YES | Contact form (name, email, phone, message), address, phone, email, business hours grid |
| MapEmbed | YES | Fallback mode (no Google Maps API key) -- shows "View on Google Maps" link |
| Footer | YES | Business name, description, quick links, contact info, social media (Instagram, Facebook, WhatsApp), copyright |
| ChatWidget | YES | Fixed bottom-right button, opens chat window, sends to `/api/chat` |
| WhatsAppButton | YES | Fixed bottom-right green button, links to `wa.me/917337372922` |

### All Pages (Layout Components)
| Component | Present | Notes |
|-----------|---------|-------|
| Header | YES | Consistent across all pages |
| GoldPriceTicker | YES | Shows on all pages (jewelry domain check in layout) |
| Footer | YES | Consistent across all pages |
| ChatWidget | YES | Present on all pages |
| WhatsAppButton | YES | Present on all pages |

### Collections (`/collections`)
| Component | Present | Notes |
|-----------|---------|-------|
| ProductGrid with filters | YES | Shows all 30 products with 9 category filter tabs |
| ProductCard with prices | YES | Each card shows name, short description, price range, category badge, "Enquire Now" button |

### About (`/about`)
| Component | Present | Notes |
|-----------|---------|-------|
| Hero section | YES | Unsplash image background with "Our Story" heading |
| Business story | YES | orgData.description rendered |
| Features grid | YES | 12 features from orgData.features in 2-column grid |
| Values grid | YES | 4 values: Exceptional Quality, Passion for Craft, Trust & Integrity, Heritage of Excellence |
| ReviewCarousel | YES | Uses orgData.testimonials (5 testimonials) |

### Contact (`/contact`)
| Component | Present | Notes |
|-----------|---------|-------|
| Contact form | YES | Name (required), email (required), phone (optional), message (required) |
| Contact info | YES | Address, phone, email displayed |
| Business hours | YES | Full 7-day grid |
| MapEmbed | YES | Fallback mode (no API key) |

### Booking (`/booking`) and Book (`/book`)
| Component | Present | Notes |
|-----------|---------|-------|
| BookingForm | YES | Name, phone, email, service dropdown, date picker (min=tomorrow), time dropdown, notes textarea |
| Service dropdown | YES | 5 services: Consultation, Custom Design, Ring Sizing, Jewelry Cleaning, Valuation |
| Date picker | YES | HTML date input with min=tomorrow |
| Time slots | YES | 15 hardcoded time slots from 10:00 AM to 5:00 PM (BookingForm component) |
| Business hours | YES (book only) | Full hours grid on `/book` page |

---

## Phase 4: Data Integrity Check

### Products Data (`orgs/davis-resta/products.json`)

| Check | Result | Details |
|-------|--------|---------|
| Total products | 30 | All in single array under `products` key |
| All have `id` | YES | prod-001 through prod-030 |
| All have `name` | YES | All products have descriptive names |
| All have `slug` | YES | Slugs are URL-friendly |
| All have `price` | YES | Range: INR 12,000 (nose ring) to INR 850,000 (bridal set) |
| All have `currency` | YES | All "INR" |
| All have `category` | YES | 9 categories represented |
| All have `images` | YES | Each has 1 image with `url`, `alt`, `isPrimary`, `order` |
| All have `inStock` | YES | All products are in stock |
| Image URLs valid | **FAIL** | **ALL 30 products use local paths like `/images/products/temple-necklace-001.jpg` -- these files do NOT exist in `public/` directory. The `public/images/products/` directory does not exist at all.** |
| Missing `createdAt` | **WARNING** | Product type requires `createdAt: string` but none of the 30 products have this field. TypeScript compiles because the JSON is cast. |
| Missing `updatedAt` | **WARNING** | Same as above for `updatedAt`. |
| Featured products | 8 | prod-001, 002, 003, 004, 007, 010, 013, 015, 016 |
| Category distribution | Correct | necklaces(4), bangles(3), rings(3), earrings(4), pendants(3), bridal(5), temple(2), mens(3), coins(3) |
| `categories` array in products.json | Correct | 9 categories with images, descriptions, and product counts matching actual data |

### Org Data (`orgs/davis-resta/data.json`)

| Check | Result | Details |
|-------|--------|---------|
| Name | "Devi Shresta Gold & Diamonds" | Correct |
| Phone | "+91-7337372922" | Present and valid Indian mobile |
| Email | "info@devishrestagold.com" | Present |
| Address | Governorpet, Vijayawada, AP 520002 | Complete with coordinates |
| Business hours | 7 days, 10:00-21:00 | All days open |
| Categories | 9 | With IDs, names, slugs, descriptions, order |
| Testimonials | 5 | Each with ID, name, location, rating, title, body, verified flag, date |
| Trust badges | 6 | BIS Hallmarked, Certified Diamonds, 100% Exchange, Custom Designs, Easy EMI, Lifetime Service |
| Social links | 4 | Instagram, Facebook, WhatsApp, Google Maps |
| Brand colors | Present | Primary #7B1F3A, secondary #D4AF37, accent #B76E79 |
| SEO data | Present | Title, description, 10 keywords |
| Rating | 4.6 / 185 reviews | Present |

### Config Mismatch (`orgs/davis-resta/config.ts`)

| Check | Result | Details |
|-------|--------|---------|
| `orgId` | "davis-resta" | Matches data.json |
| `domain` | "jewelry" | Correct |
| `sectionOverrides` title | **"Davis & Resta Fine Jewelry"** | **MISMATCH: Does not match data.json name "Devi Shresta Gold & Diamonds". The sectionOverrides use a different business name.** |
| Feature flags | All enabled | aiChat, visualSearch, whatsappCms, booking, instagramFeed, googleMap |
| WhatsApp number | "+1234567890" | **MISMATCH: Placeholder number, does not match actual +917337372922** |
| WhatsApp business name | "Davis & Resta Jewelry" | **MISMATCH: Different name from data.json** |
| Analytics | Both undefined | Expected for dev |

---

## Phase 5: Code Quality Check

```
$ npx tsc --noEmit
(no output - clean compilation)
```

**Result: PASS** -- Zero TypeScript errors.

---

## Phase 6: Build Test

```
$ npm run build

Next.js 16.1.6 (Turbopack)
Compiled successfully in 892.3ms
TypeScript: OK
Static pages: 16/16 generated in 145.6ms

Routes:
  Static:  /, /_not-found, /about, /book, /booking, /collections, /contact, /products
  Dynamic: /api/booking, /api/chat, /api/contact, /api/gold-price, /api/search, /api/whatsapp, /collections/[slug]
```

**Result: PASS** -- Build succeeds with zero errors and zero warnings.

---

## Issues Found (Prioritized)

### Critical (Blocks Launch)

#### C1. Product Detail Pages Return 500 Internal Server Error
- **Affected:** ALL product detail pages (`/collections/[slug]`)
- **Severity:** CRITICAL
- **Root Cause:** The product detail page (`src/app/collections/[slug]/page.tsx`) uses Next.js `<Image>` component with product image URLs from products.json. All 30 products reference local paths like `/images/products/temple-necklace-001.jpg`, but the `public/images/products/` directory does NOT exist. The Next.js Image component fails to resolve these paths at render time, causing a 500 error.
- **Impact:** Users cannot view any individual product details. Clicking any product card from the collections page leads to a server error.
- **Fix Required:** Either:
  1. Create the `public/images/products/` directory and add actual product images, OR
  2. Update all product image URLs in `products.json` to use valid Unsplash URLs (like the rest of the site does for hero/about/instagram images), OR
  3. Add error handling in the Image component to gracefully degrade when images are missing.

#### C2. AI Chat API Returns 500 -- No Valid Anthropic API Key
- **Affected:** `/api/chat` endpoint, ChatWidget component
- **Severity:** CRITICAL
- **Root Cause:** The `.env.local` file has `ANTHROPIC_API_KEY=your_anthropic_api_key` (a placeholder string). The `ChatAgent` constructor checks `if (!apiKey)` which passes (string is truthy), but the Anthropic SDK then fails when trying to authenticate with this invalid key.
- **Impact:** The AI chat concierge -- a core feature of the platform -- is completely non-functional. Users see an error response when they try to chat.
- **Fix Required:** Set a valid Anthropic API key in `.env.local`, or add graceful degradation in the chat widget when the API is unavailable (e.g., show a fallback message suggesting phone/WhatsApp contact).

#### C3. Product Images Do Not Exist
- **Affected:** All product cards on `/collections`, `/products`, and homepage ProductGrid
- **Severity:** CRITICAL
- **Root Cause:** All 30 products in `products.json` reference local image paths (`/images/products/*.jpg`) but no such images exist in the `public/` directory. The `public/` directory only contains SVG placeholder files (file.svg, globe.svg, etc.).
- **Impact:** Product cards likely show broken images or "No Image" fallback. The `<Image>` component in ProductCard.tsx may render but display nothing visible.
- **Fix Required:** Add product images to `public/images/products/` or update URLs to use Unsplash images.

### Major (Should Fix Before Launch)

#### M1. Booking System Uses Hardcoded Default Schedule, Ignores Business Hours
- **Affected:** `/api/booking` GET endpoint, slot generation
- **Severity:** MAJOR
- **Root Cause:** The booking calendar (`src/lib/booking/calendar.ts`) uses a `DEFAULT_SCHEDULE` (Mon-Fri 09:00-18:00, Sat 10:00-16:00, Sun closed), but the actual business hours in `data.json` are Mon-Sun 10:00-21:00. The calendar module never reads the org's actual business hours.
- **Impact:**
  - Booking slots are generated for 09:00-18:00 instead of the actual 10:00-21:00
  - Sunday shows NO slots even though the store is open on Sundays
  - Saturday shows 10:00-16:00 instead of 10:00-21:00
  - Customers may see wrong availability and miss valid appointment times
- **Fix Required:** The `getCalendarConfig()` function should read the org's business hours from `data.json` instead of using hardcoded defaults. Alternatively, the calendar initialization should sync with org data.

#### M2. BookingForm Time Slots Don't Match Actual Business Hours
- **Affected:** BookingForm component (used on `/booking` and `/book`)
- **Severity:** MAJOR
- **Root Cause:** The BookingForm component (`src/components/BookingForm.tsx`) has hardcoded time slots from "10:00 AM" to "5:00 PM" (15 slots). The business hours are 10:00-21:00 (10 AM to 9 PM), meaning evening slots from 5:30 PM to 8:30 PM are missing from the form.
- **Impact:** Customers cannot book appointments during the last 4 hours of the business day (5:30 PM - 9:00 PM).
- **Fix Required:** Either dynamically generate time slots from business hours, or extend the hardcoded list to match actual closing time.

#### M3. Config File Names Mismatch Business Data
- **Affected:** `orgs/davis-resta/config.ts`
- **Severity:** MAJOR
- **Details:**
  - `sectionOverrides` use title "Davis & Resta Fine Jewelry" but actual business name is "Devi Shresta Gold & Diamonds"
  - `whatsapp.phoneNumber` is "+1234567890" (placeholder) instead of actual "+917337372922"
  - `whatsapp.businessName` is "Davis & Resta Jewelry" instead of "Devi Shresta Gold & Diamonds"
- **Impact:** If section overrides are applied, the wrong business name would display. WhatsApp config has wrong number.
- **Fix Required:** Update config.ts to match data.json values.

#### M4. WhatsApp Webhook Verification Fails
- **Affected:** `/api/whatsapp` GET endpoint
- **Severity:** MAJOR
- **Root Cause:** `.env.local` sets `WHATSAPP_VERIFY_TOKEN=your_verify_token` which overrides the default "any-website-builder-verify" in code. Neither token is the correct Meta-assigned verification token.
- **Impact:** WhatsApp Business API integration cannot be activated. Webhook verification will fail during Meta setup.
- **Fix Required:** Set the correct WhatsApp verify token in `.env.local`.

#### M5. Search API Returns No Results
- **Affected:** `/api/search` endpoint
- **Severity:** MAJOR
- **Root Cause:** The visual search system uses an in-memory index (`src/lib/visual-search/search.ts`) that starts empty. There is no initialization code that populates the index with product data on server startup.
- **Impact:** Text search and image search return zero results for all queries.
- **Fix Required:** Add an initialization step that builds the search index from products.json on startup, or populate it lazily on first search request.

### Minor (Nice to Have)

#### m1. Footer Hardcodes "(Mon-Sat)" for Business Hours
- **Affected:** Footer component, line 99
- **Severity:** MINOR
- **Details:** The Footer renders `(Mon-Sat)` as static text next to the business hours, but the actual data shows the store is open all 7 days including Sunday.
- **Fix:** Either dynamically determine open days from businessHours data, or update the hardcoded text.

#### m2. Google Maps Not Rendering (Missing API Key)
- **Affected:** MapEmbed component on `/`, `/contact`
- **Severity:** MINOR
- **Details:** `NEXT_PUBLIC_GOOGLE_MAPS_KEY` is not set (the `.env.local` uses `GOOGLE_MAPS_API_KEY` and `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` while the MapEmbed component checks `NEXT_PUBLIC_GOOGLE_MAPS_KEY` -- different variable name). Even if set, the env var name does not match.
- **Impact:** Map shows fallback "View on Google Maps" link instead of embedded map.
- **Fix:** Either change env var name in MapEmbed to match `.env.local`, or update `.env.local` to add `NEXT_PUBLIC_GOOGLE_MAPS_KEY`.

#### m3. Contact Form Phone Placeholder Uses US Format
- **Affected:** ContactSection and BookingForm components
- **Severity:** MINOR
- **Details:** The phone placeholder shows "+1 (555) 000-0000" (US format) but the business is in India. Should be Indian format like "+91 XXXXX XXXXX".
- **Fix:** Update placeholder to match locale.

#### m4. Product Type Missing Optional Fields
- **Affected:** Type definitions vs actual data
- **Severity:** MINOR
- **Details:** The `Product` type defines `createdAt` and `updatedAt` as required `string` fields, but none of the 30 products in products.json have these fields. TypeScript compiles because the JSON is loaded via `JSON.parse` which bypasses type checking.
- **Fix:** Either make these fields optional in the type definition (`createdAt?: string`) or add timestamps to products.json.

#### m5. Duplicate Routes: `/collections` and `/products`
- **Affected:** SEO, navigation
- **Severity:** MINOR
- **Details:** Both `/collections` and `/products` render essentially the same product catalog page. This could cause SEO duplicate content issues.
- **Fix:** Remove one route or add a canonical redirect from `/products` to `/collections`.

#### m6. Gold Price API Uses Fallback Prices
- **Affected:** GoldPriceTicker, `/api/gold-price`
- **Severity:** MINOR
- **Details:** `GOLD_API_KEY` is not set, so the API always returns hardcoded fallback prices. The prices may become stale.
- **Impact:** Gold prices shown are static and may not reflect actual market prices.
- **Fix:** Set a valid Gold API key or implement a free alternative price source.

---

## Data Consistency Matrix

| Data Point | data.json | config.ts | Components | Match? |
|------------|-----------|-----------|------------|--------|
| Business Name | "Devi Shresta Gold & Diamonds" | "Davis & Resta Fine Jewelry" / "Davis & Resta Jewelry" | Renders from data.json | MISMATCH in config |
| Phone | +91-7337372922 | N/A | Renders in Footer, Contact, Book page | OK |
| WhatsApp | +917337372922 | +1234567890 | Uses data.json socialLinks.whatsapp | MISMATCH in config |
| Business Hours | 10:00-21:00 (7 days) | N/A | Renders correctly in UI, but booking slots use different hours | MISMATCH in booking |
| Address | Governorpet, Vijayawada, AP 520002 | N/A | Renders correctly | OK |
| Email | info@devishrestagold.com | N/A | Renders correctly | OK |
| Product Count | 30 products | N/A | All render on collections page | OK |
| Categories | 9 | N/A | All render as filter tabs | OK |
| Rating | 4.6 / 185 reviews | N/A | Renders in ReviewMarquee | OK |

---

## Environment Configuration Status

| Variable | Value | Status |
|----------|-------|--------|
| `NEXT_PUBLIC_ORG_ID` | davis-resta | OK |
| `NEXT_PUBLIC_DOMAIN` | jewelry | OK |
| `ANTHROPIC_API_KEY` | your_anthropic_api_key | PLACEHOLDER -- Chat broken |
| `GOLD_API_KEY` | (not set) | MISSING -- Uses fallback prices |
| `WHATSAPP_PHONE_NUMBER_ID` | your_phone_number_id | PLACEHOLDER |
| `WHATSAPP_ACCESS_TOKEN` | your_access_token | PLACEHOLDER |
| `WHATSAPP_VERIFY_TOKEN` | your_verify_token | PLACEHOLDER -- Mismatches code default |
| `WHATSAPP_BUSINESS_ACCOUNT_ID` | your_business_account_id | PLACEHOLDER |
| `GOOGLE_MAPS_API_KEY` | your_google_maps_api_key | PLACEHOLDER |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | your_google_maps_api_key | PLACEHOLDER (and wrong var name in MapEmbed) |
| `NEXT_PUBLIC_SUPABASE_URL` | your_supabase_url | PLACEHOLDER |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your_supabase_anon_key | PLACEHOLDER |
| `SUPABASE_SERVICE_ROLE_KEY` | your_service_role_key | PLACEHOLDER |

---

## Recommendations

### Immediate (Pre-Launch Blockers)
1. **Add product images** -- Either create `public/images/products/` with actual jewelry images or update `products.json` to use Unsplash URLs. This is the #1 blocker as it breaks product detail pages and degrades product cards.
2. **Set a valid Anthropic API key** or implement a graceful fallback in the chat widget that redirects users to WhatsApp/phone when the AI is unavailable.
3. **Fix the booking calendar** to read actual business hours from org data instead of using hardcoded defaults.

### Before Launch
4. **Update config.ts** to use correct business name, WhatsApp number, and section override titles.
5. **Extend BookingForm time slots** to cover the full 10:00 AM - 9:00 PM business hours.
6. **Fix the MapEmbed env variable name** -- component uses `NEXT_PUBLIC_GOOGLE_MAPS_KEY` but env has `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.
7. **Populate the search index** on startup so text/image search returns results.
8. **Set up WhatsApp API credentials** with correct verify token.

### Post-Launch Improvements
9. Remove or redirect the duplicate `/products` route to `/collections`.
10. Update phone placeholder text to Indian format.
11. Fix Footer "(Mon-Sat)" text to reflect actual 7-day schedule.
12. Add `createdAt`/`updatedAt` fields to products or make them optional in the type.
13. Integrate actual email sending for contact form and booking confirmations (currently console.log only).
14. Set up a real gold price API for live price updates.
15. Add error boundaries around product images so missing images don't crash pages.
