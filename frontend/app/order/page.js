import PrimaryLayout from "@/components/Layout/PrimaryLayout";
import Order from "@/components/Order/Order";

export const metadata = {
  title: "Order | Qwlee",
  description:
    "Company Number: (781) 316-0189, and Company Email: e-mail such as info@qwlee.com",
}
const page = () => {
  return (
    <PrimaryLayout>
      <Order />
    </PrimaryLayout>
  );
};

export default page;
