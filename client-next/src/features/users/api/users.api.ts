import { api } from "@/lib/http";
import type { User, Address } from "@/types/models";
import type { PaginatedResponse } from "@/types/api";

export const usersApi = {
  getUsers: async (
    params?: Record<string, string | number>
  ): Promise<PaginatedResponse<User>> => {
    const { data: body } = await api.get<any>("/users", { params });

    const data = Array.isArray(body) ? body : body.data || body.users || [];
    const meta = {
      total: body.meta?.total || body.total || data.length,
      page: body.meta?.page || body.page || 1,
      limit: body.meta?.limit || body.limit || 10,
      totalPages: body.meta?.totalPages || body.totalPages || 1,
      hasNextPage: body.meta?.hasNextPage || false,
      hasPrevPage: body.meta?.hasPrevPage || false,
    };

    return { data, meta };
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

  updateProfile: async (profileData: Partial<User>): Promise<User> => {
    const { data } = await api.put<any>("/users/profile", profileData);
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

  createAddress: async (
    addressData: Partial<Address>
  ): Promise<{ address: Address }> => {
    const { data } = await api.post("/addresses", addressData);
    return data;
  },

  updateAddress: async (
    id: string,
    addressData: Partial<Address>
  ): Promise<{ address: Address }> => {
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

  resetPassword: async (id: string): Promise<void> => {
    await api.post(`/users/${id}/reset-password`);
  },
};
