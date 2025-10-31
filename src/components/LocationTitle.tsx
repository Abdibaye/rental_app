"use client";

import { useEffect, useState } from "react";
import { fetchLocationWithCache, getCachedLocation } from "@/lib/locationClient";

const NEUTRAL_TITLE = "Rental Assistance Program";

interface Props {
  defaultRegion?: string;
}

function resolveTitle(
  source: ReturnType<typeof getCachedLocation>,
  defaultRegion: string,
  preferDefault: boolean
): string {
  const region = (source?.region || "").trim();
  const country = (source?.country || "").trim();
  if (region) return `${region} Rental Assistance Program`;
  if (country) return `${country} Rental Assistance Program`;
  if (preferDefault && defaultRegion) return `${defaultRegion} Rental Assistance Program`;
  return NEUTRAL_TITLE;
}

export default function LocationTitle({ defaultRegion = "California" }: Props) {
  const [title, setTitle] = useState<string>(() =>
    resolveTitle(getCachedLocation(), defaultRegion, false)
  );

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const data = await fetchLocationWithCache();
      if (!cancelled) setTitle(resolveTitle(data, defaultRegion, true));
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [defaultRegion]);

  return <>{title}</>;
}
