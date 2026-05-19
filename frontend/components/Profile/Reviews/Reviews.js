"use client";
import { useGetProfileReviewQuery } from "@/app/redux/features/getProfileReviewApi";
import Loading from "@/components/CustomCreate/Loading";
import { Pagination } from "antd";
import { useState } from "react";
import ReviewsCard from "./ReviewsCard";

const Reviews = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError, error } =
    useGetProfileReviewQuery(currentPage);
  const reviewsDatas = data?.data?.attributes?.results;
  let content = null;
  if (isLoading) {
    content = <Loading />;
  } else if (!isLoading && isError && error) {
    content = (
      <h3 className="font-semibold text-rose-500 text-center py-5">
        Something went wrong
      </h3>
    );
  } else if (!isError && !isError && reviewsDatas?.length === 0) {
    content = (
      <h3 className="font-semibold text-rose-500 text-center py-5">
        No review found
      </h3>
    );
  } else if (!isError && !isError && reviewsDatas?.length > 0) {
    content = reviewsDatas?.map((item) => (
      <ReviewsCard key={item._id} item={item} />
    ));
  }
  const onChange = (values) => {
    setCurrentPage(values);
  };
  return (
    <div className="p-2 md:p-5 rounded-lg">
      {/* tab */}
      <div className="flex justify-between items-center text-center">
        <div className="flex flex-row items-center text-center  mt-[16px]">
          <div
            className={`cursor-pointer ring-1 ring-primary   py-1 px-3 text-center  bg-primary text-white transition duration-300 `}
          >
            Reviews
          </div>
        </div>
      </div>
      <div
        style={{
          boxShadow: "0px 0px 24px 0px #0000001A",
        }}
        className=" flex flex-col gap-5 rounded-lg my-5 py-5 p-[10px]"
      >
        {content}
      </div>
      <div className="flex justify-center">
        <Pagination
          onChange={onChange}
          current={currentPage}
          defaultCurrent={1}
          // total={data?.pagination?.totalNotification}
          pageSize={10}

          // total={20}
        />
      </div>
    </div>
  );
};

export default Reviews;
