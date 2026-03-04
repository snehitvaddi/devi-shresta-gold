/**
 * AI-to-human handover management
 *
 * Detects when a conversation should be escalated to a human agent
 * and manages the handover process.
 */

import { sendTextMessage } from "@/lib/whatsapp/client";

// ── Types ───────────────────────────────────────────────────────────────────

export interface HandoverContext {
  failedAttempts: number;
  conversationLength: number;
  sentiment: "positive" | "neutral" | "negative";
  topics: string[];
}

export interface HandoverRequest {
  customerId: string;
  customerName?: string;
  reason: HandoverReason;
  conversationSummary: string;
  urgency: "low" | "medium" | "high";
  timestamp: number;
}

export type HandoverReason =
  | "explicit_request"
  | "repeated_failure"
  | "complaint"
  | "price_negotiation"
  | "complex_query"
  | "sensitive_topic"
  | "custom_order";

interface EscalationRule {
  check: (message: string, context: HandoverContext) => boolean;
  reason: HandoverReason;
  urgency: "low" | "medium" | "high";
}

// ── Escalation rules ────────────────────────────────────────────────────────

const ESCALATION_RULES: EscalationRule[] = [
  {
    check: (msg) =>
      /\b(speak|talk|connect)\b.*\b(human|person|agent|manager|owner|someone)\b/i.test(msg) ||
      /\b(real person|live agent)\b/i.test(msg),
    reason: "explicit_request",
    urgency: "high",
  },
  {
    check: (_msg, ctx) => ctx.failedAttempts >= 3,
    reason: "repeated_failure",
    urgency: "medium",
  },
  {
    check: (msg) =>
      /\b(complain|terrible|awful|worst|unacceptable|disgusting|furious|angry|scam|fraud|refund)\b/i.test(msg),
    reason: "complaint",
    urgency: "high",
  },
  {
    check: (msg) =>
      /\b(discount|negotiate|lower\s+price|best\s+price|deal|bulk\s+order|wholesale)\b/i.test(msg),
    reason: "price_negotiation",
    urgency: "low",
  },
  {
    check: (msg) =>
      /\b(custom|bespoke|special\s+order|made\s+to\s+order|personalize|engrav)/i.test(msg),
    reason: "custom_order",
    urgency: "medium",
  },
  {
    check: (msg) =>
      /\b(legal|lawyer|lawsuit|police|consumer\s+protection|bbb)\b/i.test(msg),
    reason: "sensitive_topic",
    urgency: "high",
  },
];

// ── HandoverManager ─────────────────────────────────────────────────────────

export class HandoverManager {
  private ownerPhones: string[];
  private maxAutoRetries: number;

  constructor(ownerPhones: string[], maxAutoRetries: number = 3) {
    this.ownerPhones = ownerPhones;
    this.maxAutoRetries = maxAutoRetries;
  }

  /** Determine if the current message/context warrants a human handover */
  shouldHandover(message: string, context: HandoverContext): {
    handover: boolean;
    reason?: HandoverReason;
    urgency?: "low" | "medium" | "high";
  } {
    // Check explicit failure threshold
    if (context.failedAttempts >= this.maxAutoRetries) {
      return { handover: true, reason: "repeated_failure", urgency: "medium" };
    }

    // Check all escalation rules
    for (const rule of ESCALATION_RULES) {
      if (rule.check(message, context)) {
        return { handover: true, reason: rule.reason, urgency: rule.urgency };
      }
    }

    return { handover: false };
  }

  /**
   * Initiate a handover: notify the business owner(s) via WhatsApp
   * with conversation context.
   */
  async initiateHandover(
    customerId: string,
    reason: HandoverReason,
    conversationHistory: { role: string; content: string }[],
    customerName?: string
  ): Promise<HandoverRequest> {
    const summary = this.summarizeConversation(conversationHistory);

    const request: HandoverRequest = {
      customerId,
      customerName,
      reason,
      conversationSummary: summary,
      urgency: this.getUrgency(reason),
      timestamp: Date.now(),
    };

    // Notify all owner phones
    const notificationText = this.formatNotification(request);
    const notifications = this.ownerPhones.map((phone) =>
      sendTextMessage(phone, notificationText).catch((err) => {
        console.error(`Failed to notify owner ${phone}:`, err);
      })
    );

    await Promise.allSettled(notifications);

    return request;
  }

  // ── Private helpers ───────────────────────────────────────────────────

  private getUrgency(reason: HandoverReason): "low" | "medium" | "high" {
    const urgencyMap: Record<HandoverReason, "low" | "medium" | "high"> = {
      explicit_request: "high",
      repeated_failure: "medium",
      complaint: "high",
      price_negotiation: "low",
      complex_query: "medium",
      sensitive_topic: "high",
      custom_order: "medium",
    };
    return urgencyMap[reason];
  }

  private summarizeConversation(
    history: { role: string; content: string }[]
  ): string {
    const recentMessages = history.slice(-6);
    return recentMessages
      .map((m) => `${m.role === "user" ? "Customer" : "AI"}: ${m.content.slice(0, 200)}`)
      .join("\n");
  }

  private formatNotification(request: HandoverRequest): string {
    const urgencyEmoji: Record<string, string> = {
      low: "INFO",
      medium: "ATTENTION",
      high: "URGENT",
    };

    return [
      `[${urgencyEmoji[request.urgency]}] Customer handover request`,
      ``,
      `Customer: ${request.customerName ?? request.customerId}`,
      `Reason: ${request.reason.replace(/_/g, " ")}`,
      ``,
      `Recent conversation:`,
      request.conversationSummary,
      ``,
      `Reply to this number to take over the conversation.`,
    ].join("\n");
  }
}
