// Mirror of frontend/utils/getImageUrl.js for the Vite-built admin.
//
// Same rules: absolute URLs pass through, root-relative and bare paths
// get the API base prepended, empty/placeholder values return "".

import base from "../baseUrl";

const ABSOLUTE_RE = /^(https?:\/\/|\/\/|data:|blob:)/i;
const LEGACY_PLACEHOLDER_RE =
  /(qwlee-default-(avatar|cover)|user\.png$|cover\.jpg$|gig-demo\.jpg$)/i;

export function getImageUrl(value) {
  if (!value || typeof value !== "string") return "";
  const v = value.trim();
  if (!v) return "";
  if (LEGACY_PLACEHOLDER_RE.test(v)) return "";
  if (ABSOLUTE_RE.test(v)) return v;
  const apiBase = String(base).replace(/\/+$/, "");
  const path = v.startsWith("/") ? v : `/${v}`;
  return `${apiBase}${path}`;
}

export function hasImage(value) {
  return getImageUrl(value) !== "";
}

export default getImageUrl;
