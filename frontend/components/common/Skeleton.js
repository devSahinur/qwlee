// Shared skeleton primitives. Use these everywhere so loading states
// have the same colour / animation across the app.
//
//   <SkeletonBlock className="h-4 w-32" />
//   <SkeletonCircle size={48} />
//
// Palette: bg-gray-100 → bg-gray-200/70 shimmer. Restrained on purpose
// — heavy skeletons (dark grey + fast pulse) feel cheap.

export function SkeletonBlock({ className = "", rounded = "rounded-md" }) {
  return (
    <div
      className={`bg-gray-100 ${rounded} qwlee-shimmer ${className}`}
      aria-hidden="true"
    />
  );
}

export function SkeletonCircle({ size = 40, className = "" }) {
  return (
    <div
      className={`bg-gray-100 rounded-full qwlee-shimmer ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  );
}
