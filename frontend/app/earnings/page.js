import Earnings from "@/components/Earnings/Earnings";
import PrimaryLayout from "@/components/Layout/PrimaryLayout";
import React from "react";

export const metadata = {
  title: "Earnings | Qwlee",
  description:
    "Company Number: (781) 316-0189, and Company Email: e-mail such as info@qwlee.com",
}
const page = () => {
  return (
    <PrimaryLayout>
      <Earnings />
    </PrimaryLayout>
  );
};

export default page;
