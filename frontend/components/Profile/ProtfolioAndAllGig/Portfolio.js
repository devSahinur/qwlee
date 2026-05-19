"use client";
import React, { useRef } from "react";
import PortfolioCard from "./PortfolioCard";
import { useGetAllPortfolioQuery } from "@/app/redux/features/getAllPortfolioApi";
import { useSelector } from "react-redux";
import { usePostPortfolioMutation } from "@/app/redux/features/postPortfolioApi";
import { toast } from "sonner";
import Loading from "@/components/CustomCreate/Loading";
import useUser from "@/hooks/useUser";

const Portfolio = () => {
  const user = useUser()
  const fileInputRef = useRef(null);

  const { data, isLoading, isError, error } =
    useGetAllPortfolioQuery(user?.id,{
      skip:!user?.id,
    });
  const [uploadImage] =
    usePostPortfolioMutation();
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      const res = await uploadImage(formData);
      if (res.error) {
        toast.error(res?.error?.data?.message)
        return;
      }
      if(res.data){
        toast.success("Portfolio image uploaded successfully");
      }
    }
  };
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const portfolioImageData = data?.data?.attributes?.portfolio
  let content = null;
  if (isLoading) {
    content = <Loading />;
  } else if (!isLoading && isError && error) {
    content = (
      <h3 className="text-2xl font-semibold text-rose-500 text-center">
        Something went wrong
      </h3>
    );
  } else if (!isError && !isError && portfolioImageData?.length === 0) {
    content = (
      <h3 className="font-semibold text-rose-500 ">
        No portfolio found
      </h3>
    );
  } else if (!isError && !isError && portfolioImageData?.length > 0) {
    content = portfolioImageData.map((item) => <PortfolioCard key={item.id} data={item} />);
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 items-center">
        {content}
      </div>
      <div className="mt-5">
        <input
          type="file"
          accept=".jpg, .jpeg, .png"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: "none" }}
        />
        <div
          onClick={handleButtonClick}
          className="w-full  cursor-pointer ring-1 ring-primary h-[150px] rounded-lg"
        >
          <div className="w-full h-full flex justify-center gap-1 items-center">
            <p className="text-primary font-bold text-2xl">+</p>{" "}
            <span className="text-primary">Add Portfolio</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
