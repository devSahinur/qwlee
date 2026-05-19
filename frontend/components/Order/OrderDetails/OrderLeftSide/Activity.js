"use client";
// Order activity / chat thread. Renders messages in alternating bubbles
// like Fiverr's order chat — own messages right-aligned in emerald, the
// other party's left-aligned in white. Special-cases delivery messages
// (own bubble + "Accept delivery" CTA for the buyer).

import { useEffect, useMemo, useRef, useState } from "react";
import { Image as AntdImage } from "antd";
import { toast } from "sonner";
import { FaXmark } from "react-icons/fa6";
import { IoSend, IoAttach, IoCheckmarkDone } from "react-icons/io5";

import {
  useGetOrderMessageQuery,
  useSendOrderMessageMutation,
} from "@/app/redux/features/orderMessage/orderMessage.api";
import { useUpdateBuyerOrderStatusMutation } from "@/app/redux/features/order/buyerOrderApi";
import { useSocket } from "@/components/Context/SocketProvider";
import useUser from "@/hooks/useUser";
import formatTimestampMessage from "@/utils/formatTimestamp";
import { getImageUrl } from "@/utils/getImageUrl";
import Avatar from "@/components/common/Avatar";

export default function Activity({ order, orderId }) {
  const user = useUser();
  const { socket } = useSocket();
  const { data: messagesData } = useGetOrderMessageQuery(orderId, {
    skip: !orderId,
  });
  const [sendOrderMessage, { isLoading: sending }] = useSendOrderMessageMutation();
  const [updateOrder] = useUpdateBuyerOrderStatusMutation();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [attachments, setAttachments] = useState([]);
  const bottomRef = useRef(null);

  const myId = String(user?.id || user?._id || "");
  const isSeller = !!user && String(order?.freelancerId?.id || order?.freelancerId?._id) === myId;
  const counterpartyId = isSeller
    ? order?.clientId?.id || order?.clientId?._id
    : order?.freelancerId?.id || order?.freelancerId?._id;

  useEffect(() => {
    if (messagesData?.attributes?.data) {
      setMessages(messagesData.attributes.data);
    }
  }, [messagesData]);

  useEffect(() => {
    if (!socket) return;
    const handler = (msg) => {
      if (msg?.orderId === orderId) setMessages((prev) => [...prev, msg]);
    };
    socket.on("new-order-message", handler);
    return () => socket.off("new-order-message", handler);
  }, [socket, orderId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [messages.length]);

  const orderStarted = useMemo(() => {
    const buyerName = order?.clientId?.fullName || order?.clientId?.username || "The buyer";
    return `${buyerName} placed this order. Requirements have been shared — let’s get started.`;
  }, [order]);

  function handleFile(e) {
    const files = Array.from(e.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
    e.target.value = ""; // allow re-selecting the same file
  }
  function removeAttachment(i) {
    setAttachments((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSend() {
    if (!newMessage.trim() && attachments.length === 0) return;
    if (!counterpartyId) {
      toast.error("Missing recipient — refresh and try again.");
      return;
    }
    const formData = new FormData();
    formData.append("orderId", orderId);
    formData.append("message", newMessage);
    formData.append("receiver", counterpartyId);
    attachments.forEach((f) => formData.append("files", f));
    const res = await sendOrderMessage(formData);
    if (res.error) {
      toast.error(res.error?.data?.message || "Could not send");
      return;
    }
    setNewMessage("");
    setAttachments([]);
  }

  async function handleAcceptDelivery() {
    const res = await updateOrder({ orderId, status: "delivered" });
    if (res.error) toast.error(res.error?.data?.message || "Could not accept");
    else toast.success("Delivery accepted");
  }

  return (
    <div className="flex flex-col">
      <div className="px-5 py-3 bg-emerald-50/60 border-b border-emerald-100 text-sm text-emerald-800">
        <span className="font-semibold">Order started.</span> {orderStarted}
      </div>

      <div className="px-5 py-5 space-y-4 max-h-[520px] overflow-y-auto">
        {messages.length === 0 && (
          <div className="text-sm text-gray-500 text-center py-6">
            No activity yet — say hi to get started.
          </div>
        )}
        {messages.map((m) => {
          const mine = String(m?.sender?._id || m?.sender?.id) === myId;
          return (
            <MessageBubble
              key={m._id || m.id}
              message={m}
              mine={mine}
              isSeller={isSeller}
              orderStatus={order?.status}
              onAcceptDelivery={handleAcceptDelivery}
            />
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      <div className="border-t border-gray-100 px-5 py-4 bg-gray-50/40">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Write a message…"
          rows={3}
          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:border-emerald-500 text-sm resize-none"
        />
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {attachments.map((file, i) => (
              <AttachmentPreview key={i} file={file} onRemove={() => removeAttachment(i)} />
            ))}
          </div>
        )}
        <div className="flex items-center justify-between mt-3">
          <label
            htmlFor="order-msg-attach"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 border border-gray-200 rounded-lg cursor-pointer hover:bg-white"
          >
            <IoAttach />
            Attach files
          </label>
          <input id="order-msg-attach" type="file" multiple className="hidden" onChange={handleFile} />
          <button
            type="button"
            onClick={handleSend}
            disabled={sending || (!newMessage.trim() && attachments.length === 0)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
          >
            <IoSend />
            {sending ? "Sending…" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message, mine, isSeller, orderStatus, onAcceptDelivery }) {
  const sender = message?.sender || {};
  const stamp = formatTimestampMessage(message?.createdAt);
  const content = message?.content || {};
  const messageType = content?.messageType;
  const text = content?.message;
  const files = Array.isArray(content?.files) ? content.files : [];
  const delivery = content?.deliveryDetails;
  const isDelivery = messageType === "deliveryMessage" || (delivery && delivery.message);

  return (
    <div className={`flex gap-2.5 ${mine ? "flex-row-reverse" : ""}`}>
      <Avatar src={sender?.image} name={sender?.fullName} size={32} rounded />
      <div className={`max-w-[80%] ${mine ? "items-end" : "items-start"} flex flex-col`}>
        <div className={`flex items-center gap-2 text-xs text-gray-500 mb-1 ${mine ? "flex-row-reverse" : ""}`}>
          <span className="font-medium text-gray-800">
            {mine ? "You" : sender?.fullName || "Member"}
          </span>
          <span>·</span>
          <span>{stamp}</span>
        </div>
        {isDelivery ? (
          <DeliveryCard
            delivery={delivery}
            mine={mine}
            isSeller={isSeller}
            orderStatus={orderStatus}
            onAcceptDelivery={onAcceptDelivery}
          />
        ) : (
          <div
            className={`px-3.5 py-2.5 rounded-2xl text-sm whitespace-pre-line ${
              mine
                ? "bg-emerald-600 text-white rounded-tr-sm"
                : "bg-gray-100 text-gray-900 rounded-tl-sm"
            }`}
          >
            {text}
            {files.length > 0 && <FilesGrid files={files} mine={mine} />}
          </div>
        )}
      </div>
    </div>
  );
}

function DeliveryCard({ delivery, mine, isSeller, orderStatus, onAcceptDelivery }) {
  const accepted = orderStatus === "delivered";
  return (
    <div
      className={`rounded-2xl border p-4 max-w-md ${
        mine ? "bg-emerald-50/40 border-emerald-100" : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
          Delivery
        </span>
        {accepted && (
          <span className="text-[10px] font-semibold uppercase tracking-wide text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
            <IoCheckmarkDone /> Accepted
          </span>
        )}
      </div>
      <p className="text-sm text-gray-800 whitespace-pre-line">{delivery?.message}</p>
      {Array.isArray(delivery?.files) && delivery.files.length > 0 && (
        <FilesGrid files={delivery.files} />
      )}
      {!isSeller && (
        <button
          type="button"
          onClick={onAcceptDelivery}
          disabled={accepted}
          className="mt-3 inline-flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-500"
        >
          {accepted ? "Delivery accepted" : "Accept delivery"}
        </button>
      )}
    </div>
  );
}

function FilesGrid({ files, mine }) {
  return (
    <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
      {files.map((file, i) => {
        const url = getImageUrl(file?.path) || file?.path;
        const isImage = file?.fileType === "image" || /\.(png|jpe?g|webp|gif|avif)$/i.test(file?.path || "");
        if (isImage && url) {
          return (
            <AntdImage
              key={i}
              src={url}
              alt={`Attachment ${i + 1}`}
              className="w-full h-24 object-cover rounded-md border"
            />
          );
        }
        return (
          <a
            key={i}
            href={url || "#"}
            target="_blank"
            rel="noreferrer"
            className={`block px-3 py-3 rounded-md text-xs font-medium border text-center ${
              mine ? "bg-white text-emerald-700 border-emerald-100" : "bg-gray-50 text-gray-700 border-gray-200"
            }`}
          >
            {file?.fileType?.toUpperCase() || "FILE"}
          </a>
        );
      })}
    </div>
  );
}

function AttachmentPreview({ file, onRemove }) {
  const isImage = file?.type?.startsWith("image/");
  return (
    <div className="relative w-20 h-20 rounded-md overflow-hidden border border-gray-200 bg-white">
      {isImage ? (
        <AntdImage
          src={URL.createObjectURL(file)}
          alt={file?.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-[10px] text-gray-600">
          <span className="font-semibold">FILE</span>
          <span className="truncate w-full text-center px-1">{file?.name}</span>
        </div>
      )}
      <button
        type="button"
        onClick={onRemove}
        className="absolute -top-1 -right-1 bg-white border border-gray-200 text-rose-600 rounded-full p-1 shadow"
        aria-label="Remove"
      >
        <FaXmark className="w-3 h-3" />
      </button>
    </div>
  );
}
