/* eslint-disable react/no-unescaped-entities */
// "use client";
// import { useGetBuyerAllOrderQuery } from "@/app/redux/features/order/buyerOrderApi";
// import { imageBaseUrl, imgUrl} from "@/lib/constant";
// import { Collapse, Table } from "antd";
// import moment from "moment";
// import Image from "next/image";
// import React from "react";
// import { LuEye } from "react-icons/lu";
// const getStatusClass = (status) => {
//   switch (status) {
//     case "completed":
//       return "bg-green-500 text-white";
//     case "active":
//       return "bg-blue-500 text-white";
//     case "cancelled":
//       return "bg-red-500 text-white";
//     case "delivered":
//       return "bg-yellow-500 text-white";
//     default:
//       return "bg-gray-500 text-white";
//   }
// };
// const calculateDaysRemaining = (deliveryDate) => {
//   const today = moment();
//   const delivery = moment(deliveryDate);
//   const daysRemaining = delivery.diff(today, "days");
//   return daysRemaining;
// };
// const BuyerOtherCard = () => {
//   const { data: completedOrders, isFetching: completedDataFetching } =
//     useGetBuyerAllOrderQuery("completed");
//   const { data: activeOrders, isFetching: activeDataFetching } =
//     useGetBuyerAllOrderQuery("active");
//   const { data: cancelledOrders, isFetching: cancelledDataFetching } =
//     useGetBuyerAllOrderQuery("cancelled");
//   const { data: deliveredOrders, isFetching: deliveredDataFetching } =
//     useGetBuyerAllOrderQuery("delivered");

//   const calculateTotalPrice = (orders) => {
//     return orders?.reduce(
//       (total, order) => total + (order?.items[0]?.price || 0),
//       0
//     );
//   };

//   const formatPrice = (price) => {
//     if (price) {
//       return `$${price.toFixed(0)}`;
//     }
//   };

//   const columns = [
//     {
//       title: "Image",
//       dataIndex: "image",
//       key: "image",
//       render: (text) => (
//         <Image
//           width={100}
//           height={50}
//           src={text}
//           className="w-[100px] h-[50px] rounded-lg"
//           alt="gigImage"
//         />
//       ),
//     },
//     {
//       title: "Client Name",
//       dataIndex: "clientName",
//       key: "clientName",
//     },
//     {
//       title: "Price",
//       dataIndex: "price",
//       key: "price",
//       render: (text) => formatPrice(text),
//     },
//     {
//       title: "Due in",
//       dataIndex: "dueIn",
//       key: "dueIn",
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       key: "status",
//       render: (text) => (
//         <p
//           className={`${getStatusClass(
//             text
//           )} text-center text-xs py-1 px-2 rounded-lg`}
//         >
//           {capitalizeFirstLetter(text)}
//         </p>
//       ),
//     },
//     {
//       title: "Action",
//       dataIndex: "action",
//       key: "action",
//       render: () => (
//         <div>
//           <LuEye className="size-6" />
//         </div>
//       ),
//     },
//   ];

//   const mapOrderData = (orders) => {
//     return orders?.map((item) => {
//       const deliveryDate = item?.deliveryDate;
//       const daysRemaining = calculateDaysRemaining(deliveryDate);

//       return {
//         key: item._id,
//         image:
//           item?.gigId?.images[0] && imgUrl(item?.gigId?.images[0]),
//         clientName: item?.clientId?.fullName,
//         price: item?.items[0]?.price,
//         dueIn: `${daysRemaining} days`,
//         status: item?.status,
//       };
//     });
//   };
//   const collapseItems = [
//     {
//       key: "1",
//       label: (
//         <>
//           <h1 className="text-[18px] font-semibold">
//             Active orders - {activeOrders?.results?.length} (
//             {formatPrice(calculateTotalPrice(activeOrders?.results))})
//           </h1>
//         </>
//       ),
//       children: (
//         <Table
//           loading={activeDataFetching}
//           columns={columns}
//           dataSource={mapOrderData(activeOrders?.results)}
//           pagination={false}
//           scroll={{ x: true }}
//           responsive
//         />
//       ),
//     },
//     {
//       key: "2",
//       label: (
//         <>
//           <h1 className="text-[18px] font-semibold">
//             Complete orders - {completedOrders?.results?.length} (
//             {formatPrice(calculateTotalPrice(completedOrders?.results))})
//           </h1>
//         </>
//       ),
//       children: (
//         <Table
//           loading={completedDataFetching}
//           columns={columns}
//           dataSource={mapOrderData(completedOrders?.results)}
//           pagination={false}
//           scroll={{ x: true }}
//           responsive
//         />
//       ),
//     },
//     {
//       key: "3",
//       label: (
//         <>
//           <h1 className="text-[18px] font-semibold">
//             Delivered orders - {deliveredOrders?.results.length} (
//             {formatPrice(calculateTotalPrice(deliveredOrders?.results))})
//           </h1>
//         </>
//       ),
//       children: (
//         <Table
//           loading={deliveredDataFetching}
//           columns={columns}
//           dataSource={mapOrderData(deliveredOrders?.results)}
//           pagination={false}
//           scroll={{ x: true }}
//           responsive
//         />
//       ),
//     },
//     {
//       key: "4",
//       label: (
//         <>
//           <h1 className="text-[18px] font-semibold">
//             Cancelled orders - {cancelledOrders?.results?.length} (
//             {formatPrice(calculateTotalPrice(cancelledOrders?.results))})
//           </h1>
//         </>
//       ),
//       children: (
//         <Table
//           loading={cancelledDataFetching}
//           columns={columns}
//           dataSource={mapOrderData(cancelledOrders?.results)}
//           pagination={false}
//           scroll={{ x: true }}
//           responsive
//         />
//       ),
//     },
//   ];

//   return (
//     <div>
//       <h3 className="text-xl font-semibold">My Orders</h3>
//       <Collapse
//         className="bg-white mt-5"
//         defaultActiveKey={["1"]}
//         items={collapseItems}
//       />
//     </div>
//   );
// };

// export default BuyerOtherCard;

{
  /* <form onSubmit={handleReviewSubmit} className="space-y-6 mt-4">
          <div className="flex flex-col">
            <label className="font-medium mb-1">Rate the Freelancer</label>
            <div className="flex items-center">
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                  <label key={index}>
                    <input
                      type="radio"
                      name="rating"
                      value={ratingValue}
                      onClick={() => setRating(ratingValue)}
                      className="hidden"
                    />
                    <FaStar
                      className={`text-2xl cursor-pointer transition-colors duration-200 ${
                        ratingValue <= (hover || rating)
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }`}
                      onMouseEnter={() => setHover(ratingValue)}
                      onMouseLeave={() => setHover(0)}
                    />
                  </label>
                );
              })}
            </div>
            <p className="text-gray-500 text-sm mt-1">
              {rating > 0 ? `You rated ${rating} star(s)` : "No rating yet"}
            </p>
          </div>

          <div className="flex flex-col">
            <label className="font-medium mb-1">Your Review</label>
            <textarea
              rows={4}
              className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Write your review here..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium mb-1">Would you recommend?</label>
            <div className="flex gap-4">
              <button
                type="button"
                className={`px-5 py-2 rounded-lg border transition-colors ${
                  recommend === true
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
                onClick={() => setRecommend(true)}
              >
                Yes
              </button>
              <button
                type="button"
                className={`px-5 py-2 rounded-lg border transition-colors ${
                  recommend === false
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
                onClick={() => setRecommend(false)}
              >
                No
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="bg-primary px-6 py-3 rounded-lg text-white font-medium hover:bg-primary-dark transition"
            >
              Submit Review
            </button>
          </div>
        </form> */
}

import { useGetAllReviewApiQuery } from "@/app/redux/features/getAllReviewApi";
import useUser from "@/hooks/useUser";
import { imageBaseUrl, imgUrl} from "@/lib/constant";
import { Rate } from "antd";
import Image from "next/image";
import React from "react";

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const BuyerOtherCard = () => {
  const user = useUser();
  const { data, isLoading, error } = useGetAllReviewApiQuery({
    userId: user?.id,
    gigId: null,
  });

  const reviewData = data?.data?.attributes?.results;

  return (
    <div className="w-full space-y-8 p-5 bg-white">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">
          Hi 👋 Let’s help freelancers get to know you
        </h1>
        <p>
          Get the most out of Fiverr by sharing a bit more about yourself and
          how you prefer to work with freelancers.
        </p>
      </div>

      <div className="mt-10 rounded-lg border p-5">
        <h1 className="font-semibold text-lg">Review Your Freelancer</h1>
        <div>
          {reviewData && reviewData.length > 0 ? (
            reviewData?.map((review, index) => (
              <div key={index} className="border-b border-gray-200 py-3">
                <div className="flex items-center space-x-2">
                  <Image
                    width={50}
                    height={50}
                    className="rounded-full"
                    src={imgUrl(review?.userId?.image)}
                    alt={review?.userId?.fullName}
                  />
                  <div>
                    <h2 className="font-medium">{review.userId.username}</h2>
                    <p className="text-gray-500 text-xs">
                      {review.userId?.location}
                    </p>
                  </div>
                </div>
                <div className="ml-14 mt-3 space-y-3">
                  <div className="flex gap-8 items-center">
                    <div className="flex items-center gap-1">
                      <Rate
                        className="text-yellow-500"
                        disabled
                        allowHalf
                        defaultValue={review?.rating}
                      />
                      <p>({review?.rating})</p>
                    </div>
                    <p className="text-textGray font">
                      {review?.createdAt?.split("T")[0]}
                    </p>
                  </div>
                  <p className="text-lg">{review?.review}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-rose-500 mt-10 font-medium">
              Doesn't have any reviews yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyerOtherCard;
