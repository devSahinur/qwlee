"use client";
// Compact blog card. Entire card is a single Link, image uses the
// fallback component so missing/broken URLs degrade gracefully, title
// and description clamp to 2 lines so heights line up in a grid.

import Link from "next/link";
import { MdDateRange } from "react-icons/md";
import { IoArrowForward } from "react-icons/io5";
import ImageWithFallback from "@/components/common/ImageWithFallback";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formatDate(d) {
  if (!d) return "";
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return "";
  return `${MONTHS[date.getMonth()]} ${String(date.getDate()).padStart(2, "0")}, ${date.getFullYear()}`;
}

export default function BlogCard({ item }) {
  if (!item) return null;
  const href = item.slug ? `/blogs/${item.slug}` : `/blogs/${item._id || item.id}`;

  return (
    <Link
      href={href}
      className="group flex flex-col bg-white rounded-2xl border border-gray-200 hover:border-emerald-300 hover:shadow-md transition overflow-hidden h-full"
    >
      <div className="relative w-full aspect-[16/10] bg-gray-100">
        <ImageWithFallback
          src={item.image}
          name={item.title}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          alt={item.title || "blog post"}
        />
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <MdDateRange className="w-4 h-4" />
          <span>{formatDate(item.createdAt)}</span>
          {item.author ? (
            <>
              <span>·</span>
              <span className="truncate">{item.author}</span>
            </>
          ) : null}
        </div>

        <h3 className="mt-3 text-base md:text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-emerald-700 transition">
          {item.title || "Untitled post"}
        </h3>

        {item.description ? (
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
            {item.description}
          </p>
        ) : null}

        <div className="mt-auto pt-4 inline-flex items-center gap-1 text-sm font-medium text-emerald-700">
          Read article
          <IoArrowForward className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
