export const REPORT_STATUS = ["pending", "investigating", "rejected", "resolved"] as const;
export type ReportStatus = (typeof REPORT_STATUS)[number];
