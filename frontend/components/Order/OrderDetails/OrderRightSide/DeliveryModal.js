"use client";
import { useState } from "react";
import { Image, Modal } from "antd";
import { FaXmark } from "react-icons/fa6";

const DeliverNowModal = ({ isOpen, onClose, onSubmit }) => {
  const [deliveryComment, setDeliveryComment] = useState("");
  const [attachments, setAttachments] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments((prevAttachments) => [...prevAttachments, ...files]);
  };

  const handleRemoveAttachment = (index) => {
    setAttachments((prevAttachments) =>
      prevAttachments.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const deliveryData = {
      deliveryMessage: deliveryComment,
      files: attachments,
    };
    onSubmit(deliveryData);
    onClose();
    setDeliveryComment("");
    setAttachments([]);
  };

  const renderFilePreview = (file) => {
    const fileType = file.type.split("/")[0];

    if (fileType === "image") {
      return (
        <Image
          src={URL.createObjectURL(file)}
          alt="Attachment"
          width={96}
          height={96}
          objectFit="cover"
          className="rounded-lg"
        />
      );
    } else if (file.type === "application/pdf") {
      return (
        <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-600">
          PDF
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-600">
          Attachment
        </div>
      );
    }
  };

  return (
    <Modal
      width={700}
      title={<span className="text-xl font-semibold">Deliver Your Work</span>}
      open={isOpen}
      onCancel={onClose}
      centered
      footer={null}
    >
      <form onSubmit={handleSubmit}>
        <textarea
          onChange={(e) => setDeliveryComment(e.target.value)}
          rows={7}
          value={deliveryComment}
          placeholder="Describe your delivery work"
          className="w-full rounded border outline-none p-3 resize-none"
        ></textarea>

        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 p-2">
            {attachments.map((file, index) => (
              <div
                key={index}
                className="relative w-24 h-24 border border-gray-300 rounded-lg "
              >
                {renderFilePreview(file)}
                <button
                  type="button"
                  className="absolute -top-1 z-30 -right-1 bg-slate-200 text-red-500 rounded-full p-1"
                  onClick={() => handleRemoveAttachment(index)}
                >
                  <FaXmark className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-start gap-5 my-3">
          <label className="px-5 py-2 bg-gray-200 rounded cursor-pointer">
            Upload work
            <input
              type="file"
              className="hidden"
              multiple
              accept="image/*, application/pdf, .docx, .zip"
              onChange={handleFileChange}
            />
          </label>
          <label className="px-5 py-2 bg-gray-200 rounded cursor-pointer">
            Upload source files
            <input
              type="file"
              className="hidden"
              multiple
              accept="image/*, application/pdf, .docx, .zip"
              onChange={handleFileChange}
            />
          </label>
        </div>
        <div className="flex justify-end gap-5 mt-10">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-[#00BF63] rounded text-white"
          >
            Deliver
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default DeliverNowModal;
