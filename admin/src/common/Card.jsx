// Surface primitive — white background, rounded-2xl, soft shadow, light
// border. Use as the container for any panel/section in the admin UI.

import cls from "../utils/cls";

export default function Card({
  className = "",
  bodyClassName = "",
  title,
  subtitle,
  actions,
  children,
}) {
  return (
    <section
      className={cls(
        "bg-white border border-ink-200 rounded-2xl shadow-card",
        className
      )}
    >
      {(title || actions) && (
        <header className="flex items-center justify-between gap-3 px-5 py-4 border-b border-ink-100">
          <div>
            {title ? (
              <h2 className="text-sm font-semibold text-ink-900 uppercase tracking-wide">
                {title}
              </h2>
            ) : null}
            {subtitle ? (
              <p className="text-xs text-ink-500 mt-0.5">{subtitle}</p>
            ) : null}
          </div>
          {actions}
        </header>
      )}
      <div className={cls("p-5", bodyClassName)}>{children}</div>
    </section>
  );
}
