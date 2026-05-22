"use client";

import dynamic from "next/dynamic";

const ChatWidget = dynamic(
  () =>
    import("@/features/chat/components/customer/ChatWidget").then(
      (mod) => mod.ChatWidget
    ),
  { ssr: false }
);

export function CustomerChatWidget() {
  return <ChatWidget />;
}
