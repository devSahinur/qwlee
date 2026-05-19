"use client";
import { useGetPrivacyQuery } from "@/app/redux/features/getInfo";

const Privacy = () => {
  const { data } = useGetPrivacyQuery()
  const privacyData =  data?.[0]?.content;
  return (
    <main className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 shadow rounded-lg">
      <div
            className="privacy-content"
            dangerouslySetInnerHTML={{ __html: privacyData }}
          />
      </div>
    </main>
  );
};

export default Privacy;
