"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/components/providers/UserContext";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { NotificationPermissionButton } from "@/components/ui/notification-permission-button";
import {
  Home,
  User,
  Gavel,
  LogOut,
  Bell,
  Menu,
  X,
  PlusCircle,
} from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProtectedNavbar() {
  const pathname = usePathname();
  const { user, logout } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Get user initials for avatar
  const getInitials = () => {
    if (!user) return "U";
    return `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""
      }`;
  };

  // Determine active route
  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + "/");
  };

  const navItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: <Home className="h-4 w-4 mr-2" />,
    },
    {
      path: "/auctions",
      label: "Auctions",
      icon: <Gavel className="h-4 w-4 mr-2" />,
    },
    {
      path: "/profile",
      label: "Profile",
      icon: <User className="h-4 w-4 mr-2" />,
    },
  ];

  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/dashboard" className="text-2xl font-bold text-primary">
              QuickBidz
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(item.path)
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/70 hover:text-primary hover:bg-accent"
                  }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            <Button asChild variant="default" size="sm" className="ml-4">
              <Link href="/auctions/create">
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Auction
              </Link>
            </Button>
          </nav>

          {/* User Menu & Actions */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />

            {/* Notification Bell - Original */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative p-2" size="icon">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No new notifications
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Notification Permission Button */}
            <NotificationPermissionButton />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative rounded-full"
                  size="icon"
                >
                  <Avatar className="h-8 w-8">
                    {user?.profileImage ? (
                      <AvatarImage src={user.profileImage} alt={`${user.firstName} ${user.lastName}`} />
                    ) : (
                      <AvatarFallback>{getInitials()}</AvatarFallback>
                    )}
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center justify-start p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {user && (
                      <>
                        <p className="font-medium">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </>
                    )}
                  </div>
                </div>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => logout()}
                  className="cursor-pointer text-red-500 focus:text-red-500"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive(item.path)
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/70 hover:text-primary hover:bg-accent"
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
              <Button asChild variant="default" size="sm" className="mt-2">
                <Link
                  href="/auctions/create"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Auction
                </Link>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
