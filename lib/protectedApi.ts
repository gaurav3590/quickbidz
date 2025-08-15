import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { toast } from "sonner";
import { getAuthTokens } from "./auth";
import { useRouter } from "next/navigation";
import { ROUTES } from "./constants/routes";

// API base URL from environment variable
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Create an axios instance for protected API calls
 * This instance automatically attaches the bearer token to all requests
 */
export const createProtectedApi = (): AxiosInstance => {
  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    withCredentials: false,
  });

  // Request interceptor to attach bearer token
  api.interceptors.request.use(
    async (config) => {
      const tokens = getAuthTokens();
      if (tokens) {
        config.headers.Authorization = `Bearer ${tokens.accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle errors
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response) {
        // Handle 401 Unauthorized errors
        if (error.response.status === 401) {
          // Clear auth cookies and redirect to login
          const { clearAuthCookies } = await import("./auth");
          clearAuthCookies();

          // Show error message
          toast.error("Your session has expired. Please log in again.");

          // Redirect to login page if in browser environment
          if (typeof window !== "undefined") {
            window.location.href = ROUTES.LOGIN;
          }
        } else if (error.response.status === 403) {
          toast.error("You do not have permission to perform this action.");
        } else if (error.response.status === 404) {
          toast.error("The requested resource was not found.");
        } else if (error.response.status >= 500) {
          toast.error("Server error. Please try again later.");
        } else {
          const errorMessage =
            error.response.data?.message || "An error occurred";
          toast.error(errorMessage);
        }
      } else if (error.request) {
        // Network error
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("An unexpected error occurred.");
      }

      return Promise.reject(error);
    }
  );

  return api;
};

// Create a singleton instance of the protected API
export const protectedApi = createProtectedApi();

/**
 * Custom hook for making protected API calls in components
 * Returns the protected API instance and a function to check if the user is authenticated
 */
export const useProtectedApi = () => {
  const router = useRouter();

  const isAuthenticated = (): boolean => {
    const tokens = getAuthTokens();
    return !!tokens;
  };

  const checkAuth = (): boolean => {
    if (!isAuthenticated()) {
      toast.error("You must be logged in to perform this action.");
      router.push(ROUTES.LOGIN);
      return false;
    }
    return true;
  };

  /**
   * Make a GET request to the protected API
   * @param url - The URL to make the request to
   * @param config - Additional axios config
   */
  const get = async <T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    if (!checkAuth()) throw new Error("Not authenticated");
    return protectedApi.get<T>(url, config);
  };

  /**
   * Make a POST request to the protected API
   * @param url - The URL to make the request to
   * @param data - The data to send
   * @param config - Additional axios config
   */
  const post = async <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    if (!checkAuth()) throw new Error("Not authenticated");
    return protectedApi.post<T>(url, data, config);
  };

  /**
   * Make a PUT request to the protected API
   * @param url - The URL to make the request to
   * @param data - The data to send
   * @param config - Additional axios config
   */
  const put = async <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    if (!checkAuth()) throw new Error("Not authenticated");
    return protectedApi.put<T>(url, data, config);
  };

  /**
   * Make a DELETE request to the protected API
   * @param url - The URL to make the request to
   * @param config - Additional axios config
   */
  const del = async <T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    if (!checkAuth()) throw new Error("Not authenticated");
    return protectedApi.delete<T>(url, config);
  };

  /**
   * Make a PATCH request to the protected API
   * @param url - The URL to make the request to
   * @param data - The data to send
   * @param config - Additional axios config
   */
  const patch = async <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    if (!checkAuth()) throw new Error("Not authenticated");
    return protectedApi.patch<T>(url, data, config);
  };

  return {
    api: protectedApi,
    isAuthenticated,
    checkAuth,
    get,
    post,
    put,
    delete: del,
    patch,
  };
};

/**
 * Function to make a protected API call without using hooks
 * Useful for API calls outside of React components
 * @param method - The HTTP method to use
 * @param url - The URL to make the request to
 * @param data - The data to send (for POST, PUT, PATCH)
 * @param config - Additional axios config
 */
export const protectedApiCall = async <T = any>(
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  const tokens = getAuthTokens();

  if (!tokens) {
    toast.error("You must be logged in to perform this action.");
    if (typeof window !== "undefined") {
      window.location.href = ROUTES.LOGIN;
    }
    throw new Error("Not authenticated");
  }

  switch (method) {
    case "GET":
      return protectedApi.get<T>(url, config);
    case "POST":
      return protectedApi.post<T>(url, data, config);
    case "PUT":
      return protectedApi.put<T>(url, data, config);
    case "DELETE":
      return protectedApi.delete<T>(url, config);
    case "PATCH":
      return protectedApi.patch<T>(url, data, config);
    default:
      throw new Error(`Unsupported method: ${method}`);
  }
};
