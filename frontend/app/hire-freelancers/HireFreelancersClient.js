"use client";
import dynamic from "next/dynamic";
import PrimaryLayout from "@/components/Layout/PrimaryLayout";

const Freelancers = dynamic(
  () => import("@/components/Freelancers/Freelancers"),
  { ssr: false }
);

export default function HireFreelancersClient() {
  return (
    <PrimaryLayout>
      <Freelancers />
    </PrimaryLayout>
  );
}
