import { promises as fs } from 'fs';
import path from 'path';
import type {
  OrgData,
  OrgConfig,
  DomainTheme,
  DomainSections,
  DomainPrompts,
  DomainSeo,
} from '@/types';

const ORGS_DIR = path.join(process.cwd(), 'orgs');
const DOMAINS_DIR = path.join(process.cwd(), 'domains');

// ── Org Data (from JSON) ──

export async function getOrgData(orgId: string): Promise<OrgData> {
  const filePath = path.join(ORGS_DIR, orgId, 'data.json');
  const raw = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(raw) as OrgData;
}

// ── Org Config (dynamic import from .ts) ──

export async function getOrgConfig(orgId: string): Promise<OrgConfig> {
  const mod = await import(`../../../orgs/${orgId}/config`);
  return mod.default ?? mod.orgConfig;
}

// ── Domain Theme ──

export async function getDomainTheme(domain: string): Promise<DomainTheme> {
  const mod = await import(`../../../domains/${domain}/theme`);
  // Each domain exports <domain>Theme as the named export
  const themeKey = Object.keys(mod).find((k) => k.endsWith('Theme'));
  if (themeKey) return mod[themeKey] as DomainTheme;
  return mod.default as DomainTheme;
}

// ── Domain Sections ──

export async function getDomainSections(domain: string): Promise<DomainSections> {
  const mod = await import(`../../../domains/${domain}/sections`);
  const key = Object.keys(mod).find((k) => k.endsWith('Sections'));
  if (key) return mod[key] as DomainSections;
  return mod.default as DomainSections;
}

// ── Domain Prompts ──

export async function getDomainPrompts(domain: string): Promise<DomainPrompts> {
  const mod = await import(`../../../domains/${domain}/prompts`);
  const key = Object.keys(mod).find((k) => k.endsWith('Prompts'));
  if (key) return mod[key] as DomainPrompts;
  return mod.default as DomainPrompts;
}

// ── Domain SEO ──

export async function getDomainSeo(domain: string): Promise<DomainSeo> {
  const mod = await import(`../../../domains/${domain}/seo`);
  const key = Object.keys(mod).find((k) => k.endsWith('Seo'));
  if (key) return mod[key] as DomainSeo;
  return mod.default as DomainSeo;
}

// ── Current Org Helper ──

export function getCurrentOrgId(): string {
  return process.env.NEXT_PUBLIC_ORG_ID || 'davis-resta';
}

export function getCurrentDomain(): string {
  return process.env.NEXT_PUBLIC_DOMAIN || 'jewelry';
}

export async function getCurrentOrg(): Promise<{ data: OrgData; config: OrgConfig }> {
  const orgId = getCurrentOrgId();
  const [data, config] = await Promise.all([getOrgData(orgId), getOrgConfig(orgId)]);
  return { data, config };
}

export async function getCurrentDomainConfig(): Promise<{
  theme: DomainTheme;
  sections: DomainSections;
  prompts: DomainPrompts;
  seo: DomainSeo;
}> {
  const domain = getCurrentDomain();
  const [theme, sections, prompts, seo] = await Promise.all([
    getDomainTheme(domain),
    getDomainSections(domain),
    getDomainPrompts(domain),
    getDomainSeo(domain),
  ]);
  return { theme, sections, prompts, seo };
}
