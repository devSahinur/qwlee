"use client";
// next/image wrapper that:
//   - normalizes the src through getImageUrl()
//   - swaps to <Avatar> on 404 / load error when `name` is provided
//   - swaps to a generic placeholder element when no name is given
//
// Use for any image whose source comes from user-supplied data (gigs,
// portfolios, blogs). For pure decorative/static images use next/image
// directly.

import { useState } from "react";
import Image from "next/image";
import { getImageUrl } from "@/utils/getImageUrl";
import Avatar from "./Avatar";

export default function ImageWithFallback({
  src,
  alt = "",
  name = "",
  width,
  height,
  fill = false,
  sizes,
  className = "",
  style,
  rounded = false,
}) {
  const [errored, setErrored] = useState(false);
  const resolved = getImageUrl(src);

  if (!resolved || errored) {
    if (name) {
      const size = typeof width === "number" ? width : 48;
      return <Avatar name={name} size={size} rounded={rounded} className={className} alt={alt} />;
    }
    return (
      <span
        className={className}
        aria-label={alt || "image unavailable"}
        role="img"
        style={{
          display: "inline-block",
          width: fill ? "100%" : width,
          height: fill ? "100%" : height,
          background:
            "repeating-linear-gradient(45deg,#f3f4f6,#f3f4f6 6px,#e5e7eb 6px,#e5e7eb 12px)",
          borderRadius: rounded ? "9999px" : 0,
          ...style,
        }}
      />
    );
  }

  const baseProps = {
    src: resolved,
    alt: alt || name || "",
    className,
    style,
    onError: () => setErrored(true),
  };

  if (fill) {
    return <Image {...baseProps} fill sizes={sizes || "100vw"} />;
  }
  return <Image {...baseProps} width={width} height={height} />;
}
