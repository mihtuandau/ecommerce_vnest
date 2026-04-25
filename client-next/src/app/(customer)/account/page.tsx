import { AccountView } from "@/features/users/components/customer/AccountView";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export default function AccountPage() {
  return (
    <Suspense 
      fallback={
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10 space-y-6">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-10 w-72 rounded-xl" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      }
    >
      <AccountView />
    </Suspense>
  );
}
