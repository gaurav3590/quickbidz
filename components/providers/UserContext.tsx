"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";
import { getAuthTokens, clearAuthCookies } from "@/lib/auth";
import { axiosInstance } from "@/lib/api";
import { toast } from "sonner";
import moment from "moment";

// Check if we're in a build environment
const isBuildTime =
  process.env.NODE_ENV === "production" && typeof window === "undefined";

// Define notification type
export type Notification = {
  id: string;
  message: string;
  type: "outbid" | "won" | "ending_soon" | "new_message" | "system";
  auctionId?: string;
  time: string;
  read: boolean;
};

interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  dob?: Date;
  isVerified?: boolean;
  profileImage?: string;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  notifications: Notification[];
  unreadNotificationsCount: number;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  signup: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    username: string,
    dob?: Date
  ) => Promise<void>;
  updateProfile: (data: {
    firstName?: string;
    lastName?: string;
    username?: string;
    password?: string;
    dateOfBirth?: Date;
  }) => Promise<void>;
  checkProfileCompletion: () => boolean;
  isUserAdult: () => boolean;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (
    notification: Omit<Notification, "id" | "time" | "read">
  ) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Mock notifications for demo purposes
const mockNotifications: Notification[] = [
  {
    id: "1",
    message: "You've been outbid on 'Vintage Camera Collection'",
    type: "outbid",
    auctionId: "1",
    time: new Date(Date.now() - 15 * 60000).toISOString(),
    read: false,
  },
  {
    id: "2",
    message: "Auction 'Retro Gaming Console' is ending soon",
    type: "ending_soon",
    auctionId: "2",
    time: new Date(Date.now() - 2 * 3600000).toISOString(),
    read: false,
  },
  {
    id: "3",
    message: "New message from seller regarding your bid",
    type: "new_message",
    auctionId: "3",
    time: new Date(Date.now() - 24 * 3600000).toISOString(),
    read: true,
  },
];

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);

  // Computed property for unread notifications count
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      // Skip API calls during build time
      if (isBuildTime) {
        setIsLoading(false);
        return;
      }

      try {
        const tokens = getAuthTokens();
        if (tokens) {
          const response = await axiosInstance.get("/users/currentUser", {
            headers: {
              Authorization: `Bearer ${tokens.accessToken}`,
            },
          });
          setUser(response.data);
        }
      } catch (error) {
        console.error("Session check failed:", error);
        clearAuthCookies();
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Ensure email and password are properly defined
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      // Trim email to ensure no whitespace issues
      const trimmedEmail = email.trim();

      // Explicitly create the request payload
      const payload = {
        email: trimmedEmail,
        password: password
      };

      const response = await axiosInstance.post("/auth/login", payload);
      return response.data;
    } catch (error: any) {
      console.error("Login failed:", error);
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      clearAuthCookies();
      router.push(ROUTES.LOGIN);
    }
  };

  const signup = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    username: string,
    dob?: Date
  ) => {
    setIsLoading(true);
    try {
      console.log("Attempting signup with:", { email, username });

      const response = await axiosInstance.post("/auth/register", {
        firstName,
        lastName,
        email,
        password,
        username,
        dob: dob?.toISOString(),
      });

      // Instead of automatically logging in, show verification message
      toast.success(
        "Account created! Please check your email to verify your account."
      );

      // We're not setting auth cookies here because the user needs to verify their email first
      // Redirect to login page after successful registration
      router.push(ROUTES.LOGIN);

      return;
    } catch (error) {
      console.error("Signup failed:", error);
      // Don't show toast here as the API function already does that
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: {
    firstName?: string;
    lastName?: string;
    username?: string;
    password?: string;
    dateOfBirth?: Date;
  }) => {
    if (!user) {
      toast.error("You must be logged in to update your profile");
      return Promise.reject("Not authenticated");
    }

    setIsLoading(true);
    try {
      const tokens = getAuthTokens();
      if (!tokens) {
        throw new Error("No authentication tokens found");
      }

      const response = await axiosInstance.patch(
        "/users/currentUser",
        {
          firstName: data.firstName,
          lastName: data.lastName,
          username: data.username,
          dob: data.dateOfBirth
            ? moment(data.dateOfBirth).format("YYYY-MM-DDTHH:mm:ss.SSSZ")
            : undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        }
      );

      // Update the user state with the response data
      setUser({
        ...response.data,
        dob: response.data.dob ? moment(response.data.dob).toDate() : undefined,
      });

      toast.success("Profile updated successfully");
      return Promise.resolve();
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("Failed to update profile");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const checkProfileCompletion = () => {
    if (!user) return false;
    // For demonstration purposes, always return true to prevent infinite redirects
    // In a real app, you would actually check if the dateOfBirth is set
    return true;
  };

  const isUserAdult = () => {
    if (!user || !user.dob) return false;

    const birthDate = moment(user.dob);
    const today = moment();
    const age = today.diff(birthDate, "years");

    return age >= 18;
  };

  // Notification functions
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  const addNotification = (
    notification: Omit<Notification, "id" | "time" | "read">
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      time: new Date().toISOString(),
      read: false,
    };

    setNotifications((prev) => [newNotification, ...prev]);

    // Show toast for new notification
    toast.info(notification.message, {
      id: `notification-${newNotification.id}`,
      duration: 5000,
    });
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        notifications,
        unreadNotificationsCount,
        login,
        logout,
        setUser,
        signup,
        updateProfile,
        checkProfileCompletion,
        isUserAdult,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}
