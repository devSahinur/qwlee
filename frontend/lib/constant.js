// All API endpoints derive from env. Set NEXT_PUBLIC_BACKEND_API_URL and
// NEXT_PUBLIC_SOCKET_URL in `.env.local`; see `.env.example`. The fallback
// is the local dev backend so a missing env file in development still works.

export const base =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:7171";

export const socketUrl =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8181";

// Canonical image helper lives in utils/getImageUrl.js. Re-export here so
// existing `import { imgUrl } from "@/lib/constant"` keeps working.
export { getImageUrl as imgUrl, hasImage } from "@/utils/getImageUrl";

// Back-compat ONLY. Direct concatenation like `${imageBaseUrl}${path}` is
// the bug we keep paying for — prefer `imgUrl(path)` for new code.
export const imageBaseUrl = base;
export const authKey = "accessToken";
export const baseUrl = `${base}/v1`;
export const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Qwlee";
