/**
 * Prompt loader for AI modules
 *
 * Loads and customises system prompts for different AI use cases.
 * Domain-specific prompts can be added under domains/[domain]/prompts.ts;
 * this module provides sensible defaults and injects org context.
 */

// ── Types ───────────────────────────────────────────────────────────────────

export type PromptType = "customer-chat" | "vision" | "whatsapp-cms";

export interface OrgContext {
  domain: string;
  orgId: string;
  businessName: string;
  businessType?: string;
  products?: string[];
  services?: string[];
  businessHours?: string;
  location?: string;
  specialInstructions?: string;
}

interface DomainPrompts {
  "customer-chat"?: string;
  vision?: string;
  "whatsapp-cms"?: string;
}

// ── Domain prompt registry ──────────────────────────────────────────────────

const domainPrompts: Record<string, DomainPrompts> = {};

/** Register domain-specific prompt overrides (called from domains/[domain]/prompts.ts) */
export function registerDomainPrompts(
  domain: string,
  prompts: DomainPrompts
): void {
  domainPrompts[domain] = { ...domainPrompts[domain], ...prompts };
}

// ── Default prompts ─────────────────────────────────────────────────────────

const DEFAULT_PROMPTS: Record<PromptType, string> = {
  "customer-chat": `You are a helpful customer service assistant for {{businessName}}.

Business type: {{businessType}}
{{#products}}Available products/categories: {{products}}{{/products}}
{{#services}}Services offered: {{services}}{{/services}}
{{#businessHours}}Business hours: {{businessHours}}{{/businessHours}}
{{#location}}Location: {{location}}{{/location}}

Your role:
- Help customers find products, answer questions, and assist with bookings
- Be friendly, professional, and knowledgeable about the business
- If you can suggest specific products, include them as: [PRODUCTS:[{"id":"...","name":"...","price":0,"imageUrl":"..."}]]
- If the customer wants to book, include: [BOOKING_LINK:URL]
- If you cannot help or the customer asks for a human, include: [HANDOVER]
- Never make up product details or prices — only reference what you know
{{#specialInstructions}}

Special instructions: {{specialInstructions}}{{/specialInstructions}}`,

  vision: `You are a product identification expert for {{businessName}}, a {{businessType}} business.

Analyze product images with attention to:
- Material, craftsmanship, and quality indicators
- Style, design elements, and aesthetic category
- Condition and notable features
- Potential category and price range

Provide structured analysis suitable for catalog matching.
{{#specialInstructions}}

Special instructions: {{specialInstructions}}{{/specialInstructions}}`,

  "whatsapp-cms": `You are a CMS assistant for {{businessName}}.

Help the business owner manage their website and products via WhatsApp commands.
Available commands:
- ADD PRODUCT [name] AT [price] DESC [description]
- UPDATE PRICE [product] TO [price]
- UPDATE HOURS [day] [open]-[close]
- UPDATE STATUS [product] TO [available|sold|reserved]
- GET ORDERS [today|week|pending|all]
- GET STATS [today|week|month]

Parse the owner's messages and execute the appropriate command.
If the message is ambiguous, ask for clarification.`,
};

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Get a fully resolved system prompt for a given domain, type, and org context.
 * Uses domain-specific overrides if registered, otherwise falls back to defaults.
 */
export function getSystemPrompt(
  domain: string,
  type: PromptType,
  context: OrgContext
): string {
  const template =
    domainPrompts[domain]?.[type] ?? DEFAULT_PROMPTS[type] ?? DEFAULT_PROMPTS["customer-chat"];

  return injectContext(template, context);
}

// ── Template engine (minimal mustache-like) ─────────────────────────────────

function injectContext(template: string, context: OrgContext): string {
  let result = template;

  // Simple variable replacement
  result = result.replace(/\{\{businessName\}\}/g, context.businessName);
  result = result.replace(
    /\{\{businessType\}\}/g,
    context.businessType ?? "business"
  );
  result = result.replace(
    /\{\{products\}\}/g,
    context.products?.join(", ") ?? ""
  );
  result = result.replace(
    /\{\{services\}\}/g,
    context.services?.join(", ") ?? ""
  );
  result = result.replace(
    /\{\{businessHours\}\}/g,
    context.businessHours ?? ""
  );
  result = result.replace(/\{\{location\}\}/g, context.location ?? "");
  result = result.replace(
    /\{\{specialInstructions\}\}/g,
    context.specialInstructions ?? ""
  );

  // Conditional sections: {{#field}}...{{/field}} — include if field is truthy
  result = result.replace(
    /\{\{#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g,
    (_match, field: string, content: string) => {
      const value = context[field as keyof OrgContext];
      if (Array.isArray(value) ? value.length > 0 : Boolean(value)) {
        return content;
      }
      return "";
    }
  );

  // Clean up extra blank lines
  result = result.replace(/\n{3,}/g, "\n\n");

  return result.trim();
}
