import Breadcrumb from "@/components/Layout/Breadcrumb";
import PrimaryLayout from "@/components/Layout/PrimaryLayout";
import TermsCondition from "@/components/Others/TermsCondition";

export const metadata = {
  title: "Terms of Service | Qwlee",
  description:
    "Company Number: (781) 316-0189, and Company Email: e-mail such as info@qwlee.com",
};
const page = () => {
  return (
    <>
      <PrimaryLayout>
        <Breadcrumb
          title={"Qwlee Terms of Service"}
          pathTitle={"Terms of Service"}
          path={"/terms-of-service"}
        />
     <TermsCondition/>
      </PrimaryLayout>
    </>
  );
};

export default page;
