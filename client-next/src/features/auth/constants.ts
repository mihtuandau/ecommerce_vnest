/**
 * Auth Module Constants
 */

export const AUTH_CONSTANTS = {
  // API URL should be constructed from environment variables in axios.ts
  GOOGLE_AUTH_ENDPOINT: "/auth/google",
  CACHE_BUST_PARAM: "_t",
} as const;

export const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
  VERIFY_2FA: "/auth/verify-2fa",
  GOOGLE: "/auth/google",
  REFRESH_TOKEN: "/auth/refresh",
} as const;

export const AUTH_MESSAGES = {
  // Login/Register Messages
  LOGIN_SUCCESS: "Đăng nhập thành công!",
  LOGIN_REQUIRED_2FA: "Vui lòng nhập mã xác thực từ email",
  INVALID_CREDENTIALS: "Email hoặc mật khẩu không chính xác",
  INVALID_2FA_CODE: "Mã xác thực không chính xác",
  INVALID_2FA_LENGTH: "Vui lòng nhập đủ 6 chữ số",
  REGISTER_SUCCESS: "Đăng ký thành công! Vui lòng đăng nhập.",
  REGISTER_ERROR: "Email đã tồn tại hoặc dữ liệu không hợp lệ",
  REGISTER_ERROR_GENERIC: "Lỗi đăng ký",

  // Form Validation Messages
  EMAIL_REQUIRED: "Vui lòng nhập email",
  PASSWORD_REQUIRED: "Vui lòng nhập mật khẩu",
  NAME_REQUIRED: "Vui lòng nhập họ tên",
  PHONE_REQUIRED: "Vui lòng nhập số điện thoại",
  PASSWORD_MISMATCH: "Mật khẩu xác nhận không khớp",

  // UI Labels - Login/Register Form
  REMEMBER_LOGIN: "Ghi nhớ đăng nhập",
  PROCESSING: "Đang xử lý...",
  LOGIN_BUTTON: "Đăng nhập ngay",
  REGISTER_BUTTON: "Đăng ký ngay",
  REGISTER_LINK: "Đăng ký ngay",
  FORGOT_PASSWORD: "Quên mật khẩu?",
  OR_DIVIDER: "Hoặc",
  GOOGLE_LOGIN: "Google",
  FACEBOOK_LOGIN: "Facebook",
  ALREADY_HAVE_ACCOUNT: "Chưa có tài khoản?",
  ALREADY_HAVE_ACCOUNT_LOGIN: "Đã có tài khoản?",

  // Form Labels
  EMAIL: "Email",
  PASSWORD: "Mật khẩu",
  CONFIRM_PASSWORD: "Xác nhận mật khẩu",
  FULL_NAME: "Họ và tên",
  PHONE: "Số điện thoại",

  // 2FA Labels
  OTP_LABEL: "Mã xác thực 6 chữ số",
  OTP_PLACEHOLDER: "000000",
  VERIFY_2FA_BUTTON: "Xác nhận đăng nhập",
  BACK_TO_LOGIN: "Quay lại đăng nhập",

  // Page Titles
  LOGIN_TITLE: "Chào mừng!",
  REGISTER_TITLE: "Tạo tài khoản",
  TWO_FA_TITLE: "Xác thực 2 lớp",

  // Page Descriptions
  LOGIN_DESC: "Đăng nhập để tiếp tục mua sắm",
  REGISTER_DESC: "Đăng ký để bắt đầu mua sắm",

  // Dynamic Messages
  CONFIRM_MESSAGE: (email: string) => `Nhập mã 6 chữ số đã gửi tới ${email}`,
} as const;

export const AUTH_STEPS = {
  LOGIN: "login",
  TWO_FA: "2fa",
} as const;
