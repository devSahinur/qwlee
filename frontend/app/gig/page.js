import Gig from "@/components/Gig/Gig";
import PrimaryLayout from "@/components/Layout/PrimaryLayout";

export const metadata = {
  title: "Gig | Qwlee",
  description:
    "Company Number: (781) 316-0189, and Company Email: e-mail such as info@qwlee.com",
}
const page = () => {
  return (
    <PrimaryLayout>
      <Gig />
    </PrimaryLayout>
  );
};

export default page;
