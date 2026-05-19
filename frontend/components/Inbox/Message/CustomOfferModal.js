import React from "react";
import { Modal, Input, Checkbox, Form } from "antd";
import Image from "next/image";
import { imageBaseUrl, imgUrl} from "@/lib/constant";
import CustomDropdown from "./CustomDropdown";

const CustomOfferModal = ({ isOpen, gig, onClose, handleSubmitOffer }) => {
  const [form] = Form.useForm();

  const handleCheckboxChange = (e) => {
    form.setFieldsValue({ isExpirationTime: e.target.checked });
  };

  const handleOnFinish = (values) => {
    handleSubmitOffer(values);
    form.resetFields();
  };

  return (
    <Modal
      title={<h1 className="text-xl font-bold">Create a Custom Offer</h1>}
      open={isOpen}
      onCancel={onClose}
      width={700}
      centered
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleOnFinish}
        initialValues={{
          isExpirationTime: false, // Initial value for the checkbox
          expiration: "1",
        }}
        className="space-y-3 mt-4"
      >
        <h4 className="text-xl font-medium">{gig?.title}</h4>
        <div className="flex gap-4 items-start">
          <div className="w-72 h-40 relative">
            <Image
              src={imgUrl(gig?.images[0])}
              fill
              className="rounded absolute"
              alt="gig-image"
            />
          </div>
          <Form.Item
            name="description"
            rules={[{ required: true, message: "Please describe your offer!" }]}
            className="w-full"
          >
            <Input.TextArea rows={6} placeholder="Describe Your Offer" />
          </Form.Item>
        </div>

        <div className="flex justify-between items-center gap-4 bg-gray-100 p-4 rounded">
          <Form.Item
            name="revisionDays"
            label="Revision Days"
            className="w-full"
          >
            <CustomDropdown
              placeholder="Select or add Revision Days"
              initialItems={["1", "2", "3", "4", "unlimited"]}
            />
          </Form.Item>

          <Form.Item
            name="deliveryTime"
            label="Delivery Days"
            rules={[
              { required: true, message: "Please select delivery days!" },
            ]}
            className="w-full"
          >
            <CustomDropdown
              placeholder="Select or add Delivery Days"
              initialItems={["1", "4", "7", "10"]}
            />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please enter a price!" }]}
            className="w-full"
          >
            <Input
              type="number"
              placeholder="Enter your price"
              min={0}
              addonBefore={<span>$</span>}
            />
          </Form.Item>
        </div>

        <div className="flex justify-between gap-4 items-center bg-gray-100 p-4 rounded">
          <Form.Item
            name="isExpirationTime"
            valuePropName="checked" // Binds the checked value to the form
          >
            <Checkbox onChange={handleCheckboxChange} className="w-full">
              Offer Expire Time
            </Checkbox>
          </Form.Item>

          <Form.Item name="expiration" className="w-48">
            <CustomDropdown
              placeholder="Select or add Expire Time"
              initialItems={["1", "2", "3", "4"]}
            />
          </Form.Item>
        </div>

        <div className="flex justify-end gap-2">
          <div
            className="px-5 py-1 border border-green-500 rounded bg-white cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </div>
          <button
            className="px-5 py-1 border border-green-500 rounded bg-green-500 text-white"
            type="submit"
          >
            Submit Offer
          </button>
        </div>
      </Form>
    </Modal>
  );
};

export default CustomOfferModal;
