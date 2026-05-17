import { useQuery } from "@tanstack/react-query";
import { logsApi, GetLogsParams } from "../api";

export const useAuditLogs = (params: GetLogsParams = {}) => {
  return useQuery({
    queryKey: ["audit-logs", params],
    queryFn: () => logsApi.getLogs(params),
  });
};
