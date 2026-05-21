export const REPORT_TIME_RANGES = {
  THIRTY_DAYS: "30_days",
  THREE_MONTHS: "3_months",
  ONE_YEAR: "1_year",
} as const;

export const REPORT_TIME_RANGE_OPTIONS = [
  { label: "30 ngày", value: REPORT_TIME_RANGES.THIRTY_DAYS },
  { label: "3 tháng", value: REPORT_TIME_RANGES.THREE_MONTHS },
  { label: "1 năm", value: REPORT_TIME_RANGES.ONE_YEAR },
] as const;
