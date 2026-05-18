export function getSessionStatus(startDate: string, endDate?: string) {
  const now = new Date();
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;
  if (start > now) return "SOON";
  if (end && end < now) return "ENDED";
  return "LIVE";
}

export function formatTimeRange(startDate: string, endDate?: string) {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;
  const startStr = start.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endStr = end
    ? end.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
    : "22:00";
  return `${startStr} – ${endStr}`;
}

export const CAT_ICONS: Record<string, string> = {
  "Đầm & Váy": "👗",
  "Giày dép": "👟",
  "Túi xách": "👜",
  "Áo khoác": "🧥",
  "Mỹ phẩm": "💄",
  "Phụ kiện": "⌚",
  "Áo": "👕",
  "Quần": "👖",
  "Tất cả": "🔥",
};

export function pad(n: number) {
  return String(n).padStart(2, "0");
}
