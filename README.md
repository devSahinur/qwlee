# Qwlee — Modern Freelance Marketplace

Three-app freelancing marketplace (rebranded from the legacy cnnctr codebase). Each app is a separate deployable.

> **All image uploads route through [ImgBB](https://api.imgbb.com/).** Nothing is written to local disk. Set `IMGBB_API_KEY` in `backend/.env`.

| App | Stack | Port | Purpose |
|---|---|---|---|
| `backend/` | Express 4 + Mongoose 8 + Socket.IO | `7171` (HTTP) + `8181` (socket) | REST API + websocket gateway |
| `frontend/` | **Next.js 16.2.6** + **React 19.2.6** (App Router, JS) | `8000` | Public marketplace |
| `admin/` | Vite 5 + React 18 | `4000` | Internal admin dashboard |

## Prerequisites

- Node.js ≥ 20 (tested with 21.7)
- MongoDB running locally on `mongodb://localhost:27017`
  ```sh
  brew services start mongodb-community
  ```

## First-time setup

```sh
# backend
cd backend && cp .env.example .env && npm install
# frontend
cd ../frontend && cp .env.example .env && npm install
# admin
cd ../admin   && cp .env.example .env && npm install
```

Fill in the `.env` files. **Required values for local dev:**

- `backend/.env`: `MONGODB_URL`, `JWT_SECRET` (any string ≥ 16 chars), `NODE_ENV=development`, `IMGBB_API_KEY`, **Stripe TEST keys** (`STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, optional `STRIPE_WEBHOOK_SECRET` from `stripe listen`).
- `frontend/.env`: `NEXT_PUBLIC_BACKEND_API_URL=http://localhost:7171`, `JWT_SECRET` **identical to the backend's**, `NEXTAUTH_SECRET` (`openssl rand -base64 32`), `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (same `pk_test_…` as the backend).
- `admin/.env`: `VITE_API_BASE_URL=http://localhost:7171`.

## Running

Three terminals:

```sh
cd backend  && npm run dev    # nodemon, src/index.js
cd frontend && npm run dev    # next dev -p 8000
cd admin    && npm run dev    # vite, port 4000
```

Health check: `curl http://localhost:7171/health`.

## Seeding demo data

```sh
cd backend
npm run seed              # reset + reseed everything (default)
npm run seed:reset        # drop all collections, no insert
npm run seed:users        # only users
npm run seed:gigs         # users + categories + gigs (good for UI work)
node seeders/index.js --only=blogs,banners   # subset of phases
```

Seeded volumes (per full run): **14 users · 15 categories · 17 gigs · 28 portfolios · 28 orders · 28 payments · 6 reviews · 12–16 withdrawals · 12–19 favorites · 50 chats · ~35 order messages · 24 notifications · 5 blog posts · 4 banners · privacy/terms/trust-safety content**.

The seeder also prints **3 sample `/order/<id>` URLs** at the end so you can land on a populated order detail page immediately.

### Demo credentials (all 14 seeded users)

Passwords are bcrypt-hashed by the User pre-save hook. To customize, edit `backend/seeders/usersSeeder.js` and re-run `npm run seed`.

#### Admins — password `Admin123!`

| Email | Username | Name | Role |
|---|---|---|---|
| `admin@example.com` | `admin` | Aria Sterling | Platform admin |
| `moderator@example.com` | `moderator` | Marcus Chen | Trust & Safety moderator |

#### Sellers (freelancers) — password `Seller123!`

| Email | Username | Name | Specialization | Location |
|---|---|---|---|---|
| `seller@example.com` | `sofiacodes` | Sofia Martinez | Full-Stack Developer · Next.js & Node | Barcelona, Spain |
| `daniel.park@example.com` | `danpark` | Daniel Park | Senior UI/UX Designer · Figma | Seoul, South Korea |
| `priya.anand@example.com` | `priyaedits` | Priya Anand | Video editor (YouTube + podcast) | Bengaluru, India |
| `james.oconnor@example.com` | `jamesseo` | James O'Connor | SEO & content strategist · B2B SaaS | Dublin, Ireland |
| `aisha.mohammed@example.com` | `aishamobile` | Aisha Mohammed | Mobile app developer · React Native / Flutter | Lagos, Nigeria |
| `lena.fischer@example.com` | `lenawrites` | Lena Fischer | Copywriter · landing pages & ads | Berlin, Germany |
| `thiago.ribeiro@example.com` | `thiagoai` | Thiago Ribeiro | AI engineer · LLM apps, RAG | São Paulo, Brazil |

#### Buyers — password `Buyer123!`

| Email | Username | Name | Bio | Location |
|---|---|---|---|---|
| `buyer@example.com` | `oliviab` | Olivia Bennett | Founder, indie SaaS | London, UK |
| `ryan.patel@example.com` | `ryanp` | Ryan Patel | Marketing lead, e-commerce startup | Toronto, Canada |
| `mia.tanaka@example.com` | `miat` | Mia Tanaka | Product manager | Tokyo, Japan |
| `lucas.muller@example.com` | `lucasm` | Lucas Müller | Agency owner | Munich, Germany |
| `hannah.kim@example.com` | `hannahk` | Hannah Kim | Indie podcaster | Seoul, South Korea |

Seed data is deterministic-by-seed: all images come from `picsum.photos/seed/<slug>/<w>/<h>`, so re-running the seeder produces visually consistent placeholders. `picsum.photos` is already in the Next.js image allowlist.

---

# Session log — current pass

This pass shipped a large product surface across both the marketplace and the admin dashboard. Everything below is implemented, smoke-tested, and live in `main`. Read this as the changelog for the current session.

## 1. Marketplace: Switch to Selling / Switch to Buying

Fiverr-style account-mode toggle. A single Qwlee user can act as buyer or seller without re-logging.

- **`hooks/useViewMode.js`** — `localStorage`-backed `{mode, isSelling, isBuying, setViewMode, toggleViewMode}`. Default is derived from `user.role` (freelancer → selling, buyer → buying); once toggled manually, the choice wins. Cross-component sync via a `qwlee:viewMode:changed` window event.
- **`components/Layout/TopNav.js`** — replaces the old "Become a seller" CTA with a `Switch to …` pill button. Avatar dropdown has a mode header (avatar + name + mode pill), a `Switch to …` row, then a mode-specific block:
  - **Selling**: Dashboard · Earnings · Manage orders · Create a new gig · Wishlist · My public profile
  - **Buying**: Dashboard · Orders · Wishlist · Browse services
- Toggle no longer force-redirects. Only the strictly role-gated pages bounce (selling-only `/earnings`, `/gig/add`, `/gig/edit`; buying-only `/list`). Everything else stays put.
- **`components/Dashboard/Dashboard.js`** — picks `FreelancerDashboard` vs `BuyerDashboard` from `isSelling`, not `user.role`.
- **`components/Layout/Header/MobileDrawer.js`** — mirrors the same toggle + mode-specific links on mobile.

## 2. Marketplace: gig detail page (Fiverr-style)

Full rewrite of `/gig/[slug]`.

- **`components/Gig/GigDetails/GigDetails.js`** — 2-column layout. **LEFT (8/12)**: breadcrumb · H1 title · seller chip (avatar, name, online dot, rating, verified badge) · image gallery · About this gig · Get to know the seller · Reviews. **RIGHT (4/12, sticky)**: package picker.
- **`GigGallery.js`** *(new)* — large 16:10 hero + thumbnail strip with click-to-swap; uses `ImageWithFallback`.
- **`GigPackagePicker.js`** *(new)* — Basic / Standard / Premium tabs, big price, delivery time, normalized feature list, Continue button that drives Stripe checkout via `createBuyerOrder`. Sellers see "Buyers only" with a hint to switch modes.
- **`AboutCard.js`** — slimmed to a clean "Get to know the seller" card.
- **`GigReviews.js`** + **`GigReviewCard.js`** — 5-bar rating histogram from real review data; star-filled review cards with relative dates.
- **`utils/normaliseFeatures.js`** *(new)* — accepts strings or `{feature: …}` objects and yields plain strings (fixes the silent `undefined` features bug).
- Backend `services/gig.service.js` populates `categoriesId` so the detail page breadcrumb renders without a second request.
- **`app/gig/[slug]/page.js`** — async server component (Next 16 `params` Promise), uses `PrimaryLayout` (no more legacy green-header `SecondaryLayout`).
- **`ContactSellerModal.js`** *(new)* — single shared "Contact seller" modal opened from both the AboutCard button and the package-picker link. Submit creates a chat, lands you in `/inbox/<chatId>?ref=<gigId>`.

### Gig listing — own-gigs excluded

Backend `gig.service.queryGigs(filter, options, { excludeUserId })` adds `userId: { $ne: excludeUserId }` whenever the request is signed-in and is **not** a slug lookup. So a freelancer browsing in either mode doesn't see their own gigs in the marketplace, while a single-gig URL (`/gig/<slug>`) still resolves for the owner.

`backend/src/middlewares/optionalAuth.js` *(new)* — best-effort JWT verification used by `GET /v1/gig` so the listing can identify the caller without forcing auth.

## 3. Marketplace: order detail page (Fiverr-style)

Full rewrite of `/order/[orderId]`.

- **`OrderDetails.js`** — header with short order id + status pill + ordered date + price; 8/4 grid: left summary, right sticky actions.
- **`OrderLeftSide.js`** — gig card, package details (delivery / revisions / delivery date + features), requirements card, activity (chat) thread.
- **`Activity.js`** — Fiverr-style chat: emerald right-aligned bubbles for you, grey left-aligned for the other party, auto-scroll, file/attachment grid, **Delivery card** with Accept-delivery CTA for buyers.
- **`OrderRightSide.js`** — sticky right rail. Sellers see countdown (Days/Hrs/Min/Sec, turns rose when late) + Deliver-now + Extend-delivery-date. Both sides see the Summary; buyers see Leave-a-review (delivered) or Request-cancellation (active).
- Seeder linkage fixed: `orderMessages.orderId` keys on Payment `_id` (matches what the URL/API use). Seeded `Payment.data` carries the rich payload the page reads (`packageName`, `package.features`, `requirements`, `revisionsLeft`, `deliveryDays`).

## 4. Marketplace: Manage orders (`/order`)

- **`Order.js`** delegates to **`ManageOrders.js`** *(new)*. One unified page handles both buyer + seller views via `useViewMode`.
- Tabs with **live counts** from `GET /v1/orders/counts?role=seller|buyer` (single Mongo aggregation per side).
- Search box, sort by Newest / Oldest / Due soonest / Highest total, antd Pagination (10/page).
- Per row: counterparty avatar+name, gig thumb+title+short id, due-in (color-tinted), total, status pill, View link.

Backend: new `getOrderCounts` service + `GET /v1/orders/counts` endpoint.

## 5. Marketplace: Wishlist (`/list`)

End-to-end wishlist now works for buyers AND sellers.

- Backend: `/v1/gig/love` POST/PUT/GET now `auth("common")` (was `auth("buyer")`).
- **`hooks/useWishlist.js`** *(new)* — `{ items, lovedIds, isLoved, toggle, isAuthed }`. Optimistic updates via `updateQueryData`.
- **`components/common/GigCard.js`** — heart overlay (filled rose / outlined grey) on every gig card.
- **`components/Gig/GigDetails/GigLoveReact.js`** — rewritten as a pill button (`Save` ↔ `Saved`).
- **`components/MyList/MyList.js`** — full redesign: emerald header with heart icon + item count chip, reuses `GigCard` for tiles, branded empty state, sign-in prompt.
- Navbar: heart icon visible for all authed users (was buying-only); both selling and buying menus include **Wishlist**.

## 6. Marketplace: Inbox + Real-time

Real-time messaging was broken — fixed end-to-end.

- **Root cause fix**: `components/Context/SocketProvider.js` now passes the JWT in the handshake `auth.token`. Without it, the backend's `io.use` middleware never bound the socket to the userId room → every `io.to(receiverId).emit(...)` landed in an empty room.
- Socket recreates when the token changes (login/logout) via a cookie poll.
- **Typing indicators**: server relays `typing/start` / `typing/stop` with `senderId` signed from the verified socket. The inbox composer fires throttled emits; receivers show "typing…" with a 4s safety auto-clear.
- **Presence (online/offline)**: live `user/connect` and `user/disconnect` events override the cached `online` flag on the inbox header. Last-seen rendered as "Active now" / "Last seen Xm ago" / "Last seen X day(s) ago".
- **Notification sound**: `utils/playMessageSound.js` synthesises a soft 2-tone chime via Web Audio (no asset to ship). Bell icon toggles a `qwlee:mute` localStorage flag.
- **Refresh button** on the chat header — manual refetch.
- **Chat sidebar auto-reorder**: server now mirrors `new-chat` to the sender too. `Chat.js` sorts by `lastMessage.createdAt` desc on every state change. Smooth CSS animation (`@keyframes chatRowIn`) on row mount.
- **Unread counts**: backend `chat.service` adds `unreadCount` per chat; `message.service.getMessages` auto-marks inbound messages as read. Sidebar rows have an emerald tint + bold name + green count badge while unread.
- **Gig reference card**: `Message` schema's `content` now carries an optional `gigReference` subdoc (`{gigId, title, image, price, slug, deliveryDays}`). Contact-seller flow snapshots the gig into the first message; chat bubble renders a Fiverr-style card above the text bubble, linked to `/gig/<slug>`.
- **Navbar Messages dropdown** fixed (was reading wrong response shape and routing to `/inbox?chat=` instead of `/inbox/<id>`).
- **Avatar fallback hardening**: `components/common/Avatar.js` runtime `onError` swap to initials when a stored URL 404s; `unoptimized` flag added to bypass Next.js remote-pattern blocks.

## 7. Marketplace: Custom offer flow

Seller-side custom offer (Fiverr-style "create custom offer") was already plumbed; UI surfaced + cleaned up:

- **`Message.js`** shows a **Create custom offer** pill in the composer toolbar (gated by `isSelling`, not raw role — so freelancers in selling mode can pitch).
- `AllGigsModal` → `CustomOfferModal` flow lands an `offer` message in the chat; the buyer sees Accept / Cancel buttons rendered by `MessageCart`. Accept fires the existing Stripe checkout.

## 8. Marketplace: Contact-seller handoff

- Single shared **`ContactSellerModal`** used by both AboutCard's "Contact me" and the package-picker's "Contact seller" link. Single primary button "Send message".
- On submit: creates the chat via `addMessage`, reads the new `chat.id` from the response, routes to `/inbox/<chatId>?ref=<gigId>`. Inbox prefills a friendly greeting and pins an emerald "Referencing gig" banner above the messages — and writes the full `gigReference` snapshot into the message itself.

## 9. Marketplace: Verify-email + auth fixes

- **`/verify-email`** page made async-params-safe (Next 16). OTP component now reads from `useSearchParams()` instead of spreading the server-side `searchParams` Promise (which had been leaking React internals into the request body, causing Joi to reject `_children, _debugChunk, …`).
- **Logout 404 fix**: backend `authService.logout(refreshToken)` is now idempotent (no row → still 200). Frontend `handleLogout` always runs local cleanup in `.finally()` so a network error can't strand a session.
- **Login**: 403 with `BANNED:<reason>` surfaces a rose alert above the form instead of the generic toast.
- **Stripe test keys** wired into both apps. `backend/.env` swapped from a committed live `sk_live_…` to a placeholder + a clearly-flagged `# ROTATED_*` line preserving the old key for rotation in the Stripe dashboard. Webhook secret obtained via `stripe listen --forward-to localhost:7171/v1/orders/webhook`.
- **IP-based country detection**: `frontend/hooks/useIpLocation.js` calls `ipapi.co/json/`, caches in `sessionStorage` for 6h. Signup shows a Fiverr-style "Country" row (flag emoji + `City, Country`), included in the registration payload. Sign-in footer shows "Signing in from …".
- Login validation extended to accept the new optional `location` field on register.

## 10. Marketplace: Profile + Personal info polish

- **`/profile`** is now an **auth gate + redirect**. Authed users with a username get bounced to `/<username>` so the public profile IS your profile (Fiverr pattern). Unauth → `/sign-in?from=/profile`. Authed without a username → `/profile/edit`.
- **`UsernameProfile.js`** detects ownership against `useUser` and surfaces owner controls when viewing your own profile:
  - **Owner toolbar**: Edit profile (emerald primary) · Create a new gig (sellers only) · Dashboard icon link.
  - **Cover upload**: a "Change cover" pill in the corner of the cover image, with inline upload + spinner.
- Cover-photo update writes back to `localStorage.user` + redux user slice so the topbar reflects the change without reload.
- **Recently viewed gigs** on the homepage capped at **one row of up to 4 cards** and hidden entirely in Selling mode.
- **Categories navbar strip** hidden in Selling mode.

## 11. Marketplace: Seller verification (ID / passport)

New end-to-end identity verification with admin review and a public verified tick.

- **Backend model** (`user.model.js`): `isVerified: Boolean` + a nested `verification` sub-doc `{status, documentType, documentNumber, frontUrl, backUrl, selfieUrl, submittedAt, reviewedAt, reviewedBy, rejectionReason}` with lifecycle `unsubmitted → pending → approved/rejected`.
- **Service** (`verification.service.js`): `submitDocs`, `listPending`, `review`. Approval flips `isVerified`; rejection records the reason so the user can resubmit.
- **Routes** (`routes/v1/verification.routes.js`):
  - `POST /v1/verification/submit` — `auth("common")`, multer `.fields(front/back/selfie)` + ImgBB upload (uploads run with `Promise.all`).
  - `GET /v1/verification?status=…` and `PATCH /v1/verification/:userId` — `auth("admin")`.
- **Marketplace UI** (`VerificationSection.js`) — section card on `/profile/edit`:
  - Status banner per state (approved / under review / rejected with the admin's reason).
  - Form: document-type select (NID / Passport), optional doc number, three drop-zone file pickers with live previews + Remove buttons.
  - Submit refreshes the cookie + redux user blob.
- **Verified badge**: `components/common/VerifiedBadge.js` *(new)* — emerald check disc, sized via `size` prop. Wired into:
  - Public profile header (`UsernameProfile.js`)
  - Gig card seller chip (`GigCard.js`)

## 12. Marketplace: Support tickets (`/support`)

User-facing ticket system. Built from scratch.

- **Backend**: `SupportTicket` + `SupportMessage` models; `services/support.service.js` handles unread counters, lastMessageAt, auto status flips (admin reply → pending; user reply → reopens resolved); `routes/v1/support.routes.js` exposes a single tree under `/v1/support` whose handler decides on user-vs-admin scope from `req.user.role`.
- **`/support`** (SupportInbox) — user's ticket list + "Open a new ticket" form with category select.
- **`/support/[ticketId]`** (SupportThread) — full message history, composer, status pill in header, "ticket is closed" banner when status is `closed`.
- Avatar menu + mobile drawer link: **Help & support**.

## 13. Marketplace: Activity tracking + admin user monitoring

- **Backend** (`activity.model.js` + `activity.service.js`):
  - `Activity` log per user with three event types (`login`, `page`, `logout`).
  - `recordLogin({userId, ip, userAgent})` written by the login flow (after `app.set("trust proxy", true)` so `req.ip` reflects the real client).
  - `recordPage` backfills dwell time of the previous page with a 30-minute cap.
  - `getUserActivity` returns `{user, timeline, perRoute, logins}` in one round-trip.
- **Routes**: `POST /v1/activity/track` (self-report, `auth("common")`) and `GET /v1/admin/user-activity/:userId` (admin).
- **Marketplace** (`hooks/useActivityTracker.js`): mounted once in `PrimaryLayout`, emits a track event on every pathname change + closes the previous route's dwell time. Uses `navigator.sendBeacon` on `pagehide` so the last segment isn't lost when the tab closes. No-op when signed out.

---

# Admin dashboard — full overhaul

The admin app was rebuilt around a new design system. Old `#00BF63` green and hardcoded widths are gone. Every page now flows through the same primitives.

## 1. Design system + layout

- **Tailwind tokens** (`admin/tailwind.config.js`): `primary` (emerald scale 50–900), `ink` neutral scale, `shadow-card`, `shadow-pop`, `chatRowIn` keyframe.
- **Common primitives** in `admin/src/common/`:
  - `cls.js` (clsx-style joiner)
  - `format.js` (`formatMoney`, `formatNumber`, `formatDate`, `timeAgo`, `truncate`)
  - `PageHeader`, `Card`, `Kpi`, `StatusPill`, `DataTable`, `Button`
  - `LegalPage` + `LegalEditor` for Privacy / Terms / Trust & safety
  - `categoryIcons.js` — 46-entry react-icons catalogue (`{key, label, Icon}`) shared with the marketplace via a mirror file at `frontend/utils/categoryIcons.js`.

### Layout

- **`Sidebar.jsx`** — collapsible (240px → 72px), `localStorage` persistence, mobile slide-over with overlay. Grouped sections: Overview · Marketplace · People · Finance · Content · Support · System.
- **`Header.jsx`** — sticky white topbar with route-aware title, **search palette** (type "gigs" → jumps), notifications dropdown (live unread count), profile menu (My profile / Settings / Sign out).
- **`DashboardLayout.jsx`** — clean shell, `bg-ink-50/60`, `animate-fadeIn` on each page change.
- **`AdminRoute.jsx`** — robust auth check: accepts EITHER token or user blob; wraps JSON.parse in try/catch so a corrupted localStorage value can't crash the app. No more auto-logout-on-refresh.

### Routing

- **`/dashboard` is now the index route**. `/dashboard/home` is a redirect for back-compat.
- All page-component renders are direct (no extra `<AdminRoute>` wrapping per child — guarded at the layout level).

## 2. Dashboard home

- 4 KPI tiles (Total earnings, Freelancers, Buyers, Active gigs).
- Revenue area chart with **year selector** + total chip.
- New sign-ups bar chart with month selector.
- Recent users list (top 6).
- Quick stats panel with derived ratios + jump-to-earnings CTA.

## 3. Users — Freelancers + Buyers

- **`UserListPage.jsx`** drives both `/dashboard/frelancer` and `/dashboard/buyerlist` via a `role` prop.
- Search across name / username / email / location. Tab filters (All / Online / Offline / Banned). Pagination.
- Per-row actions: **Monitor** (jumps to per-user activity), **Ban** / **Unban**, **Public** (opens marketplace profile).
- Ban / Unban hidden when `row.role === "admin"`.

## 4. Ban / Unban with reason

- Backend: `User.banReason` + `User.bannedAt`. `PATCH /v1/admin/users/:userId/ban` accepts `{reason}`; `PATCH /v1/admin/users/:userId/unban` clears it. Admin role accounts are not bannable.
- Login flow throws `403 BANNED:<reason>` before validating the password.
- Marketplace `SignIn.js` surfaces the ban reason in a rose alert above the form ("Your account has been suspended — <reason>").
- Admin **Ban** button opens a reason modal (500-char counter); the saved reason appears under the Banned status pill in the row.

## 5. Per-user monitoring (`/dashboard/users/:userId`)

- Header card (avatar, name, role, online dot, last seen, joined, location).
- 4 KPI tiles: Page visits · Time on site · Sign-ins · Distinct IPs.
- **Login history** table (when + IP + device parsed from UA).
- **Routes visited** table (route, visits, total time, last visit).
- **Recent activity timeline** (events with dwell time per page).
- All in one round-trip via `GET /v1/admin/user-activity/:userId`.

## 6. Earnings + Withdrawals

- **Earnings**: year selector + 4 KPIs (Total revenue, Avg/month, Best month, Transactions) + monthly bar chart + paginated transactions table.
- **Withdrawals**: 4 KPIs (Pending / Approved / Rejected / Open amount) + per-row Approve / Reject with confirm dialogs.

## 7. Orders + Gigs (NEW admin pages)

Backend added admin-scope endpoints:
- `GET /v1/admin/orders` — every Payment, populated with gig/buyer/seller, filterable by status.
- `GET /v1/admin/gigs` — every Gig, populated with seller + category.

Admin UI:
- **`/dashboard/orders`** — 5 KPI tiles (All / In progress / Late / Delivered / Open revenue), status tabs with live counts, search across buyer / seller / gig / order id, View → opens `/order/<id>` on the marketplace.
- **`/dashboard/gigs`** — 3 KPIs (Total / Avg starting price / Matches in view), search by title / seller / category, View → opens `/gig/<slug>`.

## 8. Reports

`/dashboard/reports` — analytics-only page combining lifetime revenue, year revenue, monthly sign-ups, active gigs.

## 9. Categories (icon picker)

- Backend model: optional `icon: String` (key into the shared catalogue) on `Categories`. `image` retained as a fallback but no longer required.
- Seeder: 15 categories paired with icon keys (`code`, `phone`, `palette`, `brush`, `video`, `megaphone`, `pencil`, `sparkles`, `music`, `briefcase`, `camera`, `calculator`, `game`, `trending`, `storefront`).
- Admin Categories page: tiles render the saved react-icon inside an emerald square. Add/edit modal has a searchable 8-column grid of **46 react-icons** with hover labels and a "Selected icon" preview chip.
- Marketplace `CategoryIcon.js` prefers `category.icon` (the admin key); falls back to the legacy name → component map for old data. `CategoryBar` and `CategoriesMenu` both render the SVG icon.

## 10. Banner slider

- Gallery of 16:7 banner cards with hover-overlay Remove button.
- AddSliderImage rewritten as a clean **modal** with drop-zone preview + upload button.

## 11. Blog

- Card grid (image / date / title / snippet / Edit & Delete).
- Empty state with "Write a post" CTA.
- Existing rich-text editor flow (jodit-react) preserved.

## 12. Settings + Personal info

- **`/dashboard/setting`** — card-style hub linking to Personal info, Change password, Privacy policy, Terms & conditions, Trust & safety.
- **`/dashboard/personalinfo`** — Page header + Card with avatar block on left + 2×2 stat grid on right (Full name / Email / Location / Account created).
- **`/dashboard/editpersonalinfo`** — clean form (Name + email read-only + Location), avatar uploader with live preview + spinner overlay, writes the new user blob back to `localStorage`.

## 13. Auth flow

All four screens (Login / Forgot / OTP verify / Update password) redesigned as centered cards on an emerald gradient. Each uses the shared `Button` primitive, `react-otp-input` on the OTP step, and shows-password toggles on the password fields.

## 14. Legal pages

- `LegalPage` viewer + `LegalEditor` (jodit) primitives.
- Privacy / Terms / Trust & safety are now 10-line wrappers over the shared primitives.

## 15. ID verifications review (`/dashboard/verifications`)

- Two-pane review at `/dashboard/verifications`.
- Left: status tabs (Pending / Approved / Rejected) + search.
- Right: profile header with status pill, doc type + number, three doc tiles (Front / Back / Selfie) that open in a black-overlay zoom modal on click. **Approve & verify** and **Reject** buttons; Reject opens a 500-char reason modal whose text is what the seller sees on their profile editor.

## 16. Support tickets (`/dashboard/support`)

- Two-pane: status tabs (All / Open / Pending / Resolved / Closed) + ticket list with user avatar + subject + status pill + red unread badge.
- Right: full thread with emerald right-aligned admin bubbles, white left-aligned user bubbles. Composer for replies. Three status controls: **Mark resolved** · **Close** · **Reopen**.

## 17. Conversations review (`/dashboard/conversations`)

Read-only moderation view of every platform conversation.

Backend (`services/adminChats.service.js` + `controllers/adminChats.controller.js`):
- `GET /v1/admin/chats` (DM list) + `GET /v1/admin/chats/:chatId/messages` (full DM thread).
- `GET /v1/admin/order-chats` (one row per order with a thread, hydrated with gig + buyer + seller) + `GET /v1/admin/order-chats/:orderId/messages`.

Admin UI:
- **Direct messages** tab: list of every buyer/seller chat (overlapping avatars, last-message preview, message count). Click → full thread with rendered text, image grids (click-to-zoom), gig-reference snippet inline.
- **Order chats** tab: list of every order with a thread (gig thumbnail, buyer ↔ seller, last message time). Right pane shows order header + status pill + "Open order →" link, plus the full chat — including delivery messages and a structured **Custom offer card** (gigTitle, description, price, delivery, revisions, status).
- One shared zoom modal for attachments. No composer — moderation observes, doesn't post.

---

# Backend additions this pass

Models added:
- `activity.model.js` — page/login activity log.
- `supportTicket.model.js` + `supportMessage.model.js` — ticket inbox.

User model fields added:
- `isVerified`, `verification.{status, documentType, documentNumber, frontUrl, backUrl, selfieUrl, submittedAt, reviewedAt, reviewedBy, rejectionReason}`.
- `banReason`, `bannedAt`.

Message schema extended:
- `content.gigReference.{gigId, title, image, price, slug, deliveryDays}` — snapshot used by the "contact seller" handoff so the bubble keeps rendering even after the gig is edited or deleted.

Categories schema extended:
- `icon: String` (shared key into the react-icons catalogue). `image` made non-required.

New routes (all under `/v1`):

| Endpoint | Auth | Purpose |
|---|---|---|
| `GET /orders/counts?role=seller\|buyer` | `withOutAdmin` | Per-status counts for ManageOrders tabs |
| `GET /admin/orders` | `admin` | All-platform orders (populated) |
| `GET /admin/gigs` | `admin` | All-platform gigs (populated) |
| `PATCH /admin/users/:userId/ban` | `admin` | Set ban + reason |
| `PATCH /admin/users/:userId/unban` | `admin` | Clear ban |
| `POST /activity/track` | `common` | Self-report a page visit |
| `GET /admin/user-activity/:userId` | `admin` | Timeline + per-route + logins for one user |
| `POST /support/tickets` | `common` | User opens a ticket |
| `GET  /support/tickets` | `common` | Lists own (user) or all (admin) |
| `GET  /support/tickets/:id` | `common` | Full thread |
| `POST /support/tickets/:id/messages` | `common` | Post a reply |
| `PATCH /support/tickets/:id` | `admin` | Update status |
| `POST /verification/submit` | `common` | Seller submits NID/passport (multipart) |
| `GET  /verification?status=` | `admin` | List submissions by status |
| `PATCH /verification/:userId` | `admin` | Approve or reject |
| `GET /admin/chats` | `admin` | List DMs for moderation |
| `GET /admin/chats/:chatId/messages` | `admin` | Read a DM thread |
| `GET /admin/order-chats` | `admin` | List order chats |
| `GET /admin/order-chats/:orderId/messages` | `admin` | Read an order chat |

Auth / login flow changes:
- Records `Activity{type:"login", ip, userAgent}` on every successful sign-in. `app.set("trust proxy", true)` so `req.ip` reflects the real client behind a proxy/load balancer.
- Login refuses banned users early with `403 BANNED:<reason>`.
- `authService.logout` is idempotent (200 even when the token isn't in DB).

Socket layer:
- Handshake JWT in `auth.token` is the authoritative identity.
- New events: `typing/start`, `typing/stop` (relayed by `userId` room).
- Message-send emits mirror to **both** sides (`new-chat` + `new-message-self` for the sender; `new-chat` + `new-message` for the receiver) so the chat sidebar reorders in real time for everyone.

---

# Environment variables (current state)

| App | Variable | Default | Notes |
|---|---|---|---|
| backend | `MONGODB_URL` | `mongodb://localhost:27017/qwlee` | |
| backend | `JWT_SECRET` | — | Must match `frontend/.env` JWT_SECRET |
| backend | `STRIPE_SECRET_KEY` | placeholder | `sk_test_…` from Stripe dashboard |
| backend | `STRIPE_PUBLISHABLE_KEY` | placeholder | `pk_test_…` |
| backend | `STRIPE_WEBHOOK_SECRET` | placeholder | From `stripe listen` |
| backend | `IMGBB_API_KEY` | — | Required for any upload |
| backend | `MAX_IMAGE_SIZE_MB` | `32` | |
| backend | `FRONTEND_URL` | `http://localhost:8000` | Stripe redirect target |
| backend | `CORS_ORIGINS` | comma list | Allowed origins |
| frontend | `NEXT_PUBLIC_BACKEND_API_URL` | `http://localhost:7171` | |
| frontend | `NEXT_PUBLIC_SOCKET_URL` | `http://localhost:8181` | |
| frontend | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | placeholder | Mirror of backend's publishable key |
| frontend | `JWT_SECRET` | — | Must match backend |
| frontend | `NEXTAUTH_SECRET` | — | `openssl rand -base64 32` |
| admin | `VITE_API_BASE_URL` | `http://localhost:7171` | |

---

# Production-ish

- Backend: `pm2 start src/index.js --env production` (see `ecosystem.config.json`).
- Frontend: `next build && next start -p 8000`.
- Admin: `vite build && vite preview`.

---

# Known issues / deferred work

- **Tokens stored in client-readable cookies** — `js-cookie` writes are not HttpOnly. Real fix is backend-set HttpOnly cookies.
- **SMTP delivery still broken** — Gmail rejects the app password in `backend/.env`. Registration / forgot / reset work via DB-stored OTP, but verification emails never arrive. Swap to Resend / Postmark / SendGrid.
- **Live Stripe keys previously committed** — preserved as commented `# ROTATED_*` lines in `backend/.env`. Rotate them in the Stripe dashboard before any production use.
- **`lib/constant.js` hardcodes a legacy host fallback** — should read from env exclusively.
- **No automated tests** — Vitest/Jest setup is a separate effort.
- **Activity log has no TTL index** — consider `Activity.createdAt` TTL @ 90 days for production to keep the collection bounded.

---

# Generating secrets

```sh
# Strong JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# NextAuth secret
openssl rand -base64 32
```
