import { AdminNotificationsView } from "@/features/notifications/views/admin/AdminNotificationsView";

export const metadata = {
  title: "Thông báo hệ thống - Admin LUXE",
  description: "Quản lý và xem các thông báo hệ thống và đơn hàng",
};

export default function AdminNotificationsPage() {
  return <AdminNotificationsView />;
}
