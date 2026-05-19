// Single source of truth for username format. Mirror these rules in any
// client-side validator so users get fast feedback before the API call.

const USERNAME_RE = /^[a-z0-9](?:[a-z0-9_-]{1,22}[a-z0-9])?$/;

const ERRORS = {
  EMPTY: "Username is required",
  LENGTH: "Username must be 3–24 characters",
  FORMAT:
    "Username must be lowercase letters, numbers, _ or -; must start and end with a letter or number",
  RESERVED: "This username is reserved",
  TAKEN: "Username is already taken",
};

function normalizeUsername(raw) {
  if (!raw) return "";
  return String(raw).trim().toLowerCase();
}

function validateUsernameFormat(raw) {
  const u = normalizeUsername(raw);
  if (!u) return { ok: false, code: "EMPTY", message: ERRORS.EMPTY };
  if (u.length < 3 || u.length > 24)
    return { ok: false, code: "LENGTH", message: ERRORS.LENGTH };
  if (!USERNAME_RE.test(u))
    return { ok: false, code: "FORMAT", message: ERRORS.FORMAT };
  return { ok: true, username: u };
}

module.exports = {
  USERNAME_RE,
  ERRORS,
  normalizeUsername,
  validateUsernameFormat,
};
