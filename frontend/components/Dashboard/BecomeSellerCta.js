"use client";
// Buyer-only CTA. Hits POST /v1/users/become-seller, then refreshes the
// local cookie/Redux so the rest of the app re-evaluates as freelancer.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import Cookies from "js-cookie";
import baseAxios from "@/lib/config";
import { setUser } from "@/app/redux/slices/userSlice";

export default function BecomeSellerCta({ user, onUpgraded }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  if (!user || user.role !== "buyer") return null;

  async function handleClick() {
    setLoading(true);
    try {
      const { data } = await baseAxios.post("/users/become-seller");
      const next = data?.data?.attributes?.user;
      if (next) {
        Cookies.set("user", JSON.stringify(next));
        dispatch(setUser(next));
        toast.success("You're now a Qwlee seller");
        if (onUpgraded) onUpgraded(next);
        else router.push("/profile/edit");
      } else {
        toast.error("Could not upgrade — try again");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err?.message || "Upgrade failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
      <h3 className="font-semibold text-emerald-900">Want to sell on Qwlee?</h3>
      <p className="text-sm text-emerald-800 mt-1">
        Upgrade your account to list gigs, get paid for your work, and build a
        public seller profile.
      </p>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="mt-3 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition disabled:opacity-60"
      >
        {loading ? "Upgrading…" : "Become a seller"}
      </button>
    </div>
  );
}
