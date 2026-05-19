"use client";
import { useGetTrustSafetyQuery } from "@/app/redux/features/getInfo";
const Trust = () => {
  const { data } = useGetTrustSafetyQuery()
  const trustData =  data?.[0]?.content;
  return (
    <main className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 shadow rounded-lg">
      <div
            className="privacy-content"
            dangerouslySetInnerHTML={{ __html: trustData }}
          />
      </div>
    </main>
  );
};

export default Trust;
