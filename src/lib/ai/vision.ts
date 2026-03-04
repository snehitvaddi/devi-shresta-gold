/**
 * AI Vision – product identification from images using Claude
 */

import Anthropic from "@anthropic-ai/sdk";
import { getSystemPrompt, type OrgContext } from "./prompts";

// ── Types ───────────────────────────────────────────────────────────────────

export interface MatchedProduct {
  id: string;
  name: string;
  confidence: number;
  matchReason: string;
}

export interface VisionResult {
  productType: string;
  description: string;
  attributes: Record<string, string>;
  matchedProducts: MatchedProduct[];
}

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Analyze an image and identify products using Claude's vision capability.
 *
 * @param imageBase64 - Base64-encoded image data (without data URI prefix)
 * @param orgContext  - Organization context for domain-aware analysis
 * @param catalog     - Optional product catalog to match against
 */
export async function identifyProduct(
  imageBase64: string,
  orgContext: OrgContext,
  catalog?: { id: string; name: string; description: string; category?: string }[]
): Promise<VisionResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("Missing ANTHROPIC_API_KEY");

  const client = new Anthropic({ apiKey });

  const systemPrompt = getSystemPrompt(orgContext.domain, "vision", orgContext);

  const catalogSection = catalog?.length
    ? `\n\nProduct catalog to match against:\n${catalog
        .map((p) => `- [${p.id}] ${p.name}: ${p.description} (${p.category ?? "uncategorized"})`)
        .join("\n")}`
    : "";

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: "image/jpeg",
              data: imageBase64,
            },
          },
          {
            type: "text",
            text: `Analyze this product image and return a JSON object with the following fields:
- productType: the type/category of the product
- description: a detailed description of the product
- attributes: key-value pairs of notable attributes (material, color, style, size, etc.)
- matchedProducts: array of matched items from the catalog (id, name, confidence 0-1, matchReason)

Return ONLY valid JSON, no markdown fencing.${catalogSection}`,
          },
        ],
      },
    ],
  });

  const text =
    response.content[0]?.type === "text" ? response.content[0].text : "";

  try {
    // Strip potential markdown code fences
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned) as VisionResult;
  } catch {
    // Fallback: return a structured result with the raw description
    return {
      productType: "unknown",
      description: text,
      attributes: {},
      matchedProducts: [],
    };
  }
}

/**
 * Generate a text description of an image for use in similarity search.
 * Lighter-weight than full identifyProduct — just returns a description string.
 */
export async function describeImage(
  imageBase64: string,
  mediaType: "image/jpeg" | "image/png" | "image/webp" | "image/gif" = "image/jpeg"
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("Missing ANTHROPIC_API_KEY");

  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: mediaType, data: imageBase64 },
          },
          {
            type: "text",
            text: "Describe this product image in detail for search purposes. Include: type, material, color, style, notable features. Be concise but thorough. Return only the description text.",
          },
        ],
      },
    ],
  });

  return response.content[0]?.type === "text" ? response.content[0].text : "";
}
