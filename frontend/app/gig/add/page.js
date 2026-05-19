import AddGig from "@/components/AddGig/AddGig";
import PrimaryLayout from "@/components/Layout/PrimaryLayout";

export const metadata = {
  title: "Add Gig | Qwlee",
  description:
    "Company Number: (781) 316-0189, and Company Email: e-mail such as info@qwlee.com",
}
const page = () => {
  return (
    <PrimaryLayout>
      <AddGig />
    </PrimaryLayout>
  );
};

export default page;