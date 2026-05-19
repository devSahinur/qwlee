// Lightweight "best-effort" auth. If a valid bearer token is present
// we attach req.user; if not (or the token is bad) we silently continue.
//
// Used by public endpoints that want to personalise the response when
// the caller happens to be signed in — e.g. excluding the caller's own
// gigs from the marketplace listing.

const passport = require("passport");

module.exports = function optionalAuth() {
  return (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user) => {
      if (user) req.user = user;
      next();
    })(req, res, next);
  };
};
