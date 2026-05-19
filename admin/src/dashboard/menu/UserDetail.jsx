// /dashboard/users/:userId — single-user monitor.
//
// Shows the profile header + three views over the activity feed:
//   - Login history (when + from which IP / device)
//   - Per-route rollup (visits + total time, sortable)
//   - Recent timeline (raw events, newest first)
//
// All data comes from /v1/admin/user-activity/:userId — one round-trip
// returns the user, the login rows, the timeline, and the per-route
// aggregation.

import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  TbArrowLeft,
  TbDeviceDesktop,
  TbWorld,
  TbClock,
  TbEye,
} from "react-icons/tb";

import { useGetUserActivityQuery } from "../../redux/api/apiSlice";

import PageHeader from "../../common/PageHeader";
import Card from "../../common/Card";
import DataTable from "../../common/DataTable";
import StatusPill from "../../common/StatusPill";
import Kpi from "../../common/Kpi";
import Button from "../../common/Button";
import {
  formatDate,
  formatNumber,
  timeAgo,
  truncate,
} from "../../utils/format";
import getImageUrl from "../../utils/getImageUrl";

function formatDuration(ms) {
  const n = Number(ms) || 0;
  if (n < 1000) return "0s";
  const s = Math.floor(n / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rs = s % 60;
  if (m < 60) return rs ? `${m}m ${rs}s` : `${m}m`;
  const h = Math.floor(m / 60);
  const rm = m % 60;
  return rm ? `${h}h ${rm}m` : `${h}h`;
}

function shortDevice(userAgent) {
  if (!userAgent) return "—";
  // No need for a full UA parser; surface the highest-signal token.
  if (/iPhone|iPad|iPod/i.test(userAgent)) return "iOS";
  if (/Android/i.test(userAgent)) return "Android";
  if (/Mac OS X/i.test(userAgent)) return "macOS";
  if (/Windows/i.test(userAgent)) return "Windows";
  if (/Linux/i.test(userAgent)) return "Linux";
  return truncate(userAgent, 28);
}

export default function UserDetail() {
  const { userId } = useParams();
  const { data, isFetching, isError } = useGetUserActivityQuery({ userId });
  const user = data?.user;
  const timeline = data?.timeline || [];
  const perRoute = data?.perRoute || [];
  const logins = data?.logins || [];

  const totals = useMemo(() => {
    const pageEvents = timeline.filter((t) => t.type === "page");
    const totalVisits = pageEvents.length;
    const totalMs = perRoute.reduce((s, r) => s + (r.totalMs || 0), 0);
    const distinctIps = new Set(
      timeline.filter((t) => t.ip).map((t) => t.ip)
    );
    return {
      totalVisits,
      totalMs,
      distinctIps: distinctIps.size,
      loginCount: logins.length,
    };
  }, [timeline, perRoute, logins]);

  const back = user?.role === "buyer" ? "/dashboard/buyerlist" : "/dashboard/frelancer";

  if (isError) {
    return (
      <div>
        <PageHeader title="User monitor" />
        <Card>
          <div className="py-10 text-center text-sm text-rose-600">
            Couldn&rsquo;t load activity for this user.
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={user?.fullName || "User monitor"}
        subtitle={
          user
            ? `${user.role} · ${user.username ? `@${user.username}` : user.email}`
            : "Loading…"
        }
        actions={
          <Link to={back}>
            <Button variant="secondary" iconLeft={TbArrowLeft}>
              Back to list
            </Button>
          </Link>
        }
      />

      {/* Profile header card */}
      <Card className="mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-ink-100">
            {user?.image ? (
              <img
                src={getImageUrl(user.image)}
                alt={user.fullName}
                className="w-full h-full object-cover"
                onError={(e) => (e.currentTarget.style.visibility = "hidden")}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xl font-bold text-primary-700 bg-primary-50">
                {(user?.fullName || "?")[0]?.toUpperCase()}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-base font-semibold text-ink-900 truncate">
              {user?.fullName || "—"}
            </div>
            <div className="text-xs text-ink-500 truncate">
              {user?.email || "—"}
            </div>
            <div className="mt-1 flex items-center gap-2">
              <StatusPill
                status={user?.online ? "active" : "muted"}
                label={user?.online ? "Online" : "Offline"}
              />
              <span className="text-xs text-ink-500">
                {user?.online
                  ? "Active now"
                  : user?.lastSeen
                  ? `Last seen ${timeAgo(user.lastSeen)}`
                  : ""}
              </span>
            </div>
          </div>
          <div className="text-right text-xs text-ink-500">
            <div>
              Joined {user?.createdAt ? formatDate(user.createdAt) : "—"}
            </div>
            {user?.location ? <div>{user.location}</div> : null}
          </div>
        </div>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <Kpi
          label="Page visits"
          value={formatNumber(totals.totalVisits)}
          icon={TbEye}
          tone="emerald"
        />
        <Kpi
          label="Time on site"
          value={formatDuration(totals.totalMs)}
          icon={TbClock}
          tone="sky"
        />
        <Kpi
          label="Sign-ins"
          value={formatNumber(totals.loginCount)}
          icon={TbDeviceDesktop}
          tone="violet"
        />
        <Kpi
          label="Distinct IPs"
          value={formatNumber(totals.distinctIps)}
          icon={TbWorld}
          tone="amber"
        />
      </div>

      {/* Login history */}
      <Card title="Login history" className="mb-6" bodyClassName="p-0">
        <DataTable
          rows={logins}
          loading={isFetching && logins.length === 0}
          empty="No sign-ins recorded yet — logins start being tracked after the next sign-in."
          columns={[
            {
              key: "time",
              label: "When",
              render: (r) => (
                <div>
                  <div className="text-ink-900 font-medium">
                    {formatDate(r.createdAt, { withTime: true })}
                  </div>
                  <div className="text-xs text-ink-500">{timeAgo(r.createdAt)}</div>
                </div>
              ),
            },
            {
              key: "ip",
              label: "IP address",
              render: (r) => (
                <span className="font-mono text-ink-800">
                  {r.ip || "—"}
                </span>
              ),
            },
            {
              key: "ua",
              label: "Device",
              render: (r) => (
                <span className="text-ink-700">{shortDevice(r.userAgent)}</span>
              ),
            },
          ]}
        />
      </Card>

      {/* Per-route */}
      <Card title="Routes visited" className="mb-6" bodyClassName="p-0">
        <DataTable
          rows={perRoute}
          loading={isFetching && perRoute.length === 0}
          rowKey={(r) => r.route}
          empty="No page visits recorded for this user yet."
          columns={[
            {
              key: "route",
              label: "Route",
              render: (r) => (
                <span className="font-mono text-ink-900">{r.route}</span>
              ),
            },
            {
              key: "visits",
              label: "Visits",
              render: (r) => (
                <span className="font-semibold text-ink-900">
                  {formatNumber(r.visits)}
                </span>
              ),
            },
            {
              key: "total",
              label: "Total time",
              render: (r) => (
                <span className="text-ink-800">{formatDuration(r.totalMs)}</span>
              ),
            },
            {
              key: "last",
              label: "Last visit",
              render: (r) => (
                <span className="text-ink-500 text-xs">
                  {timeAgo(r.lastVisit)}
                </span>
              ),
            },
          ]}
        />
      </Card>

      {/* Recent timeline */}
      <Card title="Recent activity" bodyClassName="p-0">
        {timeline.length === 0 ? (
          <div className="py-10 text-center text-sm text-ink-500">
            No activity yet.
          </div>
        ) : (
          <ol className="divide-y divide-ink-100">
            {timeline.map((row, i) => (
              <li
                key={row._id || row.id || i}
                className="px-5 py-3 flex items-center gap-3"
              >
                <span
                  className={
                    row.type === "login"
                      ? "w-2 h-2 rounded-full bg-violet-500"
                      : "w-2 h-2 rounded-full bg-primary-500"
                  }
                />
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-ink-900 truncate">
                    {row.type === "login" ? (
                      <>
                        Signed in from{" "}
                        <span className="font-mono">{row.ip || "—"}</span>
                      </>
                    ) : (
                      <>
                        Visited <span className="font-mono">{row.route}</span>
                      </>
                    )}
                  </div>
                  <div className="text-xs text-ink-500">
                    {formatDate(row.createdAt, { withTime: true })}
                    {row.durationMs ? ` · ${formatDuration(row.durationMs)} on page` : ""}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}
      </Card>
    </div>
  );
}
