import ForgotPassword from "@/components/ForgotPassword/ForgotPassword";
import PrimaryLayout from "@/components/Layout/PrimaryLayout";

export const metadata = {
  title: "Forgot Password | Qwlee",
  description:
    "Company Number: (781) 316-0189, and Company Email: e-mail such as info@qwlee.com",
  keywords:
    "Company Number: (781) 316-0189, and Company Email: e-mail such as info@qwlee.com",
}
const page = () => {
  return (
    <PrimaryLayout>
      <ForgotPassword />
    </PrimaryLayout>
  );
};

export default page;
