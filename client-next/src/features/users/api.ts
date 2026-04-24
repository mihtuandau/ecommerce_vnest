import { api } from "@/lib/axios";
import type { User } from "@/types/models";
import type { PaginatedResponse } from "@/types/api";

export const usersApi = {
  getUsers: async (params?: Record<string, any>): Promise<User[]> => {
    const { data: body } = await api.get<any>("/users", { params });
    // Support various response formats
    if (Array.isArray(body)) return body;
    if (body?.data && Array.isArray(body.data)) return body.data;
    if (body?.users && Array.isArray(body.users)) return body.users;
    return [];
  },

  getUser: async (id: string): Promise<User> => {
    const { data } = await api.get<User>(`/users/${id}`);
    return data;
  },

  createUser: async (userData: any): Promise<User> => {
    const { data } = await api.post<User>("/users", userData);
    return data;
  },

  updateUser: async (id: string, userData: any): Promise<User> => {
    const { data } = await api.put<any>(`/users/${id}`, userData);
    return data.user || data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  getProfile: async (): Promise<User> => {
    const { data } = await api.get<any>("/users/profile");
    return data.user || data;
  },

  updateProfile: async (profileData: any): Promise<User> => {
    const { data } = await api.put<any>("/users/profile", profileData);
    return data.user || data;
  },
};
