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
  timezone?: any;
  error?: string;
  raw?: any;
};

const STORAGE_KEY = "geo:location:v1";
const TTL_MS = 15 * 60 * 1000; // 15 minutes

type CachedWrapper = { ts: number; data: LocationResponse };

export async function fetchLocationWithCache(): Promise<LocationResponse | null> {
  if (typeof window === "undefined") return null;
  try {
    const cached = sessionStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        const parsed: CachedWrapper = JSON.parse(cached);
        if (parsed && typeof parsed.ts === "number" && Date.now() - parsed.ts < TTL_MS) {
          return parsed.data;
        }
      } catch {
        // ignore parse errors and refetch
      }
    }

    const res = await fetch("/api/location", { cache: "no-store" });
    if (!res.ok) return null;
    const data: LocationResponse = await res.json();
    const wrapper: CachedWrapper = { ts: Date.now(), data };
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(wrapper));
    } catch {
      // ignore quota / storage exceptions
    }
    return data;
  } catch {
    return null;
  }
}

export function invalidateLocationCache() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
