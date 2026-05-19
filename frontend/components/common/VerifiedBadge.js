// Verified-account checkmark.
//
// Renders an emerald check disc when `user.isVerified` is truthy.
// Sized via the `size` prop (defaults to 14px). Returns null otherwise
// so the caller can drop it next to any name without extra guarding.

import { IoCheckmark } from "react-icons/io5";

export default function VerifiedBadge({ user, size = 14, className = "", title }) {
  if (!user?.isVerified) return null;
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm align-middle ${className}`}
      style={{ width: size, height: size }}
      title={title || "Verified by Qwlee"}
      aria-label={title || "Verified account"}
    >
      <IoCheckmark style={{ width: size * 0.7, height: size * 0.7 }} strokeWidth={3} />
    </span>
  );
}
