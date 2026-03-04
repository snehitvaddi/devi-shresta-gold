/**
 * WhatsApp Cloud API Client
 *
 * Sends messages via the WhatsApp Business Cloud API.
 * Requires WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID env vars.
 */

const WHATSAPP_API_BASE = "https://graph.facebook.com/v21.0";

function getConfig() {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!accessToken || !phoneNumberId) {
    throw new Error(
      "Missing WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_NUMBER_ID environment variables"
    );
  }
  return { accessToken, phoneNumberId };
}

// ── Types ───────────────────────────────────────────────────────────────────

export interface WhatsAppMessageResponse {
  messaging_product: "whatsapp";
  contacts: { input: string; wa_id: string }[];
  messages: { id: string }[];
}

export interface WhatsAppError {
  error: {
    message: string;
    type: string;
    code: number;
    error_subcode?: number;
    fbtrace_id?: string;
  };
}

export interface InteractiveButton {
  type: "reply";
  reply: { id: string; title: string };
}

export interface TemplateParameter {
  type: "text" | "image" | "document";
  text?: string;
  image?: { link: string };
}

// ── Internal helpers ────────────────────────────────────────────────────────

async function sendRequest(
  phoneNumberId: string,
  accessToken: string,
  body: Record<string, unknown>
): Promise<WhatsAppMessageResponse> {
  const url = `${WHATSAPP_API_BASE}/${phoneNumberId}/messages`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messaging_product: "whatsapp", ...body }),
  });

  if (!res.ok) {
    const err = (await res.json()) as WhatsAppError;
    throw new Error(
      `WhatsApp API error ${res.status}: ${err.error?.message ?? res.statusText}`
    );
  }

  return res.json() as Promise<WhatsAppMessageResponse>;
}

// ── Public API ──────────────────────────────────────────────────────────────

/** Send a plain text message */
export async function sendTextMessage(
  to: string,
  text: string
): Promise<WhatsAppMessageResponse> {
  const { accessToken, phoneNumberId } = getConfig();
  return sendRequest(phoneNumberId, accessToken, {
    to,
    type: "text",
    text: { body: text },
  });
}

/** Send an image with an optional caption */
export async function sendImageMessage(
  to: string,
  imageUrl: string,
  caption?: string
): Promise<WhatsAppMessageResponse> {
  const { accessToken, phoneNumberId } = getConfig();
  return sendRequest(phoneNumberId, accessToken, {
    to,
    type: "image",
    image: { link: imageUrl, ...(caption ? { caption } : {}) },
  });
}

/** Send a pre-approved template message */
export async function sendTemplateMessage(
  to: string,
  templateName: string,
  params: TemplateParameter[]
): Promise<WhatsAppMessageResponse> {
  const { accessToken, phoneNumberId } = getConfig();
  return sendRequest(phoneNumberId, accessToken, {
    to,
    type: "template",
    template: {
      name: templateName,
      language: { code: "en" },
      components: [
        {
          type: "body",
          parameters: params,
        },
      ],
    },
  });
}

/** Send an interactive message with reply buttons (max 3) */
export async function sendInteractiveMessage(
  to: string,
  body: string,
  buttons: InteractiveButton[]
): Promise<WhatsAppMessageResponse> {
  const { accessToken, phoneNumberId } = getConfig();
  return sendRequest(phoneNumberId, accessToken, {
    to,
    type: "interactive",
    interactive: {
      type: "button",
      body: { text: body },
      action: { buttons },
    },
  });
}

/** Mark a message as read */
export async function markAsRead(messageId: string): Promise<void> {
  const { accessToken, phoneNumberId } = getConfig();
  await sendRequest(phoneNumberId, accessToken, {
    status: "read",
    message_id: messageId,
  });
}
