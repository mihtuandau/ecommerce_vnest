import { AdminChatView } from "@/features/chat/views/admin/AdminChatView";

export default function AdminChatPage() {
  return (
    <div className="h-[calc(100vh-120px)] -m-6 flex overflow-hidden">
      <AdminChatView />
    </div>
  );
}
