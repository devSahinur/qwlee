"use client";
// Tiny consumer hook over the wishlist endpoints. Wraps the love/unlove
// mutations + the list query so cards can render a heart without
// re-implementing the same plumbing on every page.
//
//   const { lovedIds, isLoved, toggle, isAuthed } = useWishlist();
//
// `toggle(gigId)` handles both states and shows a toast. Unauth users
// get bounced to /sign-in via toast (no Next router redirect — leave
// that to the caller if needed).

import { useMemo } from "react";
import { toast } from "sonner";

import useUser from "@/hooks/useUser";
import {
  useGetMyListQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} from "@/app/redux/features/getMyListApi";

export default function useWishlist() {
  const user = useUser();
  const isAuthed = !!user;
  const { data } = useGetMyListQuery(undefined, { skip: !isAuthed });
  const [add] = useAddToWishlistMutation();
  const [remove] = useRemoveFromWishlistMutation();

  const items = data?.data?.attributes?.results || [];
  const lovedIds = useMemo(
    () => new Set(items.map((x) => x.gigId?._id || x.gigId).filter(Boolean)),
    [items]
  );

  function isLoved(gigId) {
    return lovedIds.has(String(gigId)) || lovedIds.has(gigId);
  }

  async function toggle(gigId, { silent = false } = {}) {
    if (!gigId) return;
    if (!isAuthed) {
      toast.warning("Sign in to save gigs");
      return { ok: false, signIn: true };
    }
    const willLove = !isLoved(gigId);
    const action = willLove ? add : remove;
    const res = await action(gigId);
    if (res?.error) {
      // Backend currently 400s on duplicate love. If that fires for the
      // "love" direction we silently accept it (already saved); for the
      // unlove direction we surface the error.
      const msg = res.error?.data?.message;
      if (willLove && /already/i.test(msg || "")) return { ok: true };
      if (!silent) toast.error(msg || "Could not update wishlist");
      return { ok: false };
    }
    if (!silent) toast.success(willLove ? "Saved to wishlist" : "Removed from wishlist");
    return { ok: true };
  }

  return { items, lovedIds, isLoved, toggle, isAuthed };
}
