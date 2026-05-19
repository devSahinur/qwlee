"use client";
import { useState } from "react";
import { Checkbox, Input, Form } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { IoAlertCircleOutline } from "react-icons/io5";

import { userLogin } from "@/actions/userLogin";
import { storeUserInfo } from "@/actions/auth.services";
import { setUser } from "@/app/redux/slices/userSlice";
import Button from "../CustomCreate/Button";
import AuthCard from "../common/AuthCard";
import useIpLocation, { flagEmoji } from "@/hooks/useIpLocation";

const SignIn = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const ip = useIpLocation();
  // Banned users get a special 403 from the backend with the admin-set
  // reason. We surface that inline instead of as a toast so the user
  // sees the exact reason next to the form.
  const [banReason, setBanReason] = useState("");

  const handleSubmit = async (values) => {
    setBanReason("");
    try {
      const res = await userLogin({
        email: values.email,
        password: values.password,
      });

      if (res?.code === 403 && typeof res?.message === "string" && res.message.startsWith("BANNED:")) {
        setBanReason(res.message.slice("BANNED:".length).trim());
        return;
      }

      if (res?.data?.attributes?.tokens?.access?.token) {
        if (res?.data?.attributes?.user?.role === "admin") {
          toast.error("Admins sign in via the admin dashboard, not here.");
          return;
        }
        storeUserInfo({
          accessToken: res?.data?.attributes?.tokens?.access?.token,
        });
        Cookies.set("user", JSON.stringify(res?.data?.attributes?.user));
        Cookies.set(
          "accessToken",
          JSON.stringify(res?.data?.attributes?.tokens?.access?.token)
        );
        Cookies.set(
          "refreshToken",
          JSON.stringify(res?.data?.attributes?.tokens?.refresh?.token)
        );
        dispatch(setUser(res?.data?.attributes?.user));
        router.push("/");
        toast.success(res?.message);
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      toast.error(error?.message);
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to continue to Qwlee."
      footer={
        <div className="space-y-1.5">
          <p className="text-sm text-gray-600">
            Don&rsquo;t have an account?{" "}
            <Link href="/sign-up" className="text-emerald-700 font-medium">
              Sign up
            </Link>
          </p>
          {!ip.loading && ip.locationLabel && (
            <p className="text-xs text-gray-400">
              Signing in from{" "}
              {ip.countryCode && (
                <span aria-hidden className="align-middle">
                  {flagEmoji(ip.countryCode)}
                </span>
              )}{" "}
              <span className="text-gray-500">{ip.locationLabel}</span>
            </p>
          )}
        </div>
      }
    >
      {banReason && (
        <div
          role="alert"
          className="mb-4 flex items-start gap-3 px-4 py-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-800"
        >
          <IoAlertCircleOutline className="w-5 h-5 mt-0.5 shrink-0 text-rose-500" />
          <div className="min-w-0">
            <div className="text-sm font-semibold">
              Your account has been suspended
            </div>
            <p className="text-sm text-rose-700 mt-0.5 whitespace-pre-line">
              {banReason}
            </p>
            <p className="text-xs text-rose-500 mt-1">
              If you believe this is a mistake, contact support.
            </p>
          </div>
        </div>
      )}

      <Form onFinish={handleSubmit} autoComplete="on" layout="vertical">
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: "Please enter your email" }]}
        >
          <Input placeholder="you@example.com" className="py-2" size="large" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password
            placeholder="Your password"
            className="py-2"
            size="large"
          />
        </Form.Item>
        <div className="flex justify-between items-center mb-3">
          <Checkbox>Keep me signed in</Checkbox>
          <Link
            href="/forgot-password"
            className="text-sm text-emerald-700 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <Button name={"Sign In"} />
      </Form>
    </AuthCard>
  );
};

export default SignIn;
