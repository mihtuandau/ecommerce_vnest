import { api } from "@/lib/axios";

export interface GetLogsParams {
  page?: number;
  limit?: number;
  action?: string;
  entityName?: string;
  userId?: number;
  search?: string;
}

export const logsApi = {
  getLogs: async (params: GetLogsParams = {}) => {
    const response = await api.get("/audit-logs", { params });
    return response.data;
  },
};
