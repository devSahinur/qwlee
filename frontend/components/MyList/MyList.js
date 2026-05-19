"use client";
// Qwlee wishlist page. Reuses the marketplace GigCard so the heart and
// hover behaviours stay consistent — clicking the heart removes the
// item without leaving the page (optimistic update via useWishlist).

import Link from "next/link";
import Image from "next/image";
import { IoHeartCircleOutline } from "react-icons/io5";

import { useGetMyListQuery } from "@/app/redux/features/getMyListApi";
import useUser from "@/hooks/useUser";
import GigCard from "@/components/common/GigCard";
import GigCardSkeleton from "@/components/Gig/GigCardSkeleton";

export default function MyList() {
  const user = useUser();
  const { data, isLoading, isError } = useGetMyListQuery(undefined, {
    skip: !user,
  });
  const items = data?.data?.attributes?.results || [];
  const gigs = items
    .map((entry) => entry?.gigId)
    .filter((g) => g && (g._id || g.id));

  return (
    <main className="container mx-auto px-4 py-8 md:py-10">
      <header className="flex items-end justify-between gap-3 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 inline-flex items-center gap-2">
            <IoHeartCircleOutline className="text-rose-500 w-7 h-7" />
            My Wishlist
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Gigs you&rsquo;ve saved across the Qwlee marketplace.
          </p>
        </div>
        {gigs.length > 0 && (
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
            {gigs.length} {gigs.length === 1 ? "item" : "items"}
          </span>
        )}
      </header>

      {!user ? (
        <SignInPrompt />
      ) : isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <GigCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <ErrorState />
      ) : gigs.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-5">
          {gigs.map((gig) => (
            <GigCard key={gig._id || gig.id} item={gig} />
          ))}
        </div>
      )}
    </main>
  );
}

function EmptyState() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
      <Image src="/not-data.svg" width={180} height={180} alt="" className="mx-auto opacity-80" />
      <h2 className="mt-4 text-lg font-semibold text-gray-900">
        Your wishlist is empty
      </h2>
      <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
        Tap the heart on any gig to save it here for later.
      </p>
      <Link
        href="/gig"
        className="inline-block mt-5 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700"
      >
        Browse gigs
      </Link>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="rounded-2xl border border-rose-100 bg-rose-50/40 p-8 text-center">
      <h3 className="text-base font-semibold text-rose-700">
        We couldn&rsquo;t load your wishlist
      </h3>
      <p className="text-sm text-rose-600 mt-1">
        Please refresh and try again.
      </p>
    </div>
  );
}

function SignInPrompt() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
      <h2 className="text-lg font-semibold text-gray-900">Sign in to see your wishlist</h2>
      <p className="mt-1 text-sm text-gray-500">
        Save gigs to come back to them anytime.
      </p>
      <Link
        href="/sign-in?from=/list"
        className="inline-block mt-5 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700"
      >
        Sign in
      </Link>
    </div>
  );
}
