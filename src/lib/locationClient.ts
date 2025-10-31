export type LocationResponse = {
  ip?: string | null;
  city?: string | null;
  region?: string | null;
  region_code?: string | null;
  country?: string | null;
  country_code?: string | null;
  postal?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  timezone?: string | null;
  error?: string;
  raw?: unknown;
};

const STORAGE_KEY = "geo:location:v1";
const TTL_MS = 15 * 60 * 1000; // 15 minutes

type CachedWrapper = { ts: number; data: LocationResponse };

let inFlight: Promise<LocationResponse | null> | null = null;

function readCachedLocation(): LocationResponse | null {
  if (typeof window === "undefined") return null;
  try {
    const serialized = sessionStorage.getItem(STORAGE_KEY);
    if (!serialized) return null;
    const parsed: CachedWrapper = JSON.parse(serialized);
    if (!parsed || typeof parsed.ts !== "number") return null;
    if (Date.now() - parsed.ts > TTL_MS) return null;
    return parsed.data ?? null;
  } catch {
    return null;
  }
}

function writeCachedLocation(data: LocationResponse) {
  if (typeof window === "undefined") return;
  const wrapper: CachedWrapper = { ts: Date.now(), data };
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(wrapper));
  } catch {
    // ignore storage exceptions (quota, disabled, etc.)
  }
}

export function getCachedLocation(): LocationResponse | null {
  return readCachedLocation();
}

export async function fetchLocationWithCache(): Promise<LocationResponse | null> {
  if (typeof window === "undefined") return null;

  const cached = readCachedLocation();
  if (cached) return cached;

  if (!inFlight) {
    inFlight = (async () => {
      try {
        const res = await fetch("/api/location", { cache: "no-store" });
        if (!res.ok) return null;
        const data: LocationResponse = await res.json();
        writeCachedLocation(data);
        return data;
      } catch {
        return null;
      } finally {
        inFlight = null;
      }
    })();
  }

  return inFlight;
}

export function invalidateLocationCache() {
  if (typeof window === "undefined") return;
  inFlight = null;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

