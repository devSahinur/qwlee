"use client";
import {
  useGetMyWithdrawalRequestQuery,
  usePostWithdrawalRequestMutation,
} from "@/app/redux/features/withdraw/postWithdrawalRequestApi";
import useUser from "@/hooks/useUser";
import { Modal, Form, Select, Table, Input } from "antd";
import React, { useState } from "react";
import { toast } from "sonner";
import { capitalizeFirstLetter } from "../Profile/Buyer/BuyerOtherCard";
import { useGetUserQuery } from "@/app/redux/features/getSingleUserApi";
import { useGetTotalIncomeFreelancerQuery } from "@/app/redux/features/order/totalIncomeFreelancer";

const getStatusClass = (status) => {
  switch (status) {
    case "Completed":
      return "bg-green-500 text-white";
    case "Pending":
      return "bg-yellow-500 text-white";
    case "Failed":
      return "bg-rose-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

const australiaBank = [
  { label: "AMP Bank", value: "amp-bank" },
  { label: "ANZ", value: "anz" },
  { label: "Commonwealth Bank", value: "commonwealth-bank" },
  { label: "IMB Bank", value: "imb-bank" },
  { label: "ME Bank", value: "me-bank" },
  { label: "NAB", value: "nab" },
  { label: "St George Bank", value: "st-george-bank" },
  { label: "Suncorp Bank", value: "suncorp-bank" },
  { label: "Westpac", value: "westpac" },
  { label: "Bank of Sydney", value: "bank-of-sydney" },
  { label: "Bank Australia", value: "bank-australia" },
  { label: "Bank of Melbourne", value: "bank-of-melbourne" },
  { label: "Bandigo Bank", value: "bandigo-bank" },
  { label: "Macquarie Bank", value: "macquarie-bank" },
  { label: "Bankwest", value: "bankwest" },
  { label: "ING Bank", value: "ing-bank" },
];

const accountTypes = [
  { label: "Savings Account", value: "savings-account" },
  { label: "Checking Account", value: "checking-account" },
  { label: "Business Account", value: "business-account" },
  { label: "Fixed Deposit Account", value: "fixed-deposit-account" },
  { label: "Recurring Deposit Account", value: "recurring-deposit-account" },
];

const Earnings = () => {
  const user = useUser();
  const { data: userData } = useGetUserQuery(user?.id, {
    skip: !user?.id,
  });
  const userTransformData = userData?.data?.attributes?.user;
  const [createWithdrawalRequest, { isLoading, isError, error }] =
    usePostWithdrawalRequestMutation();
  const { data: totalIncome } = useGetTotalIncomeFreelancerQuery();
  const { data, isFetching } = useGetMyWithdrawalRequestQuery();
  const [openModal, setOpenModal] = useState(false);
  const [form] = Form.useForm();
  const availableBalance = userTransformData?.balance;

  const handleSubmit = async (values) => {
    if (values.withdrawalAmount > availableBalance) {
      toast.error("Insufficient balance for withdrawal");
    } else {
      try {
        const res = await createWithdrawalRequest(values);
        if (res?.error?.data?.code == 404 || 401) {
          toast.error(res?.error?.data?.message);
        }
        if (res?.data.code === 201) {
          toast.success("Withdrawal successfully");
          setOpenModal(false);
          form.resetFields();
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const columns = [
    {
      title: "Bank Name",
      dataIndex: "bankName",
      key: "bankName",
    },
    {
      title: "Account Number",
      dataIndex: "accountNumber",
      key: "accountNumber",
    },
    {
      title: "Account Type",
      dataIndex: "accountType",
      key: "accountType",
    },
    {
      title: "Withdrawal Amount",
      dataIndex: "withdrawalAmount",
      key: "withdrawalAmount",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <button
          className={`${getStatusClass(
            text
          )} w-20 text-center text-xs py-1 rounded-lg`}
        >
          {capitalizeFirstLetter(text)}
        </button>
      ),
    },
  ];

  const tableData = data?.data?.attributes?.map((item, index) => ({
    key: index,
    bankName: item.bankName,
    accountNumber: item.accountNumber,
    accountType: item.accountType,
    withdrawalAmount: `$${item.withdrawalAmount}`,
    status: item.status,
  }));

  const defaultBankOptions = australiaBank.slice(0, 6);

  return (
    <div className="container py-10">
      <div>
        <h1 className="text-3xl font-bold">Earnings</h1>
        <p className="mt-5">Overview of your earnings</p>
        <hr />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 py-5">
        <div>
          <h1 className="text-base pl-1 text-textGray font-bold py-3">
            Total Balance
          </h1>
          <div className="custom-box-shadow rounded-xl flex flex-col justify-between p-[30px]">
            <div>
              <p className="text-sm text-textGray">Balance available for use</p>
              <p className="text-4xl mt-3 font-bold">
                ${availableBalance?.toFixed(2)}
              </p>
            </div>
            <div>
              <button
                onClick={() => setOpenModal(true)}
                className="mt-10 justify-center items-center mx-auto cursor-pointer ring-1 ring-primary py-1 px-5 rounded text-center text-white hover:bg-transparent bg-primary hover:text-primary transition duration-300"
              >
                Withdraw balance
              </button>
            </div>
          </div>
        </div>

        <div>
          <h1 className="text-base pl-1 text-textGray font-bold py-3">
            Active Payments
          </h1>
          <div className="custom-box-shadow rounded-xl p-[30px]">
            <div className="border-b-textGray">
              <p className="text-sm text-textGray">Payments for active order</p>
              <p className="text-4xl my-3 font-bold">$00.00</p>
            </div>
          </div>
        </div>

        <div>
          <h1 className="text-base pl-1 text-textGray font-bold py-3">
            Earnings
          </h1>
          <div className="custom-box-shadow rounded-xl flex flex-col justify-between p-[30px]">
            <div className="border-b-textGray">
              <p className="text-sm text-textGray">Earnings to date</p>
              <p className="text-4xl my-3 font-bold">${totalIncome}</p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="w-full col-span-2 mt-10">
          <h1 className="text-xl font-bold">Withdrawal History</h1>
          <Table
            loading={isFetching}
            pagination={true}
            columns={columns}
            dataSource={tableData}
            scroll={{ x: true }}
          />
        </div>
      </div>
      <Modal
        centered
        open={openModal}
        footer={null}
        onCancel={() => setOpenModal(false)}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="bankName"
            label="Bank Name"
            rules={[{ required: true, message: "Please select your bank" }]}
          >
            <Select placeholder="Select your bank name">
              {australiaBank.map((bank) => (
                <Select.Option key={bank.value} value={bank.value}>
                  {bank.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="accountNumber"
            label="Account Number"
            rules={[
              { required: true, message: "Please enter your account number" },
            ]}
          >
            <Input
              type="number"
              placeholder="Enter your account number"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            name="accountType"
            label="Account Type"
            rules={[{ required: true, message: "Please select account type" }]}
          >
            <Select placeholder="Select account type">
              {accountTypes.map((type) => (
                <Select.Option key={type.value} value={type.value}>
                  {type.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="withdrawalAmount"
            label="Withdrawal Amount"
            rules={[
              { required: true, message: "Please enter withdrawal amount" },
            ]}
          >
            <Input
              type="number"
              placeholder="Enter your amount"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item>
            <button
              type="submit"
              className="justify-center items-center mx-auto cursor-pointer ring-1 ring-primary py-1 px-5 rounded text-center text-white hover:bg-transparent bg-primary hover:text-primary transition duration-300"
            >
              {isLoading ? "Processing..." : "Submit"}
            </button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Earnings;
