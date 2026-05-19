// Deterministic-ish helpers. No external dep so the seeder stays light.

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[rand(0, arr.length - 1)];
const pickMany = (arr, n) => {
  const copy = [...arr];
  const out = [];
  while (out.length < n && copy.length) {
    out.push(copy.splice(rand(0, copy.length - 1), 1)[0]);
  }
  return out;
};
const chance = (p) => Math.random() < p;
const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);
const daysFromNow = (n) => new Date(Date.now() + n * 24 * 60 * 60 * 1000);

module.exports = { rand, pick, pickMany, chance, daysAgo, daysFromNow };
