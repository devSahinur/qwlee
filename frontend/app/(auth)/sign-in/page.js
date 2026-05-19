import PrimaryLayout from "@/components/Layout/PrimaryLayout";
import SignIn from "@/components/SignIn/SignIn";

export const metadata = {
  title: "Sign In | Qwlee",
  description:
    "Company Number: (781) 316-0189, and Company Email: e-mail such as info@qwlee.com",
}

const page = () => {
  return (
    <>
      <PrimaryLayout>
        <SignIn />
      </PrimaryLayout>
    </>
  );
};

export default page;
