"use client";

import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { UserProvider } from "@/components/providers/UserContext";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { useEffect } from "react";
import { useFirebaseNotifications } from "@/hooks/useFirebaseNotifications";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // Initialize Firebase (will only run on client-side)
  const FirebaseNotificationsSetup = () => {
    const { fcmToken } = useFirebaseNotifications();
    
    useEffect(() => {
      // Firebase initialization already happens in the hook
      // This component acts as a placeholder for the hook to be initialized
      if (fcmToken) {
        console.log("FCM Token retrieved:", fcmToken.substring(0, 10) + "...");
      }
    }, [fcmToken]);

    return null;
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="quickbidz-theme">
      <UserProvider>
        <QueryProvider>
          {/* Initialize Firebase */}
          <FirebaseNotificationsSetup />
          {children}
        </QueryProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
