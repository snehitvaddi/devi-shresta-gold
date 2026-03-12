import { NextRequest, NextResponse } from "next/server";
import { ChatAgent, type ConversationMessage } from "@/lib/ai/chat-agent";
import type { OrgContext } from "@/lib/ai/prompts";
import { identifyProduct } from "@/lib/ai/vision";
import { HandoverManager } from "@/lib/ai/handover";
import { getOrgData, getCurrentOrgId, getCurrentDomain } from "@/lib/data/org";
import { getProducts } from "@/lib/data/products";

let agent: ChatAgent | null = null;

function getAgent(): ChatAgent {
  if (!agent) {
    agent = new ChatAgent();
  }
  return agent;
}

const MAX_PAYLOAD_BYTES = 10 * 1024 * 1024; // 10 MB
const MAX_BASE64_LENGTH = MAX_PAYLOAD_BYTES;
const MAX_HISTORY_LENGTH = 20;
const MAX_CONTENT_LENGTH = 2000;

function sanitizeHistory(raw: unknown): ConversationMessage[] {
  if (!Array.isArray(raw)) return [];
  const validRoles = new Set(["user", "assistant"]);
  return raw
    .filter(
      (entry): entry is { role: string; content: string } =>
        entry != null &&
        typeof entry === "object" &&
        typeof entry.role === "string" &&
        validRoles.has(entry.role) &&
        typeof entry.content === "string",
    )
    .map((entry) => ({
      role: entry.role as "user" | "assistant",
      content: entry.content.slice(0, MAX_CONTENT_LENGTH),
    }))
    .slice(-MAX_HISTORY_LENGTH);
}

export async function POST(request: NextRequest) {
  try {
    const contentLength = Number(request.headers.get("content-length") ?? "0");
    if (contentLength > MAX_PAYLOAD_BYTES) {
      return NextResponse.json(
        { error: "Payload too large" },
        { status: 413 },
      );
    }

    const body = await request.json();
    const { message, image } = body as {
      message: string;
      image?: string; // base64 encoded image
    };
    const history = sanitizeHistory(body.history);

    if (image && typeof image === "string" && image.length > MAX_BASE64_LENGTH) {
      return NextResponse.json(
        { error: "Payload too large" },
        { status: 413 },
      );
    }

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    const orgId = getCurrentOrgId();
    const domain = getCurrentDomain();
    const [orgData, products] = await Promise.all([
      getOrgData(orgId),
      getProducts(orgId),
    ]);

    const orgContext: OrgContext = {
      domain,
      orgId,
      businessName: orgData.name,
      businessType: domain,
      products: products.map((p) => `${p.name} (${p.category})`),
      services: orgData.features,
      businessHours: orgData.businessHours
        .map((h) => `${h.day}: ${h.closed ? "Closed" : `${h.open}-${h.close}`}`)
        .join(", "),
      location: `${orgData.address.street}, ${orgData.address.city}, ${orgData.address.state}`,
    };

    // Check if Anthropic API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({
        reply: "Our chat assistant is currently being set up. Please reach out via WhatsApp for immediate assistance!",
        error: false,
      });
    }

    // If image is provided, use vision to identify product first
    if (image) {
      try {
        const catalog = products.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.shortDescription || p.description,
          category: p.category,
        }));

        const visionResult = await identifyProduct(image, orgContext, catalog);

        // Build a context-enriched message for the chat agent
        const enrichedMessage = `${message}\n\n[Image Analysis: ${visionResult.description}. Product type: ${visionResult.productType}. ${
          visionResult.matchedProducts.length > 0
            ? `Similar items found: ${visionResult.matchedProducts.map((m) => m.name).join(", ")}`
            : "No exact matches found in catalog."
        }]`;

        const chatAgent = getAgent();
        const response = await chatAgent.chat(
          enrichedMessage,
          history,
          orgContext,
        );

        return NextResponse.json({
          reply: response.text,
          suggestedProducts: response.suggestedProducts ?? visionResult.matchedProducts.map((m) => ({
            id: m.id,
            name: m.name,
          })),
          bookingLink: response.bookingLink,
          handover: response.handover,
          visionResult: {
            productType: visionResult.productType,
            description: visionResult.description,
          },
        });
      } catch (visionError) {
        console.error("[API /chat] Vision error:", visionError);
        // Fall through to regular chat if vision fails
      }
    }

    // Check handover conditions
    const handoverManager = new HandoverManager([]);
    const handoverCheck = handoverManager.shouldHandover(message, {
      failedAttempts: 0,
      conversationLength: history.length,
      sentiment: "neutral",
      topics: [],
    });

    if (handoverCheck.handover) {
      return NextResponse.json({
        reply: "I'd like to connect you with our team for personalized assistance. Please call us or send a WhatsApp message and our experts will be happy to help you!",
        handover: true,
        bookingLink: "/book",
      });
    }

    // Regular AI chat
    const chatAgent = getAgent();
    const response = await chatAgent.chat(
      message,
      history,
      orgContext,
    );

    return NextResponse.json({
      reply: response.text,
      suggestedProducts: response.suggestedProducts,
      bookingLink: response.bookingLink,
      handover: response.handover,
    });
  } catch (error) {
    console.error("[API /chat] Error:", error);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 },
    );
  }
}
