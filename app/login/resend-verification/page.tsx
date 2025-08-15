"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export default function ResendVerification() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);

    try {
      await axiosInstance.post("/auth/resend-verification", { email });
      setIsSubmitted(true);
      toast.success("Verification email sent. Please check your inbox.");
    } catch (error) {
      console.error("Resend verification request failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Resend Verification Email
          </CardTitle>
          <CardDescription>
            {!isSubmitted
              ? "Enter your email address to receive a new verification link"
              : "Check your email for the verification link"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Verification Link"}
              </Button>
            </form>
          ) : (
            <div className="bg-green-100 text-green-700 p-4 rounded-lg">
              <p>
                A verification link has been sent to <strong>{email}</strong>.
                Please check your email inbox and follow the instructions to
                verify your account.
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-center">
          <div className="text-sm text-center">
            <Link
              href="/login"
              className="font-medium text-primary hover:text-primary/80"
            >
              Back to Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
