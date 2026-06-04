import { NextResponse } from "next/server";

const otpStore = globalThis.__visitOtpStore ?? new Map();
if (!globalThis.__visitOtpStore) {
  globalThis.__visitOtpStore = otpStore;
}

const OTP_TTL_MS = 5 * 60 * 1000;

function normalizePhone(phone) {
  return String(phone).replace(/\D/g, "").slice(-10);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, propertyId, propertyTitle } = body;

    if (!name?.trim() || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Please enter your full name." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const normalizedPhone = normalizePhone(phone);
    if (normalizedPhone.length !== 10) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit mobile number." },
        { status: 400 }
      );
    }

    if (!propertyId) {
      return NextResponse.json(
        { error: "Property information is missing." },
        { status: 400 }
      );
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    otpStore.set(normalizedPhone, {
      otp,
      expires: Date.now() + OTP_TTL_MS,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      propertyId,
      propertyTitle: propertyTitle || "",
    });

    const payload = {
      success: true,
      message: "OTP sent successfully.",
      expiresIn: OTP_TTL_MS / 1000,
    };

    if (process.env.NODE_ENV === "development") {
      payload.demoOtp = otp;
    }

    return NextResponse.json(payload);
  } catch {
    return NextResponse.json(
      { error: "Unable to send OTP. Please try again." },
      { status: 500 }
    );
  }
}
