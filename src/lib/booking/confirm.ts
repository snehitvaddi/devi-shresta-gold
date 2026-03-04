/**
 * Booking confirmation – create, confirm, and cancel bookings
 */

import { sendTextMessage } from "@/lib/whatsapp/client";

// ── Types ───────────────────────────────────────────────────────────────────

export interface BookingDetails {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  date: string;      // "YYYY-MM-DD"
  startTime: string;  // "HH:MM"
  endTime: string;    // "HH:MM"
  service?: string;
  notes?: string;
}

export interface Booking extends BookingDetails {
  id: string;
  orgId: string;
  status: "confirmed" | "cancelled" | "completed" | "no_show";
  createdAt: number;
  updatedAt: number;
}

export interface BookingResult {
  success: boolean;
  booking?: Booking;
  error?: string;
}

// ── In-memory store ─────────────────────────────────────────────────────────

const bookings = new Map<string, Booking>();

function generateId(): string {
  return `bk_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ── Public API ──────────────────────────────────────────────────────────────

/** Create a new booking */
export async function createBooking(
  orgId: string,
  details: BookingDetails
): Promise<BookingResult> {
  const id = generateId();
  const now = Date.now();

  const booking: Booking = {
    ...details,
    id,
    orgId,
    status: "confirmed",
    createdAt: now,
    updatedAt: now,
  };

  bookings.set(id, booking);

  return { success: true, booking };
}

/**
 * Send booking confirmation to the customer via WhatsApp and/or email.
 * Returns true if at least one notification channel succeeded.
 */
export async function sendConfirmation(booking: Booking): Promise<boolean> {
  let sent = false;

  // WhatsApp confirmation
  if (booking.customerPhone) {
    const message = formatConfirmationMessage(booking);
    try {
      await sendTextMessage(booking.customerPhone, message);
      sent = true;
    } catch (err) {
      console.error("Failed to send WhatsApp confirmation:", err);
    }
  }

  // Email confirmation (placeholder — integrate with email provider)
  if (booking.customerEmail) {
    try {
      await sendEmailConfirmation(booking);
      sent = true;
    } catch (err) {
      console.error("Failed to send email confirmation:", err);
    }
  }

  return sent;
}

/** Cancel a booking and notify the customer */
export async function cancelBooking(
  bookingId: string,
  reason?: string
): Promise<BookingResult> {
  const booking = bookings.get(bookingId);

  if (!booking) {
    return { success: false, error: "Booking not found" };
  }

  if (booking.status === "cancelled") {
    return { success: false, error: "Booking already cancelled" };
  }

  booking.status = "cancelled";
  booking.updatedAt = Date.now();

  // Notify customer
  if (booking.customerPhone) {
    const message = formatCancellationMessage(booking, reason);
    try {
      await sendTextMessage(booking.customerPhone, message);
    } catch (err) {
      console.error("Failed to send cancellation notification:", err);
    }
  }

  return { success: true, booking };
}

/** Retrieve a booking by ID */
export function getBooking(bookingId: string): Booking | undefined {
  return bookings.get(bookingId);
}

/** List all bookings for an org, optionally filtered by date */
export function listBookings(
  orgId: string,
  date?: string
): Booking[] {
  const results: Booking[] = [];

  for (const booking of bookings.values()) {
    if (booking.orgId !== orgId) continue;
    if (date && booking.date !== date) continue;
    results.push(booking);
  }

  return results.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.startTime.localeCompare(b.startTime);
  });
}

// ── Message formatting ──────────────────────────────────────────────────────

function formatConfirmationMessage(booking: Booking): string {
  const lines = [
    `Booking Confirmed`,
    ``,
    `Hi ${booking.customerName},`,
    `Your appointment has been confirmed:`,
    ``,
    `Date: ${booking.date}`,
    `Time: ${booking.startTime} - ${booking.endTime}`,
  ];

  if (booking.service) {
    lines.push(`Service: ${booking.service}`);
  }

  lines.push(
    ``,
    `If you need to reschedule or cancel, please reply to this message.`,
    ``,
    `Thank you!`
  );

  return lines.join("\n");
}

function formatCancellationMessage(
  booking: Booking,
  reason?: string
): string {
  const lines = [
    `Booking Cancelled`,
    ``,
    `Hi ${booking.customerName},`,
    `Your appointment on ${booking.date} at ${booking.startTime} has been cancelled.`,
  ];

  if (reason) {
    lines.push(`Reason: ${reason}`);
  }

  lines.push(
    ``,
    `If you'd like to rebook, please reply to this message.`
  );

  return lines.join("\n");
}

// ── Email (placeholder) ─────────────────────────────────────────────────────

async function sendEmailConfirmation(_booking: Booking): Promise<void> {
  // Integrate with your email provider (Resend, SendGrid, etc.)
  // For now, this is a no-op placeholder.
  console.log(`[Email] Would send confirmation to ${_booking.customerEmail}`);
}
