import EditProfile from "@/components/EditProfile/EditProfile";
import PrimaryLayout from "@/components/Layout/PrimaryLayout";

export const metadata = {
  title: "Edit Profile | Qwlee",
  description:
    "Company Number: (781) 316-0189, and Company Email: e-mail such as info@qwlee.com",
}
const page = () => {
  return (
    <PrimaryLayout>
      <EditProfile />
    </PrimaryLayout>
  );
};

export default page;
