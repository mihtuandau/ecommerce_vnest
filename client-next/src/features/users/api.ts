import { api } from "@/lib/axios";
import type { User, Address } from "@/types/models";
import type { PaginatedResponse } from "@/types/api";

export const usersApi = {
  getUsers: async (params?: Record<string, string | number>): Promise<User[]> => {
    const { data: body } = await api.get<{ data?: User[]; users?: User[] } | User[]>("/users", { params });
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

  createUser: async (userData: Partial<User>): Promise<User> => {
    const { data } = await api.post<User>("/users", userData);
    return data;
  },

  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    const { data } = await api.put<{ user?: User } | User>(`/users/${id}`, userData);
    return data.user || data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  getProfile: async (): Promise<User> => {
    const { data } = await api.get<{ user?: User } | User>("/users/profile");
    return data.user || data;
  },

  updateProfile: async (profileData: Partial<User>): Promise<User> => {
    const { data } = await api.put<{ user?: User } | User>("/users/profile", profileData);
    return data.user || data;
  },

  // ── Address management ──
  getAddresses: async (): Promise<{ addresses: Address[] }> => {
    const { data } = await api.get("/addresses");
    return data;
  },

  getAddress: async (id: string): Promise<{ address: Address }> => {
    const { data } = await api.get(`/addresses/${id}`);
    return data;
  },

  createAddress: async (addressData: Partial<Address>): Promise<{ address: Address }> => {
    const { data } = await api.post("/addresses", addressData);
    return data;
  },

  updateAddress: async (id: string, addressData: Partial<Address>): Promise<{ address: Address }> => {
    const { data } = await api.patch(`/addresses/${id}`, addressData);
    return data;
  },

  deleteAddress: async (id: string): Promise<void> => {
    await api.delete(`/addresses/${id}`);
  },

  setDefaultAddress: async (id: string): Promise<{ address: Address }> => {
    const { data } = await api.patch(`/addresses/${id}/set-default`);
    return data;
  },
};
