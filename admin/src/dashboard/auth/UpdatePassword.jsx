// Update password — final step of the admin reset flow.

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline, IoArrowBack } from "react-icons/io5";
import toast from "react-hot-toast";

import { useResetPasswordMutation } from "../../redux/api/apiSlice";
import Button from "../../common/Button";

export default function UpdatePassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const email = params.get("email") || "";
  const oneTimeCode = params.get("oneTimeCode") || "";

  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [reset, { isLoading }] = useResetPasswordMutation();

  async function handleSubmit(e) {
    e.preventDefault();
    if (pw.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (pw !== confirm) {
      toast.error("Passwords don't match.");
      return;
    }
    if (!email) {
      toast.error("Missing email — restart the flow.");
      navigate("/forgotpassword");
      return;
    }
    const res = await reset({ email, password: pw, oneTimeCode });
    if (res?.error) {
      toast.error(res.error?.data?.message || "Couldn't update");
      return;
    }
    toast.success("Password updated — please sign in.");
    navigate("/");
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
        <h1 className="text-xl font-bold text-ink-900">Set a new password</h1>
        <p className="text-sm text-ink-500 mt-1 mb-5">
          Choose something at least 8 characters long.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <PasswordField
            label="New password"
            value={pw}
            onChange={setPw}
            show={show}
            onToggle={() => setShow((v) => !v)}
            placeholder="Enter new password"
          />
          <PasswordField
            label="Confirm new password"
            value={confirm}
            onChange={setConfirm}
            show={show}
            onToggle={() => setShow((v) => !v)}
            placeholder="Re-enter new password"
          />
          <Button type="submit" loading={isLoading} className="w-full" size="lg">
            Update password
          </Button>
        </form>
      </div>
    </div>
  );
}

function PasswordField({ label, value, onChange, show, onToggle, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink-700 mb-1.5">
        {label}
      </label>
      <div className="flex items-center bg-white border border-ink-200 rounded-lg focus-within:border-primary focus-within:ring-2 focus-within:ring-primary-100">
        <IoLockClosedOutline className="ml-3 text-ink-400 w-4 h-4" />
        <input
          type={show ? "text" : "password"}
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none"
        />
        <button
          type="button"
          onClick={onToggle}
          className="px-3 text-ink-400 hover:text-ink-700"
          aria-label="Toggle visibility"
        >
          {show ? <IoEyeOffOutline /> : <IoEyeOutline />}
        </button>
      </div>
    </div>
  );
}
