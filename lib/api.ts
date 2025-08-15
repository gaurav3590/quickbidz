// API base URL from environment variable
import axios, { AxiosInstance, AxiosError } from "axios";
import { toast } from "sonner";

// Set API base URL with fallback for development
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Check if we're in a build environment
const isBuildTime =
  process.env.NODE_ENV === "production" && typeof window === "undefined";

// Function to get the correct URL (with proxy if in development)
const getApiUrl = (endpoint: string) => {
  if (isBuildTime) {
    return null; // Return null during build time to prevent API calls
  }
  return `${API_BASE_URL}${endpoint}`;
};

// Create public axios instance for non-authenticated requests
export const publicApi: AxiosInstance = axios.create({
  baseURL: isBuildTime ? undefined : API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
});

// Add request interceptor to log outgoing requests
publicApi.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Create private axios instance for authenticated requests
export const privateApi: AxiosInstance = axios.create({
  baseURL: isBuildTime ? undefined : API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
});

// Configure response interceptor for both instances with error handling
const responseErrorHandler = (error: AxiosError) => {
  console.error("Axios error:", error);

  // Handle specific error status codes
  if (error.response) {
    const { status, data } = error.response;
    const errorMessage = (data as any).message || "An error occurred";

    // Handle 401 Unauthorized
    if (status === 401) {
      toast.error("Session expired. Please login again.");
    }
    // Handle 404 Not Found
    else if (status === 404) {
      toast.error("Resource not found.");
    }
    // Handle 403 Forbidden
    else if (status === 403) {
      toast.error("Access denied.");
    }
    // Handle 400 Bad Request
    else if (status === 400) {
      toast.error(errorMessage);
    }
    // Handle 500 Server Error
    else if (status >= 500) {
      toast.error("Server error. Please try again later.");
    }
  }
  // Handle network errors
  else if (error.request && !error.response) {
    toast.error("Network error. Please check your connection.");
  }
  // Handle other errors
  else {
    toast.error("An unexpected error occurred.");
  }

  return Promise.reject(error);
};

// Add response interceptor to public API instance
publicApi.interceptors.response.use(
  (response) => response,
  responseErrorHandler
);

// Add request and response interceptors to private API instance
privateApi.interceptors.request.use(
  async (config) => {
    // Import here to avoid circular dependency
    const { getAuthTokens } = await import("./auth");

    const tokens = getAuthTokens();
    if (tokens) {
      const { accessToken } = tokens;
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Check if the request data is FormData and remove content-type header
    // to let the browser set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to private API instance
privateApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle authentication errors specially
    if (error.response && error.response.status === 401) {
      const { clearAuthCookies } = await import("./auth");
      clearAuthCookies();

      // Redirect to login page if we're in a browser environment
      if (typeof window !== "undefined") {
        toast.error(
          "Authentication token missing or expired. Please log in again."
        );
        window.location.href = "/login";
      }
    }

    return responseErrorHandler(error);
  }
);

// Interface for user registration data
export interface RegisterData {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  dob: Date;
}

// Interface for login data
export interface LoginData {
  email: string;
  password: string;
}

// Interface for auth response
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    isVerified: boolean | undefined;
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    dob: Date;
  };
}

// Register a new user
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    // Format data consistently
    const formattedData = {
      email: data.email.trim(),
      username: data.username.trim(),
      password: data.password,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      dob: data.dob.toISOString(),
    };
    // Using our CORS proxy URL for development
    const apiUrl = "/auth/register";

    // Use public API instance for registration
    const response = await publicApi.post(apiUrl, formattedData);

    // Convert the response data to use Date objects
    const responseData = {
      ...response.data,
      user: {
        ...response.data.user,
        dob: new Date(response.data.user.dob),
      },
    };

    toast.success("Registration successful!");
    return responseData;
  } catch (error) {
    console.error("Registration error:", error);

    if (axios.isAxiosError(error) && error.response) {
      const errorMsg = error.response.data.message || "Registration failed";
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Registration failed. Please try again later.";
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

// Login a user
export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    // Format data consistently
    const formattedData = {
      email: data.email.trim(),
      password: data.password,
    };

    console.log("Login attempt for:", formattedData.email);

    // Using our CORS proxy URL for development
    const apiUrl = "/auth/login";

    // Use public API instance for login
    const response = await publicApi.post(apiUrl, formattedData);

    toast.success("Login successful!");
    return response.data;
  } catch (error) {
    console.error("Login error:", error);

    if (axios.isAxiosError(error) && error.response) {
      const errorMsg = error.response.data.message || "Login failed";
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Login failed. Please try again later.";
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

// Create an authorized request function that includes the access token
export const authorizedRequest = async (
  url: string,
  options: {
    method?: string;
    data?: any;
    headers?: Record<string, string>;
    params?: any;
  } = {}
) => {
  try {
    // Use private API instance which automatically handles authentication
    const method = options.method?.toLowerCase() || "get";

    // Special handling for FormData - let axios set the correct content-type with boundary
    const customHeaders = { ...options.headers };
    if (options.data instanceof FormData) {
      // Remove the Content-Type header to let the browser set it with the boundary
      delete customHeaders["Content-Type"];
    }

    let response;
    if (method === "get") {
      response = await privateApi.get(url, {
        params: options.params,
        headers: customHeaders,
      });
    } else if (method === "post") {
      response = await privateApi.post(url, options.data, {
        params: options.params,
        headers: customHeaders,
      });
    } else if (method === "put") {
      response = await privateApi.put(url, options.data, {
        params: options.params,
        headers: customHeaders,
      });
    } else if (method === "delete") {
      response = await privateApi.delete(url, {
        params: options.params,
        headers: customHeaders,
        data: options.data,
      });
    } else {
      throw new Error(`Unsupported method: ${options.method}`);
    }

    return response;
  } catch (error) {
    // Error handling is already done in the interceptor
    throw error;
  }
};

// For backward compatibility
export const authorizedFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  console.warn(
    "authorizedFetch is deprecated, please use authorizedRequest instead"
  );
  // Import here to avoid circular dependency
  const { getAuthTokens } = await import("./auth");

  const tokens = getAuthTokens();
  if (!tokens) {
    toast.error("Authentication required");
    throw new Error("User not authenticated");
  }

  const { accessToken } = tokens;

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast.error(errorData.message || "Request failed");
      throw new Error(errorData.message || "Request failed");
    }

    return response;
  } catch (error) {
    toast.error("Request failed");
    throw error;
  }
};

// Deprecate the original axiosInstance for better clarity
export const axiosInstance = privateApi;
