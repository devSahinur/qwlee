// Forgot password — admin flow. Matches the redesigned Login card.
// Submits to /auth/forgot-password, then routes to /otp?email=… so
// the OTP screen knows whom we're verifying.

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMailOutline, IoArrowBack } from "react-icons/io5";
import toast from "react-hot-toast";

import { useForgotPasswordMutation } from "../../redux/api/apiSlice";
import Button from "../../common/Button";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [forgot, { isLoading }] = useForgotPasswordMutation();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Enter the email on your account");
      return;
    }
    const res = await forgot({ email });
    if (res?.error) {
      toast.error(res.error?.data?.message || "Couldn't send code");
      return;
    }
    toast.success("Code sent — check your inbox");
    navigate(`/otp?email=${encodeURIComponent(email)}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-sky-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-ink-200 rounded-2xl shadow-card p-6 md:p-8">
        <Link
          to="/"
          className="text-sm font-medium text-ink-500 hover:text-ink-900 inline-flex items-center gap-1 mb-3"
        >
          <IoArrowBack /> Back to sign in
        </Link>
        <h1 className="text-xl font-bold text-ink-900">Forgot password?</h1>
        <p className="text-sm text-ink-500 mt-1 mb-5">
          Enter the email on your admin account and we&rsquo;ll send a 6-digit code.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">
              Email
            </label>
            <div className="flex items-center bg-white border border-ink-200 rounded-lg focus-within:border-primary focus-within:ring-2 focus-within:ring-primary-100">
              <IoMailOutline className="ml-3 text-ink-400 w-4 h-4" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none"
              />
            </div>
          </div>
          <Button type="submit" loading={isLoading} className="w-full" size="lg">
            Send code
          </Button>
        </form>
      </div>
    </div>
  );
}
