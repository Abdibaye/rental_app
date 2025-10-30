"use client";

import { useEffect, useState } from "react";
import { fetchLocationWithCache } from "@/lib/locationClient";

interface Props {
  defaultRegion?: string;
  className?: string;
}

export default function LocationRegion({ defaultRegion = "California", className }: Props) {
  const [region, setRegion] = useState<string>(defaultRegion);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const data = await fetchLocationWithCache();
      const next = (data?.region || data?.country || defaultRegion).trim();
      if (!cancelled && next) setRegion(next);
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [defaultRegion]);

  return <span className={className}>{region}</span>;
}
