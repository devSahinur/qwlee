"use client";
// Wishlist heart on the gig detail page. Visible to any signed-in user;
// unauthed visitors get a toast nudge to sign in. Uses the same shared
// useWishlist hook as the gig listing so state stays in sync.

import { useRouter } from "next/navigation";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import useUser from "@/hooks/useUser";
import useWishlist from "@/hooks/useWishlist";

export default function GigLoveReact({ result }) {
  const user = useUser();
  const router = useRouter();
  const { isLoved, toggle } = useWishlist();
  const gigId = result?._id || result?.id;
  const loved = isLoved(gigId);

  async function handle() {
    if (!user) {
      router.push(`/sign-in?from=${encodeURIComponent(`/gig/${result?.slug || gigId}`)}`);
      return;
    }
    await toggle(gigId);
  }

  return (
    <button
      type="button"
      onClick={handle}
      aria-label={loved ? "Remove from wishlist" : "Save to wishlist"}
      aria-pressed={loved}
      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:border-rose-300 hover:bg-rose-50/40 transition"
    >
      {loved ? (
        <FaHeart className="text-rose-500" />
      ) : (
        <FaRegHeart className="text-gray-600" />
      )}
      <span>{loved ? "Saved" : "Save"}</span>
    </button>
  );
}
