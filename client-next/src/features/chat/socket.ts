"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";
import { useAuthStore } from "@/store/useAuthStore";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ||
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
  "http://localhost:5000";

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    // Token might be null if HttpOnly cookie is used, but io will send cookies if withCredentials is true
    console.log("Socket Hook - Token found in store:", !!accessToken);

    const SOCKET_URL =
      process.env.NEXT_PUBLIC_SOCKET_URL ||
      process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
      "http://localhost:5000";
    console.log("Socket Hook - Connecting to:", SOCKET_URL);

    const socketInstance = io(SOCKET_URL, {
      auth: { token: accessToken },
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      autoConnect: true,
    });

    socketInstance.on("connect", () => {
      setIsConnected(true);
      console.log("Socket Hook - Connected successfully ID:", socketInstance.id);
    });

    socketInstance.on("connect_error", (err) => {
      console.error("Socket Hook - Connection error:", err.message);
    });

    socketInstance.on("disconnect", (reason) => {
      setIsConnected(false);
      console.log("Socket Hook - Disconnected:", reason);
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
