import { useQuery } from "@tanstack/react-query";
import { logsApi, type GetLogsParams } from "@/features/logs/api";

export const useAuditLogs = (params: GetLogsParams = {}) => {
  return useQuery({
    queryKey: ["audit-logs", params],
    queryFn: () => logsApi.getLogs(params),
  });
};
