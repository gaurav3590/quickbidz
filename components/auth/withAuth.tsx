"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/components/providers/UserContext";
import ProtectedLayout from "@/components/layout/ProtectedLayout";

export default function withAuth<T extends {}>(
  Component: React.ComponentType<T>
) {
  return function WithAuth(props: T) {
    const { user, isLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !user) {
        router.push("/login");
      }
    }, [user, isLoading, router]);

    // Show loading while checking authentication
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }

    // If no user, don't render anything (redirect effect will handle it)
    if (!user) {
      return null;
    }

    // If authenticated, render the component inside the protected layout
    return (
      <ProtectedLayout>
        <Component {...props} />
      </ProtectedLayout>
    );
  };
}
