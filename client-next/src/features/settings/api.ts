import { api } from "@/lib/axios";

export const settingsApi = {
  getSettings: async () => {
    const response = await api.get("/system-settings");
    return response.data;
  },

  updateSettings: async (settings: any) => {
    const response = await api.put("/system-settings", settings);
    return response.data;
  },
};
