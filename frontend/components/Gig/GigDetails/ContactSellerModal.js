"use client";
// Fiverr-style "Contact seller" dialog.
//
// One entry point used by both the right-rail "Contact seller" link in
// GigPackagePicker and the inline button in AboutCard. The host
// component owns the trigger UI; this component only owns the modal.
//
//   <ContactSellerModal
//     open={open}
//     onClose={() => setOpen(false)}
//     seller={gig?.userId}
//     gig={gig}
//   />
//
// On submit:
//   - calls POST /message/add-message with `receiver = sellerId`
//   - reads the freshly-created chat id from the response
//   - routes to /inbox/<chatId>?ref=<gigId> so the inbox composer can
//     show the "Referencing gig" banner.

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "antd";
import { toast } from "sonner";
import { IoChatbubbleEllipsesOutline, IoStar } from "react-icons/io5";

import useUser from "@/hooks/useUser";
import { useAddMessageMutation } from "@/app/redux/features/inbox/inboxApi";
import Avatar from "@/components/common/Avatar";

export default function ContactSellerModal({ open, onClose, seller, gig }) {
  const user = useUser();
  const router = useRouter();
  const [addMessage, { isLoading }] = useAddMessageMutation();
  const [text, setText] = useState("");

  useEffect(() => {
    if (!open) return;
    // The gig card itself rides along on the message — keep the text
    // intro short. Sender can edit before hitting send.
    setText(
      `Hi ${seller?.fullName?.split(" ")[0] || "there"}! I have a project in mind related to your gig — would you have time to chat?`
    );
  }, [open, seller?.fullName]);

  async function handleSend(e) {
    e.preventDefault();
    if (!user) {
      router.push(
        `/sign-in?from=${encodeURIComponent(`/gig/${gig?.slug || gig?._id || ""}`)}`
      );
      return;
    }
    const message = text.trim();
    if (!message) {
      toast.warning("Write a message first");
      return;
    }
    const form = new FormData();
    form.append("receiver", seller?.id || seller?._id);
    form.append("message", message);
    // Snapshot the gig so the chat bubble can render a Fiverr-style
    // reference card (image / title / price / delivery) — survives the
    // seller later editing or removing the gig.
    if (gig?._id || gig?.id) {
      const cheapestPkg = Array.isArray(gig.package) && gig.package[0];
      form.append(
        "gigReference",
        JSON.stringify({
          gigId: gig._id || gig.id,
          title: gig.title,
          image: Array.isArray(gig.images) ? gig.images[0] : "",
          price: Number(cheapestPkg?.price || gig.price || 0),
          slug: gig.slug || "",
          deliveryDays: Number(cheapestPkg?.deliveryDate || 0),
        })
      );
    }
    const res = await addMessage(form);
    if (res?.error) {
      toast.error(res.error?.data?.message || "Couldn't send message");
      return;
    }
    const chatId = res?.data?.data?.attributes?.chat;
    toast.success("Message sent");
    const refQ = gig?._id ? `?ref=${gig._id}` : "";
    onClose?.();
    if (chatId) router.push(`/inbox/${chatId}${refQ}`);
    else router.push(`/inbox${refQ}`);
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={520}
      destroyOnClose
      title={null}
    >
      <div className="pt-1">
        <div className="flex items-center gap-3">
          <Avatar src={seller?.image} name={seller?.fullName} size={56} rounded />
          <div className="min-w-0">
            <div className="text-base font-semibold text-gray-900 truncate inline-flex items-center gap-1.5">
              {seller?.fullName || "Seller"}
              {seller?.online && (
                <span className="w-2 h-2 rounded-full bg-emerald-500" aria-label="Online" />
              )}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {seller?.intro || "Qwlee seller"}
            </div>
            {seller?.review?.total > 0 && (
              <div className="inline-flex items-center gap-1 text-xs mt-0.5">
                <IoStar className="text-amber-500" />
                <span className="font-medium text-gray-900">
                  {Number(seller.review.rating).toFixed(1)}
                </span>
                <span className="text-gray-500">({seller.review.total})</span>
              </div>
            )}
          </div>
        </div>

        {gig?.title && (
          <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-xs text-gray-600">
            <span className="text-gray-400">About: </span>
            <span className="text-gray-800 font-medium line-clamp-1">
              {gig.title}
            </span>
          </div>
        )}

        <form onSubmit={handleSend} className="mt-4">
          <label
            htmlFor="contact-seller-textarea"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Your message
          </label>
          <textarea
            id="contact-seller-textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            placeholder="Describe your project, timeline, and any references."
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-emerald-500 resize-none"
          />
          <p className="mt-1 text-xs text-gray-400">
            Avg. response time is usually under an hour.
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 disabled:opacity-50 transition"
          >
            <IoChatbubbleEllipsesOutline />
            {isLoading ? "Sending…" : "Send message"}
          </button>
        </form>
      </div>
    </Modal>
  );
}
