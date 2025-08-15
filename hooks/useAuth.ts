"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/components/providers/UserContext";
import { ROUTES, ProtectedRoute } from "@/lib/constants/routes";
import { getAuthTokens, setAuthCookies, clearAuthCookies } from "@/lib/auth";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/api";

interface LoginResponse {
  user: {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    role: string;
    isActive: boolean;
  };
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export function useAuth(redirectTo: ProtectedRoute = ROUTES.DASHBOARD) {
  const {
    user,
    isLoading,
    login: userLogin,
    logout: userLogout,
    setUser,
  } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Check if user is authenticated
  const isAuthenticated = !!user && !!getAuthTokens();

  // Fetch current user with token
  const fetchCurrentUser = async (token: string) => {
    try {
      const response = await axiosInstance.get("/users/currentUser", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch current user:", error);
      throw error;
    }
  };

  // Handle login with redirect
  const login = async (email: string, password: string) => {
    setIsAuthenticating(true);
    try {      
      const response = (await userLogin(email, password)) as LoginResponse;
      console.log("Login response received:", !!response);

      if (!response?.accessToken) {
        throw new Error("No authentication tokens received from server");
      }

      // Set the auth cookies
      setAuthCookies({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });

      // Fetch current user with the new token
      const currentUser = await fetchCurrentUser(response.accessToken);
      setUser(currentUser);

      // Get the redirect URL from the current pathname
      const searchParams = new URLSearchParams(window.location.search);
      const from = searchParams.get("from");
      const redirectPath = from && from.startsWith("/") ? from : redirectTo;

      // Ensure we have valid tokens before redirecting
      if (getAuthTokens()) {
        router.push(redirectPath);
      } else {
        throw new Error("Failed to store authentication tokens");
      }
    } catch (error) {
      console.error("Login failed:", error);
      // Clear any partial auth state
      clearAuthCookies();
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Handle logout with cleanup
  const logout = async () => {
    try {
      await userLogout();
      clearAuthCookies();
      router.push(ROUTES.LOGIN);
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  // Check authentication status and redirect if needed
  useEffect(() => {
    if (!isLoading) {
      const tokens = getAuthTokens();

      if (!user || !tokens) {
        // If on a protected route, redirect to login
        if (
          pathname.startsWith("/dashboard") ||
          pathname.startsWith("/profile") ||
          pathname.startsWith("/auctions") ||
          pathname.startsWith("/bids")
        ) {
          router.push(ROUTES.LOGIN);
        }
      } else if (user && tokens) {
        // If on auth pages while logged in, redirect to dashboard
        if (
          pathname === ROUTES.LOGIN ||
          pathname === ROUTES.SIGNUP ||
          pathname === ROUTES.FORGOT_PASSWORD
        ) {
          router.push(ROUTES.DASHBOARD);
        }
      }
    }
  }, [user, isLoading, router, pathname]);

  return {
    user,
    isLoading: isLoading || isAuthenticating,
    isAuthenticated,
    login,
    logout,
  };
}
