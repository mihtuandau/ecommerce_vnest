import { AdminLogsView } from "@/features/logs/views/admin/AdminLogsView";

export const metadata = {
  title: "Nhật ký hệ thống - Admin LUXE",
  description: "Nhật ký giám sát camera an ninh và hoạt động hệ thống",
};

export default function AdminLogsPage() {
  return <AdminLogsView />;
}
