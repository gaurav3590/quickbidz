import { Suspense } from "react";
import ResetPasswordContent from "@/components/pages/ResetPasswordContent";

export default function ResetPassword() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
