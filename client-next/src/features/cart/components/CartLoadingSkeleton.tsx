import { Skeleton } from "@/components/ui/Skeleton";

export function CartLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-brand-cream pt-12 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-20 w-full rounded-full" />
      </div>
    </div>
  );
}
