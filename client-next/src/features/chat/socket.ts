"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { CHAT_SOCKET_CONSTANTS, CHAT_SOCKET_TRANSPORTS } from "./constants";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ||
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
  "http://localhost:5000";

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    // Check tokens from store or cookie fallback
    let currentToken = accessToken;
    if (!currentToken) {
      currentToken = Cookies.get("accessToken") || Cookies.get("access_token") || null;
    }

    const socketInstance = io(SOCKET_URL, {
      auth: { token: currentToken },
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: CHAT_SOCKET_CONSTANTS.RECONNECTION_ATTEMPTS,
      reconnectionDelay: CHAT_SOCKET_CONSTANTS.RECONNECTION_DELAY,
      autoConnect: true,
      transports: CHAT_SOCKET_TRANSPORTS,
    });

    socketInstance.on("connect", () => {
      setIsConnected(true);
    });

    socketInstance.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [accessToken]);

  return {
    socket,
    isConnected,
  };
};
