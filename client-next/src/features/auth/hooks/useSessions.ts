import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const useSessions = () => {
  return useQuery({
    queryKey: ["auth-sessions"],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/auth/sessions`, {
        withCredentials: true,
      });
      return data;
    },
  });
};

export const useRevokeSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (sessionId: number) => {
      const { data } = await axios.post(
        `${API_URL}/auth/sessions/revoke`,
        { sessionId },
        { withCredentials: true }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-sessions"] });
    },
  });
};
