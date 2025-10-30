import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function extractClientIp(req: NextRequest): string | undefined {
  const headers = req.headers;
  // Prefer explicit query override for local testing: /api/location?ip=8.8.8.8
  const { searchParams } = new URL(req.url);
  const overrideIp = searchParams.get("ip") || undefined;
  if (overrideIp) return overrideIp.trim();

  const xff = headers.get("x-forwarded-for");
  if (xff && xff.length > 0) {
    // x-forwarded-for may contain multiple IPs: client, proxy1, proxy2
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }

  const xri = headers.get("x-real-ip");
  if (xri && xri.length > 0) return xri.trim();

  const cf = headers.get("cf-connecting-ip");
  if (cf && cf.length > 0) return cf.trim();

  // Next.js (Node) may expose req.ip in some deployments via header
  const forwarded = headers.get("forwarded");
  if (forwarded) {
    // e.g., "for=203.0.113.195;proto=https;by=203.0.113.43"
    const match = forwarded.match(/for=([^;]+)/i);
    if (match?.[1]) return match[1].replace(/"/g, "").trim();
  }

  return undefined;
}

function isPrivateOrLocal(ip: string): boolean {
  const v4 = ip.match(/^(\d{1,3}\.){3}\d{1,3}$/);
  if (v4) {
    const parts = ip.split(".").map(Number);
    const [a, b] = parts;
    if (a === 10) return true; // 10.0.0.0/8
    if (a === 127) return true; // 127.0.0.0/8 loopback
    if (a === 192 && b === 168) return true; // 192.168.0.0/16
    if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
    return false;
  }
  const ipLower = ip.toLowerCase();
  // IPv6 loopback and private/link-local ranges
  if (ipLower === "::1") return true;
  if (ipLower.startsWith("fe80:")) return true; // link-local
  if (ipLower.startsWith("fc") || ipLower.startsWith("fd")) return true; // unique local
  return false;
}

export async function GET(req: NextRequest) {
  try {
    const extractedIp = extractClientIp(req);
    const ip = extractedIp && isPrivateOrLocal(extractedIp) ? undefined : extractedIp;

    // Build ipwho.is URL. If we couldn't detect the IP, ipwho.is will infer from server IP,
    // which may be inaccurate; but we prefer explicit header-derived IP when available.
    const url = ip ? `https://ipwho.is/${ip}` : `https://ipwho.is/`;

    const resp = await fetch(url, { cache: "no-store" });
    if (!resp.ok) {
      const fallback = {
        ip: extractedIp ?? null,
        city: null,
        region: null,
        region_code: null,
        country: null,
        country_code: null,
        postal: null,
        latitude: null,
        longitude: null,
        timezone: null,
        error: "Failed to fetch geolocation",
      };
      return NextResponse.json(fallback, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      });
    }

    const data = await resp.json();
    // ipwho.is returns { success: boolean, message?: string, ... }
    if (data && data.success === false) {
      const fallback = {
        ip: extractedIp ?? null,
        city: null,
        region: null,
        region_code: null,
        country: null,
        country_code: null,
        postal: null,
        latitude: null,
        longitude: null,
        timezone: null,
        error: data.message || "Failed to fetch geolocation",
        raw: data,
      };
      return NextResponse.json(fallback, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      });
    }

    // Normalize a small subset we care about, plus return raw for flexibility
    const payload = {
  ip: data.ip ?? extractedIp ?? null,
      city: data.city ?? null,
      region: data.region ?? null, // Full state/region name for US (e.g., California)
      region_code: data.region_code ?? null, // e.g., CA
      country: data.country ?? null,
      country_code: data.country_code ?? null,
      postal: data.postal ?? null,
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
      timezone: (data.timezone && (data.timezone.id || data.timezone)) ?? null,
      raw: data,
    };

    return NextResponse.json(payload, {
      // Prevent CDN caching per-user data
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
