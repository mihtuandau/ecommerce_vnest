import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tài khoản của tôi — LUXE",
  description: "Quản lý thông tin cá nhân, địa chỉ và bảo mật tài khoản của bạn.",
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
