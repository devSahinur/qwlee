"use client";
// Compact, icon-first category tile. Replaces the old image-only card —
// icons render uniformly regardless of whether an admin uploaded an
// image, and they read better at small sizes than blurry photos.
//
// Card hover state matches the rest of the Qwlee surface (emerald
// accent + soft shadow lift).

import Link from "next/link";
import CategoryIcon from "@/components/common/CategoryIcon";

export default function CategoriesCard({ data }) {
  if (!data?.name) return null;

  return (
    <Link
      href={`/gig?categories=${encodeURIComponent(data.name)}`}
      className="group block bg-white rounded-2xl border border-gray-200 hover:border-emerald-300 hover:shadow-md transition p-4 md:p-5 text-center h-full"
    >
      <div className="mx-auto w-12 h-12 md:w-14 md:h-14 inline-flex items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition">
        <CategoryIcon name={data.name} size={26} />
      </div>
      <div className="mt-3 text-sm md:text-base font-semibold text-gray-900 group-hover:text-emerald-700 transition">
        {data.name}
      </div>
    </Link>
  );
}
