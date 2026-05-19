// Class-list joiner. Like clsx but small and inline. Falsy values are
// dropped so you can write conditionals without ternaries littering the
// JSX.
//
//   <div className={cls("base", active && "active", danger ? "red" : "gray")} />

export default function cls(...parts) {
  return parts.filter(Boolean).join(" ");
}
