import { useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsApi } from "@/features/settings/api/index";
import type { SystemSettings } from "@/features/settings/types";
import { settingsQueryKeys } from "@/features/settings/hooks/queries";

export const useUpdateSystemSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings: SystemSettings) => settingsApi.updateSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsQueryKeys.systemSettings });
    },
  });
};
