"use client";
// Per-user route + dwell-time tracker.
//
// Mounted once near the root of the app (PrimaryLayout). On every
// pathname change we POST `{ route }` to /v1/activity/track — the
// backend stores it and backfills the previous row's dwell time. On
// page hide / unload we send one final POST with the open route's
// dwell time so we don't lose the last segment if the user just
// closes the tab.
//
// Only fires for signed-in users (the endpoint is auth-gated anyway).
// Cheap — at most one fetch per route change + one beacon on unload.

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";

import { base } from "@/lib/constant";

function getToken() {
  if (typeof window === "undefined") return "";
  const raw = Cookies.get("accessToken");
  if (!raw) return "";
  return raw.replace(/^"(.*)"$/, "$1");
}

function isAuthed() {
  return !!getToken();
}

function postTrack(payload, { useBeacon = false } = {}) {
  if (!isAuthed()) return;
  const url = `${base}/v1/activity/track`;
  const body = JSON.stringify(payload);
  if (useBeacon && typeof navigator !== "undefined" && navigator.sendBeacon) {
    // sendBeacon doesn't accept custom headers, so we encode the JWT
    // into the body. The backend's `/track` endpoint also reads the
    // Authorization header path; this fallback only matters on unload.
    const blob = new Blob(
      [JSON.stringify({ ...payload, _bearer: getToken() })],
      { type: "application/json" }
    );
    navigator.sendBeacon(url, blob);
    return;
  }
  try {
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* ignore — tracking shouldn't ever crash the app */
  }
}

export default function useActivityTracker() {
  const pathname = usePathname();
  const openedAtRef = useRef(null);
  const lastRouteRef = useRef("");

  // On every route change emit an event for the new route + close out
  // the previous one with its dwell time. Backend will deduce the
  // previous row from its own index too, so the explicit `durationMs`
  // here is mostly a hint.
  useEffect(() => {
    if (!pathname) return;
    if (!isAuthed()) {
      // No-op while logged out; reset the watcher so the next login
      // doesn't bill the previous route with stale time.
      openedAtRef.current = null;
      lastRouteRef.current = "";
      return;
    }
    const now = Date.now();
    const prevRoute = lastRouteRef.current;
    const prevOpenedAt = openedAtRef.current;
    const dwellMs = prevOpenedAt ? Math.max(0, now - prevOpenedAt) : 0;

    postTrack({ route: pathname });
    if (prevRoute && dwellMs > 0) {
      // Hint the backend with the explicit dwell time we measured
      // client-side. Cheaper than relying on the server-side index
      // walk, and survives long offline windows.
      postTrack({ route: prevRoute, durationMs: Math.min(dwellMs, 30 * 60 * 1000) });
    }

    lastRouteRef.current = pathname;
    openedAtRef.current = now;
  }, [pathname]);

  // Best-effort flush on unload: bills the currently open route with
  // its accumulated dwell time. Uses sendBeacon when available because
  // fetch() won't reliably finish during pagehide.
  useEffect(() => {
    function flush() {
      const openedAt = openedAtRef.current;
      const route = lastRouteRef.current;
      if (!openedAt || !route) return;
      const dwellMs = Math.max(0, Date.now() - openedAt);
      if (dwellMs <= 0) return;
      postTrack(
        { route, durationMs: Math.min(dwellMs, 30 * 60 * 1000) },
        { useBeacon: true }
      );
    }
    window.addEventListener("pagehide", flush);
    window.addEventListener("beforeunload", flush);
    return () => {
      window.removeEventListener("pagehide", flush);
      window.removeEventListener("beforeunload", flush);
    };
  }, []);
}
