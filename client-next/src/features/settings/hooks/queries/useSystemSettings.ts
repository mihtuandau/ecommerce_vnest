import { useQuery } from "@tanstack/react-query";
import { settingsApi } from "@/features/settings/api/index";

export const settingsQueryKeys = {
  systemSettings: ["system-settings"] as const,
};

export const useSystemSettings = () => {
  return useQuery({
    queryKey: settingsQueryKeys.systemSettings,
    queryFn: () => settingsApi.getSettings(),
  });
};
