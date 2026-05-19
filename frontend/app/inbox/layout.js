'use client'
import PrimaryLayout from "@/components/Layout/PrimaryLayout";
import Chat from "@/components/Inbox/Chat/Chat";
import { useSelector } from "react-redux";

const InboxLayout = ({ children }) => {
  const {isOpen} = useSelector(state=>state.userToChat)
  return (
    <PrimaryLayout isFooterAdd={true}>
      <div className="w-full grid grid-cols-1 md:grid-cols-12 p-2 gap-4 md:container">
        {/* Mobile will show the chat below, while tablet/desktop has a two-column layout */}
        <div className={`w-full col-span-full md:col-span-4 ${isOpen ? "hidden" : "block"} md:block`}>
          <Chat />
        </div>
        <div className={`w-full col-span-full md:col-span-8 ${isOpen ? "block" : "hidden"} md:block`}>
          {children}
        </div>
      </div>
    </PrimaryLayout>
  );
};

export default InboxLayout;
