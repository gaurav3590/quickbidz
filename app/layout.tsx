import type { Metadata } from "next";
import localFont from "next/font/local";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "sonner";
import { Providers } from "@/components/providers/Providers";
import "./globals.css";

const inter = localFont({
  src: [
    {
      path: "../public/fonts/Inter-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Inter-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Inter-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/Inter-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "QuickBidz - Online Auction Platform",
  description: "A premier destination for real-time online auctions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Add Firebase messaging service worker script */}
        <script src="/firebase-messaging-sw-register.js" defer></script>
      </head>
      <body className={`${inter.variable} antialiased`}>
        <Providers>{children}</Providers>
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: {
              borderRadius: "8px",
            },
            className: "toast-notification",
          }}
        />
        <SpeedInsights />
      </body>
    </html>
  );
}
