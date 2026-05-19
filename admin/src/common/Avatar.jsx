// Universal avatar for the admin dashboard. Same contract as the
// frontend's components/common/Avatar.js — render the uploaded image when
// present, otherwise a deterministic initials badge.

const SIZE_MAP = { sm: 32, md: 40, lg: 56, xl: 80 };

const PALETTE = [
  ["#0F766E", "#CCFBF1"],
  ["#1D4ED8", "#DBEAFE"],
  ["#7C3AED", "#EDE9FE"],
  ["#BE185D", "#FCE7F3"],
  ["#B45309", "#FEF3C7"],
  ["#15803D", "#DCFCE7"],
  ["#0E7490", "#CFFAFE"],
  ["#7C2D12", "#FFEDD5"],
  ["#4338CA", "#E0E7FF"],
  ["#9F1239", "#FFE4E6"],
];

function hashCode(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function initials(name) {
  if (!name) return "?";
  const parts = String(name).trim().split(/\s+/);
  const first = parts[0]?.[0] || "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase() || "?";
}

function looksLikeRealImage(src) {
  if (!src || typeof src !== "string") return false;
  if (!/^https?:\/\//.test(src)) return false;
  if (/qwlee-default-avatar/.test(src)) return false;
  if (/user\.png$|cover\.jpg$|gig-demo\.jpg$/i.test(src)) return false;
  return true;
}

export default function Avatar({
  src,
  name = "",
  size = "md",
  className = "",
  rounded = true,
  alt,
}) {
  const px = typeof size === "number" ? size : SIZE_MAP[size] || SIZE_MAP.md;
  const radius = rounded ? "9999px" : "8px";

  if (looksLikeRealImage(src)) {
    return (
      <img
        src={src}
        alt={alt || name || "avatar"}
        width={px}
        height={px}
        className={className}
        style={{
          width: px,
          height: px,
          borderRadius: radius,
          objectFit: "cover",
        }}
        loading="lazy"
      />
    );
  }

  const text = initials(name);
  const [fg, bg] = PALETTE[hashCode(name || "?") % PALETTE.length];
  const fontSize = Math.round(px * (text.length > 1 ? 0.4 : 0.5));

  return (
    <span
      className={className}
      aria-label={alt || name || "avatar"}
      role="img"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: px,
        height: px,
        borderRadius: radius,
        background: bg,
        color: fg,
        fontWeight: 600,
        fontSize,
        lineHeight: 1,
        userSelect: "none",
        letterSpacing: text.length > 1 ? "-0.02em" : 0,
      }}
    >
      {text}
    </span>
  );
}
