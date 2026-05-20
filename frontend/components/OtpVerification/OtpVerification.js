"use client";
// OTP verification screen — Fiverr-style.
//
// Six-digit code split-input with auto-advance + paste support, masked
// email reminder, resend-with-cooldown timer, and clear success/error
// states. Reads `email` from `useSearchParams` (Next 16 made the server
// `searchParams` prop a Promise — spreading it leaked React-internal
// fields the Joi schema rejected).

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  IoMailOpenOutline,
  IoArrowBackOutline,
  IoShieldCheckmark,
  IoTimeOutline,
} from "react-icons/io5";

import { usePostOtpVerifyMutation } from "@/app/redux/features/postOtpVerifyApi";
import { usePostForgotPasswordMutation } from "@/app/redux/features/postForgotPasswordApi";

const CODE_LEN = 6;
const RESEND_COOLDOWN_SECONDS = 60;

function maskEmail(e) {
  if (!e || typeof e !== "string") return "your email";
  const [name = "", domain = ""] = e.split("@");
  if (!domain) return e;
  const visible = name.slice(0, 2);
  return `${visible}${"•".repeat(Math.max(2, name.length - 2))}@${domain}`;
}

export default function OtpVerification({ searchParams }) {
  const router = useRouter();
  const params = useSearchParams();
  const email =
    params.get("email") ||
    (typeof searchParams === "object" && searchParams && !("then" in searchParams)
      ? searchParams.email
      : "") ||
    "";
  const flow = params.get("flow") || ""; // "reset" | "" (signup)

  const [digits, setDigits] = useState(Array(CODE_LEN).fill(""));
  const inputs = useRef([]);
  const [verifyOtp, { isLoading }] = usePostOtpVerifyMutation();
  const [resendOtp, { isLoading: resending }] = usePostForgotPasswordMutation();
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);

  // Resend cooldown ticker.
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  // Focus first cell on mount.
  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  // Auto-submit when all six cells are filled.
  useEffect(() => {
    if (digits.every((d) => d !== "") && !isLoading) {
      handleVerify(digits.join(""));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [digits.join("")]);

  function setDigitAt(i, value) {
    const clean = value.replace(/[^0-9]/g, "").slice(0, 1);
    setDigits((d) => {
      const next = [...d];
      next[i] = clean;
      return next;
    });
    if (clean && i < CODE_LEN - 1) inputs.current[i + 1]?.focus();
  }

  function handleKeyDown(e, i) {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputs.current[i - 1]?.focus();
      setDigitAt(i - 1, "");
    } else if (e.key === "ArrowLeft" && i > 0) {
      inputs.current[i - 1]?.focus();
    } else if (e.key === "ArrowRight" && i < CODE_LEN - 1) {
      inputs.current[i + 1]?.focus();
    }
  }

  function handlePaste(e) {
    const text = (e.clipboardData.getData("text") || "")
      .replace(/[^0-9]/g, "")
      .slice(0, CODE_LEN);
    if (!text) return;
    e.preventDefault();
    const next = Array(CODE_LEN).fill("");
    text.split("").forEach((c, i) => (next[i] = c));
    setDigits(next);
    inputs.current[Math.min(text.length, CODE_LEN - 1)]?.focus();
  }

  async function handleVerify(code) {
    const otp = code || digits.join("");
    if (!email) {
      toast.error("Missing email — open the verification link again.");
      return;
    }
    if (otp.length < CODE_LEN) {
      toast.error("Enter the full 6-digit code.");
      return;
    }
    try {
      const response = await verifyOtp({ email, oneTimeCode: otp });
      if (response?.error) {
        const msg = response.error?.data?.message || "Verification failed";
        if (msg === "Reset password otp successfully verified") {
          toast.success("Code verified");
          router.push(
            `/change-password?email=${encodeURIComponent(email)}&oneTimeCode=${encodeURIComponent(otp)}`
          );
          return;
        }
        toast.error(msg);
        // Clear inputs on bad code so the user can retype.
        setDigits(Array(CODE_LEN).fill(""));
        inputs.current[0]?.focus();
        return;
      }
      if (response?.data?.code === 200) {
        toast.success(response.data.message || "Email verified");
        router.push("/sign-in");
      }
    } catch (err) {
      toast.error(err?.message || "Verification failed");
    }
  }

  async function handleResend() {
    if (cooldown > 0 || resending) return;
    if (!email) {
      toast.error("Missing email — open the verification link again.");
      return;
    }
    const res = await resendOtp({ email });
    if (res?.error) {
      toast.error(res.error?.data?.message || "Couldn't send the code");
      return;
    }
    toast.success("A fresh code is on the way.");
    setCooldown(RESEND_COOLDOWN_SECONDS);
  }

  const filled = digits.filter(Boolean).length;
  const heading = flow === "reset" ? "Reset your password" : "Verify your email";
  const blurb =
    flow === "reset"
      ? "Enter the 6-digit code we sent so we can reset your password."
      : "Enter the 6-digit code we sent to confirm your email address.";

  return (
    <main className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-emerald-50/40 via-white to-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-4"
        >
          <IoArrowBackOutline /> Back
        </button>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 md:p-9">
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <IoMailOpenOutline className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{heading}</h1>
            <p className="mt-2 text-sm text-gray-600">{blurb}</p>
            <p className="mt-1 text-sm text-gray-900 font-medium">
              {maskEmail(email)}
            </p>
          </div>

          <div className="mt-7 flex items-center justify-between gap-2" onPaste={handlePaste}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => (inputs.current[i] = el)}
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={d}
                onChange={(e) => setDigitAt(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className={`w-11 h-14 md:w-12 md:h-16 text-center text-xl md:text-2xl font-bold bg-gray-50 border rounded-xl outline-none transition focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 ${
                  d ? "border-emerald-300 text-emerald-700" : "border-gray-200 text-gray-900"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            disabled={isLoading || filled < CODE_LEN}
            onClick={() => handleVerify()}
            className="mt-6 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <IoShieldCheckmark className="w-4 h-4" />
            {isLoading ? "Verifying…" : "Verify"}
          </button>

          <div className="mt-5 text-center text-sm text-gray-500">
            Didn&apos;t receive the code?{" "}
            {cooldown > 0 ? (
              <span className="inline-flex items-center gap-1 text-gray-500">
                <IoTimeOutline className="w-3.5 h-3.5" />
                Resend in {cooldown}s
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-emerald-700 hover:text-emerald-800 font-medium disabled:opacity-60"
              >
                {resending ? "Sending…" : "Resend code"}
              </button>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          Wrong email?{" "}
          <Link href="/sign-up" className="text-emerald-700 font-medium">
            Start over
          </Link>
        </p>
      </div>
    </main>
  );
}
