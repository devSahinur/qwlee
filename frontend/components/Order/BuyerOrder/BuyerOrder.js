"use client";
import { useGetBuyerAllOrderQuery } from "@/app/redux/features/order/buyerOrderApi";
import { useState } from "react";
import { Table } from "antd";
import Image from "next/image";
import { imageBaseUrl, imgUrl} from "@/lib/constant";
import Link from "next/link";

const BuyerOrder = () => {
  const [activeTab, setActiveTab] = useState("Active");

  const { data: activeOrder } = useGetBuyerAllOrderQuery("active");
  const { data: missingDetailsOrder } = useGetBuyerAllOrderQuery("late");
  const { data: deliveredOrder } = useGetBuyerAllOrderQuery("delivered");
  const { data: cancelledOrder } = useGetBuyerAllOrderQuery("cancelled");
  const { data: allOrder } = useGetBuyerAllOrderQuery();

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-cyan-800";
      case "Completed":
        return "bg-green-500";
      case "Late":
        return "bg-rose-500";
      case "Delivered":
        return "bg-pink-500";
      case "Cancelled":
        return "bg-gray-500";
      default:
        return "black";
    }
  };

  const getActiveOrders = () => {
    switch (activeTab) {
      case "Active":
        return activeOrder;
      case "Late":
        return missingDetailsOrder;
      case "Delivered":
        return deliveredOrder;
      case "Cancelled":
        return cancelledOrder;
      case "All":
        return allOrder;
      default:
        return [];
    }
  };

  const buyerTabs = [
    { title: "Active", count: activeOrder?.results?.length || 0 },
    { title: "Late", count: missingDetailsOrder?.results?.length || 0 },
    { title: "Delivered", count: deliveredOrder?.results?.length || 0 },
    { title: "Cancelled", count: cancelledOrder?.results?.length || 0 },
    { title: "All", count: allOrder?.results?.length || 0 },
  ];

  const columns = [
    {
      title: "Gig Image",
      dataIndex: "gigImage",
      key: "gigImage",
    },
    {
      title: "Gig Title",
      dataIndex: "gigTitle",
      key: "gigTitle",
      render: (text, record) => {
        // Truncate the title if it exceeds 30 characters
        const truncatedTitle =
          text.length > 30 ? `${text.substring(0, 30)}...` : text;
        return <Link href={`/order/${record?.id}`}>{truncatedTitle}</Link>;
      },
    },
    {
      title: "Due On",
      dataIndex: "dueOn",
      key: "dueOn",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          className={`px-3 py-1 rounded ${getStatusColor(status)} text-white`}
        >
          {status}
        </span>
      ),
    },
  ];

  const filteredOrders = getActiveOrders()?.results.map((order) => {
    return {
      key: order._id,
      id: order._id,
      gigImage: (
        <Image
          width={80}
          height={80}
          src={imgUrl(order?.gigId?.images[0])}
          alt="image"
          className="rounded"
        />
      ),
      gigTitle: order.gigId.title,
      dueOn: new Date(order.deliveryDate).toLocaleDateString(),
      total: `$${order.gigId.price}`,
      status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
    };
  });

  return (
    <div className="w-full min-h-screen container p-4 md:p-8">
      <h1 className="text-2xl md:text-4xl font-light mb-4">Manage Orders</h1>
      <div className="flex flex-col md:flex-row flex-wrap gap-4 md:gap-8 border-b border-gray-300 pb-4">
        {buyerTabs.map((tab) => (
          <button
            key={tab.title}
            onClick={() => setActiveTab(tab.title)}
            className={`relative pb-2 transition-colors text-sm md:text-base duration-300 uppercase ${
              activeTab === tab.title ? "text-green-500" : "text-gray-500"
            }`}
          >
            {tab.title} ({tab.count})
            {activeTab === tab.title && (
              <span className="absolute bottom-[-1px] left-0 right-0 mx-auto w-full h-[2px] bg-green-500"></span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-5 overflow-x-auto">
        {filteredOrders?.length > 0 ? (
          <Table
            columns={columns}
            dataSource={filteredOrders}
            pagination={{ pageSize: 5 }}
          />
        ) : (
          <p>No {activeTab.toLowerCase()} orders to show.</p>
        )}
      </div>
    </div>
  );
};

export default BuyerOrder;
