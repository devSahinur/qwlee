// Package features arrive in two shapes:
//   - new seed data: ["Landing page", "Auth", …]
//   - legacy admin form: [{ feature: "Landing page" }, …]
// Normalize once so consumers can render text directly.

export default function normaliseFeatures(features) {
  if (!Array.isArray(features)) return [];
  return features
    .map((f) => {
      if (typeof f === "string") return f;
      return f?.feature || f?.name || f?.text || "";
    })
    .filter((s) => s && String(s).trim());
}
