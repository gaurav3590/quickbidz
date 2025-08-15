"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { Loading } from "@/components/ui/loading";
import { ROUTES } from "@/lib/constants/routes";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  const { login, isLoading, user } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  }, [error, setError]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);

      // Trim and validate form data
      const email = formData.email.trim();
      const password = formData.password;

      // Validate form data
      if (!email || !password) {
        setError("Email and password are required");
        return;
      }

      try {
        // Pass the trimmed values to ensure no whitespace issues
        await login(email, password);
      } catch (error) {
        console.error("Login failed:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Login failed, please try again."
        );
      }
    },
    [formData, login, setError]
  );

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Welcome back!</CardTitle>
          <CardDescription>
            Sign in to your QuickBidz account to continue your bidding journey.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email-address">Email address</Label>
              <Input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href={ROUTES.FORGOT_PASSWORD}
                  className="text-sm font-medium text-primary hover:text-primary/80"
                >
                  Forgot your password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember-me"
                name="rememberMe"
                checked={formData.rememberMe}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    rememberMe: checked === true,
                  }))
                }
              />
              <Label htmlFor="remember-me" className="text-sm">
                Remember me
              </Label>
            </div>

            {error && (
              <div className="text-sm text-red-500 text-center">{error}</div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                "Sign in securely"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-center">
            New to QuickBidz?{" "}
            <Link
              href={ROUTES.SIGNUP}
              className="font-medium text-primary hover:text-primary/80"
            >
              Sign up for free
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
