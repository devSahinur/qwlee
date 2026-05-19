import PrimaryLayout from "@/components/Layout/PrimaryLayout";
import SignUp from "@/components/SignUp/SignUp";

export const metadata = {
  title: "Sign Up | Qwlee",
  description:
    "Company Number: (781) 316-0189, and Company Email: e-mail such as info@qwlee.com",
}
const page = () => {
  return (
    <>
      <PrimaryLayout>
        <SignUp />
      </PrimaryLayout>
    </>
  );
};

export default page;
