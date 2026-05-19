// OTP verification — admin password reset step.
// Centred card matching Login + Forgot password.

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import OTPInput from "react-otp-input";
import toast from "react-hot-toast";

import { useEmailVerifyMutation } from "../../redux/api/apiSlice";
import Button from "../../common/Button";

export default function OtpVerify() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const email = params.get("email") || "";
  const [otp, setOtp] = useState("");
  const [verifyEmail, { isLoading }] = useEmailVerifyMutation();

  async function handleVerify() {
    if (!email) {
      toast.error("Missing email — restart the flow.");
      navigate("/forgotpassword");
      return;
    }
    if (otp.length < 6) {
      toast.error("Enter the 6-digit code");
      return;
    }
    const res = await verifyEmail({ email, otp });
    if (res?.error) {
      toast.error(res.error?.data?.message || "Code didn't match");
      return;
    }
    toast.success("Code verified");
    navigate(`/updatepassword?email=${encodeURIComponent(email)}&oneTimeCode=${encodeURIComponent(otp)}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-sky-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-ink-200 rounded-2xl shadow-card p-6 md:p-8">
        <Link
          to="/forgotpassword"
          className="text-sm font-medium text-ink-500 hover:text-ink-900 inline-flex items-center gap-1 mb-3"
        >
          <IoArrowBack /> Back
        </Link>
        <h1 className="text-xl font-bold text-ink-900">Verify code</h1>
        <p className="text-sm text-ink-500 mt-1 mb-5">
          We sent a 6-digit code to{" "}
          <span className="font-medium text-ink-800">{email || "your email"}</span>.
          Enter it below.
        </p>

        <div className="flex justify-center mb-6">
          <OTPInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            renderSeparator={<span className="w-2" />}
            renderInput={(props) => (
              <input
                {...props}
                className="h-12 w-10 md:w-12 rounded-lg border border-ink-200 text-center text-lg font-semibold text-ink-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary-100"
              />
            )}
          />
        </div>

        <Button onClick={handleVerify} loading={isLoading} className="w-full" size="lg">
          Verify code
        </Button>

        <p className="text-xs text-ink-400 text-center mt-4">
          Didn&rsquo;t get it?{" "}
          <Link to="/forgotpassword" className="text-primary-700 font-medium hover:text-primary-800">
            Send again
          </Link>
        </p>
      </div>
    </div>
  );
}
