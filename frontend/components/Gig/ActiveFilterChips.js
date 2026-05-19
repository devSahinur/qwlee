"use client";
// Shows the currently-applied search/category/price filters as
// removable chips above the gig grid. Clicking a chip strips that one
// param from the URL; "Clear all" wipes the lot. Keeps state in sync
// with the existing Filters component because both read/write the same
// URLSearchParams.

import { useRouter, useSearchParams } from "next/navigation";
import { IoClose } from "react-icons/io5";

export default function ActiveFilterChips() {
  const params = useSearchParams();
  const router = useRouter();

  const title = params.get("title");
  const categories = params.get("categories")?.split(",").filter(Boolean) || [];
  const minPrice = params.get("minPrice");
  const maxPrice = params.get("maxPrice");

  const chips = [];
  if (title) chips.push({ key: "title", label: `“${title}”` });
  for (const c of categories) chips.push({ key: `cat:${c}`, label: c, kind: "cat", value: c });
  if (minPrice || maxPrice) {
    const lbl =
      minPrice && maxPrice
        ? `$${minPrice}–$${maxPrice}`
        : minPrice
        ? `$${minPrice}+`
        : `Up to $${maxPrice}`;
    chips.push({ key: "price", label: lbl });
  }

  if (chips.length === 0) return null;

  function setParams(mutate) {
    const next = new URLSearchParams(params.toString());
    mutate(next);
    router.push(`/gig?${next.toString()}`, { scroll: false });
  }

  function removeChip(chip) {
    setParams((p) => {
      if (chip.kind === "cat") {
        const remaining = categories.filter((c) => c !== chip.value);
        if (remaining.length) p.set("categories", remaining.join(","));
        else p.delete("categories");
      } else if (chip.key === "title") {
        p.delete("title");
      } else if (chip.key === "price") {
        p.delete("minPrice");
        p.delete("maxPrice");
      }
    });
  }

  function clearAll() {
    router.push("/gig", { scroll: false });
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-sm text-gray-500">Filters:</span>
      {chips.map((c) => (
        <button
          key={c.key}
          type="button"
          onClick={() => removeChip(c)}
          className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100 hover:bg-emerald-100"
        >
          {c.label}
          <IoClose className="w-3.5 h-3.5" />
        </button>
      ))}
      <button
        type="button"
        onClick={clearAll}
        className="text-xs text-gray-500 hover:text-gray-800 underline ml-1"
      >
        Clear all
      </button>
    </div>
  );
}
