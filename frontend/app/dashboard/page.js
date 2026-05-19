import Dashboard from "@/components/Dashboard/Dashboard";
import PrimaryLayout from "@/components/Layout/PrimaryLayout";
import React from "react";

export const metadata = {
  title: "Dashboard | Qwlee",
  description:
    "Company Number: (781) 316-0189, and Company Email: e-mail such as info@qwlee.com",
}
const page = () => {
  return (
    <PrimaryLayout>
      <Dashboard />
    </PrimaryLayout>
  );
};

export default page;
