import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng nhập — Minh Tuấn Store",
  description: "Đăng nhập vào tài khoản của bạn để trải nghiệm mua sắm tuyệt vời nhất.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
