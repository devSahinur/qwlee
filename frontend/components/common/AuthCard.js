"use client";
// Shared card layout for all auth pages (sign-in, sign-up, forgot-password,
// change-password, verify-email). Consistent header, subtle border, no
// more random green-500 outlines.

import Link from "next/link";
import QwleeLogo from "./QwleeLogo";

export default function AuthCard({
  title,
  subtitle,
  children,
  footer,
  width = 480,
  back,
}) {
  return (
    <main className="min-h-[80vh] flex justify-center items-center px-3 py-10 bg-gradient-to-b from-emerald-50/60 to-white">
      <div
        className="w-full bg-white rounded-2xl border border-gray-100"
        style={{
          maxWidth: width,
          boxShadow:
            "0 1px 2px rgba(15,23,42,0.04), 0 8px 32px rgba(15,23,42,0.08)",
        }}
      >
        <div className="px-8 pt-8 pb-2 flex items-center justify-center">
          <Link href="/" aria-label="Qwlee home">
            <QwleeLogo height={32} />
          </Link>
        </div>
        <div className="px-8 pb-8 pt-2">
          {back ? (
            <Link
              href={back.href}
              className="text-sm text-gray-500 hover:text-gray-800 inline-flex items-center gap-1"
            >
              ← {back.label || "Back"}
            </Link>
          ) : null}
          <h1 className="text-2xl font-semibold text-center mt-3">{title}</h1>
          {subtitle ? (
            <p className="text-[15px] text-gray-500 mt-2 text-center">
              {subtitle}
            </p>
          ) : null}
          <div className="mt-6">{children}</div>
          {footer ? <div className="mt-6 text-center">{footer}</div> : null}
        </div>
      </div>
    </main>
  );
}
