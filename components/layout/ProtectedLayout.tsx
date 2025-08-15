"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/components/providers/UserContext";
import { getAuthTokens } from "@/lib/auth";
import { toast } from "sonner";
import ProtectedNavbar from "./ProtectedNavbar";

interface ProtectedLayoutProps {
  children: React.ReactNode;
  requireAdult?: boolean;
}

export default function ProtectedLayout({
  children,
  requireAdult = false,
}: ProtectedLayoutProps) {
  const { user, isLoading, isUserAdult, checkProfileCompletion } = useUser();
  const router = useRouter();
  const [authState, setAuthState] = useState<
    "checking" | "authenticated" | "unauthenticated"
  >("checking");

  useEffect(() => {
    // Only run this check once when the component mounts or user/isLoading changes
    if (authState !== "checking") {
      return;
    }

    const checkAuth = async () => {
      // Wait for user loading to complete
      if (isLoading) {
        return;
      }

      // Check if user is authenticated
      if (!user) {
        toast.error("Please log in to access this page", {
          id: "auth-required",
        });
        router.push("/login");
        setAuthState("unauthenticated");
        return;
      }

      // Get the current path
      const currentPath = window.location.pathname;

      // If user is authenticated but profile is not complete
      if (!checkProfileCompletion()) {
        // Only redirect if NOT already on the profile page
        if (currentPath !== "/profile") {
          toast.error("Please complete your profile first", {
            id: "profile-incomplete",
          });
          router.push("/profile");
          return;
        }
      }

      // Check if user meets age requirement (for pages that require it)
      if (requireAdult && !isUserAdult()) {
        toast.error(
          "You must be 18 or older to access this feature. Please contact administrator.",
          {
            id: "age-restriction",
          }
        );
        router.push("/dashboard");
        return;
      }

      // Check for authentication token - but don't redirect if we're on the profile page
      // and only if we're not already authenticated
      const tokens = getAuthTokens();
      if (!tokens && currentPath !== "/profile") {
        toast.error(
          "Authentication token missing or expired. Please log in again.",
          {
            id: "token-missing",
          }
        );
        router.push("/login");
        setAuthState("unauthenticated");
        return;
      }

      // If we made it here, the user is authenticated
      setAuthState("authenticated");
    };

    // Run the auth check
    checkAuth();
  }, [
    user,
    isLoading,
    router,
    requireAdult,
    isUserAdult,
    checkProfileCompletion,
    authState,
  ]);

  // Show loading while checking auth status
  if (isLoading || authState === "checking") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If authentication failed, we've already redirected
  if (authState === "unauthenticated") {
    return null;
  }

  // Render children if authenticated
  return (
    <div className="flex flex-col min-h-screen">
      <ProtectedNavbar />
      <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
      <footer className="border-t border-border py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} QuickBidz. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
