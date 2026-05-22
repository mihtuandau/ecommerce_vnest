import { api } from "@/lib/http";
import type { SystemSettings } from "@/features/settings/types";

export const settingsApi = {
  getSettings: async () => {
    const response = await api.get("/system-settings");
    return response.data;
  },

  updateSettings: async (settings: SystemSettings) => {
    const response = await api.put("/system-settings", settings);
    return response.data;
  },
};
