"use client";
// Qwlee top navigation v2.
//
// Sticky white bar above all pages. Real auth-state awareness (uses the
// shared useUser hook), real search (routes to /gig?title=), real
// notification badge (uses the existing getNotification API). No stubbed
// dropdowns — items here actually navigate somewhere real.
//
// Mobile: collapses to logo + menu button + search icon; the existing
// MobileDrawer handles the slide-out.

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Dropdown } from "antd";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { IoSearch, IoNotificationsOutline } from "react-icons/io5";
import { HiOutlineMenu } from "react-icons/hi";
import { MdOutlineEmail } from "react-icons/md";
import { IoMdHeartEmpty } from "react-icons/io";

import useUser from "@/hooks/useUser";
import useViewMode, { SELLING, BUYING, clearViewMode } from "@/hooks/useViewMode";
import { logout } from "@/actions/auth.services";
import { setUser } from "@/app/redux/slices/userSlice";
import { useGetNotificationQuery } from "@/app/redux/features/getNotificationApi";
import QwleeLogo from "@/components/common/QwleeLogo";
import Avatar from "@/components/common/Avatar";
import SearchSuggestions from "@/components/Search/SearchSuggestions";
import CategoriesMenu from "./CategoriesMenu";
import NotificationsMenu from "./NotificationsMenu";
import MessagesMenu from "./MessagesMenu";
import MobileDrawer from "./Header/MobileDrawer";

export default function TopNav() {
  const user = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  // useUser reads cookies, which are only present client-side. To avoid
  // SSR rendering "Sign in / Join" and the client immediately swapping
  // to the authed UI (hydration mismatch), gate every user-dependent
  // branch behind `mounted` — flips to true after first client render.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const authedUser = mounted ? user : null;
  const { mode, isSelling, toggleViewMode } = useViewMode(authedUser);

  // Skip the notification query when unauth — keeps the API from 401-ing.
  const { data: notificationData } = useGetNotificationQuery(undefined, {
    skip: !authedUser,
  });
  const unread = notificationData?.unReadCount || 0;

  // Drop a subtle shadow once the page scrolls a bit — tells the user the
  // bar is sticky without being heavy.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hide the inline search box on the homepage — the hero has its own
  // large search. Show it everywhere else.
  const showInlineSearch = pathname !== "/";

  function handleLogout() {
    const refreshToken = Cookies.get("refreshToken");
    // Local cleanup always runs — even if the backend call fails (network
    // down, stale token already removed server-side, etc.), the user
    // expects to be signed out on this device. We fire-and-forget the
    // server call and ignore non-success responses.
    function finishLocally() {
      localStorage.removeItem("accessToken");
      Cookies.remove("user");
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      clearViewMode();
      dispatch(setUser(null));
      router.push("/sign-in");
      toast.success("Signed out");
    }
    Promise.resolve(refreshToken ? logout(refreshToken) : null)
      .catch(() => {
        // Ignore — local cleanup still proceeds.
      })
      .finally(finishLocally);
  }

  // Pages that only make sense in one mode — if the user switches modes
  // while standing on one of these, send them somewhere neutral.
  // Everywhere else (gig browse, gig detail, profile, inbox, …) stay put.
  const SELLER_ONLY = ["/earnings", "/gig/add", "/gig/edit"];
  const BUYER_ONLY = ["/list"];

  function handleSwitchMode() {
    const next = isSelling ? BUYING : SELLING;
    toggleViewMode();
    toast.success(next === SELLING ? "Switched to Selling" : "Switched to Buying");
    const path = pathname || "/";
    const becomingBuyer = next === BUYING;
    const onSellerOnly = SELLER_ONLY.some((p) => path === p || path.startsWith(`${p}/`));
    const onBuyerOnly = BUYER_ONLY.some((p) => path === p || path.startsWith(`${p}/`));
    if ((becomingBuyer && onSellerOnly) || (!becomingBuyer && onBuyerOnly)) {
      router.push("/dashboard");
    }
  }

  // Header section — shows who you are + the active mode pill, like Fiverr.
  const menuHeader = {
    key: "header",
    label: (
      <div className="px-4 py-3 flex items-center gap-3 min-w-[240px]">
        <Avatar src={authedUser?.image} name={authedUser?.fullName} size={40} rounded />
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-gray-900 truncate">
            {authedUser?.fullName || "Member"}
          </div>
          <div className="text-xs text-gray-500 truncate">
            {authedUser?.username ? `@${authedUser.username}` : "Qwlee member"}
          </div>
        </div>
        <span
          className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${
            isSelling
              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
              : "bg-sky-50 text-sky-700 border border-sky-100"
          }`}
        >
          {isSelling ? "Selling" : "Buying"}
        </span>
      </div>
    ),
    disabled: true,
  };

  const sellingItems = [
    { key: "dashboard", label: <NavItem onClick={() => router.push("/dashboard")}>Dashboard</NavItem> },
    { key: "earnings", label: <NavItem onClick={() => router.push("/earnings")}>Earnings</NavItem> },
    { key: "orders", label: <NavItem onClick={() => router.push("/order")}>Manage orders</NavItem> },
    { key: "add-gig", label: <NavItem onClick={() => router.push("/gig/add")}>Create a new gig</NavItem> },
    { key: "wishlist", label: <NavItem onClick={() => router.push("/list")}>Wishlist</NavItem> },
    authedUser?.username && {
      key: "public",
      label: <NavItem onClick={() => router.push(`/${authedUser.username}`)}>My public profile</NavItem>,
    },
  ].filter(Boolean);

  const buyingItems = [
    { key: "dashboard", label: <NavItem onClick={() => router.push("/dashboard")}>Dashboard</NavItem> },
    { key: "orders", label: <NavItem onClick={() => router.push("/order")}>Orders</NavItem> },
    { key: "wishlist", label: <NavItem onClick={() => router.push("/list")}>Wishlist</NavItem> },
    { key: "post", label: <NavItem onClick={() => router.push("/gig")}>Browse services</NavItem> },
  ];

  const userMenu = [
    menuHeader,
    { type: "divider" },
    {
      key: "switch",
      label: (
        <NavItem onClick={handleSwitchMode}>
          <span className="font-medium">
            {isSelling ? "Switch to Buying" : "Switch to Selling"}
          </span>
        </NavItem>
      ),
    },
    { type: "divider" },
    ...(isSelling ? sellingItems : buyingItems),
    { type: "divider" },
    { key: "profile", label: <NavItem onClick={() => router.push("/profile")}>Profile settings</NavItem> },
    { key: "inbox", label: <NavItem onClick={() => router.push("/inbox")}>Inbox</NavItem> },
    { key: "support", label: <NavItem onClick={() => router.push("/support")}>Help & support</NavItem> },
    { type: "divider" },
    { key: "logout", label: <NavItem danger onClick={handleLogout}>Sign out</NavItem> },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 bg-white border-b transition-shadow ${
          scrolled ? "shadow-sm border-gray-200" : "border-transparent"
        }`}
      >
        <div className="container mx-auto px-3 md:px-6 h-16 flex items-center gap-3 md:gap-6">
          {/* Logo */}
          <Link href="/" aria-label="Qwlee home" className="shrink-0">
            <QwleeLogo height={28} />
          </Link>

          {/* Desktop-only categories dropdown — sits next to the logo */}
          <div className="hidden md:block">
            <CategoriesMenu />
          </div>

          {/* Inline search (hidden on / — hero owns the homepage search).
              When hidden, the empty flex-1 spacer below still pushes the
              right nav to the right edge. */}
          {showInlineSearch && (
            <div className="hidden md:block flex-1 max-w-xl">
              <SearchSuggestions size="sm" placeholder="Find a service…" />
            </div>
          )}

          {/* Always flex-1 so the right-side nav anchors to the right
              regardless of whether the inline search is rendered. */}
          <div className="flex-1" />

          {/* Desktop right-side nav */}
          <nav className="hidden md:flex items-center gap-1 text-sm">
            <Link
              href="/gig"
              className="px-3 py-2 rounded text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 transition"
            >
              Explore
            </Link>
            {authedUser && (
              <button
                type="button"
                onClick={handleSwitchMode}
                className="ml-1 px-3 py-2 rounded-lg border border-emerald-600 text-emerald-700 font-medium hover:bg-emerald-50 transition text-sm"
              >
                {isSelling ? "Switch to Buying" : "Switch to Selling"}
              </button>
            )}
            {!authedUser && (
              <Link
                href="/sign-in"
                className="ml-1 px-3 py-2 rounded text-gray-700 hover:text-emerald-700 transition"
              >
                Sign in
              </Link>
            )}
            {!authedUser && (
              <Link
                href="/sign-up"
                className="ml-1 px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition"
              >
                Join
              </Link>
            )}

            {authedUser && (
              <>
                <Link
                  href="/list"
                  className="p-2 rounded-full text-gray-700 hover:bg-gray-100"
                  aria-label="Wishlist"
                  title="Wishlist"
                >
                  <IoMdHeartEmpty className="w-5 h-5" />
                </Link>
                {/* Inbox + notifications dropdowns — fetch only when
                    authed, click to mark read + navigate. */}
                <MessagesMenu active={!!authedUser} />
                <NotificationsMenu active={!!authedUser} />
                <Dropdown
                  menu={{ items: userMenu }}
                  placement="bottomRight"
                  trigger={["click"]}
                >
                  <button className="ml-2 rounded-full ring-2 ring-transparent hover:ring-emerald-200 transition">
                    <Avatar
                      src={authedUser.image}
                      name={authedUser.fullName}
                      size={36}
                      rounded
                    />
                  </button>
                </Dropdown>
              </>
            )}
          </nav>

          {/* Mobile right-side */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => {
                const q = prompt("Find a service");
                if (q) router.push(`/gig?title=${encodeURIComponent(q.trim())}`);
              }}
              className="p-2 rounded-full text-gray-700 hover:bg-gray-100"
              aria-label="Search"
            >
              <IoSearch className="w-5 h-5" />
            </button>
            <button
              onClick={() => setDrawerOpen(true)}
              className="p-2 rounded-full text-gray-700 hover:bg-gray-100"
              aria-label="Menu"
            >
              <HiOutlineMenu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        setOpen={setDrawerOpen}
        showDrawer={() => setDrawerOpen(true)}
        user={authedUser}
      />
    </>
  );
}

function NavItem({ children, onClick, danger }) {
  return (
    <div
      onClick={onClick}
      className={`px-4 py-2 text-sm cursor-pointer ${
        danger ? "text-red-600" : "text-gray-800"
      } hover:bg-gray-50`}
    >
      {children}
    </div>
  );
}
