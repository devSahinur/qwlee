import ChangePassword from "@/components/ChangePassword/ChangePassword";
import PrimaryLayout from "@/components/Layout/PrimaryLayout";
export const metadata = {
  title: "Change Password | Qwlee",
  description:
    "Company Number: (781) 316-0189, and Company Email: e-mail such as info@qwlee.com",
  keywords:
    "Company Number: (781) 316-0189, and Company Email: e-mail such as info@qwlee.com",
};
const page = ({ searchParams }) => {
  return (
    <PrimaryLayout>
      <ChangePassword searchParams={searchParams} />
    </PrimaryLayout>
  );
};

export default page;
