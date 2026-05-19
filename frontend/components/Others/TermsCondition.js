"use client";
import { useGetTermsAndConditionsQuery } from "@/app/redux/features/getInfo";
const TermsCondition = () => {
  const { data } = useGetTermsAndConditionsQuery()
  const termsData =  data?.[0]?.content;
  return (
    <main className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 shadow rounded-lg">
      <div
            className="privacy-content"
            dangerouslySetInnerHTML={{ __html: termsData }}
          />
      </div>
    </main>
  );
};

export default TermsCondition;
