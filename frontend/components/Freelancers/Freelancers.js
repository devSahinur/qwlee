"use client";
// /hire-freelancers — full freelancer directory using the homepage card.
//
// Layout: emerald → cyan hero (same wash as /services and the home hero)
// with an in-page search input, then a responsive grid of FreelancersCard
// tiles, then Ant pagination. Card design lives in
// components/Home/MostPopularFreelancers/FreelancersCard.js so both
// surfaces share one implementation.

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Pagination } from "antd";
import Image from "next/image";
import Link from "next/link";
import { IoSearch, IoClose } from "react-icons/io5";

import { useGetAllUsersQuery } from "@/app/redux/features/getAllUsersApi";
import FreelancersCard from "@/components/Home/MostPopularFreelancers/FreelancersCard";
import FreelancersCardSkeleton from "@/components/Home/MostPopularFreelancers/FreelancersCardSkeleton";

const LIMIT = 12;

export default function Freelancers() {
  const params = useSearchParams();
  const initialName = params.get("name") || "";
  const [query, setQuery] = useState(initialName);
  const [debouncedQuery, setDebouncedQuery] = useState(initialName);
  const [currentPage, setCurrentPage] = useState(1);

  // Mirror the URL param into local state — so /hire-freelancers?name=X
  // pre-fills the search box.
  useEffect(() => {
    setQuery(initialName);
    setDebouncedQuery(initialName);
    setCurrentPage(1);
  }, [initialName]);

  // Debounce the in-page input so we don't refetch on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQuery(query);
      setCurrentPage(1);
    }, 280);
    return () => clearTimeout(t);
  }, [query]);

  const { data, isFetching, isError } = useGetAllUsersQuery({
    search: debouncedQuery || undefined,
    page: currentPage,
    limit: LIMIT,
  });

  const results = data?.data?.attributes?.results || [];
  const total = data?.data?.attributes?.totalResults || 0;

  return (
    <main>
      {/* Hero header — same palette as /services + home hero so the
          directory feels like part of the same family. */}
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
            Verified freelancers
          </span>
          <h1 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight text-gray-900">
            Hire top freelancers
          </h1>
          <p className="mt-3 md:mt-4 text-sm md:text-lg text-gray-600 max-w-2xl mx-auto">
            Search the Qwlee marketplace by name or expertise. Open any profile
            to see gigs, reviews, and portfolio.
          </p>

          <div className="mt-7 mx-auto max-w-xl">
            <div className="flex items-center bg-white rounded-2xl border border-gray-200 shadow-sm focus-within:border-emerald-500 transition">
              <div className="pl-4 text-gray-400">
                <IoSearch className="w-5 h-5" />
              </div>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search freelancers by name…"
                aria-label="Search freelancers"
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

      <section className="container mx-auto px-4 py-10 md:py-14">
        <div className="flex items-end justify-between mb-5 md:mb-6">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">
            {isFetching && !results.length
              ? "Loading freelancers…"
              : debouncedQuery
              ? `${total} freelancer${total === 1 ? "" : "s"} matching “${debouncedQuery}”`
              : `${total} freelancers available`}
          </h2>
        </div>

        {isError ? (
          <div className="text-center py-12 text-red-500">
            Something went wrong loading freelancers.
          </div>
        ) : isFetching && !results.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <FreelancersCardSkeleton key={i} />
            ))}
          </div>
        ) : results.length === 0 ? (
          <EmptyState query={debouncedQuery} onClear={() => setQuery("")} />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
              {results.map((u) => (
                <FreelancersCard key={u.id || u._id} data={u} />
              ))}
            </div>
            {total > LIMIT && (
              <Pagination
                current={currentPage}
                total={total}
                pageSize={LIMIT}
                onChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 200, behavior: "smooth" });
                }}
                showSizeChanger={false}
                className="flex justify-center mt-8"
              />
            )}
          </>
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
        No freelancers match {query ? `“${query}”` : "your search"}
      </p>
      <p className="text-sm text-gray-500 mt-1">
        Try a different name, or{" "}
        <Link href="/gig" className="text-emerald-700 font-medium hover:underline">
          browse services instead
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
