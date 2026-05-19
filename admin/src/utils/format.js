// Shared formatters for the admin UI. Keep them framework-free.

export function formatMoney(n, { currency = "USD", maxFractionDigits = 0 } = {}) {
  const v = Number(n || 0);
  if (Number.isNaN(v)) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: maxFractionDigits,
  }).format(v);
}

export function formatNumber(n) {
  const v = Number(n || 0);
  if (Number.isNaN(v)) return "0";
  return new Intl.NumberFormat("en-US").format(v);
}

export function formatDate(d, { withTime = false } = {}) {
  if (!d) return "—";
  const date = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(date.getTime())) return "—";
  const opts = { year: "numeric", month: "short", day: "numeric" };
  if (withTime) Object.assign(opts, { hour: "numeric", minute: "2-digit" });
  return date.toLocaleString("en-US", opts);
}

// Short relative time for admin lists ("3m", "2h", "5d", "12 Jan").
export function timeAgo(d) {
  if (!d) return "—";
  const t = new Date(d).getTime();
  if (Number.isNaN(t)) return "—";
  const diffMs = Date.now() - t;
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "now";
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h`;
  const days = Math.floor(h / 24);
  if (days < 7) return `${days}d`;
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function truncate(s, n = 60) {
  if (!s) return "";
  return s.length > n ? `${s.slice(0, n)}…` : s;
}
