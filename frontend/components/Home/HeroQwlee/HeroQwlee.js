"use client";
// Marketplace hero.
//
// Background strategy:
// - Mobile: static gradient + soft blobs (kept lightweight on small
//   screens / mobile data).
// - Desktop (md+): the same gradient PLUS three slow-drifting blurred
//   blobs animated via CSS keyframes. Pure CSS — no video assets, no
//   extra deps. Respects prefers-reduced-motion (animations disabled).
//
// If you want to swap in a real self-hosted hero video later, drop the
// file in `frontend/public/hero.mp4` and add a <video> behind everything.
// Don't hotlink third-party CDN videos — they're copyrighted assets.

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GoVerified } from "react-icons/go";
import { HiOutlineLockClosed, HiOutlineLightningBolt } from "react-icons/hi";
import SearchSuggestions from "@/components/Search/SearchSuggestions";
import { base } from "@/lib/constant";
import trackSearch from "@/utils/trackSearch";

const ROTATING_SUGGESTIONS = [
  "Next.js developer",
  "Logo designer",
  "Video editor",
  "SEO audit",
  "Claude API integration",
  "React Native app",
  "Landing page copywriter",
  "Brand identity",
];

const FALLBACK_TRENDING = [
  "Next.js",
  "UI/UX",
  "React Native",
  "SEO",
  "Video editing",
  "AI",
  "Copywriting",
];

export default function HeroQwlee() {
  const router = useRouter();
  const [trending, setTrending] = useState(FALLBACK_TRENDING);

  // Pull live trending from the search log. Falls back to the seeded
  // list when the endpoint is empty (fresh DB / no traffic yet) so the
  // strip never renders blank.
  useEffect(() => {
    let cancelled = false;
    fetch(`${base}/v1/search/trending?days=7&limit=8`)
      .then((r) => r.json())
      .then((res) => {
        if (cancelled) return;
        const live = (res?.data?.attributes?.results || [])
          .map((r) => r.query)
          .filter(Boolean);
        if (live.length) setTrending(live.slice(0, 8));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  function searchTerm(term) {
    trackSearch(term, { route: "/gig" });
    router.push(`/gig?title=${encodeURIComponent(term)}`);
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-cyan-50">
      {/* Animated backdrop — desktop only. Hidden on mobile to keep
          paint cheap on phones. */}
      <div
        aria-hidden
        className="hidden md:block absolute inset-0 pointer-events-none"
      >
        <div className="qwlee-blob qwlee-blob-a" />
        <div className="qwlee-blob qwlee-blob-b" />
        <div className="qwlee-blob qwlee-blob-c" />
      </div>

      {/* Static blobs on all viewports (subtle, give the hero some shape
          even when the animated layer is hidden on mobile). */}
      <div
        aria-hidden
        className="md:hidden absolute -top-24 -right-24 w-72 h-72 rounded-full bg-emerald-200/40 blur-3xl"
      />
      <div
        aria-hidden
        className="md:hidden absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-cyan-200/40 blur-3xl"
      />

      <div className="relative container mx-auto px-4 py-14 md:py-24 max-w-5xl">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-emerald-100 text-emerald-700 text-xs font-medium">
            <GoVerified /> Trusted freelancers · verified payouts
          </span>
          <h1 className="mt-4 md:mt-5 text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-gray-900">
            Find the right freelancer{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
              for any project
            </span>
          </h1>
          <p className="mt-3 md:mt-4 text-sm md:text-lg text-gray-600 max-w-2xl mx-auto">
            Web, design, video, AI, and more — hire from a global marketplace
            of vetted professionals.
          </p>

          <div className="mt-6 md:mt-8 mx-auto max-w-2xl text-left">
            <SearchSuggestions
              size="lg"
              rotatingPlaceholders={ROTATING_SUGGESTIONS}
            />
          </div>

          <div className="mt-4 md:mt-5 flex flex-wrap items-center justify-center gap-1.5 md:gap-2">
            <span className="text-xs md:text-sm text-gray-500">Trending:</span>
            {trending.map((t) => (
              <button
                key={t}
                onClick={() => searchTerm(t)}
                className="px-2.5 py-1 md:px-3 md:py-1.5 rounded-full border border-gray-200 bg-white text-xs md:text-sm text-gray-700 hover:border-emerald-500 hover:text-emerald-700 transition"
              >
                {t}
              </button>
            ))}
          </div>

          <div className="mt-10 md:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 text-left">
            <TrustCard
              icon={<HiOutlineLockClosed className="w-5 h-5" />}
              title="Secure payments"
              body="Funds held in escrow until you accept delivery."
            />
            <TrustCard
              icon={<GoVerified className="w-5 h-5" />}
              title="Verified sellers"
              body="Identity-checked freelancers with verified reviews."
            />
            <TrustCard
              icon={<HiOutlineLightningBolt className="w-5 h-5" />}
              title="Fast delivery"
              body="Most orders ship in days, not weeks."
            />
          </div>

          <p className="mt-6 md:mt-8 text-sm text-gray-500">
            New to Qwlee?{" "}
            <Link href="/sign-up" className="text-emerald-700 font-medium">
              Create your free account
            </Link>
          </p>
        </div>
      </div>

      {/* Scoped keyframes for the animated background. Lives in the
          component so it ships with it. */}
      <style jsx>{`
        .qwlee-blob {
          position: absolute;
          border-radius: 9999px;
          filter: blur(72px);
          opacity: 0.55;
          will-change: transform;
        }
        .qwlee-blob-a {
          width: 28rem;
          height: 28rem;
          top: -8rem;
          right: -6rem;
          background: radial-gradient(circle, #6ee7b7 0%, #34d399 70%);
          animation: qwlee-drift-a 22s ease-in-out infinite;
        }
        .qwlee-blob-b {
          width: 30rem;
          height: 30rem;
          bottom: -10rem;
          left: -8rem;
          background: radial-gradient(circle, #67e8f9 0%, #22d3ee 70%);
          animation: qwlee-drift-b 28s ease-in-out infinite;
        }
        .qwlee-blob-c {
          width: 22rem;
          height: 22rem;
          top: 40%;
          left: 45%;
          background: radial-gradient(circle, #a7f3d0 0%, #6ee7b7 70%);
          opacity: 0.35;
          animation: qwlee-drift-c 32s ease-in-out infinite;
        }
        @keyframes qwlee-drift-a {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%      { transform: translate(-3rem, 2rem) scale(1.05); }
        }
        @keyframes qwlee-drift-b {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%      { transform: translate(2rem, -2rem) scale(1.08); }
        }
        @keyframes qwlee-drift-c {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50%      { transform: translate(-46%, -54%) scale(1.1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .qwlee-blob { animation: none !important; }
        }
      `}</style>
    </section>
  );
}

function TrustCard({ icon, title, body }) {
  return (
    <div className="bg-white/80 backdrop-blur rounded-xl border border-gray-100 p-4 flex items-start gap-3">
      <div className="shrink-0 w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <div className="font-semibold text-gray-900">{title}</div>
        <div className="text-sm text-gray-600 mt-0.5">{body}</div>
      </div>
    </div>
  );
}
