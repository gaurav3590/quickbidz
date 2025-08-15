"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useUser } from "@/components/providers/UserContext";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const { user, logout } = useUser();

  // Determine active route
  const isActive = (path: string) => {
    return pathname === path
      ? "text-primary font-medium relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-primary after:rounded-full animate-subtle-bounce"
      : "text-foreground/80 hover:text-primary transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-primary after:rounded-full hover:after:w-full after:transition-all after:duration-300 hover:shadow-glow";
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header with navigation */}
      <header className="border-b border-border bg-gradient-to-r from-background to-background/95 backdrop-blur-sm sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold">
              QuickBidz
            </Link>

            <nav className="hidden md:flex space-x-8">
              <Link href="/" className={isActive("/")}>
                Home
              </Link>
              <Link href="/about" className={isActive("/about")}>
                About
              </Link>
              <Link href="/contact" className={isActive("/contact")}>
                Contact
              </Link>
              <Link href="/privacy" className={isActive("/privacy")}>
                Privacy
              </Link>
              <Link href="/terms" className={isActive("/terms")}>
                Terms
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <ThemeToggle />

              {user ? (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/profile"
                    className={`text-sm ${isActive("/profile")}`}
                  >
                    {user.firstName}'s Profile
                  </Link>
                  <Button variant="ghost" onClick={() => logout()}>
                    Logout
                  </Button>
                </div>
              ) : (
                <>
                  <Button asChild variant="ghost">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/10">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">QuickBidz</h3>
              <p className="text-sm text-muted-foreground">
                Your premier destination for real-time online auctions. Discover
                unique items and place secure bids.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/"
                    className="hover:text-primary transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:text-primary transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-primary transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-primary transition-colors"
                  >
                    Privacy & Security
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-primary transition-colors"
                  >
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-primary transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a href="#" className="hover:text-primary transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                </a>
                <a href="#" className="hover:text-primary transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Email: info.quickbidz@gmail.com
                <br />
                Phone: +91 9876543210
              </p>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} QuickBidz. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
