#!/usr/bin/env npx tsx
/**
 * Generate Site Configuration from Scout Data
 *
 * Usage:
 *   npx tsx scripts/generate-site.ts --org "business-name"
 *
 * Reads:
 *   orgs/<org>/data.json     - Business data
 *   research/<org>/          - Raw research data
 *
 * Generates:
 *   orgs/<org>/config.ts     - Site configuration
 *   orgs/<org>/products.json - Product catalog
 */

import * as fs from "fs";
import * as path from "path";

// ── Parse CLI Arguments ──

function parseArgs(argv: string[]): Record<string, string> {
  const args: Record<string, string> = {};
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith("--") && i + 1 < argv.length) {
      const key = arg.slice(2);
      args[key] = argv[++i];
    }
  }
  return args;
}

const args = parseArgs(process.argv);

if (!args.org) {
  console.error("Usage: npx tsx scripts/generate-site.ts --org <name>");
  console.error("");
  console.error("Required:");
  console.error("  --org    Business name / org ID (kebab-case)");
  process.exit(1);
}

const { org } = args;

// ── Paths ──

const ROOT = path.resolve(__dirname, "..");
const ORG_DIR = path.join(ROOT, "orgs", org);
const RESEARCH_DIR = path.join(ROOT, "research", org);
const DATA_PATH = path.join(ORG_DIR, "data.json");

// ── Validate ──

if (!fs.existsSync(DATA_PATH)) {
  console.error(`Error: orgs/${org}/data.json not found.`);
  console.error(`Run scout first: npx tsx scripts/scout.ts --org "${org}" --domain <type>`);
  process.exit(1);
}

// ── Domain Section Defaults ──

interface SectionDef {
  type: string;
  title: string;
  order: number;
  enabled: boolean;
}

const DOMAIN_SECTIONS: Record<string, SectionDef[]> = {
  jewelry: [
    { type: "hero", title: "Hero", order: 1, enabled: true },
    { type: "featured-products", title: "Featured Collection", order: 2, enabled: true },
    { type: "categories", title: "Categories", order: 3, enabled: true },
    { type: "about-snippet", title: "Our Story", order: 4, enabled: true },
    { type: "testimonials", title: "Testimonials", order: 5, enabled: true },
    { type: "instagram-feed", title: "Instagram", order: 6, enabled: true },
    { type: "contact-cta", title: "Visit Us", order: 7, enabled: true },
    { type: "map", title: "Location", order: 8, enabled: true },
  ],
  healthcare: [
    { type: "hero", title: "Hero", order: 1, enabled: true },
    { type: "services", title: "Our Services", order: 2, enabled: true },
    { type: "doctors", title: "Our Doctors", order: 3, enabled: true },
    { type: "booking", title: "Book Appointment", order: 4, enabled: true },
    { type: "testimonials", title: "Patient Reviews", order: 5, enabled: true },
    { type: "contact-cta", title: "Contact Us", order: 6, enabled: true },
    { type: "map", title: "Find Us", order: 7, enabled: true },
  ],
  restaurant: [
    { type: "hero", title: "Hero", order: 1, enabled: true },
    { type: "menu", title: "Our Menu", order: 2, enabled: true },
    { type: "about-snippet", title: "Our Story", order: 3, enabled: true },
    { type: "gallery", title: "Gallery", order: 4, enabled: true },
    { type: "testimonials", title: "Reviews", order: 5, enabled: true },
    { type: "booking", title: "Reservations", order: 6, enabled: true },
    { type: "contact-cta", title: "Contact", order: 7, enabled: true },
    { type: "map", title: "Find Us", order: 8, enabled: true },
  ],
  salon: [
    { type: "hero", title: "Hero", order: 1, enabled: true },
    { type: "services", title: "Services", order: 2, enabled: true },
    { type: "pricing", title: "Pricing", order: 3, enabled: true },
    { type: "gallery", title: "Gallery", order: 4, enabled: true },
    { type: "testimonials", title: "Client Reviews", order: 5, enabled: true },
    { type: "booking", title: "Book Now", order: 6, enabled: true },
    { type: "instagram-feed", title: "Follow Us", order: 7, enabled: true },
    { type: "contact-cta", title: "Get In Touch", order: 8, enabled: true },
    { type: "map", title: "Location", order: 9, enabled: true },
  ],
};

// ── Feature Flags by Domain ──

const DOMAIN_FEATURES: Record<string, object> = {
  jewelry: {
    aiChat: true,
    visualSearch: true,
    whatsappCms: true,
    booking: false,
    instagramFeed: true,
    googleMap: true,
  },
  healthcare: {
    aiChat: true,
    visualSearch: false,
    whatsappCms: true,
    booking: true,
    instagramFeed: false,
    googleMap: true,
  },
  restaurant: {
    aiChat: true,
    visualSearch: false,
    whatsappCms: true,
    booking: true,
    instagramFeed: true,
    googleMap: true,
  },
  salon: {
    aiChat: true,
    visualSearch: false,
    whatsappCms: true,
    booking: true,
    instagramFeed: true,
    googleMap: true,
  },
};

// ── Generate Config ──

async function generateConfig(orgData: Record<string, unknown>) {
  const domainType = orgData.domain as string;
  const sections = DOMAIN_SECTIONS[domainType] || DOMAIN_SECTIONS.jewelry;
  const features = DOMAIN_FEATURES[domainType] || DOMAIN_FEATURES.jewelry;

  const config = {
    orgId: org,
    domain: domainType,
    sections,
    featureFlags: features,
    whatsapp: orgData.phone
      ? {
          phoneNumber: orgData.phone as string,
          businessName: orgData.name as string,
        }
      : undefined,
  };

  return config;
}

// ── Generate Products Catalog ──

async function generateProducts(orgData: Record<string, unknown>) {
  console.log("  Generating product catalog ...");

  // Check for research data that might contain product info
  const igPath = path.join(RESEARCH_DIR, "instagram.json");
  const websitePath = path.join(RESEARCH_DIR, "website.json");

  let igData = null;
  let websiteData = null;

  if (fs.existsSync(igPath)) {
    igData = JSON.parse(fs.readFileSync(igPath, "utf-8"));
  }
  if (fs.existsSync(websitePath)) {
    websiteData = JSON.parse(fs.readFileSync(websitePath, "utf-8"));
  }

  // TODO: Use AI to generate product catalog from research data
  // For now, return empty catalog structure
  return {
    orgId: org,
    domain: orgData.domain,
    products: [],
    categories: (orgData.categories as unknown[]) || [],
    generatedAt: new Date().toISOString(),
    sources: {
      instagram: !!igData,
      website: !!websiteData,
    },
  };
}

// ── Generate Config File (TypeScript) ──

function writeConfigTs(config: Record<string, unknown>) {
  const configContent = `import type { OrgConfig } from "@/types";

const config: OrgConfig = ${JSON.stringify(config, null, 2)};

export default config;
`;
  fs.writeFileSync(path.join(ORG_DIR, "config.ts"), configContent);
}

// ── Main ──

async function main() {
  console.log("");
  console.log(`=== Generate Site: ${org} ===`);
  console.log("");

  // Step 1: Load org data
  console.log("[1/3] Loading org data ...");
  const orgData = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
  console.log(`  Name: ${orgData.name}`);
  console.log(`  Domain: ${orgData.domain}`);
  console.log("");

  // Step 2: Generate config
  console.log("[2/3] Generating site config ...");
  const config = await generateConfig(orgData);
  writeConfigTs(config as unknown as Record<string, unknown>);
  console.log(`  Saved: orgs/${org}/config.ts`);
  console.log(`  Sections: ${(config.sections as SectionDef[]).length} enabled`);
  console.log("");

  // Step 3: Generate product catalog
  console.log("[3/3] Generating product catalog ...");
  const products = await generateProducts(orgData);
  fs.writeFileSync(
    path.join(ORG_DIR, "products.json"),
    JSON.stringify(products, null, 2)
  );
  console.log(`  Saved: orgs/${org}/products.json`);
  console.log(`  Products: ${products.products.length}`);
  console.log("");

  // Summary
  console.log("Site generation complete!");
  console.log("");
  console.log("Generated files:");
  console.log(`  orgs/${org}/config.ts      - Site configuration`);
  console.log(`  orgs/${org}/products.json  - Product catalog`);
  console.log("");
  console.log("Next steps:");
  console.log(`  1. Review and edit the generated config`);
  console.log(`  2. Add product images to Supabase storage`);
  console.log(`  3. Run: npx tsx scripts/deploy.ts --org "${org}"`);
  console.log("");
}

main().catch((err) => {
  console.error("Generation failed:", err);
  process.exit(1);
});
