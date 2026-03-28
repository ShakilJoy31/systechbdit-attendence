// hooks/useUserData.ts

import { useGetClientByIdQuery } from "@/redux/api/authentication/authApi";
import { getUserIdFromToken } from "./userFromToken";

export const useUserData = () => {
  const userId = getUserIdFromToken();
  const { data, isLoading, error, refetch } = useGetClientByIdQuery(userId || "", {
    skip: !userId,
  });
  
  return {
    user: data?.data || null,
    isLoading,
    error,
    refetch,
  };
};