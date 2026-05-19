// Standard page header used across the admin app. Title + optional
// subtitle on the left; action slot on the right. Keeps spacing and
// typography consistent across pages without each one re-rolling its
// own.

import cls from "../utils/cls";

export default function PageHeader({ title, subtitle, actions, className = "" }) {
  return (
    <div
      className={cls(
        "flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-5 md:mb-6",
        className
      )}
    >
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-ink-900">{title}</h1>
        {subtitle ? (
          <p className="text-sm text-ink-500 mt-1">{subtitle}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
