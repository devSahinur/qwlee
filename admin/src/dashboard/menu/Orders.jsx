// Orders — admin view of every platform order.
//
// Server returns the full Payment list populated with gigId / buyer /
// seller. Tabs filter by status, search filters by buyer / seller /
// title / id, and the row links to the marketplace order detail page
// so the admin can see the full conversation context.

import { useMemo, useState } from "react";
import { IoSearch, IoCloseCircleOutline, IoClose } from "react-icons/io5";
import toast from "react-hot-toast";
import {
  useGetAdminOrdersQuery,
  useAdminCancelOrderMutation,
} from "../../redux/api/apiSlice";

import PageHeader from "../../common/PageHeader";
import DataTable from "../../common/DataTable";
import Kpi from "../../common/Kpi";
import Button from "../../common/Button";
import StatusPill from "../../common/StatusPill";
import cls from "../../utils/cls";
import { formatDate, formatMoney, formatNumber } from "../../utils/format";
import getImageUrl from "../../utils/getImageUrl";

const TABS = [
  { v: "all", label: "All" },
  { v: "active", label: "In progress" },
  { v: "late", label: "Late" },
  { v: "delivered", label: "Delivered" },
  { v: "cancelled", label: "Cancelled" },
];

const STATUS_LABEL = {
  active: "In progress",
  late: "Late",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function Orders() {
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [cancelTarget, setCancelTarget] = useState(null);

  const { data, isFetching } = useGetAdminOrdersQuery({});
  const rows = data?.data?.attributes?.results || [];

  const counts = useMemo(() => {
    const out = { all: rows.length, active: 0, late: 0, delivered: 0, cancelled: 0 };
    for (const r of rows) {
      const s = (r.status || "active").toLowerCase();
      if (out[s] != null) out[s] += 1;
    }
    return out;
  }, [rows]);

  const totalRevenue = useMemo(() => {
    return rows
      .filter((r) => r.status !== "cancelled")
      .reduce((s, r) => s + Number(r.items?.[0]?.price || r.price || 0), 0);
  }, [rows]);

  const visible = useMemo(() => {
    let list = rows;
    if (tab !== "all") list = list.filter((r) => (r.status || "active").toLowerCase() === tab);
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((r) =>
        [
          r.items?.[0]?.name,
          r.gigId?.title,
          r.clientId?.fullName,
          r.freelancerId?.fullName,
          r._id,
        ]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q))
      );
    }
    return list;
  }, [rows, tab, search]);

  const PAGE_SIZE = 12;
  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = visible.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const columns = [
    {
      key: "gig",
      label: "Gig",
      render: (r) => (
        <div className="flex items-center gap-3 min-w-[260px]">
          <div className="w-12 h-9 rounded-md overflow-hidden bg-ink-100 shrink-0">
            <img
              src={getImageUrl(r.gigId?.images?.[0])}
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.style.visibility = "hidden")}
            />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium text-ink-900 truncate max-w-[260px]">
              {r.gigId?.title || r.items?.[0]?.name || "—"}
            </div>
            <div className="text-xs text-ink-500">
              #{String(r._id).slice(-8).toUpperCase()}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "buyer",
      label: "Buyer",
      render: (r) => (
        <span className="text-ink-700">{r.clientId?.fullName || "—"}</span>
      ),
    },
    {
      key: "seller",
      label: "Seller",
      render: (r) => (
        <span className="text-ink-700">{r.freelancerId?.fullName || "—"}</span>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (r) => (
        <span className="text-ink-900 font-semibold">
          {formatMoney(r.items?.[0]?.price || r.price)}
        </span>
      ),
    },
    {
      key: "date",
      label: "Ordered",
      render: (r) => <span className="text-ink-700">{formatDate(r.createdAt)}</span>,
    },
    {
      key: "status",
      label: "Status",
      render: (r) => <StatusPill status={(r.status || "active").toLowerCase()} label={STATUS_LABEL[r.status] || "Unknown"} />,
    },
    {
      key: "action",
      label: "",
      render: (r) => (
        <div className="flex items-center gap-3 justify-end">
          {r.status !== "cancelled" && (
            <button
              type="button"
              onClick={() => setCancelTarget(r)}
              className="inline-flex items-center gap-1 text-xs font-medium text-rose-600 hover:text-rose-700"
              title="Cancel this order"
            >
              <IoCloseCircleOutline className="w-3.5 h-3.5" />
              Cancel
            </button>
          )}
          <a
            href={`http://localhost:8000/order/${r._id}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-medium text-primary-700 hover:text-primary-800"
          >
            Open →
          </a>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Orders"
        subtitle={`${formatNumber(rows.length)} total orders on the platform.`}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        <Kpi label="All" value={formatNumber(counts.all)} tone="slate" />
        <Kpi label="In progress" value={formatNumber(counts.active)} tone="emerald" />
        <Kpi label="Late" value={formatNumber(counts.late)} tone="rose" />
        <Kpi label="Delivered" value={formatNumber(counts.delivered)} tone="sky" />
        <Kpi label="Revenue (open)" value={formatMoney(totalRevenue)} tone="violet" />
      </div>

      <div className="flex items-center gap-3 flex-wrap mb-4">
        <div className="flex items-center bg-white border border-ink-200 rounded-lg px-3 max-w-sm w-full focus-within:border-primary">
          <IoSearch className="text-ink-400" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by buyer, seller, gig, or order id…"
            className="px-2 py-2 bg-transparent outline-none text-sm flex-1"
          />
        </div>
        <div className="flex gap-1 bg-white border border-ink-200 rounded-lg p-0.5 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.v}
              type="button"
              onClick={() => {
                setTab(t.v);
                setPage(1);
              }}
              className={cls(
                "px-3 py-1.5 text-xs font-medium rounded-md transition whitespace-nowrap",
                tab === t.v
                  ? "bg-primary-50 text-primary-800"
                  : "text-ink-600 hover:bg-ink-50"
              )}
            >
              {t.label}
              <span className="ml-1 text-[10px] text-ink-400">
                {counts[t.v]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={pageRows}
        loading={isFetching}
        empty="No orders match this view."
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2 mt-4">
          <Button variant="secondary" size="sm" disabled={safePage === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            Previous
          </Button>
          <span className="text-xs text-ink-500">
            Page {safePage} of {totalPages}
          </span>
          <Button variant="secondary" size="sm" disabled={safePage === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
            Next
          </Button>
        </div>
      )}

      <CancelOrderModal
        order={cancelTarget}
        onClose={() => setCancelTarget(null)}
      />
    </div>
  );
}

// Confirm-with-reason dialog for the admin force-cancel action. Fiverr
// shows the reason in the cancellation email to both parties, so we
// require it here too.
function CancelOrderModal({ order, onClose }) {
  const [reason, setReason] = useState("");
  const [cancelOrder, { isLoading }] = useAdminCancelOrderMutation();

  if (!order) return null;

  async function handleConfirm() {
    if (!reason.trim()) {
      toast.error("Please provide a reason for cancellation.");
      return;
    }
    const res = await cancelOrder({
      orderId: order._id || order.id,
      reason: reason.trim(),
    });
    if (res?.error) {
      toast.error(res.error?.data?.message || "Could not cancel order");
      return;
    }
    toast.success("Order cancelled. Both parties have been notified.");
    setReason("");
    onClose();
  }

  const wasDelivered = order.status === "delivered";

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center px-4 py-6 bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="px-5 py-4 border-b border-ink-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IoCloseCircleOutline className="w-5 h-5 text-rose-600" />
            <h2 className="text-base font-semibold text-ink-900">
              Cancel this order?
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-ink-400 hover:bg-ink-50"
            aria-label="Close"
          >
            <IoClose className="w-4 h-4" />
          </button>
        </header>

        <div className="px-5 py-4 space-y-4">
          <div className="text-sm text-ink-700">
            <div className="text-ink-900 font-medium truncate">
              {order.gigId?.title || order.items?.[0]?.name || "Order"}
            </div>
            <div className="text-xs text-ink-500 mt-0.5">
              #{String(order._id).slice(-8).toUpperCase()} &middot;{" "}
              {STATUS_LABEL[order.status] || order.status} &middot;{" "}
              {formatMoney(order.items?.[0]?.price || order.price)}
            </div>
          </div>

          {wasDelivered && (
            <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-3 text-xs text-amber-900">
              <strong>Note:</strong> this order was already delivered and the
              seller&rsquo;s balance was credited. Cancelling will deduct the
              previously-credited amount from their balance.
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-ink-500 mb-1.5">
              Reason for cancellation
            </label>
            <textarea
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value.slice(0, 500))}
              placeholder="Why is this order being cancelled? This will be shown to both the buyer and seller."
              className="w-full px-3 py-2 rounded-lg border border-ink-200 text-sm outline-none focus:border-primary-400 resize-none"
              autoFocus
            />
            <div className="text-right text-[11px] text-ink-400 mt-1">
              {reason.length}/500
            </div>
          </div>
        </div>

        <footer className="px-5 py-3 border-t border-ink-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-ink-700 hover:bg-ink-100"
          >
            Keep order
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading || !reason.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-60"
          >
            <IoCloseCircleOutline className="w-4 h-4" />
            {isLoading ? "Cancelling…" : "Cancel order"}
          </button>
        </footer>
      </div>
    </div>
  );
}
