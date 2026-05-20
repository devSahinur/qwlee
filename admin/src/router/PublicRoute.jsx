// Inverse of AdminRoute — guards the auth screens (login, forgot
// password, OTP, update password). If a token is already in
// localStorage we punt the user straight to /dashboard instead of
// re-showing the login page. The token presence is authoritative;
// the API will 401 if it's actually expired and the AdminRoute side
// will then bounce them back here.

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

export default function PublicRoute({ children }) {
  const location = useLocation();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const user = readUser();

  if (token || user) {
    // Respect a "?from=" hop if the user was originally trying to reach
    // a deeper page when their session lapsed — otherwise drop them at
    // the dashboard home.
    const to =
      location.state?.from?.pathname && location.state.from.pathname !== "/"
        ? location.state.from.pathname
        : "/dashboard";
    return <Navigate to={to} replace />;
  }
  return children;
}
