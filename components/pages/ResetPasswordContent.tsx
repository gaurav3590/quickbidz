"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loading } from "@/components/ui/loading";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { axiosInstance } from "@/lib/api";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

// Password validation helper
const validatePassword = (
  password: string
): { valid: boolean; message: string } => {
  if (password.length < 8) {
    return {
      valid: false,
      message: "Password must be at least 8 characters long",
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      message: "Password must contain at least one uppercase letter",
    };
  }

  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      message: "Password must contain at least one lowercase letter",
    };
  }

  if (!/[0-9]/.test(password)) {
    return {
      valid: false,
      message: "Password must contain at least one number",
    };
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    return {
      valid: false,
      message: "Password must contain at least one special character",
    };
  }

  return { valid: true, message: "Password is valid" };
};

export default function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
    token: "",
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (!tokenParam) {
      setErrors((prev) => ({
        ...prev,
        token: "Invalid reset link. The token is missing.",
      }));
    } else {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors when user types
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    // Validate password on change
    if (name === "newPassword") {
      const validation = validatePassword(value);
      if (!validation.valid) {
        setErrors((prev) => ({
          ...prev,
          newPassword: validation.message,
        }));
      }
    }

    // Check if passwords match
    if (name === "confirmPassword" && value !== formData.newPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
    }
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);

      // Validate before submission
      let isValid = true;
      const newErrors = { ...errors };

      // Check password validity
      const passwordValidation = validatePassword(formData.newPassword);
      if (!passwordValidation.valid) {
        newErrors.newPassword = passwordValidation.message;
        isValid = false;
      }

      // Check if passwords match
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
        isValid = false;
      }

      // Check if token exists
      if (!token) {
        newErrors.token =
          "Invalid reset link. Please request a new password reset.";
        isValid = false;
      }

      setErrors(newErrors);

      if (!isValid) {
        setIsSubmitting(false);
        return;
      }

      try {
        await axiosInstance.post("/auth/reset-password", {
          token,
          newPassword: formData.newPassword,
        });

        setIsSuccess(true);
        toast.success("Password has been reset successfully");
      } catch (error) {
        console.error("Password reset failed:", error);
        toast.error("Failed to reset password. The link may have expired.");

        setErrors((prev) => ({
          ...prev,
          token:
            "Password reset failed. The link may have expired or is invalid.",
        }));
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Reset Your Password
          </CardTitle>
          <CardDescription>
            {!isSuccess
              ? "Enter your new password below"
              : "Your password has been successfully reset"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {errors.token && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
              <p>{errors.token}</p>
            </div>
          )}

          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    tabIndex={-1}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-sm text-red-500">{errors.newPassword}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || !!errors.token}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Resetting Password...
                  </div>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          ) : (
            <div className="bg-green-100 text-green-700 p-4 rounded-lg">
              <p>
                Your password has been reset successfully. You can now login
                with your new password.
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-center">
          <div className="text-sm text-center">
            {isSuccess ? (
              <Link
                href="/login"
                className="font-medium text-primary hover:text-primary/80"
              >
                Proceed to Login
              </Link>
            ) : (
              <Link
                href="/login"
                className="font-medium text-primary hover:text-primary/80"
              >
                Back to Login
              </Link>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
