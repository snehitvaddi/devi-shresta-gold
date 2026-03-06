import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, date, time, interests, budget, platform, notes, email } = body;

    if (!name || !phone || !date || !time) {
      return NextResponse.json(
        { error: 'Name, phone, date, and time are required.' },
        { status: 400 }
      );
    }

    // Log the booking (in production, save to Supabase + send WhatsApp notification)
    console.log('=== VIDEO CALL BOOKING ===');
    console.log(`Name: ${name}`);
    console.log(`Phone: ${phone}`);
    console.log(`Email: ${email || 'N/A'}`);
    console.log(`Date: ${date}`);
    console.log(`Time: ${time}`);
    console.log(`Platform: ${platform}`);
    console.log(`Interests: ${interests?.join(', ') || 'N/A'}`);
    console.log(`Budget: ${budget || 'N/A'}`);
    console.log(`Notes: ${notes || 'N/A'}`);
    console.log('========================');

    return NextResponse.json({
      success: true,
      message: 'Video call booked successfully. We will confirm via WhatsApp.',
      booking: { name, phone, date, time, platform },
    });
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body.' },
      { status: 400 }
    );
  }
}
