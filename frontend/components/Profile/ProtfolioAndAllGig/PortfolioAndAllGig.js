"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useGetAllPortfolioQuery } from "@/app/redux/features/getAllPortfolioApi";
import { useGetAllGigUserQuery } from "@/app/redux/features/getAllGigForUserApi";
import useUser from "@/hooks/useUser";

// Dynamically import Portfolio and AllGig components
const Portfolio = dynamic(() => import("./Portfolio"), { ssr: false });
const AllGig = dynamic(() => import("./AllGig"), { ssr: false });

const PortfolioAndAllGig = () => {
  const [currentTab, setCurrentTab] = useState("portfolio");
  const user = useUser();
  const { data: portfolioData } = useGetAllPortfolioQuery(user?.id);
  const { data: allGig } = useGetAllGigUserQuery(user?.id);

  return (
    <div className="p-2 md:p-5 rounded-lg">
      {/* tab */}
      <div className="flex justify-between items-center text-center">
        <div className="flex flex-row items-center text-center mt-[16px]">
          <div
            onClick={() => setCurrentTab("portfolio")}
            className={`cursor-pointer ring-1 ring-primary text-primary py-1 px-3 text-center hover:bg-primary hover:text-white transition duration-300 ${
              currentTab === "portfolio" ? "text-white bg-primary" : ""
            }`}
          >
            Portfolio ({portfolioData?.data?.attributes?.portfolio?.length})
          </div>
          <div
            onClick={() => setCurrentTab("buyer")}
            className={`cursor-pointer ring-1 ring-primary text-primary py-1 px-3 text-center hover:bg-primary hover:text-white transition duration-300 ${
              currentTab === "buyer" ? "text-white bg-primary" : ""
            }`}
          >
            All Gig ({allGig?.data?.attributes?.results?.length})
          </div>
        </div>
      </div>
      <div
        style={{
          boxShadow: "0px 0px 24px 0px #0000001A",
        }}
        className="rounded-lg my-5 py-5 p-[10px]"
      >
        {currentTab === "portfolio" ? <Portfolio /> : <AllGig />}
      </div>
    </div>
  );
};

export default PortfolioAndAllGig;
