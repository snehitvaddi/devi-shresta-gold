/**
 * Website analyzer
 *
 * Fetches a URL and extracts design elements, content structure,
 * colors, fonts, and images for use in site generation.
 */

// ── Types ───────────────────────────────────────────────────────────────────

export interface WebsiteAnalysis {
  url: string;
  title: string;
  description: string;
  colors: string[];
  fonts: string[];
  sections: PageSection[];
  images: PageImage[];
  links: string[];
  technologies: string[];
}

export interface PageSection {
  tag: string;
  heading?: string;
  textContent: string;
  order: number;
}

export interface PageImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface DesignReport {
  primaryColors: string[];
  secondaryColors: string[];
  fonts: string[];
  layoutPatterns: string[];
  commonSections: string[];
  imageStyles: string[];
  overallStyle: string;
}

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Analyze a website URL and extract design/content elements.
 * Uses fetch + regex-based HTML parsing (no browser dependency).
 */
export async function analyzeWebsite(url: string): Promise<WebsiteAnalysis> {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; AnyWebsiteBuilder/1.0; +https://anywebsitebuilder.com)",
      Accept: "text/html",
    },
    redirect: "follow",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status}`);
  }

  const html = await res.text();

  return {
    url,
    title: extractTitle(html),
    description: extractMeta(html, "description"),
    colors: extractColors(html),
    fonts: extractFonts(html),
    sections: extractSections(html),
    images: extractImages(html, url),
    links: extractLinks(html, url),
    technologies: detectTechnologies(html),
  };
}

/**
 * Analyze multiple websites and produce a design report
 * summarizing common patterns.
 */
export async function extractDesignPatterns(
  urls: string[]
): Promise<DesignReport> {
  const analyses = await Promise.allSettled(
    urls.map((u) => analyzeWebsite(u))
  );

  const successful = analyses
    .filter(
      (r): r is PromiseFulfilledResult<WebsiteAnalysis> =>
        r.status === "fulfilled"
    )
    .map((r) => r.value);

  if (successful.length === 0) {
    throw new Error("Failed to analyze any of the provided URLs");
  }

  // Aggregate findings
  const allColors = successful.flatMap((a) => a.colors);
  const allFonts = successful.flatMap((a) => a.fonts);
  const allSectionTags = successful.flatMap((a) =>
    a.sections.map((s) => s.tag)
  );

  return {
    primaryColors: getMostCommon(allColors, 3),
    secondaryColors: getMostCommon(allColors.slice(3), 3),
    fonts: getMostCommon(allFonts, 4),
    layoutPatterns: detectLayoutPatterns(successful),
    commonSections: getMostCommon(allSectionTags, 6),
    imageStyles: detectImageStyles(successful),
    overallStyle: inferStyle(successful),
  };
}

// ── HTML extraction helpers ─────────────────────────────────────────────────

function extractTitle(html: string): string {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? decodeEntities(match[1].trim()) : "";
}

function extractMeta(html: string, name: string): string {
  const regex = new RegExp(
    `<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']*)["']`,
    "i"
  );
  const match = html.match(regex);
  if (match) return decodeEntities(match[1]);

  // Try reverse order (content before name)
  const regex2 = new RegExp(
    `<meta[^>]*content=["']([^"']*)["'][^>]*name=["']${name}["']`,
    "i"
  );
  const match2 = html.match(regex2);
  return match2 ? decodeEntities(match2[1]) : "";
}

function extractColors(html: string): string[] {
  const colors = new Set<string>();

  // Hex colors
  const hexMatches = html.matchAll(/#([0-9a-fA-F]{3,8})\b/g);
  for (const m of hexMatches) {
    const hex = m[1];
    if (hex.length === 3 || hex.length === 6) {
      colors.add(`#${hex.toLowerCase()}`);
    }
  }

  // RGB/RGBA
  const rgbMatches = html.matchAll(
    /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/g
  );
  for (const m of rgbMatches) {
    const r = parseInt(m[1]), g = parseInt(m[2]), b = parseInt(m[3]);
    colors.add(
      `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
    );
  }

  // CSS custom properties with color values
  const varMatches = html.matchAll(
    /--[\w-]+:\s*(#[0-9a-fA-F]{3,8})/g
  );
  for (const m of varMatches) {
    colors.add(m[1].toLowerCase());
  }

  return [...colors].slice(0, 20);
}

function extractFonts(html: string): string[] {
  const fonts = new Set<string>();

  // font-family declarations
  const fontMatches = html.matchAll(
    /font-family:\s*['"]?([^;'"}\n]+)/gi
  );
  for (const m of fontMatches) {
    const families = m[1].split(",").map((f) => f.trim().replace(/['"]/g, ""));
    for (const f of families) {
      if (f && !isGenericFont(f)) {
        fonts.add(f);
      }
    }
  }

  // Google Fonts links
  const gfMatches = html.matchAll(
    /fonts\.googleapis\.com\/css2?\?family=([^"&]+)/g
  );
  for (const m of gfMatches) {
    const families = decodeURIComponent(m[1]).split("|");
    for (const f of families) {
      fonts.add(f.split(":")[0].replace(/\+/g, " "));
    }
  }

  return [...fonts].slice(0, 10);
}

function extractSections(html: string): PageSection[] {
  const sections: PageSection[] = [];
  const sectionTags = ["header", "nav", "main", "section", "article", "aside", "footer"];

  let order = 0;
  for (const tag of sectionTags) {
    const regex = new RegExp(
      `<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`,
      "gi"
    );
    let match: RegExpExecArray | null;

    while ((match = regex.exec(html)) !== null) {
      const content = match[1];
      const heading = extractFirstHeading(content);
      const textContent = stripTags(content).trim().slice(0, 500);

      if (textContent.length > 10) {
        sections.push({ tag, heading, textContent, order: order++ });
      }
    }
  }

  return sections;
}

function extractImages(html: string, baseUrl: string): PageImage[] {
  const images: PageImage[] = [];
  const imgRegex = /<img[^>]+>/gi;
  let match: RegExpExecArray | null;

  while ((match = imgRegex.exec(html)) !== null) {
    const tag = match[0];
    const src = extractAttr(tag, "src") ?? extractAttr(tag, "data-src");
    const alt = extractAttr(tag, "alt") ?? "";
    const width = extractAttr(tag, "width");
    const height = extractAttr(tag, "height");

    if (src) {
      images.push({
        src: resolveUrl(src, baseUrl),
        alt,
        width: width ? parseInt(width) : undefined,
        height: height ? parseInt(height) : undefined,
      });
    }
  }

  return images.slice(0, 50);
}

function extractLinks(html: string, baseUrl: string): string[] {
  const links = new Set<string>();
  const regex = /<a[^>]+href=["']([^"'#]+)/gi;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(html)) !== null) {
    const href = match[1];
    if (href && !href.startsWith("javascript:") && !href.startsWith("mailto:")) {
      links.add(resolveUrl(href, baseUrl));
    }
  }

  return [...links].slice(0, 100);
}

function detectTechnologies(html: string): string[] {
  const techs: string[] = [];

  if (html.includes("__next") || html.includes("_next/")) techs.push("Next.js");
  if (html.includes("wp-content") || html.includes("wordpress")) techs.push("WordPress");
  if (html.includes("shopify") || html.includes("Shopify")) techs.push("Shopify");
  if (html.includes("wix.com")) techs.push("Wix");
  if (html.includes("squarespace")) techs.push("Squarespace");
  if (html.includes("react")) techs.push("React");
  if (html.includes("vue")) techs.push("Vue.js");
  if (html.includes("tailwind") || html.includes("tw-")) techs.push("Tailwind CSS");
  if (html.includes("bootstrap")) techs.push("Bootstrap");
  if (html.includes("jquery")) techs.push("jQuery");
  if (html.includes("gtag") || html.includes("google-analytics")) techs.push("Google Analytics");
  if (html.includes("fbq") || html.includes("facebook.com/tr")) techs.push("Facebook Pixel");

  return techs;
}

// ── Utility helpers ─────────────────────────────────────────────────────────

function extractAttr(tag: string, attr: string): string | undefined {
  const regex = new RegExp(`${attr}=["']([^"']*)["']`, "i");
  return tag.match(regex)?.[1];
}

function extractFirstHeading(html: string): string | undefined {
  const match = html.match(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/i);
  return match ? stripTags(match[1]).trim() : undefined;
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
}

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#x27;/g, "'");
}

function resolveUrl(href: string, base: string): string {
  try {
    return new URL(href, base).toString();
  } catch {
    return href;
  }
}

function isGenericFont(name: string): boolean {
  const generic = [
    "serif", "sans-serif", "monospace", "cursive", "fantasy",
    "system-ui", "ui-serif", "ui-sans-serif", "ui-monospace",
    "inherit", "initial", "unset",
  ];
  return generic.includes(name.toLowerCase());
}

function getMostCommon(items: string[], count: number): string[] {
  const freq = new Map<string, number>();
  for (const item of items) {
    freq.set(item, (freq.get(item) ?? 0) + 1);
  }
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([item]) => item);
}

function detectLayoutPatterns(analyses: WebsiteAnalysis[]): string[] {
  const patterns: string[] = [];

  const allTags = analyses.flatMap((a) => a.sections.map((s) => s.tag));
  if (allTags.includes("header")) patterns.push("sticky-header");
  if (allTags.filter((t) => t === "section").length > 3)
    patterns.push("section-based-layout");
  if (allTags.includes("aside")) patterns.push("sidebar");

  const avgImages =
    analyses.reduce((sum, a) => sum + a.images.length, 0) / analyses.length;
  if (avgImages > 10) patterns.push("image-heavy");
  if (avgImages > 20) patterns.push("gallery");

  return patterns;
}

function detectImageStyles(analyses: WebsiteAnalysis[]): string[] {
  const styles: string[] = [];
  const totalImages = analyses.reduce(
    (sum, a) => sum + a.images.length,
    0
  );

  if (totalImages > 0) {
    const withAlt = analyses.reduce(
      (sum, a) => sum + a.images.filter((i) => i.alt).length,
      0
    );
    if (withAlt / totalImages > 0.8) styles.push("well-labeled");

    styles.push("product-photography");
  }

  return styles;
}

function inferStyle(analyses: WebsiteAnalysis[]): string {
  const colors = analyses.flatMap((a) => a.colors);
  const darkColors = colors.filter((c) => {
    const hex = c.replace("#", "");
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return (r + g + b) / 3 < 128;
  });

  if (darkColors.length > colors.length / 2) return "dark-elegant";
  return "light-modern";
}
