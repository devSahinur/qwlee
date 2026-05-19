"use client";
// Socket.IO client wrapper.
//
// IMPORTANT: the backend handshake middleware (io.use in
// socket/socketServer.js) reads `auth.token` to bind a verified userId.
// Without it, presence stays offline and io.to(userId).emit from the
// server never reaches the client (the socket never joined the userId
// room). So the access token MUST travel with the handshake.
//
// The token is recomputed every time the user signs in / out so a
// post-login socket carries the right identity. We tear down + recreate
// the connection on token change rather than mutate socket.auth on
// the fly (Socket.IO doesn't pick up auth changes mid-connection).

import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import Cookies from "js-cookie";
import { socketUrl } from "@/lib/constant";

export const SocketContext = createContext({ socket: null });

export const useSocket = () => useContext(SocketContext);

function getAccessToken() {
  if (typeof window === "undefined") return "";
  const raw = Cookies.get("accessToken");
  if (!raw) return "";
  return raw.replace(/^"(.*)"$/, "$1");
}

export const SocketProvider = ({ children }) => {
  const [token, setToken] = useState(() => getAccessToken());
  const [socket, setSocket] = useState(null);

  // Cookies has no event API — poll lightly so the socket reconnects
  // promptly after sign-in / sign-out.
  useEffect(() => {
    const interval = setInterval(() => {
      const next = getAccessToken();
      if (next !== token) setToken(next);
    }, 800);
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    const next = io(socketUrl, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      transports: ["websocket", "polling"],
      auth: token ? { token } : {},
    });
    next.on("connect", () => {
      // eslint-disable-next-line no-console
      console.log(`Socket connected: ${next.id}`);
    });
    next.on("disconnect", (reason) => {
      if (reason !== "io client disconnect") {
        // eslint-disable-next-line no-console
        console.log(`Socket disconnected: ${reason}`);
      }
    });
    setSocket(next);
    return () => {
      next.removeAllListeners();
      next.disconnect();
    };
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
