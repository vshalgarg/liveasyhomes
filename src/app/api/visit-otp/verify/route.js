import { NextResponse } from "next/server";

const otpStore = globalThis.__visitOtpStore ?? new Map();

function normalizePhone(phone) {
  return String(phone).replace(/\D/g, "").slice(-10);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { phone, otp } = body;

    const normalizedPhone = normalizePhone(phone);
    const code = String(otp || "").trim();

    if (normalizedPhone.length !== 10) {
      return NextResponse.json(
        { error: "Invalid phone number." },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { error: "Please enter the 6-digit OTP." },
        { status: 400 }
      );
    }

    const entry = otpStore.get(normalizedPhone);

    if (!entry) {
      return NextResponse.json(
        { error: "OTP expired or not found. Please request a new code." },
        { status: 400 }
      );
    }

    if (Date.now() > entry.expires) {
      otpStore.delete(normalizedPhone);
      return NextResponse.json(
        { error: "OTP has expired. Please request a new code." },
        { status: 400 }
      );
    }

    if (entry.otp !== code) {
      return NextResponse.json(
        { error: "Incorrect OTP. Please try again." },
        { status: 400 }
      );
    }

    otpStore.delete(normalizedPhone);

    return NextResponse.json({
      success: true,
      message: "Visit scheduled successfully.",
      booking: {
        name: entry.name,
        email: entry.email,
        propertyId: entry.propertyId,
        propertyTitle: entry.propertyTitle,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Verification failed. Please try again." },
      { status: 500 }
    );
  }
}
