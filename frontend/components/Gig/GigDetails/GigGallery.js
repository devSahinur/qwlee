"use client";
// Image gallery: large hero with a thumbnail strip. Clicking a thumb
// swaps the hero. Falls back to ImageWithFallback so missing media
// degrades to a placeholder instead of a broken icon.

import { useState } from "react";
import ImageWithFallback from "@/components/common/ImageWithFallback";

export default function GigGallery({ images = [], title = "" }) {
  const list = Array.isArray(images) && images.length > 0 ? images : [null];
  const [active, setActive] = useState(0);
  const current = list[active];

  return (
    <div>
      <div className="relative aspect-[16/10] w-full bg-gray-100 rounded-2xl overflow-hidden">
        <ImageWithFallback
          src={current}
          name={title}
          fill
          sizes="(max-width: 1024px) 100vw, 800px"
          className="object-cover"
          alt={title || "Gig"}
        />
      </div>
      {list.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {list.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={`relative shrink-0 w-20 h-14 md:w-24 md:h-16 rounded-lg overflow-hidden border transition ${
                i === active
                  ? "border-emerald-500 ring-2 ring-emerald-100"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <ImageWithFallback
                src={src}
                name={title}
                fill
                sizes="120px"
                className="object-cover"
                alt={`${title} ${i + 1}`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
