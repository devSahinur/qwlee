import EditGig from "@/components/EditGig/EditGig";
import PrimaryLayout from "@/components/Layout/PrimaryLayout";

export const metadata = {
  title: "Edit Gig | Qwlee",
  description:
    "Company Number: (781) 316-0189, and Company Email: e-mail such as info@qwlee.com",
}
const page = () => {
  return (
    <PrimaryLayout>
      <EditGig />
    </PrimaryLayout>
  );
};

export default page;