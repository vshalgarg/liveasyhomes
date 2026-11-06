import { NextResponse } from "next/server";
import { setAuthCookies } from "@/lib/auth-cookies";
import { serverApiFetch } from "@/lib/server-api";

const ALLOWED_PUBLIC_ROLES = new Set(["LANDLORD", "TENANT"]);

export async function POST(request) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body is invalid." }, { status: 400 });
  }

  const requestedRole = String(payload?.role || "LANDLORD").toUpperCase();
  if (!ALLOWED_PUBLIC_ROLES.has(requestedRole)) {
    return NextResponse.json(
      { error: "Invalid account type. Choose Landlord or Tenant." },
      { status: 400 }
    );
  }

  const { res, data } = await serverApiFetch("/api/auth/register", {
    method: "POST",
    body: {
      name: String(payload?.name || "").trim(),
      email: String(payload?.email || "").trim(),
      phone: String(payload?.phone || "").trim(),
      password: String(payload?.password || ""),
      role: requestedRole,
    },
  });

  if (!res.ok) {
    return NextResponse.json(
      {
        error: data?.error || data?.message || "Registration failed.",
        fields: data?.fields,
      },
      { status: res.status }
    );
  }

  if (!data?.token || !data?.user) {
    return NextResponse.json(
      { error: "Unexpected registration response from API." },
      { status: 502 }
    );
  }

  await setAuthCookies({
    token: data.token,
    user: data.user,
    expiresIn: data.expiresIn,
  });

  return NextResponse.json({
    user: data.user,
    tokenType: data.tokenType || "Bearer",
    expiresIn: data.expiresIn,
  });
}
