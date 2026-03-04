/**
 * AI Chat Agent powered by Anthropic Claude
 *
 * Provides conversational AI for customer support, product discovery,
 * and booking assistance. Domain-agnostic — behaviour is controlled by
 * system prompts loaded per-domain.
 */

import Anthropic from "@anthropic-ai/sdk";
import { getSystemPrompt, type OrgContext } from "./prompts";

// ── Types ───────────────────────────────────────────────────────────────────

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

export interface SuggestedProduct {
  id: string;
  name: string;
  price?: number;
  imageUrl?: string;
  url?: string;
}

export interface ChatResponse {
  text: string;
  suggestedProducts?: SuggestedProduct[];
  bookingLink?: string;
  handover?: boolean;
}

export interface ToolDefinition {
  name: string;
  description: string;
  input_schema: Record<string, unknown>;
}

export type ToolHandler = (
  input: Record<string, unknown>
) => Promise<string>;

// ── ChatAgent class ─────────────────────────────────────────────────────────

export class ChatAgent {
  private client: Anthropic;
  private model: string;
  private tools: Map<string, { definition: ToolDefinition; handler: ToolHandler }>;

  constructor(model: string = "claude-sonnet-4-20250514") {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("Missing ANTHROPIC_API_KEY");

    this.client = new Anthropic({ apiKey });
    this.model = model;
    this.tools = new Map();

    // Register built-in tools
    this.registerDefaultTools();
  }

  /** Register a callable tool the agent can invoke during a conversation */
  registerTool(definition: ToolDefinition, handler: ToolHandler): void {
    this.tools.set(definition.name, { definition, handler });
  }

  /** Main chat method */
  async chat(
    message: string,
    conversationHistory: ConversationMessage[],
    orgContext: OrgContext
  ): Promise<ChatResponse> {
    const systemPrompt = getSystemPrompt(orgContext.domain, "customer-chat", orgContext);

    const messages: Anthropic.MessageParam[] = [
      ...conversationHistory.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user", content: message },
    ];

    const toolDefs: Anthropic.Tool[] = Array.from(this.tools.values()).map(
      (t) => ({
        name: t.definition.name,
        description: t.definition.description,
        input_schema: t.definition.input_schema as Anthropic.Tool.InputSchema,
      })
    );

    let response = await this.client.messages.create({
      model: this.model,
      max_tokens: 1024,
      system: systemPrompt,
      messages,
      ...(toolDefs.length > 0 ? { tools: toolDefs } : {}),
    });

    // Process tool calls in a loop until the model produces a final text response
    while (response.stop_reason === "tool_use") {
      const assistantContent = response.content;
      const toolResults: Anthropic.ToolResultBlockParam[] = [];

      for (const block of assistantContent) {
        if (block.type === "tool_use") {
          const tool = this.tools.get(block.name);
          let result: string;
          try {
            result = tool
              ? await tool.handler(block.input as Record<string, unknown>)
              : `Tool "${block.name}" not found.`;
          } catch (err) {
            result = `Tool error: ${err instanceof Error ? err.message : "unknown"}`;
          }
          toolResults.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: result,
          });
        }
      }

      response = await this.client.messages.create({
        model: this.model,
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          ...messages,
          { role: "assistant", content: assistantContent },
          { role: "user", content: toolResults },
        ],
        ...(toolDefs.length > 0 ? { tools: toolDefs } : {}),
      });
    }

    return this.parseResponse(response);
  }

  // ── Private helpers ─────────────────────────────────────────────────────

  private parseResponse(response: Anthropic.Message): ChatResponse {
    let text = "";
    for (const block of response.content) {
      if (block.type === "text") {
        text += block.text;
      }
    }

    // Extract structured data from the response text (simple convention-based)
    const suggestedProducts = this.extractProducts(text);
    const bookingLink = this.extractBookingLink(text);
    const handover = this.detectHandover(text);

    // Clean markers from visible text
    let cleanText = text
      .replace(/\[PRODUCTS:[^\]]*\]/g, "")
      .replace(/\[BOOKING_LINK:.*?\]/g, "")
      .replace(/\[HANDOVER\]/g, "")
      .trim();

    return {
      text: cleanText || text,
      ...(suggestedProducts.length > 0 ? { suggestedProducts } : {}),
      ...(bookingLink ? { bookingLink } : {}),
      ...(handover ? { handover } : {}),
    };
  }

  private extractProducts(text: string): SuggestedProduct[] {
    const match = text.match(/\[PRODUCTS:([\s\S]*?)\]/);
    if (!match) return [];
    try {
      return JSON.parse(match[1]) as SuggestedProduct[];
    } catch {
      return [];
    }
  }

  private extractBookingLink(text: string): string | undefined {
    const match = text.match(/\[BOOKING_LINK:(.*?)\]/);
    return match?.[1]?.trim();
  }

  private detectHandover(text: string): boolean {
    return text.includes("[HANDOVER]");
  }

  private registerDefaultTools(): void {
    this.registerTool(
      {
        name: "search_products",
        description:
          "Search the product catalog by name, category, price range, or description.",
        input_schema: {
          type: "object",
          properties: {
            query: { type: "string", description: "Search query" },
            category: { type: "string", description: "Product category" },
            minPrice: { type: "number", description: "Minimum price" },
            maxPrice: { type: "number", description: "Maximum price" },
          },
          required: ["query"],
        },
      },
      async (input) => {
        // Placeholder — wired to real product search at integration time
        return JSON.stringify({
          results: [],
          message: `Search for "${input.query}" — connect to product database.`,
        });
      }
    );

    this.registerTool(
      {
        name: "check_availability",
        description: "Check if a specific date/time slot is available for booking.",
        input_schema: {
          type: "object",
          properties: {
            date: { type: "string", description: "Date in YYYY-MM-DD format" },
            time: { type: "string", description: "Time in HH:MM format" },
          },
          required: ["date"],
        },
      },
      async (input) => {
        return JSON.stringify({
          available: true,
          date: input.date,
          time: input.time ?? "any",
          message: "Slot available — connect to booking system.",
        });
      }
    );

    this.registerTool(
      {
        name: "create_booking",
        description: "Create a new booking/appointment.",
        input_schema: {
          type: "object",
          properties: {
            customerName: { type: "string" },
            date: { type: "string" },
            time: { type: "string" },
            service: { type: "string" },
            notes: { type: "string" },
          },
          required: ["customerName", "date", "time"],
        },
      },
      async (input) => {
        return JSON.stringify({
          bookingId: `bk_${Date.now()}`,
          confirmed: true,
          ...input,
          message: "Booking created — connect to booking system.",
        });
      }
    );
  }
}
