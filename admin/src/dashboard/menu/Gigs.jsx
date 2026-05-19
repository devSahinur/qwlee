// Gigs — admin view of every gig on the platform.

import { useMemo, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { useGetAdminGigsQuery } from "../../redux/api/apiSlice";

import PageHeader from "../../common/PageHeader";
import DataTable from "../../common/DataTable";
import Kpi from "../../common/Kpi";
import Button from "../../common/Button";
import { formatDate, formatMoney, formatNumber, truncate } from "../../utils/format";
import getImageUrl from "../../utils/getImageUrl";

export default function Gigs() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, isFetching } = useGetAdminGigsQuery({});
  const rows = data?.data?.attributes?.results || [];

  const totals = useMemo(() => {
    const out = { count: rows.length, avgPrice: 0 };
    if (rows.length) {
      out.avgPrice = rows.reduce((s, g) => s + Number(g.price || 0), 0) / rows.length;
    }
    return out;
  }, [rows]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((g) =>
      [g.title, g.userId?.fullName, g.categoriesId?.name]
        .filter(Boolean)
        .some((s) => String(s).toLowerCase().includes(q))
    );
  }, [rows, search]);

  const PAGE_SIZE = 12;
  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = visible.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const columns = [
    {
      key: "gig",
      label: "Gig",
      render: (g) => (
        <div className="flex items-center gap-3 min-w-[280px]">
          <div className="w-14 h-10 rounded-md overflow-hidden bg-ink-100 shrink-0">
            <img
              src={getImageUrl(g.images?.[0])}
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.style.visibility = "hidden")}
            />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium text-ink-900 truncate max-w-[280px]">
              {truncate(g.title, 60)}
            </div>
            <div className="text-xs text-ink-500">/{g.slug}</div>
          </div>
        </div>
      ),
    },
    {
      key: "seller",
      label: "Seller",
      render: (g) => (
        <span className="text-ink-700">
          {g.userId?.fullName || "—"}
          {g.userId?.username ? <span className="text-ink-400"> @{g.userId.username}</span> : null}
        </span>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (g) => <span className="text-ink-700">{g.categoriesId?.name || "—"}</span>,
    },
    {
      key: "price",
      label: "Starting at",
      render: (g) => (
        <span className="text-ink-900 font-semibold">{formatMoney(g.price)}</span>
      ),
    },
    {
      key: "created",
      label: "Listed",
      render: (g) => <span className="text-ink-700">{formatDate(g.createdAt)}</span>,
    },
    {
      key: "action",
      label: "",
      render: (g) => (
        <a
          href={`http://localhost:8000/gig/${g.slug}`}
          target="_blank"
          rel="noreferrer"
          className="text-xs font-medium text-primary-700 hover:text-primary-800"
        >
          View →
        </a>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Gigs"
        subtitle={`${formatNumber(rows.length)} gigs on the marketplace.`}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Kpi label="Total gigs" value={formatNumber(totals.count)} tone="emerald" />
        <Kpi label="Average starting price" value={formatMoney(totals.avgPrice)} tone="sky" />
        <Kpi label="Matches in view" value={formatNumber(visible.length)} tone="violet" />
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
            placeholder="Search by title, seller, or category…"
            className="px-2 py-2 bg-transparent outline-none text-sm flex-1"
          />
        </div>
      </div>

      <DataTable columns={columns} rows={pageRows} loading={isFetching} empty="No gigs match this search." />

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
    </div>
  );
}
