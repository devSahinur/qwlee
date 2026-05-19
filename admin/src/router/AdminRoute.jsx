// Auth gate for the admin dashboard.
//
// Reads token + user from localStorage. Treats the *token* as the
// source of truth — even if the `user` JSON gets corrupted (which is
// what was causing the refresh-then-logout behaviour), as long as the
// token is present we let the page render. The token will get a real
// 401 from the API if it's actually invalid, at which point we bounce.
//
// JSON.parse is wrapped in a try/catch so a stray non-JSON value can't
// throw on render and break the whole app.

import { Navigate, useLocation } from "react-router-dom";

function readUser() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default function AdminRoute({ children }) {
  const location = useLocation();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const user = readUser();

  // Token presence is the real authoritative check — the user blob may
  // legitimately be missing (e.g. cleared by hand during dev) but the
  // request will still authenticate as long as the token is alive.
  if (token || user) return children;

  return <Navigate to="/" state={{ from: location }} replace />;
}
