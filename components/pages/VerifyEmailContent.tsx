"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
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

export default function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const [verificationState, setVerificationState] = useState<
    "loading" | "success" | "error"
  >("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setVerificationState("error");
      setErrorMessage("Invalid verification link. No token provided.");
      return;
    }

    const verifyEmail = useCallback(async () => {
      try {
        await axiosInstance.post("/auth/verify-email", { token });
        setVerificationState("success");
      } catch (error) {
        console.error("Email verification failed:", error);
        setVerificationState("error");
        setErrorMessage(
          "Email verification failed. The link may have expired or is invalid."
        );
      }
    }, [token]);

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Email Verification
          </CardTitle>
          <CardDescription>
            {verificationState === "loading" &&
              "Verifying your email address..."}
            {verificationState === "success" && "Your email has been verified!"}
            {verificationState === "error" && "Verification Failed"}
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center">
          {verificationState === "loading" && (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}

          {verificationState === "success" && (
            <div className="py-4">
              <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6">
                <p>
                  Your email address has been successfully verified. You can now
                  login to your account.
                </p>
              </div>
            </div>
          )}

          {verificationState === "error" && (
            <div className="py-4">
              <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
                <p>{errorMessage}</p>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-center">
          {verificationState === "success" && (
            <Button asChild>
              <Link href="/login">Go to Login</Link>
            </Button>
          )}

          {verificationState === "error" && (
            <Button asChild>
              <Link href="/login">Return to Login</Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
