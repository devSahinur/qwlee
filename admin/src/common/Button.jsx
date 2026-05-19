// Standard button. Three visual variants × three sizes. Loading state
// shows a small spinner and disables the click.

import cls from "../utils/cls";

const VARIANTS = {
  primary:
    "bg-primary text-white hover:bg-primary-700 active:bg-primary-800 disabled:bg-primary-300",
  secondary:
    "bg-white text-ink-800 border border-ink-200 hover:bg-ink-50 disabled:text-ink-400",
  danger:
    "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 disabled:bg-rose-300",
  ghost:
    "text-ink-700 hover:bg-ink-100 disabled:text-ink-400",
};

const SIZES = {
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-4 text-sm",
  lg: "h-11 px-5 text-sm",
};

export default function Button({
  as: As = "button",
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  iconLeft: IL,
  iconRight: IR,
  className = "",
  children,
  ...props
}) {
  const isDisabled = disabled || loading;
  return (
    <As
      {...props}
      disabled={isDisabled}
      className={cls(
        "inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition disabled:cursor-not-allowed",
        VARIANTS[variant] || VARIANTS.primary,
        SIZES[size] || SIZES.md,
        className
      )}
    >
      {loading ? (
        <Spinner />
      ) : IL ? (
        <IL className="w-4 h-4" />
      ) : null}
      {children}
      {IR && !loading ? <IR className="w-4 h-4" /> : null}
    </As>
  );
}

function Spinner() {
  return (
    <svg
      className="w-4 h-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
