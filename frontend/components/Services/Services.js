"use client";
// /services — full categories directory.
// Uses the same CategoriesCard tile as the homepage so look + feel
// stay consistent. No online/offline sort (Qwlee is online-only).
// In-page search box live-filters the grid client-side.

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoSearch, IoClose } from "react-icons/io5";
import { useGetAllCategoryQuery } from "@/app/redux/features/getAllCategoryApi";
import CategoriesCard from "@/components/Home/MostPopularCategories/CategoriesCard";
import CategoriesCardSkeleton from "@/components/Home/MostPopularCategories/CategoriesCardSkeleton";

export default function Services() {
  const [query, setQuery] = useState("");
  const {
    data: responseAllCategoriesData,
    isLoading,
    isFetching,
    isError,
  } = useGetAllCategoryQuery({});
  const categories = responseAllCategoriesData?.results || [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.name?.toLowerCase().includes(q));
  }, [categories, query]);

  const loading = isLoading || isFetching;

  return (
    <main>
      {/* Hero header — same emerald → cyan wash as the home hero so the
          page reads as part of the marketplace, not a separate area. */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-cyan-50">
        <div
          aria-hidden
          className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-emerald-200/40 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-cyan-200/40 blur-3xl"
        />
        <div className="relative container mx-auto px-4 py-12 md:py-20 max-w-4xl text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-emerald-100 text-emerald-700 text-xs font-medium">
            Browse the Qwlee marketplace
          </span>
          <h1 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight text-gray-900">
            Every category, one search away
          </h1>
          <p className="mt-3 md:mt-4 text-sm md:text-lg text-gray-600 max-w-2xl mx-auto">
            Find a freelance service for any project — from web development to
            video editing, all in one place.
          </p>

          {/* In-page search — filters the grid below. */}
          <div className="mt-7 mx-auto max-w-xl">
            <div className="flex items-center bg-white rounded-2xl border border-gray-200 shadow-sm focus-within:border-emerald-500 transition">
              <div className="pl-4 text-gray-400">
                <IoSearch className="w-5 h-5" />
              </div>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search categories…"
                aria-label="Search categories"
                className="flex-1 px-3 py-3.5 bg-transparent outline-none text-base"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="px-3 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <IoClose className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="container mx-auto px-4 py-10 md:py-14">
        <div className="flex items-end justify-between mb-5 md:mb-6">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">
            {loading
              ? "Loading categories…"
              : query
              ? `${filtered.length} categor${filtered.length === 1 ? "y" : "ies"} matching “${query}”`
              : `All ${categories.length} categories`}
          </h2>
        </div>

        {isError ? (
          <div className="text-center py-10 text-red-500">
            Something went wrong loading categories.
          </div>
        ) : loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <CategoriesCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState query={query} onClear={() => setQuery("")} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
            {filtered.map((c) => (
              <CategoriesCard key={c.id || c._id} data={c} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function EmptyState({ query, onClear }) {
  return (
    <div className="flex flex-col items-center text-center py-14">
      <Image
        src="/not-data.svg"
        alt=""
        width={200}
        height={200}
        className="opacity-80"
      />
      <p className="mt-3 text-lg font-medium text-gray-900">
        No categories match {query ? `“${query}”` : "your search"}
      </p>
      <p className="text-sm text-gray-500 mt-1">
        Try a different keyword, or{" "}
        <Link href="/gig" className="text-emerald-700 font-medium hover:underline">
          browse all services
        </Link>
        .
      </p>
      {query && (
        <button
          type="button"
          onClick={onClear}
          className="mt-4 px-4 py-2 rounded-lg border border-emerald-600 text-emerald-700 font-medium hover:bg-emerald-50 transition"
        >
          Clear search
        </button>
      )}
    </div>
  );
}
