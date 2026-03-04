/**
 * WhatsApp Webhook – incoming message parser and router
 */

// ── Message types (discriminated union) ─────────────────────────────────────

export interface BaseMessage {
  messageId: string;
  from: string;
  timestamp: number;
  profileName?: string;
}

export interface TextMessage extends BaseMessage {
  type: "text";
  text: string;
}

export interface ImageMessage extends BaseMessage {
  type: "image";
  mediaId: string;
  mimeType: string;
  caption?: string;
}

export interface LocationMessage extends BaseMessage {
  type: "location";
  latitude: number;
  longitude: number;
  name?: string;
  address?: string;
}

export interface ButtonReplyMessage extends BaseMessage {
  type: "button_reply";
  buttonId: string;
  buttonTitle: string;
}

export interface UnknownMessage extends BaseMessage {
  type: "unknown";
}

export type IncomingMessage =
  | TextMessage
  | ImageMessage
  | LocationMessage
  | ButtonReplyMessage
  | UnknownMessage;

export interface WebhookStatus {
  id: string;
  status: "sent" | "delivered" | "read" | "failed";
  recipientId: string;
  timestamp: number;
}

export interface ParsedWebhook {
  messages: IncomingMessage[];
  statuses: WebhookStatus[];
}

// ── Raw WhatsApp payload shapes ─────────────────────────────────────────────

interface RawWAMessage {
  id: string;
  from: string;
  timestamp: string;
  type: string;
  text?: { body: string };
  image?: { id: string; mime_type: string; caption?: string };
  location?: {
    latitude: number;
    longitude: number;
    name?: string;
    address?: string;
  };
  interactive?: {
    type: string;
    button_reply?: { id: string; title: string };
  };
}

interface RawWAStatus {
  id: string;
  status: string;
  recipient_id: string;
  timestamp: string;
}

interface RawWAValue {
  messaging_product: string;
  metadata: { display_phone_number: string; phone_number_id: string };
  contacts?: { profile: { name: string }; wa_id: string }[];
  messages?: RawWAMessage[];
  statuses?: RawWAStatus[];
}

interface RawWebhookBody {
  object: string;
  entry?: {
    id: string;
    changes: { value: RawWAValue; field: string }[];
  }[];
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function toIncomingMessage(
  raw: RawWAMessage,
  profileName?: string
): IncomingMessage {
  const base: BaseMessage = {
    messageId: raw.id,
    from: raw.from,
    timestamp: parseInt(raw.timestamp, 10),
    profileName,
  };

  switch (raw.type) {
    case "text":
      return { ...base, type: "text", text: raw.text?.body ?? "" };

    case "image":
      return {
        ...base,
        type: "image",
        mediaId: raw.image?.id ?? "",
        mimeType: raw.image?.mime_type ?? "image/jpeg",
        caption: raw.image?.caption,
      };

    case "location":
      return {
        ...base,
        type: "location",
        latitude: raw.location?.latitude ?? 0,
        longitude: raw.location?.longitude ?? 0,
        name: raw.location?.name,
        address: raw.location?.address,
      };

    case "interactive":
      if (raw.interactive?.type === "button_reply" && raw.interactive.button_reply) {
        return {
          ...base,
          type: "button_reply",
          buttonId: raw.interactive.button_reply.id,
          buttonTitle: raw.interactive.button_reply.title,
        };
      }
      return { ...base, type: "unknown" };

    default:
      return { ...base, type: "unknown" };
  }
}

// ── Public API ──────────────────────────────────────────────────────────────

/** Parse a raw WhatsApp webhook body into typed messages and statuses */
export function parseWebhookPayload(body: unknown): ParsedWebhook {
  const payload = body as RawWebhookBody;
  const messages: IncomingMessage[] = [];
  const statuses: WebhookStatus[] = [];

  if (payload.object !== "whatsapp_business_account" || !payload.entry) {
    return { messages, statuses };
  }

  for (const entry of payload.entry) {
    for (const change of entry.changes) {
      const value = change.value;

      // Build name lookup from contacts
      const nameMap = new Map<string, string>();
      for (const c of value.contacts ?? []) {
        nameMap.set(c.wa_id, c.profile.name);
      }

      // Parse messages
      for (const raw of value.messages ?? []) {
        messages.push(toIncomingMessage(raw, nameMap.get(raw.from)));
      }

      // Parse statuses
      for (const raw of value.statuses ?? []) {
        statuses.push({
          id: raw.id,
          status: raw.status as WebhookStatus["status"],
          recipientId: raw.recipient_id,
          timestamp: parseInt(raw.timestamp, 10),
        });
      }
    }
  }

  return { messages, statuses };
}

/** Route handler for incoming text messages */
export interface MessageRouterConfig {
  onTextMessage: (msg: TextMessage) => Promise<void>;
  onImageMessage: (msg: ImageMessage) => Promise<void>;
  onLocationMessage: (msg: LocationMessage) => Promise<void>;
  onButtonReply?: (msg: ButtonReplyMessage) => Promise<void>;
  onUnknown?: (msg: UnknownMessage) => Promise<void>;
}

/** Route parsed messages to appropriate handlers */
export async function routeMessages(
  parsed: ParsedWebhook,
  config: MessageRouterConfig
): Promise<void> {
  for (const msg of parsed.messages) {
    switch (msg.type) {
      case "text":
        await config.onTextMessage(msg);
        break;
      case "image":
        await config.onImageMessage(msg);
        break;
      case "location":
        await config.onLocationMessage(msg);
        break;
      case "button_reply":
        await config.onButtonReply?.(msg);
        break;
      case "unknown":
        await config.onUnknown?.(msg);
        break;
    }
  }
}
