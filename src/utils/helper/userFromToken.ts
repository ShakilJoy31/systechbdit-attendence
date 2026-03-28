// utils/auth/userFromToken.ts
import { jwtDecode } from "jwt-decode";
import { shareWithCookies } from "../helper/shareWithCookies";
import { appConfiguration } from "../constant/appConfiguration";

// Define types for the token payload
interface TokenPayload {
  id: string;
  email?: string;
  role?: string;
  exp?: number;
  iat?: number;
}

// Define user type
export interface UserInfo {
  id: string;
  email: string;
  role: string;
  name?: string;
  avatar?: string;
  [key: string]: unknown;
}

// Helper function to get token from cookies
export const getTokenFromCookies = (): string | null => {
  return shareWithCookies("get", `${appConfiguration.appCode}token`) as string | null;
};

// Helper function to decode token and get user ID
export const getUserIdFromToken = (): string | null => {
  try {
    const token = getTokenFromCookies();
    if (!token) return null;

    const decoded = jwtDecode<TokenPayload>(token);
    return decoded.id || null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

// Helper function to get user role from token
export const getUserRoleFromToken = (): string | null => {
  try {
    const token = getTokenFromCookies();
    if (!token) return null;

    const decoded = jwtDecode<TokenPayload>(token);
    return decoded.role || null;
  } catch (error) {
    console.error("Error getting role from token:", error);
    return null;
  }
};

// Helper function to check if token is expired
export const isTokenExpired = (): boolean => {
  try {
    const token = getTokenFromCookies();
    if (!token) return true;

    const decoded = jwtDecode<TokenPayload>(token);
    const currentTime = Date.now() / 1000;

    return !!(decoded.exp && decoded.exp < currentTime);
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return true;
  }
};

//! Main function to get complete user information
export const getUserInfo = async (): Promise<UserInfo | null> => {
  try {
    // Check if token exists and is valid
    const token = getTokenFromCookies();
    if (!token) return null;

    if (isTokenExpired()) {
      console.warn("Token is expired");
      // You might want to handle token refresh here
      return null;
    }

    // Get user ID from token
    const userId = getUserIdFromToken();
    if (!userId) return null;

    // In a real implementation, you would fetch user data from your API
    // Since we don't have access to the store directly, we'll return basic info from token
    const decoded = jwtDecode<TokenPayload>(token);
    
    // For more complete info, you would need to fetch from your API
    // This is a basic implementation with just token data
    const basicUserInfo: UserInfo = {
      id: decoded.id,
      email: decoded.email || "",
      role: decoded.role || "user",
    };

    return basicUserInfo;

  } catch (error) {
    console.error("Error getting user info:", error);
    return null;
  }
};

// Helper function to get user info with API call (using RTK Query)
// This would be used in components where you have access to the hook
export const useGetFullUserInfo = () => {
  const userId = getUserIdFromToken();
  
  // This hook would be used in a component
  // For a helper function, we can't directly use hooks
  return userId;
};

// Helper function to determine redirect path based on role
export const getRedirectPathByRole = (role: string | null): string => {
  if (!role) return "/login";

  const roleRoutes: Record<string, string> = {
    admin: "/admin/dashboard",
    client: "/client/dashboard",
    user: "/user/dashboard",
    // Add more roles as needed
  };

  return roleRoutes[role.toLowerCase()] || "/";
};

// Helper function to check if user has required role
export const hasRequiredRole = (
  userRole: string | null, 
  requiredRoles: string[]
): boolean => {
  if (!userRole) return false;
  return requiredRoles.some(role => 
    userRole.toLowerCase() === role.toLowerCase()
  );
};

// Helper function for protected route access
export const canAccessRoute = (
  routeRole: string, 
  userRole: string | null
): boolean => {
  const roleHierarchy: Record<string, number> = {
    admin: 3,
    client: 2,
    user: 1,
  };

  if (!userRole) return false;
  
  const userLevel = roleHierarchy[userRole.toLowerCase()] || 0;
  const routeLevel = roleHierarchy[routeRole.toLowerCase()] || 0;
  
  return userLevel >= routeLevel;
};

// Example usage in a component or page
export const handleAuthRedirect = (
  router: import("next/router").NextRouter, 
  currentPath?: string
): boolean => {
  const token = getTokenFromCookies();
  const role = getUserRoleFromToken();
  
  if (!token) {
    // No token, redirect to login
    router.push("/login");
    return false;
  }
  
  if (isTokenExpired()) {
    // Token expired, redirect to login
    router.push("/login");
    return false;
  }
  
  // Check if current path is accessible by user role
  if (currentPath && role) {
    // You can add specific route checks here
    if (currentPath.startsWith("/admin") && role !== "admin") {
      router.push("/access-denied");
      return false;
    }
  }
  
  return true;
};

// Hook wrapper for React components
import { useCallback } from "react";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const router = useRouter();
  
  const getUser = useCallback(async (): Promise<UserInfo | null> => {
    return await getUserInfo();
  }, []);
  
  const logout = useCallback(() => {
    shareWithCookies("remove", `${appConfiguration.appCode}token`);
    router.push("/login");
    router.refresh();
  }, [router]);
  
  const redirectByRole = useCallback((role: string) => {
    const path = getRedirectPathByRole(role);
    router.push(path);
  }, [router]);
  
  const checkAccess = useCallback((requiredRole: string): boolean => {
    const role = getUserRoleFromToken();
    return canAccessRoute(requiredRole, role);
  }, []);
  
  return {
    getUser,
    logout,
    redirectByRole,
    checkAccess,
    getUserId: getUserIdFromToken,
    getUserRole: getUserRoleFromToken,
    isAuthenticated: () => !!getTokenFromCookies() && !isTokenExpired(),
  };
};