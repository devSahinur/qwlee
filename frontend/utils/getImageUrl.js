// Canonical image URL helper.
//
// Frontend stores a mix of image references:
//   - absolute cloud URLs:  https://i.ibb.co/abc.png, https://picsum.photos/...
//   - absolute legacy URLs: http://example.com/whatever.png
//   - protocol-relative:    //cdn.example.com/x.png
//   - root-relative paths:  /uploads/avatar.png (LEGACY — no static serve now)
//   - bare paths:           uploads/avatar.png  (LEGACY)
//   - data URIs:            data:image/png;base64,...
//   - empty / null:         "" / undefined
//
// `getImageUrl(value)` returns a renderable string or "" (let the caller
// decide what to show for empty — usually the Avatar / fallback).
//
// `imgUrl` is the short alias re-exported from lib/constant for backwards
// compatibility with the 33 components migrated in the previous pass.

const ABSOLUTE_RE = /^(https?:\/\/|\/\/|data:|blob:)/i;

// Legacy default placeholders the schema used to write before the empty-
// string default. Treat as "no image" so the fallback path fires.
const LEGACY_PLACEHOLDER_RE =
  /(qwlee-default-(avatar|cover)|user\.png$|cover\.jpg$|gig-demo\.jpg$)/i;

function getApiBase() {
  // Read once per call so tests / runtime env changes are honored.
  return (
    process.env.NEXT_PUBLIC_BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:7171"
  );
}

export function getImageUrl(value) {
  if (!value || typeof value !== "string") return "";
  const v = value.trim();
  if (!v) return "";
  if (LEGACY_PLACEHOLDER_RE.test(v)) return "";
  if (ABSOLUTE_RE.test(v)) return v;
  const base = getApiBase().replace(/\/+$/, "");
  const path = v.startsWith("/") ? v : `/${v}`;
  return `${base}${path}`;
}

// Returns true when the value will resolve to a real renderable image —
// useful for "show Avatar fallback" branches.
export function hasImage(value) {
  return getImageUrl(value) !== "";
}

export default getImageUrl;
