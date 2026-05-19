"use client";
// OTP verification screen.
//
// Reads `email` (and any optional context flags) from the URL via
// useSearchParams — Next 16 made the `searchParams` server prop a
// Promise, so spreading it directly into the request body was leaking
// React-internal fields (`_children`, `_debugChunk`, `status`, …) that
// the backend Joi schema would reject as "not allowed". useSearchParams
// is the supported way to read query params from a client component.

import { useState } from "react";
import OTPInput from "react-otp-input";
import { GoArrowLeft } from "react-icons/go";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { usePostOtpVerifyMutation } from "@/app/redux/features/postOtpVerifyApi";
import Button from "../CustomCreate/Button";

export default function OtpVerification({ searchParams }) {
  const router = useRouter();
  const params = useSearchParams();
  // Prefer the client-side params (always a plain string-map). Fall back
  // to the server prop in case it was passed as a resolved object.
  const email =
    params.get("email") ||
    (typeof searchParams === "object" && searchParams && !("then" in searchParams)
      ? searchParams.email
      : "") ||
    "";

  const [otp, setOtp] = useState("");
  const [setOtpData, { isLoading }] = usePostOtpVerifyMutation();

  async function handleVerify() {
    if (!email) {
      toast.error("Missing email — open the link from your inbox again.");
      return;
    }
    if (!otp || otp.length < 4) {
      toast.warning("Enter the OTP from your email");
      return;
    }
    try {
      const response = await setOtpData({ email, oneTimeCode: otp });
      if (response?.error) {
        const msg = response.error?.data?.message || "Verification failed";
        if (msg === "Reset password otp successfully verified") {
          toast.success("OTP verified");
          router.push(
            `/change-password?email=${encodeURIComponent(email)}&oneTimeCode=${encodeURIComponent(otp)}`
          );
          return;
        }
        toast.error(msg);
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

  return (
    <div className="flex justify-center items-center">
      <div className="w-[500px] border border-emerald-500 p-12 my-16 rounded-xl">
        <div
          onClick={() => router.push("/sign-up")}
          className="flex justify-center items-center gap-2 cursor-pointer"
        >
          <GoArrowLeft className="text-[24px] md:text-[32px]" />
          <h1 className="text-[20px] md:text-[24px] font-medium my-[24px]">
            Verify OTP
          </h1>
        </div>
        <p className="text-[16px] md:text-[20px] text-[#5C5C5C] mb-2">
          Please enter the OTP we have sent to{" "}
          <span className="font-medium text-gray-900">
            {email || "your email"}
          </span>
          .
        </p>
        <p className="text-xs text-gray-500 mb-6">
          Didn&rsquo;t get it? Check your spam folder, or sign up again.
        </p>
        <div className="space-y-7 fit-content object-contain">
          <div className="flex items-center gap-2 outline-none focus:border-blue-400 object-contain w-full max-w-[500px] mx-auto">
            <OTPInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderSeparator={<span> </span>}
              renderInput={(props) => (
                <input
                  {...props}
                  className="h-[40px] w-[40px] md:h-[50px] md:w-[50px] bg-[#E8EBF0] border border-[#193664] outline-none text-black mr-2 md:mr-4"
                />
              )}
            />
          </div>
          <div onClick={handleVerify}>
            <Button loading={isLoading} name={"Verify"} />
          </div>
        </div>
      </div>
    </div>
  );
}
