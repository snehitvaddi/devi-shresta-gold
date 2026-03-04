import { NextRequest, NextResponse } from "next/server";
import {
  parseWebhookPayload,
  routeMessages,
  type TextMessage,
  type ImageMessage,
  type LocationMessage,
} from "@/lib/whatsapp/webhook";
import { sendTextMessage } from "@/lib/whatsapp/client";
import { ChatAgent, type ConversationMessage } from "@/lib/ai/chat-agent";
import type { OrgContext } from "@/lib/ai/prompts";
import { identifyProduct } from "@/lib/ai/vision";
import { HandoverManager } from "@/lib/ai/handover";
import { getOrgData, getCurrentOrgId, getCurrentDomain } from "@/lib/data/org";
import { getProducts } from "@/lib/data/products";

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN ?? "any-website-builder-verify";
const OWNER_PHONE = process.env.OWNER_WHATSAPP_PHONE ?? "";

// Per-user conversation store (in-memory, reset on deploy)
const conversations = new Map<string, ConversationMessage[]>();

let agent: ChatAgent | null = null;
function getAgent(): ChatAgent {
  if (!agent) agent = new ChatAgent();
  return agent;
}

// GET - WhatsApp webhook verification (Meta sends verify token)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("[WhatsApp] Webhook verified");
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Verification failed" }, { status: 403 });
}

// POST - Handle incoming WhatsApp messages
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = parseWebhookPayload(body);

    if (parsed.messages.length === 0) {
      return NextResponse.json({ status: "ok" });
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

    const handoverManager = new HandoverManager(
      OWNER_PHONE ? [OWNER_PHONE] : [],
    );

    await routeMessages(parsed, {
      onTextMessage: async (msg: TextMessage) => {
        console.log(`[WhatsApp] Text from ${msg.from}: ${msg.text}`);

        // Check if this is from the owner (CMS commands)
        if (msg.from === OWNER_PHONE.replace(/\D/g, "")) {
          // Owner messages could be CMS commands - for now, acknowledge
          try {
            await sendTextMessage(
              msg.from,
              `Command received: "${msg.text}". CMS processing is being set up.`,
            );
          } catch (err) {
            console.error("[WhatsApp] Failed to respond to owner:", err);
          }
          return;
        }

        // Customer message - route to AI agent
        const history = conversations.get(msg.from) ?? [];

        // Check handover conditions
        const handoverCheck = handoverManager.shouldHandover(msg.text, {
          failedAttempts: 0,
          conversationLength: history.length,
          sentiment: "neutral",
          topics: [],
        });

        if (handoverCheck.handover && handoverCheck.reason) {
          await handoverManager.initiateHandover(
            msg.from,
            handoverCheck.reason,
            history.map((m) => ({ role: m.role, content: m.content })),
            msg.profileName,
          );
          try {
            await sendTextMessage(
              msg.from,
              "I'm connecting you with our team. Someone will be with you shortly!",
            );
          } catch (err) {
            console.error("[WhatsApp] Failed to send handover message:", err);
          }
          return;
        }

        try {
          const chatAgent = getAgent();
          const response = await chatAgent.chat(msg.text, history, orgContext);

          // Update conversation history
          history.push({ role: "user", content: msg.text });
          history.push({ role: "assistant", content: response.text });
          conversations.set(msg.from, history.slice(-20)); // Keep last 20 messages

          await sendTextMessage(msg.from, response.text);
        } catch (err) {
          console.error("[WhatsApp] AI chat failed:", err);
          try {
            await sendTextMessage(
              msg.from,
              `Thank you for your message! Our team will get back to you shortly. In the meantime, visit our website or call us at ${orgData.phone}.`,
            );
          } catch (sendErr) {
            console.error("[WhatsApp] Failed to send fallback:", sendErr);
          }
        }
      },

      onImageMessage: async (msg: ImageMessage) => {
        console.log(`[WhatsApp] Image from ${msg.from}, media ID: ${msg.mediaId}`);

        try {
          await sendTextMessage(
            msg.from,
            "Thank you for sharing the image! I'm analyzing it to find similar items in our collection. This may take a moment...",
          );

          // Note: To fully process, we'd need to download the image from
          // WhatsApp Media API using msg.mediaId, convert to base64, then
          // call identifyProduct. For now, acknowledge receipt.
          await sendTextMessage(
            msg.from,
            "I've received your image. For the best visual search experience, please visit our website where you can upload images directly. Our team can also help you find matching pieces!",
          );
        } catch (err) {
          console.error("[WhatsApp] Failed to respond to image:", err);
        }
      },

      onLocationMessage: async (msg: LocationMessage) => {
        console.log(
          `[WhatsApp] Location from ${msg.from}: ${msg.latitude},${msg.longitude}`,
        );

        const storeAddress = `${orgData.address.street}, ${orgData.address.city}, ${orgData.address.state} ${orgData.address.zip}`;
        try {
          await sendTextMessage(
            msg.from,
            `Thanks for sharing your location! Our store is at: ${storeAddress}. You can find us on Google Maps: https://www.google.com/maps?q=${orgData.address.coordinates?.lat},${orgData.address.coordinates?.lng}`,
          );
        } catch (err) {
          console.error("[WhatsApp] Failed to respond to location:", err);
        }
      },
    });

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("[API /whatsapp] Error:", error);
    // Always return 200 to WhatsApp to prevent retries
    return NextResponse.json({ status: "ok" });
  }
}
