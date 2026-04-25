"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || "http://localhost:5000";

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (!token) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      setIsConnected(true);
      console.log("Connected to Chat Socket");
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      console.log("Disconnected from Chat Socket");
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
  };
};
