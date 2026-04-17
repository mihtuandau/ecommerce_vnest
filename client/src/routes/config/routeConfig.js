export const DEFAULT_TITLE = "MINH TUAN STORE";

const routeMap = [
  [/^\/$/, "Trang chủ"], [/^\/login$/, "Đăng nhập"], [/^\/register$/, "Đăng ký"], 
  [/^\/forgot-password$/, "Quên mật khẩu"], [/^\/reset-password$/, "Đặt lại mật khẩu"],
  [/^\/products$/, "Tất cả sản phẩm"], [/^\/flash-sale$/, "Flash Sale"],
  [/^\/category\/\d+$/, "Danh mục sản phẩm"], [/^\/products\/\d+$/, "Chi tiết sản phẩm"],
  [/^\/cart$/, "Giỏ hàng"], [/^\/wishlist$/, "Yêu thích"], [/^\/checkout$/, "Thanh toán"],
  [/^\/orders$/, "Đơn hàng của tôi"], [/^\/orders\/\d+$/, "Chi tiết đơn hàng"],
  [/^\/order-lookup$/, "Tra cứu đơn hàng"], [/^\/guest-order\/.+$/, "Chi tiết đơn hàng"],
  [/^\/payment\/return$/, "Kết quả thanh toán"], [/^\/payment\/cancel$/, "Hủy thanh toán"],
  [/^\/about$/, "Giới thiệu"], [/^\/contact$/, "Liên hệ"], [/^\/support$/, "Hỗ trợ"],
  [/^\/(promotions|deals)$/, "Khuyến mãi"], [/^\/(profile|account)$/, "Tài khoản"],
  [/^\/admin-dashboard$/, "Admin Dashboard"], [/^\/admin-products$/, "Admin Products"],
  [/^\/admin-categories$/, "Admin Categories"], [/^\/admin-users$/, "Admin Users"],
  [/^\/admin-orders$/, "Admin Orders"], [/^\/admin-payments$/, "Admin Payments"],
  [/^\/admin-discounts$/, "Admin Discounts"], [/^\/admin-flash-sales$/, "Flash Sales"],
  [/^\/admin-banners$/, "Admin Banners"], [/^\/admin-chat$/, "Admin Chat"],
  [/^\/admin-reports$/, "Admin Reports"], [/^\/admin\/profile$/, "Admin Profile"]
];

export const getRouteTitle = (pathname) => {
  const match = routeMap.find(([pattern]) => pattern.test(pathname));
  return match ? `${match[1]} | ${DEFAULT_TITLE}` : DEFAULT_TITLE;
};
