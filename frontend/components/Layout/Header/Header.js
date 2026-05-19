// Header.js
"use client";
import useUser from "@/hooks/useUser"; // Custom hook to get user info
import { usePathname } from "next/navigation"; // Hook to get the current pathname
import { useSocket } from "@/components/Context/SocketProvider"; // Custom hook for socket context
import { useEffect } from "react";
import SecondaryNavbar from "./SecondaryNavbar";
import { Navbar } from "./Navbar";

const Header = () => {
  const user = useUser(); // Get the current user
  const { socket } = useSocket(); // Get the socket instance from context
  const pathname = usePathname(); // Get the current path

  // Define paths where SecondaryNavbar should not be shown
  const pathsToExclude = ["/sign-in", "/sign-up"];
  const showSecondaryNavbar = !pathsToExclude.includes(pathname);

  useEffect(() => {
    if (user && user.id) {
      // Emit 'user/connect' event when the user is logged in or connected
      socket.emit("user/connect", { userId: user.id });

      // Emit 'user/disconnect' event when the component unmounts
      return () => {
        socket.emit("user/disconnect", { userId: user.id });
      };
    }
  }, [socket, user]);

  return (
    <div>
      <Navbar />
      {showSecondaryNavbar && <SecondaryNavbar />}
    </div>
  );
};

export default Header;
