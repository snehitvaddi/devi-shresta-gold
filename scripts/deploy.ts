#!/usr/bin/env npx tsx
/**
 * Deploy to Vercel
 *
 * Usage:
 *   npx tsx scripts/deploy.ts --org "business-name" [--prod]
 *
 * Reads:
 *   orgs/<org>/config.ts   - Site config
 *   orgs/<org>/data.json   - Business data
 *
 * Actions:
 *   1. Validates org data and config exist
 *   2. Sets required environment variables
 *   3. Triggers Vercel deployment
 */

import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

// ── Parse CLI Arguments ──

function parseArgs(argv: string[]): Record<string, string | boolean> {
  const args: Record<string, string | boolean> = {};
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      if (i + 1 < argv.length && !argv[i + 1].startsWith("--")) {
        args[key] = argv[++i];
      } else {
        args[key] = true;
      }
    }
  }
  return args;
}

const args = parseArgs(process.argv);

if (!args.org) {
  console.error("Usage: npx tsx scripts/deploy.ts --org <name> [--prod]");
  console.error("");
  console.error("Required:");
  console.error("  --org     Business name / org ID (kebab-case)");
  console.error("");
  console.error("Optional:");
  console.error("  --prod    Deploy to production (default: preview)");
  process.exit(1);
}

const org = args.org as string;
const isProduction = !!args.prod;

// ── Paths ──

const ROOT = path.resolve(__dirname, "..");
const ORG_DIR = path.join(ROOT, "orgs", org);
const DATA_PATH = path.join(ORG_DIR, "data.json");
const CONFIG_PATH = path.join(ORG_DIR, "config.ts");

// ── Validate ──

function validate(): boolean {
  let valid = true;

  if (!fs.existsSync(DATA_PATH)) {
    console.error(`Missing: orgs/${org}/data.json`);
    valid = false;
  }

  if (!fs.existsSync(CONFIG_PATH)) {
    console.error(`Missing: orgs/${org}/config.ts`);
    valid = false;
  }

  if (!valid) {
    console.error("");
    console.error("Run the following first:");
    console.error(`  npx tsx scripts/scout.ts --org "${org}" --domain <type>`);
    console.error(`  npx tsx scripts/generate-site.ts --org "${org}"`);
  }

  return valid;
}

// ── Environment Variables ──

interface EnvVars {
  NEXT_PUBLIC_ORG_ID: string;
  NEXT_PUBLIC_ORG_DOMAIN: string;
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  ANTHROPIC_API_KEY: string;
  WHATSAPP_VERIFY_TOKEN: string;
  WHATSAPP_ACCESS_TOKEN: string;
  WHATSAPP_PHONE_NUMBER_ID: string;
}

function getRequiredEnvVars(orgData: Record<string, unknown>): Partial<EnvVars> {
  return {
    NEXT_PUBLIC_ORG_ID: org,
    NEXT_PUBLIC_ORG_DOMAIN: orgData.domain as string,
  };
}

function checkEnvVars(): string[] {
  const missing: string[] = [];
  const required = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "ANTHROPIC_API_KEY",
  ];

  for (const key of required) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  return missing;
}

// ── Shell Helper ──

function run(cmd: string, opts?: { silent?: boolean }): string {
  if (!opts?.silent) {
    console.log(`  $ ${cmd}`);
  }
  try {
    return execSync(cmd, { cwd: ROOT, encoding: "utf-8", stdio: opts?.silent ? "pipe" : "inherit" }) || "";
  } catch {
    throw new Error(`Command failed: ${cmd}`);
  }
}

// ── Set Vercel Env Vars ──

function setVercelEnvVars(vars: Record<string, string>) {
  const target = isProduction ? "production" : "preview";
  for (const [key, value] of Object.entries(vars)) {
    console.log(`  Setting ${key} for ${target} ...`);
    try {
      // Remove existing value first (ignore error if not set)
      try {
        execSync(`echo "${value}" | vercel env rm ${key} ${target} -y`, {
          cwd: ROOT,
          encoding: "utf-8",
          stdio: "pipe",
        });
      } catch {
        // Ignore - var might not exist yet
      }
      execSync(`echo "${value}" | vercel env add ${key} ${target}`, {
        cwd: ROOT,
        encoding: "utf-8",
        stdio: "pipe",
      });
    } catch {
      console.warn(`  Warning: Could not set ${key}. Set it manually in Vercel dashboard.`);
    }
  }
}

// ── Main ──

async function main() {
  console.log("");
  console.log(`=== Deploy: ${org} ===`);
  console.log(`Environment: ${isProduction ? "PRODUCTION" : "preview"}`);
  console.log("");

  // Step 1: Validate
  console.log("[1/4] Validating ...");
  if (!validate()) {
    process.exit(1);
  }
  console.log("  All files present.");
  console.log("");

  // Step 2: Check env vars
  console.log("[2/4] Checking environment ...");
  const missing = checkEnvVars();
  if (missing.length > 0) {
    console.warn("  Warning: Missing environment variables:");
    missing.forEach((v) => console.warn(`    - ${v}`));
    console.warn("  These must be set in Vercel or .env.local");
  } else {
    console.log("  All environment variables set.");
  }
  console.log("");

  // Step 3: Set Vercel env vars
  console.log("[3/4] Setting Vercel environment variables ...");
  const orgData = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
  const envVars = getRequiredEnvVars(orgData);
  setVercelEnvVars(envVars as Record<string, string>);
  console.log("");

  // Step 4: Deploy
  console.log("[4/4] Deploying ...");
  const deployCmd = isProduction ? "vercel --prod" : "vercel";
  try {
    run(deployCmd);
    console.log("");
    console.log("Deployment triggered successfully!");
  } catch {
    console.error("");
    console.error("Deployment failed. Make sure:");
    console.error("  1. Vercel CLI is installed: npm i -g vercel");
    console.error("  2. You are logged in: vercel login");
    console.error("  3. Project is linked: vercel link");
    process.exit(1);
  }

  console.log("");
}

main().catch((err) => {
  console.error("Deploy failed:", err);
  process.exit(1);
});
