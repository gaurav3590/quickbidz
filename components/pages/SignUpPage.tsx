"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/components/providers/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import moment from "moment";

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

// Age validation helper
const checkAge = (dob: string): { valid: boolean; message: string } => {
  if (!dob) {
    return { valid: false, message: "Date of birth is required" };
  }

  const birthDate = moment(dob, "MM-DD-YYYY");
  const today = moment();
  const age = today.diff(birthDate, "years");

  if (age < 18) {
    return {
      valid: false,
      message: "You must be 18 or older to create an account",
    };
  }

  return { valid: true, message: "" };
};

export default function SignUpPage() {
  const { signup, isLoading, user } = useUser();
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    username: "",
    dob: "",
    terms: false,
  });
  const [passwordError, setPasswordError] = useState<string>("");
  const [ageError, setAgeError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (name === "dob") {
      // For date input, we directly use the value from the date picker
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (value) {
        // Convert YYYY-MM-DD to MM-DD-YYYY for age validation
        const dateObj = new Date(value);
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        const year = dateObj.getFullYear();
        const formattedDate = `${month}-${day}-${year}`;

        const validation = checkAge(formattedDate);
        setAgeError(validation.valid ? "" : validation.message);
      } else {
        setAgeError("");
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));

      // Validate password on change
      if (name === "password") {
        const validation = validatePassword(value);
        setPasswordError(validation.valid ? "" : validation.message);
      }
    }
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);

      // Validate password before submission
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.valid) {
        setPasswordError(passwordValidation.message);
        setIsSubmitting(false);
        return;
      }

      // Validate age before submission
      const ageValidation = checkAge(formData.dob);
      if (!ageValidation.valid) {
        setAgeError(ageValidation.message);
        setIsSubmitting(false);
        return;
      }

      if (!formData.terms) {
        alert("Please agree to the terms and conditions");
        setIsSubmitting(false);
        return;
      }

      try {
        await signup(
          formData.firstName,
          formData.lastName,
          formData.email,
          formData.password,
          formData.username,
          new Date(formData.dob)
        );
      } catch (error) {
        console.error("Signup failed:", error);
        alert(
          "Signup failed: " +
          (error instanceof Error ? error.message : "Unknown error")
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, signup]
  );

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">
            Join QuickBidz Today
          </CardTitle>
          <CardDescription>
            Sign up to discover exciting auctions, place bids, and win unique
            items!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">First Name</Label>
                <Input
                  id="first-name"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last Name</Label>
                <Input
                  id="last-name"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
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
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <div className="relative">
                <Input
                  id="dob"
                  name="dob"
                  type="date"
                  required
                  value={formData.dob}
                  onChange={handleChange}
                  className="pr-10"
                />
              </div>
              {ageError && (
                <p className="text-sm text-red-500 mt-1">{ageError}</p>
              )}
              <p className="text-xs text-muted-foreground">
                You must be at least 18 years old to register
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
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
              {passwordError && (
                <p className="text-sm text-red-500 mt-1">{passwordError}</p>
              )}
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                name="terms"
                checked={formData.terms}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, terms: checked === true }))
                }
                required
              />
              <Label htmlFor="terms" className="text-sm">
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="font-medium text-primary hover:text-primary/80"
                >
                  Terms and Conditions
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="font-medium text-primary hover:text-primary/80"
                >
                  Privacy Policy
                </Link>
              </Label>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Creating account...
                </div>
              ) : (
                "Create your free account"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <p className="text-sm text-center text-muted-foreground">
            Registration is completely free. Get personalized recommendations,
            secure payments, and more!
          </p>
          <p className="text-sm text-center">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:text-primary/80"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
