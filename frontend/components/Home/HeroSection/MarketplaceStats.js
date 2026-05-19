"use client";
// Live marketplace counters pulled from GET /v1/info/stats. Renders four
// numbers in a thin band below the hero slider so the homepage doesn't
// feel hollow even before the user scrolls.

import { useEffect, useState } from "react";
import { base } from "@/lib/constant";

function formatCount(n) {
  if (n == null) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M+`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k+`;
  return String(n);
}

export default function MarketplaceStats() {
  const [stats, setStats] = useState(null);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        const res = await fetch(`${base}/v1/info/stats`, { signal: ctrl.signal });
        const json = await res.json();
        setStats(json?.data?.attributes || null);
      } catch (err) {
        if (err?.name !== "AbortError") setErrored(true);
      }
    })();
    return () => ctrl.abort();
  }, []);

  if (errored) return null;

  const items = [
    { label: "Verified sellers", value: stats?.sellers },
    { label: "Active gigs", value: stats?.gigs },
    { label: "Orders shipped", value: stats?.orders },
    { label: "Countries", value: stats?.countries },
  ];

  return (
    <section className="container mx-auto px-4 -mt-8 md:-mt-12 relative z-10">
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 bg-white rounded-2xl border border-gray-100 p-4 md:p-6"
        style={{ boxShadow: "0 8px 32px rgba(15,23,42,0.08)" }}
      >
        {items.map((it) => (
          <div
            key={it.label}
            className="text-center md:text-left px-2 md:px-4"
          >
            <div className="text-2xl md:text-3xl font-bold text-gray-900">
              {formatCount(it.value)}
            </div>
            <div className="text-xs md:text-sm text-gray-500 mt-1 uppercase tracking-wide">
              {it.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
