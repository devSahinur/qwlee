"use client";
// Universal avatar component.
//
// Renders the user's uploaded image when present and looks like a real URL.
// Otherwise generates a deterministic initials-based SVG fallback — no
// external service, no extra hosts, server-safe.
//
//   <Avatar name="Sofia Martinez" src={user.image} size={48} />
//   <Avatar name="John Doe" size="lg" />            // SVG fallback
//
// `src` is treated as "present" only if it's an http(s) URL. Empty strings,
// legacy `/uploads/...` paths, and undefined all fall through to initials.
// A runtime onError handler also swaps to initials if the image 404s.

import { useState } from "react";
import Image from "next/image";

const SIZE_MAP = { sm: 32, md: 40, lg: 56, xl: 80 };

// Stable, accessible palette. Hash → index into the palette so the same
// name always lands on the same color.
const PALETTE = [
  ["#0F766E", "#CCFBF1"], // teal
  ["#1D4ED8", "#DBEAFE"], // blue
  ["#7C3AED", "#EDE9FE"], // violet
  ["#BE185D", "#FCE7F3"], // pink
  ["#B45309", "#FEF3C7"], // amber
  ["#15803D", "#DCFCE7"], // green
  ["#0E7490", "#CFFAFE"], // cyan
  ["#7C2D12", "#FFEDD5"], // orange
  ["#4338CA", "#E0E7FF"], // indigo
  ["#9F1239", "#FFE4E6"], // rose
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
  // Stale legacy paths sometimes came back as absolute URLs ending in the
  // old default filenames — treat those as missing too.
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
  // Track runtime image-load failures so a 404 swaps to the initials
  // block rather than leaving a broken-image icon.
  const [erroredSrc, setErroredSrc] = useState(null);

  if (looksLikeRealImage(src) && erroredSrc !== src) {
    return (
      <Image
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
        onError={() => setErroredSrc(src)}
        unoptimized
      />
    );
  }

  const text = initials(name);
  const [fg, bg] = PALETTE[hashCode(name || "?") % PALETTE.length];
  // Slightly smaller font when two letters, larger when one.
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
