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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, history, image } = body as {
      message: string;
      history?: ConversationMessage[];
      image?: string; // base64 encoded image
    };

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
          history ?? [],
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
      conversationLength: (history ?? []).length,
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
      history ?? [],
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
