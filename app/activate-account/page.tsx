import { Suspense } from "react";
import ActivateAccountContent from "@/components/pages/ActivateAccountContent";

export default function ActivateAccount() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      }
    >
      <ActivateAccountContent />
    </Suspense>
  );
}
