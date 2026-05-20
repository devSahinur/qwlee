"use client";
// Live marketplace counters pulled from GET /v1/info/stats. Renders four
// numbers in a thin band below the hero slider so the homepage doesn't
// feel hollow even before the user scrolls.
//
// Each number animates with a "tick up from 0" effect via framer-motion's
// `useMotionValue` + `animate` when the strip enters the viewport, so
// the figures feel earned. Once.

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate as motionAnimate,
} from "framer-motion";
import { base } from "@/lib/constant";

function formatCount(n) {
  if (n == null) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M+`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k+`;
  return String(n);
}

// Single counter that ticks from 0 to `value` over ~1.2s once visible.
function Counter({ value }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px 0px" });
  const mv = useMotionValue(0);
  const display = useTransform(mv, (latest) => formatCount(Math.round(latest)));

  useEffect(() => {
    if (!inView || value == null) return;
    const controls = motionAnimate(mv, value, {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [inView, value, mv]);

  if (value == null) {
    return <span ref={ref}>—</span>;
  }
  return (
    <motion.span ref={ref} className="tabular-nums">
      {display}
    </motion.span>
  );
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px 0px" }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 bg-white rounded-2xl border border-gray-100 p-4 md:p-6"
        style={{ boxShadow: "0 8px 32px rgba(15,23,42,0.08)" }}
      >
        {items.map((it, i) => (
          <motion.div
            key={it.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px 0px" }}
            transition={{
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.1 + i * 0.07,
            }}
            className="text-center md:text-left px-2 md:px-4"
          >
            <div className="text-2xl md:text-3xl font-bold text-gray-900">
              <Counter value={it.value} />
            </div>
            <div className="text-xs md:text-sm text-gray-500 mt-1 uppercase tracking-wide">
              {it.label}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
