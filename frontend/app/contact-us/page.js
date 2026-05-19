import ContactCard from "@/components/ContactUs/ContactCard";
import Breadcrumb from "@/components/Layout/Breadcrumb";
import PrimaryLayout from "@/components/Layout/PrimaryLayout";

export const metadata = {
  title: "Contact Us | Qwlee",
  description:
    "Company Number: (781) 316-0189, and Company Email: e-mail such as info@qwlee.com",
};

function ContactUs() {
  return (
    <>
      <PrimaryLayout>
        <Breadcrumb
          title={"Qwlee Contact Us "}
          pathTitle={"Contacts Us"}
          path={"/contact-us"}
        />
        <ContactCard />
      </PrimaryLayout>
    </>
  );
}

export default ContactUs;
