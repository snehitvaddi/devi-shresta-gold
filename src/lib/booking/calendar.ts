/**
 * Booking calendar – availability management
 *
 * Manages business hours, blocked dates, and availability checks.
 * Data is stored per-org and can be backed by Supabase or in-memory.
 */

// ── Types ───────────────────────────────────────────────────────────────────

export interface BusinessHours {
  open: string;  // "09:00"
  close: string; // "18:00"
  closed: boolean;
}

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface WeeklySchedule {
  monday: BusinessHours;
  tuesday: BusinessHours;
  wednesday: BusinessHours;
  thursday: BusinessHours;
  friday: BusinessHours;
  saturday: BusinessHours;
  sunday: BusinessHours;
}

export interface BlockedDate {
  date: string; // "YYYY-MM-DD"
  reason?: string;
  allDay: boolean;
  startTime?: string;
  endTime?: string;
}

export interface CalendarConfig {
  orgId: string;
  schedule: WeeklySchedule;
  blockedDates: BlockedDate[];
  timezone: string;
}

// ── Default schedule ────────────────────────────────────────────────────────

const DEFAULT_SCHEDULE: WeeklySchedule = {
  monday: { open: "10:00", close: "21:00", closed: false },
  tuesday: { open: "10:00", close: "21:00", closed: false },
  wednesday: { open: "10:00", close: "21:00", closed: false },
  thursday: { open: "10:00", close: "21:00", closed: false },
  friday: { open: "10:00", close: "21:00", closed: false },
  saturday: { open: "10:00", close: "21:00", closed: false },
  sunday: { open: "10:00", close: "21:00", closed: false },
};

// ── In-memory store ─────────────────────────────────────────────────────────

const calendars = new Map<string, CalendarConfig>();

/** Get or initialise calendar config for an org */
export function getCalendarConfig(orgId: string): CalendarConfig {
  if (!calendars.has(orgId)) {
    calendars.set(orgId, {
      orgId,
      schedule: { ...DEFAULT_SCHEDULE },
      blockedDates: [],
      timezone: "Asia/Kolkata",
    });
  }
  return calendars.get(orgId)!;
}

/** Update calendar config */
export function setCalendarConfig(config: CalendarConfig): void {
  calendars.set(config.orgId, config);
}

// ── Public API ──────────────────────────────────────────────────────────────

/** Get the business hours for a specific date */
export function getBusinessHours(
  orgId: string,
  date: Date
): BusinessHours {
  const config = getCalendarConfig(orgId);
  const dayNames: DayOfWeek[] = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const day = dayNames[date.getDay()];
  return config.schedule[day];
}

/** Get all blocked dates for an org */
export function getBlockedDates(orgId: string): BlockedDate[] {
  const config = getCalendarConfig(orgId);
  return config.blockedDates;
}

/** Add a blocked date */
export function addBlockedDate(orgId: string, blocked: BlockedDate): void {
  const config = getCalendarConfig(orgId);
  config.blockedDates.push(blocked);
}

/** Remove a blocked date */
export function removeBlockedDate(orgId: string, date: string): boolean {
  const config = getCalendarConfig(orgId);
  const idx = config.blockedDates.findIndex((b) => b.date === date);
  if (idx >= 0) {
    config.blockedDates.splice(idx, 1);
    return true;
  }
  return false;
}

/** Check if a specific date and time is available */
export function isAvailable(
  orgId: string,
  date: Date,
  time: string
): boolean {
  const hours = getBusinessHours(orgId, date);

  // Closed day
  if (hours.closed) return false;

  // Check time is within business hours
  if (time < hours.open || time >= hours.close) return false;

  // Check blocked dates
  const dateStr = formatDate(date);
  const config = getCalendarConfig(orgId);

  for (const blocked of config.blockedDates) {
    if (blocked.date !== dateStr) continue;

    if (blocked.allDay) return false;

    // Partial block: check time overlap
    if (
      blocked.startTime &&
      blocked.endTime &&
      time >= blocked.startTime &&
      time < blocked.endTime
    ) {
      return false;
    }
  }

  return true;
}

/** Update business hours for a specific day */
export function updateBusinessHours(
  orgId: string,
  day: DayOfWeek,
  hours: BusinessHours
): void {
  const config = getCalendarConfig(orgId);
  config.schedule[day] = hours;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
