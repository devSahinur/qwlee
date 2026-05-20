"use client";
import { Form, Input } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { usePostResetPasswordMutation } from "@/app/redux/features/postResetPassword";
import { toast } from "sonner";
import Button from "../CustomCreate/Button";
import AuthCard from "../common/AuthCard";

const ChangePassword = ({ searchParams }) => {
  const router = useRouter();
  const params = useSearchParams();
  const [setNewPassword, { isLoading }] = usePostResetPasswordMutation();

  // Carry the original deep-link through the reset funnel so the user
  // lands back on the page they originally tried to reach after
  // signing in with the new password. Internal paths only — strip
  // anything that doesn't start with a single "/" to avoid open
  // redirects.
  const fromParam = params.get("from") || "";
  const safeFrom =
    fromParam.startsWith("/") && !fromParam.startsWith("//") ? fromParam : "";

  const handleSubmit = async (values) => {
    const { new_password } = values;
    const res = await setNewPassword({
      password: new_password,
      email: searchParams?.email || params.get("email"),
      oneTimeCode: searchParams?.oneTimeCode || params.get("oneTimeCode"),
    });
    if (res?.error) {
      toast.error(res?.error?.data?.message || "Could not reset password");
      return;
    }
    if (res?.data) {
      toast.success(res.data.message || "Password updated");
      const next = new URLSearchParams();
      if (safeFrom) next.set("from", safeFrom);
      const qs = next.toString();
      router.push(qs ? `/sign-in?${qs}` : "/sign-in");
    }
  };

  return (
    <AuthCard
      title="Set a new password"
      subtitle="Choose something you haven't used here before."
      back={{ href: "/sign-in", label: "Back to sign in" }}
    >
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="new_password"
          label="New password"
          rules={[
            { required: true, message: "Please enter a new password" },
            { min: 8, message: "At least 8 characters" },
            {
              pattern:
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              message: "Mix of letters, a number, and a special character",
            },
          ]}
        >
          <Input.Password placeholder="New password" size="large" />
        </Form.Item>
        <Form.Item
          name="confirm_password"
          label="Confirm new password"
          dependencies={["new_password"]}
          rules={[
            { required: true, message: "Please confirm your new password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("new_password") === value)
                  return Promise.resolve();
                return Promise.reject(new Error("The two passwords do not match"));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm new password" size="large" />
        </Form.Item>
        <Button loading={isLoading} name={"Update password"} />
      </Form>
    </AuthCard>
  );
};

export default ChangePassword;
