// Usernames we never let a user claim. Two reasons:
//
//   1. Existing frontend routes — Next.js matches static segments before
//      dynamic ones, so /gig wins over /[username]. But if we allowed a
//      user named "gig", their profile would be unreachable and confusing.
//   2. Generic platform / admin / brand words.
//
// Add new app routes here whenever you add a top-level page.

const APP_ROUTES = [
  // Existing static routes under app/
  "about-us",
  "blogs",
  "blog",
  "cancel",
  "contact-us",
  "dashboard",
  "earnings",
  "freelancer-details",
  "gig",
  "hire-freelancers",
  "inbox",
  "list",
  "order",
  "orders",
  "profile",
  "services",
  "success",
  "sign-in",
  "sign-up",
  "signin",
  "signup",
  "login",
  "logout",
  "register",
  "forgot-password",
  "verify-email",
  "change-password",
  "reset-password",
  "trust-safety",
  "terms-of-service",
  "privacy-policy",
];

const PLATFORM_WORDS = [
  "admin",
  "administrator",
  "api",
  "auth",
  "billing",
  "checkout",
  "contact",
  "dashboard",
  "help",
  "home",
  "info",
  "mail",
  "messages",
  "moderator",
  "official",
  "owner",
  "qwlee",
  "root",
  "search",
  "security",
  "settings",
  "staff",
  "support",
  "system",
  "team",
  "user",
  "users",
  "v1",
  "v2",
  "www",
];

const RESERVED = new Set([...APP_ROUTES, ...PLATFORM_WORDS]);

function isReserved(username) {
  if (!username) return false;
  return RESERVED.has(String(username).toLowerCase().trim());
}

module.exports = { isReserved, RESERVED };
