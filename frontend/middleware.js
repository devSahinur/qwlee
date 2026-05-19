import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Routes that anyone can hit without a valid session.
const publicRoutes = new Set(["/", "/gig", "/sign-in", "/sign-up"]);

// Routes that require a valid access token.
const protectedRoutes = new Set([
  "/dashboard",
  "/profile",
  "/profile/edit",
  "/profile/add",
  "/earnings",
  "/inbox",
  "/list",
]);

const encoder = new TextEncoder();

async function verifyAccessToken(token, secret) {
  if (!token || !secret) return null;
  try {
    const { payload } = await jwtVerify(token, encoder.encode(secret));
    if (payload.type && payload.type !== "access") return null;
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (publicRoutes.has(pathname)) {
    return NextResponse.next();
  }

  if (!protectedRoutes.has(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get("accessToken")?.value;
  // Token is stored JSON-stringified by SignIn.js; strip surrounding quotes.
  const cleaned = token ? token.replace(/^"(.*)"$/, "$1") : null;
  const payload = await verifyAccessToken(cleaned, process.env.JWT_SECRET);

  if (!payload) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/list",
    "/inbox",
    "/dashboard",
    "/profile",
    "/profile/edit",
    "/profile/add",
    "/earnings",
    "/sign-in",
    "/sign-up",
    "/gig",
    "/",
  ],
};
