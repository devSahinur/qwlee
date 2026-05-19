// Reusable Qwlee logo. Default = full wordmark; `markOnly` = circular icon.
// Scales via the `height` prop; SVG handles the rest. Dark variant flips
// the wordmark to white for dark-backed surfaces (e.g. footer).

export default function QwleeLogo({
  height = 32,
  markOnly = false,
  variant = "default",
  className = "",
  alt = "Qwlee",
}) {
  if (markOnly) {
    return (
      <img
        src="/qwlee-mark.svg"
        alt={alt}
        height={height}
        style={{ height, width: "auto" }}
        className={className}
      />
    );
  }
  const src =
    variant === "white" ? "/qwlee-logo-white.svg" : "/qwlee-logo.svg";
  return (
    <img
      src={src}
      alt={alt}
      height={height}
      style={{ height, width: "auto" }}
      className={className}
    />
  );
}
