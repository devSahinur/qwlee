"use client";
import { useGetFreelancerAllOrderQuery } from "@/app/redux/features/order/freelancerOrderApi";
import { imageBaseUrl, imgUrl} from "@/lib/constant";
import { Collapse, Table } from "antd";
import moment from "moment";
import Image from "next/image";
import React from "react";
import { LuEye } from "react-icons/lu";
export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const getStatusClass = (status) => {
  switch (status) {
    case "completed":
      return "bg-green-500 text-white";
    case "active":
      return "bg-blue-500 text-white";
    case "cancelled":
      return "bg-red-500 text-white";
    case "delivered":
      return "bg-yellow-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

const calculateDaysRemaining = (deliveryDate) => {
  const today = moment();
  const delivery = moment(deliveryDate);
  const daysRemaining = delivery.diff(today, "days");
  return daysRemaining;
};
const FreelancerOrderInfo = () => {
  const { data: activeOrders, isFetching } =
    useGetFreelancerAllOrderQuery("active");
  const { data: missingDetailsOrder } = useGetFreelancerAllOrderQuery("late");
  const { data: deliveredOrders } = useGetFreelancerAllOrderQuery("delivered");
  const { data: cancelledOrders } = useGetFreelancerAllOrderQuery("cancelled");

  const calculateTotalPrice = (orders) => {
    return orders?.reduce(
      (total, order) => total + (order?.items[0]?.price || 0),
      0
    );
  };

  const formatPrice = (price) => {
    if (price) {
      return `$${price.toFixed(0)}`;
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (text) => (
        <Image
          width={100}
          height={50}
          src={text}
          className="w-[100px] h-[50px] rounded-lg"
          alt="gigImage"
        />
      ),
    },
    {
      title: "Client Name",
      dataIndex: "clientName",
      key: "clientName",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text) => formatPrice(text),
    },
    {
      title: "Due in",
      dataIndex: "dueIn",
      key: "dueIn",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <p
          className={`${getStatusClass(
            text
          )} text-center text-xs py-1 px-2 rounded-lg`}
        >
          {capitalizeFirstLetter(text)}
        </p>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: () => (
        <div>
          <LuEye className="size-6" />
        </div>
      ),
    },
  ];

  const mapOrderData = (orders) => {
    return orders?.map((item) => {
      const deliveryDate = item?.deliveryDate;
      const daysRemaining = calculateDaysRemaining(deliveryDate);

      return {
        key: item._id,
        image:
          item?.gigId?.images[0] && imgUrl(item?.gigId?.images[0]),
        clientName: item?.clientId?.fullName,
        price: item?.items[0]?.price,
        dueIn: `${daysRemaining} days`,
        status: item?.status,
      };
    });
  };

  const collapseItems = [
    {
      key: "1",
      label: (
        <>
          <h1 className="text-[18px] font-semibold">
            Active orders - {activeOrders?.results?.length} (
            {formatPrice(calculateTotalPrice(activeOrders?.results))})
          </h1>
        </>
      ),
      children: (
        <Table
          columns={columns}
          dataSource={mapOrderData(activeOrders?.results)}
          pagination={false}
          scroll={{ x: true }}
          responsive
        />
      ),
    },
    {
      key: "2",
      label: (
        <>
          <h1 className="text-[18px] font-semibold">
            Missing orders - {missingDetailsOrder?.results?.length} (
            {formatPrice(calculateTotalPrice(missingDetailsOrder?.results))})
          </h1>
        </>
      ),
      children: (
        <Table
          loading={isFetching}
          columns={columns}
          dataSource={mapOrderData(missingDetailsOrder?.results)}
          pagination={false}
          scroll={{ x: true }}
          responsive
        />
      ),
    },
    {
      key: "3",
      label: (
        <>
          <h1 className="text-[18px] font-semibold">
            Delivered orders - {deliveredOrders?.results.length} (
            {formatPrice(calculateTotalPrice(deliveredOrders?.results))})
          </h1>
        </>
      ),
      children: (
        <Table
          columns={columns}
          dataSource={mapOrderData(deliveredOrders?.results)}
          pagination={false}
          scroll={{ x: true }}
          responsive
        />
      ),
    },
    {
      key: "4",
      label: (
        <>
          <h1 className="text-[18px] font-semibold">
            Cancelled orders - {cancelledOrders?.results?.length} (
            {formatPrice(calculateTotalPrice(cancelledOrders?.results))})
          </h1>
        </>
      ),
      children: (
        <Table
          columns={columns}
          dataSource={mapOrderData(cancelledOrders?.results)}
          pagination={false}
          scroll={{ x: true }}
          responsive
        />
      ),
    },
  ];

  return (
    <div>
      <h3 className="text-xl font-semibold">My Orders</h3>
      <Collapse
        className="bg-white mt-5"
        defaultActiveKey={["1"]}
        items={collapseItems}
      />
    </div>
  );
};

export default FreelancerOrderInfo;
