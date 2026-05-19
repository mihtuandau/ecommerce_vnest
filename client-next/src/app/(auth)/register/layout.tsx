import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng ký tài khoản — LUXE",
  description: "Tạo tài khoản mới để nhận nhiều ưu đãi và trải nghiệm mua sắm tốt nhất.",
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
