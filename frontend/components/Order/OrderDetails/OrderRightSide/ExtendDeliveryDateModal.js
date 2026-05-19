"use client";
import { useState } from "react";
import { Modal, DatePicker, message } from "antd";
import moment from "moment";
import { FaArrowRight } from "react-icons/fa6";

const ExtendDeliveryDateModal = ({
  isOpen,
  onClose,
  onSubmit,
  originalDeliveryDate,
}) => {
  const [newDeliveryDate, setNewDeliveryDate] = useState(null);
  const [extensionReason, setExtensionReason] = useState("");

  const originalDate = moment(originalDeliveryDate);
  const minDate = originalDate;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newDeliveryDate || !newDeliveryDate.isAfter(originalDate)) {
      message.error("The new delivery date must be after the original date.");
      return;
    }

    const formattedDate = newDeliveryDate.format("D MMMM YYYY");
    const reasonData = {
      newDeliveryDate: formattedDate,
      extensionReason,
    };

    onSubmit(reasonData);
    onClose();
    setNewDeliveryDate(null);
    setExtensionReason("");
  };

  return (
    <Modal
      width={700}
      title={
        <span className="text-2xl font-semibold">
          Request: Extend Delivery Date
        </span>
      }
      open={isOpen}
      onCancel={onClose}
      centered
      footer={null}
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-2 mt-5">
          <h1 className="font-semibold text-lg">
            How many days do you want to add to the original date?
          </h1>
          <DatePicker
            value={newDeliveryDate}
            onChange={(date) => setNewDeliveryDate(date)}
            disabledDate={(current) =>
              current && current.isBefore(minDate, "day")
            }
            format="D MMMM YYYY"
          />
        </div>
        <div className="my-5 flex items-center gap-16">
          <div>
            <h1 className="font-semibold text-lg">Original Date</h1>
            <span className="font-semibold">
              {moment(originalDeliveryDate).format("D MMMM YYYY")}
            </span>
          </div>
          {newDeliveryDate && (
            <>
              <FaArrowRight />
              <div>
                <h1 className="font-semibold text-lg">New Date</h1>
                <span className="font-semibold">
                  {newDeliveryDate?.format("D MMMM YYYY")}
                </span>
              </div>
            </>
          )}
        </div>
        <div>
          <h1 className="font-semibold text-lg">Reason for Extension</h1>
          <textarea
            rows={5}
            onChange={(e) => setExtensionReason(e.target.value)}
            placeholder="Describe the reason for extension"
            className="w-full rounded border outline-none p-3 resize-none"
          />
        </div>
        <div className="flex justify-end gap-5 mt-10">
          <div
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 rounded cursor-pointer"
          >
            Cancel
          </div>
          <button
            type="submit"
            className="px-5 py-2 bg-[#00BF63] rounded text-white"
          >
            Request
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ExtendDeliveryDateModal;
