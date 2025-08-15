import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

// Firebase imports
import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  MessagePayload,
} from "firebase/messaging";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase - only on client side
let app: any = null;
let messaging: any = null;

if (typeof window !== "undefined") {
  app = initializeApp(firebaseConfig);
  try {
    messaging = getMessaging(app);
  } catch (error) {
    console.error("Error initializing messaging:", error);
  }
}

export const useFirebaseNotifications = () => {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const { toast } = useToast();

  // Request notification permission and get FCM token
  const requestPermission = async (): Promise<string | null> => {
    if (!messaging) return null;

    try {
      // Request permission from the user
      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        console.log("Notification permission not granted");
        return null;
      }

      // Get token
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      });

      if (token) {
        setFcmToken(token);
        return token;
      } else {
        console.log("No registration token available");
        return null;
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return null;
    }
  };

  // Register FCM token with backend
  const registerTokenWithBackend = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/notifications/register-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fcmToken: token }),
      });

      if (!response.ok) {
        throw new Error("Failed to register FCM token");
      }

      return true;
    } catch (error) {
      console.error("Error registering FCM token:", error);
      return false;
    }
  };

  // Enable notifications
  const enableNotifications = async (): Promise<boolean> => {
    try {
      // Request permission and get token
      const token = await requestPermission();

      if (!token) {
        toast({
          title: "Notification permission denied",
          description: "Please enable notifications in your browser settings.",
          variant: "destructive",
        });
        return false;
      }

      // Register token with backend
      const registered = await registerTokenWithBackend(token);

      if (registered) {
        setIsNotificationsEnabled(true);
        toast({
          title: "Notifications enabled",
          description: "You will now receive notifications for your auctions.",
        });
        return true;
      } else {
        toast({
          title: "Failed to register for notifications",
          description: "Please try again later.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Error enabling notifications:", error);
      toast({
        title: "Error enabling notifications",
        description: "Please try again later.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Setup message listener for foreground notifications
  useEffect(() => {
    if (!messaging) return;

    // Setup message listener for foreground messages
    const unsubscribe = onMessage(messaging, (payload: MessagePayload) => {
      console.log("Message received in foreground:", payload);

      // Show toast notification
      toast({
        title: payload.notification?.title || "New notification",
        description: payload.notification?.body || "",
      });

      return payload;
    });

    // Check if notifications were previously enabled
    const checkNotificationStatus = async () => {
      if (typeof Notification !== "undefined") {
        const permission = Notification.permission;
        setIsNotificationsEnabled(permission === "granted");

        // If permission is granted, try to get the token
        if (permission === "granted" && messaging) {
          try {
            const currentToken = await getToken(messaging, {
              vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
            });

            if (currentToken) {
              setFcmToken(currentToken);
            }
          } catch (error) {
            console.error("Error retrieving FCM token:", error);
          }
        }
      }
    };

    checkNotificationStatus();

    // Cleanup function
    return () => {
      unsubscribe();
    };
  }, [toast]);

  return {
    isNotificationsEnabled,
    enableNotifications,
    fcmToken,
  };
};
