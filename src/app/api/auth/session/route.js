import { NextResponse } from "next/server";
import { readAuthCookies } from "@/lib/auth-cookies";

export async function GET() {
  const { token, user } = await readAuthCookies();
  if (!token || !user) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  return NextResponse.json({
    authenticated: true,
    user,
  });
}
