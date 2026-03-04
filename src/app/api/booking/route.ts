import { NextRequest, NextResponse } from "next/server";
import {
  createBooking,
  sendConfirmation,
  listBookings,
  type BookingDetails,
} from "@/lib/booking/confirm";
import { getAvailableSlots } from "@/lib/booking/slots";
import { getCurrentOrgId } from "@/lib/data/org";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, service, date, time, notes } = body as {
      name: string;
      phone: string;
      email: string;
      service: string;
      date: string;
      time: string;
      notes?: string;
    };

    if (!name || !phone || !email || !service || !date || !time) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 },
      );
    }

    const orgId = getCurrentOrgId();

    const details: BookingDetails = {
      customerName: name,
      customerPhone: phone,
      customerEmail: email,
      date,
      startTime: time,
      endTime: time, // Duration handled by service type
      service,
      notes,
    };

    const result = await createBooking(orgId, details);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error ?? "Failed to create booking" },
        { status: 400 },
      );
    }

    // Send confirmation asynchronously
    if (result.booking) {
      sendConfirmation(result.booking).catch((err) =>
        console.error("[Booking] Confirmation send failed:", err),
      );
    }

    return NextResponse.json({
      success: true,
      bookingId: result.booking?.id,
      message: "Appointment booked successfully",
    });
  } catch (error) {
    console.error("[API /booking] Error:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const orgId = getCurrentOrgId();

    if (date) {
      // Return available time slots for a date
      const slots = getAvailableSlots(orgId, new Date(date));
      return NextResponse.json({ date, slots });
    }

    // Return all bookings for today
    const today = new Date().toISOString().split("T")[0];
    const bookings = listBookings(orgId, today);
    return NextResponse.json({ date: today, bookings });
  } catch (error) {
    console.error("[API /booking GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking data" },
      { status: 500 },
    );
  }
}
