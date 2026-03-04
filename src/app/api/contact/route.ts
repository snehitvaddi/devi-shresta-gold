import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body as {
      name: string;
      email: string;
      phone?: string;
      message: string;
    };

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 },
      );
    }

    // Log the contact submission (integrate with email/CRM in production)
    console.log("[Contact Form]", {
      name,
      email,
      phone: phone ?? "N/A",
      message: message.slice(0, 200),
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Thank you for your message. We will get back to you shortly.",
    });
  } catch (error) {
    console.error("[API /contact] Error:", error);
    return NextResponse.json(
      { error: "Failed to submit contact form" },
      { status: 500 },
    );
  }
}
