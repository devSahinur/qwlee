// All seed image URLs come from picsum.photos (deterministic by seed).
// Frontend next.config.mjs allowlists picsum.photos for these to render.

const PICSUM = "https://picsum.photos/seed";

const slug = (s) =>
  String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);

const img = (seed, w = 800, h = 600) => `${PICSUM}/${slug(seed)}/${w}/${h}`;

module.exports = {
  avatar: (seed) => img(seed, 300, 300),
  cover: (seed) => img(seed, 1200, 300),
  gig: (seed, n = 0) => img(`${seed}-${n}`, 800, 500),
  portfolio: (seed, n = 0) => img(`${seed}-pf-${n}`, 800, 600),
  banner: (seed) => img(seed, 1600, 500),
  blog: (seed) => img(`${seed}-blog`, 900, 500),
  category: (seed) => img(`${seed}-cat`, 400, 400),
};
