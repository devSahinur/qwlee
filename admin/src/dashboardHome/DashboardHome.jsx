// Admin dashboard home — Fiverr/Stripe-style.
//
// 4 KPI tiles + revenue area chart with year selector + new-user chart
// with month selector + a "Recent users" list. Each section uses the
// shared Card primitive so spacing/borders/shadows are consistent.

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineCurrencyDollar,
} from "react-icons/hi";
import { FaUsers } from "react-icons/fa6";
import { BiSolidUserPlus } from "react-icons/bi";
import { CiBag1 } from "react-icons/ci";
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
  useGetRecentUserQuery,
  useGetUserRatioQuery,
  useTotalStatusQuery,
} from "../redux/api/apiSlice";
import Card from "../common/Card";
import Kpi from "../common/Kpi";
import PageHeader from "../common/PageHeader";
import Button from "../common/Button";
import { formatMoney, formatNumber, timeAgo } from "../utils/format";
import getImageUrl from "../utils/getImageUrl";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function DashboardHome() {
  const navigate = useNavigate();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const { data: totalStatus, isLoading: loadingTotal } = useTotalStatusQuery();
  const totals = totalStatus?.data?.attributes || {};

  const { data: incomeRatio, isFetching: loadingIncome } = useGetIncomeRatioQuery(year);
  const incomeData = useMemo(() => {
    const raw = incomeRatio?.data?.attributes?.results || incomeRatio?.data?.attributes || [];
    // Backend may return [{month, total}] or an object map. Normalise.
    if (Array.isArray(raw) && raw[0] && raw[0].month != null) {
      return raw.map((d, i) => ({
        month: typeof d.month === "number" ? MONTHS[d.month - 1]?.slice(0, 3) : String(d.month).slice(0, 3),
        total: Number(d.total || d.amount || d.income || 0),
      }));
    }
    if (raw && typeof raw === "object") {
      return MONTHS.map((m, i) => ({ month: m.slice(0, 3), total: Number(raw[String(i + 1)] || raw[m] || 0) }));
    }
    return MONTHS.map((m) => ({ month: m.slice(0, 3), total: 0 }));
  }, [incomeRatio]);
  const yearTotal = incomeData.reduce((s, d) => s + d.total, 0);

  const { data: userRatio, isFetching: loadingUsers } = useGetUserRatioQuery(month);
  const userData = useMemo(() => {
    const raw = userRatio?.data?.attributes?.results || userRatio?.data?.attributes || [];
    if (Array.isArray(raw) && raw[0] && raw[0].day != null) {
      return raw.map((d) => ({ day: String(d.day), total: Number(d.total || d.count || 0) }));
    }
    // Fallback: empty 30-day frame
    return Array.from({ length: 30 }).map((_, i) => ({ day: String(i + 1), total: 0 }));
  }, [userRatio]);
  const monthTotal = userData.reduce((s, d) => s + d.total, 0);

  const { data: recentUser } = useGetRecentUserQuery();
  const recents = recentUser?.data?.attributes?.results?.slice(0, 6) || [];

  return (
    <div>
      <PageHeader
        title="Welcome back"
        subtitle="Here's what's happening across the Qwlee marketplace today."
        actions={
          <>
            <Button variant="secondary" onClick={() => navigate("/dashboard/orders")}>
              View orders
            </Button>
            <Button onClick={() => navigate("/dashboard/reports")}>
              Open reports
            </Button>
          </>
        }
      />

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Kpi
          label="Total earnings"
          value={formatMoney(totals.totalEarnings)}
          hint="Lifetime gross"
          icon={HiOutlineCurrencyDollar}
          tone="emerald"
        />
        <Kpi
          label="Freelancers"
          value={loadingTotal ? "—" : formatNumber(totals.totalFreelancer)}
          hint="Verified sellers"
          icon={FaUsers}
          tone="sky"
        />
        <Kpi
          label="Buyers"
          value={loadingTotal ? "—" : formatNumber(totals.totalBuyer)}
          hint="Account count"
          icon={BiSolidUserPlus}
          tone="violet"
        />
        <Kpi
          label="Active gigs"
          value={loadingTotal ? "—" : formatNumber(totals.totalGigs)}
          hint="Across all categories"
          icon={CiBag1}
          tone="amber"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        <Card
          className="xl:col-span-2"
          title="Revenue"
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
              <AreaChart data={incomeData} margin={{ left: 0, right: 12, top: 8 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} width={50} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0", boxShadow: "0 10px 24px rgba(15,23,42,0.08)" }}
                  formatter={(v) => [formatMoney(v), "Revenue"]}
                />
                <Area type="monotone" dataKey="total" stroke="#059669" strokeWidth={2} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card
          title="New sign-ups"
          subtitle={`${formatNumber(monthTotal)} in ${MONTHS[month - 1]}`}
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
              <BarChart data={userData} margin={{ left: 0, right: 4, top: 8 }}>
                <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: "#94A3B8", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0" }}
                  formatter={(v) => [formatNumber(v), "Sign-ups"]}
                />
                <Bar dataKey="total" radius={[4, 4, 0, 0]} fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent users + Quick stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card
          className="lg:col-span-2"
          title="Recent users"
          actions={
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/buyerlist")}>
              View all →
            </Button>
          }
          bodyClassName="p-0"
        >
          {recents.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-ink-500">
              No recent users.
            </div>
          ) : (
            <ul className="divide-y divide-ink-100">
              {recents.map((u) => (
                <li
                  key={u._id || u.id}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-ink-50/60 transition"
                >
                  <img
                    src={getImageUrl(u.image)}
                    alt={u.fullName || "user"}
                    className="w-9 h-9 rounded-full object-cover bg-ink-100"
                    onError={(e) => {
                      e.currentTarget.style.visibility = "hidden";
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-ink-900 truncate">
                      {u.fullName || "Member"}
                    </div>
                    <div className="text-xs text-ink-500 truncate">
                      {u.email}
                    </div>
                  </div>
                  <span className="text-xs text-ink-400 capitalize whitespace-nowrap">
                    {u.role || "buyer"}
                  </span>
                  <span className="text-xs text-ink-400 whitespace-nowrap">
                    {timeAgo(u.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Quick stats">
          <dl className="space-y-3 text-sm">
            <Row label="Avg revenue / month">
              {formatMoney(yearTotal / 12)}
            </Row>
            <Row label="New users this month">
              {formatNumber(monthTotal)}
            </Row>
            <Row label="Active gigs">
              {formatNumber(totals.totalGigs || 0)}
            </Row>
            <Row label="Freelancer / Buyer ratio">
              {totals.totalBuyer
                ? `${(Number(totals.totalFreelancer || 0) / Number(totals.totalBuyer)).toFixed(2)} : 1`
                : "—"}
            </Row>
          </dl>
          <Button
            variant="secondary"
            className="mt-5 w-full"
            onClick={() => navigate("/dashboard/earnings")}
          >
            Detailed earnings →
          </Button>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-ink-100 last:border-b-0 pb-2.5 last:pb-0">
      <dt className="text-ink-500">{label}</dt>
      <dd className="font-semibold text-ink-900 text-right">{children}</dd>
    </div>
  );
}
