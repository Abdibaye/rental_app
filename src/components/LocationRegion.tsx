"use client";

import { useEffect, useState } from "react";
import { fetchLocationWithCache, getCachedLocation } from "@/lib/locationClient";

const NEUTRAL_REGION = "your state";

interface Props {
  defaultRegion?: string;
  className?: string;
}

function resolveRegion(
  source: ReturnType<typeof getCachedLocation>,
  defaultRegion: string,
  preferDefault: boolean
): string {
  const region = (source?.region || "").trim();
  const country = (source?.country || "").trim();
  if (region) return region;
  if (country) return country;
  if (preferDefault) return defaultRegion;
  return NEUTRAL_REGION;
}

export default function LocationRegion({ defaultRegion = "California", className }: Props) {
  const [region, setRegion] = useState<string>(() =>
    resolveRegion(getCachedLocation(), defaultRegion, false)
  );

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const data = await fetchLocationWithCache();
      if (!cancelled) setRegion(resolveRegion(data, defaultRegion, true));
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [defaultRegion]);

  return <span className={className}>{region}</span>;
}
