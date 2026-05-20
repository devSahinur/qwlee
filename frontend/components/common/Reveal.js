"use client";
// Reusable scroll-into-view animation wrapper.
//
//   <Reveal delay={0.1}>...</Reveal>
//   <Reveal stagger>{cards.map(...)}</Reveal>
//
// Keeps the rest of the codebase free of framer-motion plumbing — every
// component just wraps a section with `<Reveal>` and gets a consistent,
// tasteful entrance. Animations respect `prefers-reduced-motion` via
// framer-motion's built-in handling.

import { motion } from "framer-motion";

const DEFAULT_TRANSITION = { duration: 0.55, ease: [0.22, 1, 0.36, 1] };

// Single child — fade + 16px lift, fires once per page load when it
// enters the viewport (50px before the edge so it never feels "late").
export default function Reveal({
  children,
  delay = 0,
  y = 16,
  duration,
  as: As = "div",
  className,
  ...rest
}) {
  const MotionAs = motion[As] || motion.div;
  return (
    <MotionAs
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px 0px" }}
      transition={{ ...DEFAULT_TRANSITION, ...(duration ? { duration } : {}), delay }}
      className={className}
      {...rest}
    >
      {children}
    </MotionAs>
  );
}

// Container that staggers its direct children. Pair with `<RevealItem>`
// for the children so they each animate individually with a small delay
// between them — used by card grids.
export function RevealStagger({ children, gap = 0.06, className, as: As = "div" }) {
  const MotionAs = motion[As] || motion.div;
  return (
    <MotionAs
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px 0px" }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: gap, delayChildren: 0.05 },
        },
      }}
      className={className}
    >
      {children}
    </MotionAs>
  );
}

export function RevealItem({ children, className, as: As = "div", y = 14 }) {
  const MotionAs = motion[As] || motion.div;
  return (
    <MotionAs
      variants={{
        hidden: { opacity: 0, y },
        visible: { opacity: 1, y: 0, transition: DEFAULT_TRANSITION },
      }}
      className={className}
    >
      {children}
    </MotionAs>
  );
}

// For interactive cards/buttons — gentle hover + tap micro-feedback.
// Use sparingly so it never feels jittery.
export function HoverLift({ children, className, ...rest }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
