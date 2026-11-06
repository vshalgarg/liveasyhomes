import { NextResponse } from "next/server";
import { setAuthCookies } from "@/lib/auth-cookies";
import { serverApiFetch } from "@/lib/server-api";

export async function POST(request) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body is invalid." }, { status: 400 });
  }

  const { res, data } = await serverApiFetch("/api/auth/login", {
    method: "POST",
    body: {
      email: String(payload?.email || "").trim(),
      password: String(payload?.password || ""),
    },
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: data?.error || data?.message || "Login failed.", fields: data?.fields },
      { status: res.status }
    );
  }

  if (!data?.token || !data?.user) {
    return NextResponse.json(
      { error: "Unexpected login response from API." },
      { status: 502 }
    );
  }

  await setAuthCookies({
    token: data.token,
    user: data.user,
    expiresIn: data.expiresIn,
  });

  // Never return the JWT to the browser — keep it httpOnly only.
  return NextResponse.json({
    user: data.user,
    tokenType: data.tokenType || "Bearer",
    expiresIn: data.expiresIn,
  });
}
