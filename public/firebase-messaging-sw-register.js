// Register the service worker for Firebase Cloud Messaging
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then((registration) => {
      console.log('Firebase Messaging Service Worker registered with scope:', registration.scope);
      
      // Pass the environment variables to service worker
      if (registration.active) {
        registration.active.postMessage({
          type: 'FIREBASE_CONFIG',
          config: {
            FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
            FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
            FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
            FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
            FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
          }
        });
      }
    }).catch((err) => {
      console.error('Service Worker registration failed:', err);
    });

  // Handle messages from service worker
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'NOTIFICATION_CLICKED') {
      console.log('Notification clicked:', event.data);
      // Handle notification click, e.g., navigate to a specific page
    }
  });
} 