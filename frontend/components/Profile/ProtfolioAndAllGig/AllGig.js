"use client";
import React from "react";
import OwnGig from "./OwnGig";
import { useRouter } from "next/navigation";
import { useGetAllGigUserQuery } from "@/app/redux/features/getAllGigForUserApi";
import useUser from "@/hooks/useUser";
import Link from "next/link";
import Loading from "@/components/CustomCreate/Loading";
const AllGig = () => {
  const user = useUser();
  const router = useRouter();
  const { data, isLoading, isError, error } = useGetAllGigUserQuery(user?.id);
  const allGigsData = data?.data?.attributes?.results;
  let content = null;
  if (isLoading) {
    content = <Loading />;
  } else if (!isLoading && isError && error) {
    content = (
      <h3 className="text-2xl font-semibold text-rose-500 text-center">
        Something went wrong
      </h3>
    );
  } else if (!isError && !isError && allGigsData?.length === 0) {
    content = (
      <h3 className="font-semibold text-rose-500 ">
        No gigs found
      </h3>
    );
  } else if (!isError && !isError && allGigsData?.length > 0) {
    content = allGigsData.map((item) => <OwnGig key={item?.id} item={item} />);
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {content}
      </div>
      <div className="mt-5">
        <Link href={"/gig/add"}>
          <div className="w-full h-[150px] cursor-pointer ring-1 ring-primary  rounded-lg">
            <div className="w-full h-full flex justify-center gap-1 items-center">
              <p className="text-primary font-bold text-2xl">+</p>{" "}
              <span
                onClick={() => router.push("gig/add")}
                className="text-primary"
              >
                Add Gig
              </span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AllGig;
