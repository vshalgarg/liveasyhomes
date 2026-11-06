#!/usr/bin/env node
/**
 * Go-live smoke checks for LiveEasy Homes (Next.js + Spring API).
 * Usage:
 *   node scripts/go-live-check.mjs
 *   SITE_URL=https://liveasyhomes.com API_URL=https://api.liveasyhomes.com node scripts/go-live-check.mjs
 */

const SITE_URL = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
const API_URL = (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080").replace(/\/$/, "");

const results = [];

function record(name, ok, detail = "") {
  results.push({ name, ok, detail });
  const mark = ok ? "PASS" : "FAIL";
  console.log(`${mark.padEnd(4)}  ${name}${detail ? ` — ${detail}` : ""}`);
}

async function checkJson(url, opts = {}) {
  const res = await fetch(url, { ...opts, redirect: "manual" });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }
  return { res, text, data };
}

async function main() {
  console.log(`\nLiveEasy go-live check`);
  console.log(`SITE_URL=${SITE_URL}`);
  console.log(`API_URL=${API_URL}\n`);

  // --- Env shape ---
  record(
    "SITE_URL uses https (or localhost for local)",
    SITE_URL.startsWith("https://") || SITE_URL.includes("localhost"),
    SITE_URL
  );
  record(
    "API_URL uses https (or localhost for local)",
    API_URL.startsWith("https://") || API_URL.includes("localhost"),
    API_URL
  );
  record(
    "SITE_URL is not the placeholder-only check for prod hosts",
    !(SITE_URL.includes("localhost") && process.env.REQUIRE_PROD === "1"),
    process.env.REQUIRE_PROD === "1" ? "REQUIRE_PROD=1" : "local/staging allowed"
  );

  // --- API ---
  try {
    const props = await checkJson(`${API_URL}/api/properties?size=5`);
    record(
      "GET /api/properties",
      props.res.ok,
      `HTTP ${props.res.status}`
    );
    const content = Array.isArray(props.data)
      ? props.data
      : props.data?.content || [];
    record(
      "Properties payload has content array",
      Array.isArray(content),
      `count=${content.length}`
    );

    if (content[0]?.id) {
      const one = await checkJson(`${API_URL}/api/properties/${encodeURIComponent(content[0].id)}`);
      record(
        "GET /api/properties/{id}",
        one.res.ok && one.data?.id,
        `id=${content[0].id} HTTP ${one.res.status}`
      );
      const imgs = one.data?.images || [];
      if (imgs[0]) {
        try {
          const imgRes = await fetch(imgs[0], { method: "HEAD", redirect: "follow" });
          record(
            "First listing image URL reachable",
            imgRes.ok,
            `${imgRes.status} ${imgs[0].slice(0, 80)}…`
          );
        } catch (e) {
          record("First listing image URL reachable", false, e.message);
        }
      } else {
        record("First listing image URL reachable", false, "no images on first listing");
      }
    } else {
      record("GET /api/properties/{id}", false, "no listings to sample");
      record("First listing image URL reachable", false, "skipped");
    }

    const unauth = await checkJson(`${API_URL}/api/properties`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "x" }),
    });
    record(
      "POST /api/properties without auth is rejected",
      unauth.res.status === 401 || unauth.res.status === 403,
      `HTTP ${unauth.res.status}`
    );
  } catch (e) {
    record("GET /api/properties", false, e.message);
    record("Properties payload has content array", false, "API unreachable");
    record("GET /api/properties/{id}", false, "skipped");
    record("First listing image URL reachable", false, "skipped");
    record("POST /api/properties without auth is rejected", false, "skipped");
  }

  // --- Next.js app ---
  const pages = ["/home", "/listings", "/about", "/contact", "/robots.txt", "/sitemap.xml"];
  for (const path of pages) {
    try {
      const res = await fetch(`${SITE_URL}${path}`, { redirect: "manual" });
      const ok = res.ok || (path === "/home" && (res.status === 200 || res.status === 308 || res.status === 307));
      record(`Frontend ${path}`, ok || res.status === 200, `HTTP ${res.status}`);
    } catch (e) {
      record(`Frontend ${path}`, false, e.message);
    }
  }

  try {
    const session = await checkJson(`${SITE_URL}/api/auth/session`);
    record(
      "GET /api/auth/session",
      session.res.ok && typeof session.data?.authenticated === "boolean",
      `HTTP ${session.res.status} authenticated=${session.data?.authenticated}`
    );
  } catch (e) {
    record("GET /api/auth/session", false, e.message);
  }

  try {
    const admin = await fetch(`${SITE_URL}/admin/properties/add`, { redirect: "manual" });
    record(
      "Admin add page responds",
      admin.status === 200,
      `HTTP ${admin.status}`
    );
  } catch (e) {
    record("Admin add page responds", false, e.message);
  }

  const failed = results.filter((r) => !r.ok);
  console.log(`\nSummary: ${results.length - failed.length}/${results.length} passed`);
  if (failed.length) {
    console.log("Failed:");
    failed.forEach((f) => console.log(`  - ${f.name}: ${f.detail}`));
    process.exitCode = 1;
  } else {
    console.log("All checks passed.");
  }
}

main();
