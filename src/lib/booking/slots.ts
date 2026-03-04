/**
 * Time slot generation for booking system
 *
 * Generates available time slots for a given date, respecting
 * business hours, existing bookings, and blocked periods.
 */

import { getBusinessHours, isAvailable } from "./calendar";

// ── Types ───────────────────────────────────────────────────────────────────

export interface TimeSlot {
  start: string; // "09:00"
  end: string;   // "09:30"
  available: boolean;
}

export interface ExistingBooking {
  start: string;
  end: string;
}

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Generate all time slots for a given date.
 *
 * @param orgId    - Organisation ID
 * @param date     - The date to generate slots for
 * @param duration - Slot duration in minutes (default 30)
 * @param existing - Already-booked slots to mark as unavailable
 */
export function generateSlots(
  orgId: string,
  date: Date,
  duration: number = 30,
  existing: ExistingBooking[] = []
): TimeSlot[] {
  const hours = getBusinessHours(orgId, date);

  if (hours.closed) return [];

  const slots: TimeSlot[] = [];
  let current = parseTime(hours.open);
  const end = parseTime(hours.close);

  while (current + duration <= end) {
    const startStr = formatTime(current);
    const endStr = formatTime(current + duration);

    // Check calendar-level availability (blocked dates, business hours)
    let available = isAvailable(orgId, date, startStr);

    // Check against existing bookings
    if (available) {
      available = !hasConflict(startStr, endStr, existing);
    }

    slots.push({ start: startStr, end: endStr, available });

    current += duration;
  }

  return slots;
}

/**
 * Get only available slots for a date.
 */
export function getAvailableSlots(
  orgId: string,
  date: Date,
  duration: number = 30,
  existing: ExistingBooking[] = []
): TimeSlot[] {
  return generateSlots(orgId, date, duration, existing).filter(
    (s) => s.available
  );
}

/**
 * Check if a specific time range is available (no conflicts).
 */
export function isSlotAvailable(
  orgId: string,
  date: Date,
  start: string,
  end: string,
  existing: ExistingBooking[] = []
): boolean {
  if (!isAvailable(orgId, date, start)) return false;
  return !hasConflict(start, end, existing);
}

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Parse "HH:MM" to minutes since midnight */
function parseTime(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + (m || 0);
}

/** Convert minutes since midnight to "HH:MM" */
function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Check if a proposed slot overlaps with any existing booking */
function hasConflict(
  start: string,
  end: string,
  existing: ExistingBooking[]
): boolean {
  const s = parseTime(start);
  const e = parseTime(end);

  for (const booking of existing) {
    const bs = parseTime(booking.start);
    const be = parseTime(booking.end);

    // Overlap: not (end <= bookingStart or start >= bookingEnd)
    if (!(e <= bs || s >= be)) {
      return true;
    }
  }

  return false;
}
