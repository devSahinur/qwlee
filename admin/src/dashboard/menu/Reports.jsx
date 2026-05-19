// Reports — quick analytics page combining several existing endpoints.
//
// Year revenue chart + month sign-up chart + top-line summary cards.
// Lightweight; the heavy aggregations live on the backend already
// (admin.service getIncomeRatio, getUserRatio, getTotalStatus).

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  useGetIncomeRatioQuery,
  useGetUserRatioQuery,
  useTotalStatusQuery,
} from "../../redux/api/apiSlice";
import PageHeader from "../../common/PageHeader";
import Card from "../../common/Card";
import Kpi from "../../common/Kpi";
import { formatMoney, formatNumber } from "../../utils/format";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function Reports() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const { data: ratio } = useGetIncomeRatioQuery(year);
  const { data: userRatio } = useGetUserRatioQuery(month);
  const { data: totals } = useTotalStatusQuery();
  const t = totals?.data?.attributes || {};

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

  const daily = useMemo(() => {
    const raw = userRatio?.data?.attributes?.results || userRatio?.data?.attributes || [];
    if (Array.isArray(raw) && raw[0] && raw[0].day != null) {
      return raw.map((d) => ({ day: String(d.day), total: Number(d.total || d.count || 0) }));
    }
    return Array.from({ length: 30 }).map((_, i) => ({ day: String(i + 1), total: 0 }));
  }, [userRatio]);

  const yearTotal = monthly.reduce((s, d) => s + d.total, 0);
  const monthSignups = daily.reduce((s, d) => s + d.total, 0);

  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="Quick view of revenue and growth trends across the platform."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Kpi label="Lifetime revenue" value={formatMoney(t.totalEarnings)} tone="emerald" />
        <Kpi label="This year revenue" value={formatMoney(yearTotal)} hint={String(year)} tone="sky" />
        <Kpi label="New users this month" value={formatNumber(monthSignups)} hint={MONTHS[month - 1]} tone="violet" />
        <Kpi label="Active gigs" value={formatNumber(t.totalGigs || 0)} tone="amber" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card
          title="Revenue trend"
          subtitle={`${formatMoney(yearTotal)} in ${year}`}
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
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthly}>
                <defs>
                  <linearGradient id="rev2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} width={50} />
                <Tooltip formatter={(v) => [formatMoney(v), "Revenue"]} contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0" }} />
                <Area type="monotone" dataKey="total" stroke="#059669" strokeWidth={2} fill="url(#rev2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card
          title="Daily sign-ups"
          subtitle={`${formatNumber(monthSignups)} new accounts in ${MONTHS[month - 1]}`}
          actions={
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="h-9 px-3 rounded-lg border border-ink-200 bg-white text-sm"
            >
              {MONTHS.map((m, i) => (
                <option key={m} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
          }
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={daily}>
                <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: "#94A3B8", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
                <Tooltip formatter={(v) => [formatNumber(v), "Sign-ups"]} contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0" }} />
                <Bar dataKey="total" radius={[4, 4, 0, 0]} fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
