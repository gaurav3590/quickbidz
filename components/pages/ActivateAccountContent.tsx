"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { toast } from "sonner";

export default function ActivateAccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activationState, setActivationState] = useState<
    "loading" | "success" | "error"
  >("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const activateAccount = useCallback(async (token: string) => {
    try {
      const res = await axiosInstance.post("/auth/activate-account", {
        token,
      });
      if (res.status === 200) {
        toast.success("Your account has been successfully activated!");
        setActivationState("success");
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      }
    } catch (error: any) {
      console.error("Account activation failed:", error);
      setActivationState("error");
      setErrorMessage(
        error?.response?.data?.message ||
        "Account activation failed. The link may have expired or is invalid."
      );
    }
  }, [router]);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setActivationState("error");
      setErrorMessage("Invalid activation link. No token provided.");
      return;
    }

    activateAccount(token);
  }, [searchParams, activateAccount]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Account Activation
          </CardTitle>
          <CardDescription>
            {activationState === "loading" && "Activating your account..."}
            {activationState === "success" &&
              "Your account has been activated!"}
            {activationState === "error" && "Activation Failed"}
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center">
          {activationState === "loading" && (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}

          {activationState === "success" && (
            <div className="py-4">
              <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6">
                <p>
                  Your account has been successfully activated. You will be
                  redirected to the dashboard.
                </p>
              </div>
            </div>
          )}

          {activationState === "error" && (
            <div className="py-4">
              <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
                <p>{errorMessage}</p>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-center">
          {activationState === "success" && (
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          )}

          {activationState === "error" && (
            <Button asChild>
              <Link href="/login">Return to Login</Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
