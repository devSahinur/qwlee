"use client";
import { useGetMyListQuery } from "@/app/redux/features/getMyListApi";
import AboutCard from "./AboutCard";
import GigLoveReact from "./GigLoveReact";
import MoneyProtectionGuarantee from "./MoneyProtectionGuarantee";
import { useGetGigDetailsQuery } from "@/app/redux/features/getGigDetailsApi";
import Loading from "@/components/CustomCreate/Loading";
import useUser from "@/hooks/useUser";

const AboutSeller = ({ slug, open, setOpen }) => {
  const loginUser = useUser();
  const { data, isLoading } = useGetGigDetailsQuery(slug);
  const { data: myListData } = useGetMyListQuery();
  const result = data?.data?.attributes?.results[0];
  const isLoved = !!myListData?.data?.attributes?.results?.find(
    (item) => item?.gigId?._id === result?._id
  );
  if (isLoading) {
    return (
      <div className="w-full h-screen">
        <Loading />
      </div>
    );
  }
  const user = result?.userId;

  return (
    <div className="md:w-1/3">
      <div className="flex flex-col gap-5">
        {loginUser?.role === "buyer" && (
          <div>
            <GigLoveReact result={result} isLoved={isLoved} />
          </div>
        )}

        <div className="flex flex-col gap-5">
          <AboutCard gig={result} user={user} setOpen={setOpen} open={open} />
          {/* <MoneyProtectionGuarantee /> */}
        </div>
      </div>
    </div>
  );
};

export default AboutSeller;
