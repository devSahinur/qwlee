// Plain module — no "use client" directive. The axios instance is used
// from both client components (interceptors run against document.cookie)
// and server-side metadata loaders (interceptors no-op when js-cookie
// has no document). Marking this file "use client" caused Next.js 16 to
// treat it as a client reference and the axios default export couldn't
// pass through the RSC boundary cleanly.

import axios from "axios";
import Cookies from "js-cookie";
import { base } from "./constant";

// Single shared axios instance. Token is injected per-request via an
// interceptor — capturing `Cookies.get("accessToken")` at module load
// (as the legacy code did) meant the instance stayed empty after login
// and every authenticated request silently 401'd.
const baseAxios = axios.create({
  baseURL: `${base}/v1`,
  timeout: 15000,
});

baseAxios.interceptors.request.use((cfg) => {
  let token = Cookies.get("accessToken");
  if (token) {
    // SignIn.js stores the token JSON-stringified, so strip surrounding quotes.
    token = token.replace(/^"(.*)"$/, "$1");
    cfg.headers = cfg.headers || {};
    cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
});

// Light-touch response interceptor — keeps callers from having to repeat
// the "did the request 401?" boilerplate. Doesn't trigger a refresh flow
// yet; that belongs in a dedicated auth module.
baseAxios.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401 && typeof window !== "undefined") {
      // Surface for callers; route-level logic can redirect to /sign-in.
    }
    return Promise.reject(err);
  }
);

export default baseAxios;
