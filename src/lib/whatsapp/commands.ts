/**
 * CMS commands for business owners via WhatsApp
 *
 * Owners can manage products, hours, and view orders/stats by texting the
 * WhatsApp business number using a simple command syntax.
 */

// ── Types ───────────────────────────────────────────────────────────────────

export type CommandType =
  | "ADD_PRODUCT"
  | "UPDATE_PRICE"
  | "UPDATE_HOURS"
  | "UPDATE_STATUS"
  | "GET_ORDERS"
  | "GET_STATS";

export interface ParsedCommand {
  type: CommandType;
  params: Record<string, string>;
  raw: string;
}

export interface CommandResult {
  success: boolean;
  message: string;
  data?: unknown;
}

export interface OrgConfig {
  orgId: string;
  ownerPhoneNumbers: string[];
}

// ── Command patterns ────────────────────────────────────────────────────────

interface CommandPattern {
  type: CommandType;
  pattern: RegExp;
  groups: string[];
}

const COMMAND_PATTERNS: CommandPattern[] = [
  {
    type: "ADD_PRODUCT",
    pattern:
      /^(?:add\s+product|new\s+product)\s+(.+?)\s+(?:at|@|price)\s+(\d+(?:\.\d{1,2})?)\s*(?:desc(?:ription)?\s+(.+))?$/i,
    groups: ["name", "price", "description"],
  },
  {
    type: "UPDATE_PRICE",
    pattern:
      /^(?:update\s+price|change\s+price|price)\s+(.+?)\s+(?:to|=)\s+(\d+(?:\.\d{1,2})?)$/i,
    groups: ["name", "price"],
  },
  {
    type: "UPDATE_HOURS",
    pattern:
      /^(?:update\s+hours|set\s+hours|hours)\s+(\w+)\s+(\d{1,2}(?::\d{2})?(?:\s*(?:am|pm))?)\s*-\s*(\d{1,2}(?::\d{2})?(?:\s*(?:am|pm))?)$/i,
    groups: ["day", "open", "close"],
  },
  {
    type: "UPDATE_STATUS",
    pattern:
      /^(?:update\s+status|set\s+status|status)\s+(.+?)\s+(?:to|=)\s+(available|sold|reserved|unavailable)$/i,
    groups: ["name", "status"],
  },
  {
    type: "GET_ORDERS",
    pattern: /^(?:get\s+orders|orders|show\s+orders)(?:\s+(today|week|pending|all))?$/i,
    groups: ["filter"],
  },
  {
    type: "GET_STATS",
    pattern: /^(?:get\s+stats|stats|show\s+stats|analytics)(?:\s+(today|week|month|all))?$/i,
    groups: ["period"],
  },
];

// ── Public API ──────────────────────────────────────────────────────────────

/** Check if a sender is an authenticated owner */
export function isOwner(senderPhone: string, orgConfig: OrgConfig): boolean {
  const normalized = senderPhone.replace(/\D/g, "");
  return orgConfig.ownerPhoneNumbers.some(
    (num) => num.replace(/\D/g, "") === normalized
  );
}

/** Try to parse a text message as a CMS command. Returns null if not a command. */
export function parseCommand(text: string): ParsedCommand | null {
  const trimmed = text.trim();

  for (const { type, pattern, groups } of COMMAND_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match) {
      const params: Record<string, string> = {};
      for (let i = 0; i < groups.length; i++) {
        const value = match[i + 1];
        if (value !== undefined) {
          params[groups[i]] = value.trim();
        }
      }
      return { type, params, raw: trimmed };
    }
  }

  return null;
}

/**
 * Execute a parsed CMS command.
 *
 * This is the integration point where each command calls the appropriate
 * data layer function (Supabase, etc). The implementations below are
 * structured for easy wiring; the actual DB calls will be injected via
 * the executor map.
 */
export type CommandExecutor = (
  orgId: string,
  params: Record<string, string>
) => Promise<CommandResult>;

const DEFAULT_EXECUTORS: Record<CommandType, CommandExecutor> = {
  ADD_PRODUCT: async (_orgId, params) => ({
    success: true,
    message: `Product "${params.name}" added at $${params.price}.`,
    data: params,
  }),
  UPDATE_PRICE: async (_orgId, params) => ({
    success: true,
    message: `Price for "${params.name}" updated to $${params.price}.`,
    data: params,
  }),
  UPDATE_HOURS: async (_orgId, params) => ({
    success: true,
    message: `Hours for ${params.day} set to ${params.open} - ${params.close}.`,
    data: params,
  }),
  UPDATE_STATUS: async (_orgId, params) => ({
    success: true,
    message: `Status for "${params.name}" set to ${params.status}.`,
    data: params,
  }),
  GET_ORDERS: async (_orgId, params) => ({
    success: true,
    message: `Showing ${params.filter ?? "recent"} orders.`,
    data: [],
  }),
  GET_STATS: async (_orgId, params) => ({
    success: true,
    message: `Stats for ${params.period ?? "today"}.`,
    data: {},
  }),
};

/** Execute a command, optionally with custom executors for DB integration */
export async function executeCommand(
  orgId: string,
  command: ParsedCommand,
  executors?: Partial<Record<CommandType, CommandExecutor>>
): Promise<CommandResult> {
  const executor =
    executors?.[command.type] ?? DEFAULT_EXECUTORS[command.type];

  if (!executor) {
    return { success: false, message: `Unknown command: ${command.type}` };
  }

  try {
    return await executor(orgId, command.params);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Command execution failed";
    return { success: false, message };
  }
}

/** Convenience: parse + authenticate + execute in one call */
export async function handleOwnerMessage(
  senderPhone: string,
  text: string,
  orgConfig: OrgConfig,
  executors?: Partial<Record<CommandType, CommandExecutor>>
): Promise<CommandResult | null> {
  if (!isOwner(senderPhone, orgConfig)) {
    return null;
  }

  const command = parseCommand(text);
  if (!command) {
    return null;
  }

  return executeCommand(orgConfig.orgId, command, executors);
}
