"use client";
// Auth gate + redirect into the public profile.
//
// We keep "/profile" as a stable URL (linked from the nav menu and old
// emails) but route the user straight to /<username>. That page is the
// real profile; if the viewer happens to be the owner, UsernameProfile
// surfaces owner controls (Edit profile, cover upload).

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import useUser from "@/hooks/useUser";

export default function Profile() {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user === undefined) return; // hook still hydrating
    if (!user) {
      toast.warning("Sign in to view your profile");
      router.replace("/sign-in?from=/profile");
      return;
    }
    if (user?.username) {
      router.replace(`/${user.username}`);
      return;
    }
    // Authed but no username yet — send them to set one.
    router.replace("/profile/edit");
  }, [user, router]);

  return (
    <div className="container mx-auto px-4 py-16 text-center text-sm text-gray-500">
      Taking you to your profile…
    </div>
  );
}
