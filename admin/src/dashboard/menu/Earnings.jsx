// Earnings — admin overview of platform income.
//
// Year selector + summary KPIs + monthly bar chart + paginated table
// of recent transactions. Same design system as the rest of the admin.

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  useGetEarningQuery,
  useGetIncomeRatioQuery,
} from "../../redux/api/apiSlice";

import PageHeader from "../../common/PageHeader";
import Card from "../../common/Card";
import DataTable from "../../common/DataTable";
import StatusPill from "../../common/StatusPill";
import Kpi from "../../common/Kpi";
import Button from "../../common/Button";
import { formatDate, formatMoney, formatNumber } from "../../utils/format";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function Earnings() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [page, setPage] = useState(1);

  const { data: ratio } = useGetIncomeRatioQuery(year);
  const { data, isFetching } = useGetEarningQuery({ year, page });

  const monthly = useMemo(() => {
    const raw = ratio?.data?.attributes?.results || ratio?.data?.attributes || [];
    if (Array.isArray(raw) && raw[0] && raw[0].month != null) {
      return raw.map((d) => ({
        month: typeof d.month === "number" ? MONTHS[d.month - 1] : String(d.month).slice(0, 3),
        total: Number(d.total || d.amount || d.income || 0),
      }));
    }
    if (raw && typeof raw === "object") {
      return MONTHS.map((m, i) => ({ month: m, total: Number(raw[String(i + 1)] || raw[m] || 0) }));
    }
    return MONTHS.map((m) => ({ month: m, total: 0 }));
  }, [ratio]);
  const yearTotal = monthly.reduce((s, d) => s + d.total, 0);
  const avgPerMonth = yearTotal / 12;
  const best = monthly.reduce((b, d) => (d.total > b.total ? d : b), monthly[0] || { month: "—", total: 0 });

  const rows = data?.data?.attributes?.results || [];
  const totalResults = data?.data?.attributes?.totalResults || rows.length;
  const totalPages = data?.data?.attributes?.totalPages || 1;

  const columns = [
    {
      key: "order",
      label: "Order",
      render: (r) => (
        <div>
          <div className="font-medium text-ink-900 truncate max-w-[280px]">
            {r.items?.[0]?.name || r.data?.title || "—"}
          </div>
          <div className="text-xs text-ink-500">
            #{String(r._id || r.id).slice(-8).toUpperCase()}
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
      key: "freelancer",
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
      label: "Date",
      render: (r) => <span className="text-ink-700">{formatDate(r.createdAt)}</span>,
    },
    {
      key: "status",
      label: "Status",
      render: (r) => <StatusPill status={(r.status || "active").toLowerCase()} />,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Earnings"
        subtitle={`Platform revenue for ${year}.`}
        actions={
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="h-9 px-3 rounded-lg border border-ink-200 bg-white text-sm"
          >
            {[now.getFullYear(), now.getFullYear() - 1, now.getFullYear() - 2].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Kpi label="Total revenue" value={formatMoney(yearTotal)} hint={`In ${year}`} tone="emerald" />
        <Kpi label="Average / month" value={formatMoney(avgPerMonth)} tone="sky" />
        <Kpi label="Best month" value={best?.month} hint={formatMoney(best?.total || 0)} tone="violet" />
        <Kpi label="Transactions" value={formatNumber(totalResults)} hint={`Page ${page} of ${totalPages}`} tone="amber" />
      </div>

      <Card title={`Monthly revenue · ${year}`} className="mb-6">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthly} margin={{ left: 0, right: 8, top: 8 }}>
              <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} width={50} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0" }}
                formatter={(v) => [formatMoney(v), "Revenue"]}
              />
              <Bar dataKey="total" radius={[4, 4, 0, 0]} fill="#059669" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <DataTable
        columns={columns}
        rows={rows}
        loading={isFetching}
        empty={`No earnings recorded in ${year}.`}
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2 mt-4">
          <Button
            variant="secondary"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <span className="text-xs text-ink-500">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
