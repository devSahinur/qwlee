"use client";
// Compact, icon-first category tile. Replaces the old image-only card —
// icons render uniformly regardless of whether an admin uploaded an
// image, and they read better at small sizes than blurry photos.
//
// Card hover state matches the rest of the Qwlee surface (emerald
// accent + soft shadow lift).

import Link from "next/link";
import { motion } from "framer-motion";
import CategoryIcon from "@/components/common/CategoryIcon";

export default function CategoriesCard({ data }) {
  if (!data?.name) return null;

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}>
      <Link
        href={`/gig?categories=${encodeURIComponent(data.name)}`}
        className="group block bg-white rounded-2xl border border-gray-200 hover:border-emerald-300 hover:shadow-md transition p-4 md:p-5 text-center h-full"
      >
        <motion.div
          whileHover={{ rotate: -6, scale: 1.08 }}
          transition={{ type: "spring", stiffness: 350, damping: 18 }}
          className="mx-auto w-12 h-12 md:w-14 md:h-14 inline-flex items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition"
        >
          <CategoryIcon name={data.name} size={26} />
        </motion.div>
        <div className="mt-3 text-sm md:text-base font-semibold text-gray-900 group-hover:text-emerald-700 transition">
          {data.name}
        </div>
      </Link>
    </motion.div>
  );
}
