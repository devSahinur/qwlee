// Fire-and-forget search tracker. Posts to /v1/search/track with the
// query + IP-detected country snapshot, so the admin can see who's
// searching for what (anonymously or signed-in).
//
// Throttled per (query, route) tuple to one event per 1.5s so a debounced
// search input doesn't flood the log on every keystroke. The window is
// short enough that legitimate re-searches (user clicks Search twice
// after editing the query) still get captured.

import Cookies from "js-cookie";
import { base } from "@/lib/constant";

const KEY = "qwlee:iploc";
const recent = new Map();
const WINDOW_MS = 1500;

function readLocation() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.data || null;
  } catch {
    return null;
  }
}

function getToken() {
  if (typeof window === "undefined") return "";
  const raw = Cookies.get("accessToken");
  if (!raw) return "";
  return raw.replace(/^"(.*)"$/, "$1");
}

export default function trackSearch(query, opts = {}) {
  if (typeof window === "undefined") return;
  const q = String(query || "").trim();
  if (!q || q.length > 200) return;
  const route = opts.route || window.location.pathname || "";
  const dedupKey = `${q.toLowerCase()}::${route}`;
  const now = Date.now();
  const last = recent.get(dedupKey) || 0;
  if (now - last < WINDOW_MS) return;
  recent.set(dedupKey, now);

  const loc = readLocation();
  const body = {
    query: q,
    displayQuery: q,
    route,
    referer: document.referrer || "",
    country: loc?.country || "",
    countryCode: loc?.countryCode || "",
    city: loc?.city || "",
  };
  const token = getToken();
  try {
    fetch(`${base}/v1/search/track`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* tracking shouldn't ever crash the app */
  }
}
