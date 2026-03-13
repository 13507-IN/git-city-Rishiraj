"use client";

import { useState, useEffect } from "react";

export function useLiveUsers() {
  const [count, setCount] = useState(1);

  useEffect(() => {
    let cancelled = false;

    async function fetchCount() {
      try {
        const res = await fetch("/api/presence");
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && typeof data.count === "number") {
          setCount(Math.max(1, data.count));
        }
      } catch {
        // ignore
      }
    }

    fetchCount();
    const interval = setInterval(fetchCount, 60_000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return { count, status: "connected" as const };
}
