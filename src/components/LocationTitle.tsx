"use client";

import { useEffect, useState } from "react";
import { fetchLocationWithCache } from "@/lib/locationClient";

interface Props {
  defaultRegion?: string;
}

export default function LocationTitle({ defaultRegion = "California" }: Props) {
  const defaultTitle = `${defaultRegion} Rental Assistance Program`;
  const [title, setTitle] = useState<string>(defaultTitle);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const data = await fetchLocationWithCache();
      const region = (data?.region || "").trim();
      const country = (data?.country || "").trim();
      const chosen = region || country || defaultRegion;
      if (!cancelled && chosen) {
        setTitle(`${chosen} Rental Assistance Program`);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [defaultRegion]);

  return <>{title}</>;
}
