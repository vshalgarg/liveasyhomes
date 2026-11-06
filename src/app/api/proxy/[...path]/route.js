import { NextResponse } from "next/server";
import { readAuthCookies } from "@/lib/auth-cookies";
import { SERVER_API_BASE_URL } from "@/lib/server-api";

async function forward(request, context) {
  const { token } = await readAuthCookies();
  if (!token) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 }
    );
  }

  const params = await context.params;
  const parts = params?.path || [];
  const backendPath = `/${parts.join("/")}`;
  const incomingUrl = new URL(request.url);
  const target = `${SERVER_API_BASE_URL}/api${backendPath}${incomingUrl.search}`;

  const method = request.method.toUpperCase();
  const headers = new Headers();
  headers.set("Authorization", `Bearer ${token}`);

  let body;
  if (method !== "GET" && method !== "HEAD") {
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      body = await request.formData();
    } else if (contentType.includes("application/json")) {
      headers.set("Content-Type", "application/json");
      body = await request.text();
    } else {
      body = await request.arrayBuffer();
      if (contentType) headers.set("Content-Type", contentType);
    }
  }

  let upstream;
  try {
    upstream = await fetch(target, {
      method,
      headers,
      body,
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { error: "Cannot reach the API server." },
      { status: 502 }
    );
  }

  const responseHeaders = new Headers();
  const upstreamType = upstream.headers.get("content-type");
  if (upstreamType) responseHeaders.set("content-type", upstreamType);

  const buffer = await upstream.arrayBuffer();
  return new NextResponse(buffer, {
    status: upstream.status,
    headers: responseHeaders,
  });
}

export const GET = forward;
export const POST = forward;
export const PUT = forward;
export const PATCH = forward;
export const DELETE = forward;
