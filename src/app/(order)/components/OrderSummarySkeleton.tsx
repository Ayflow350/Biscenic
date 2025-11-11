// components/OrderSummarySkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle } from "lucide-react";

export function OrderSummarySkeleton() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4 bg-background text-foreground">
      <div className="text-center max-w-4xl w-full p-8 border rounded-lg shadow-lg space-y-8">
        {/* Header Skeleton */}
        <div className="space-y-4">
          {/* Faux Success Icon - use a pulsing color */}
          <CheckCircle className="h-16 w-16 text-green-300 dark:text-green-600 mx-auto animate-pulse" />
          <Skeleton className="h-10 w-3/4 mx-auto" />
          <Skeleton className="h-5 w-1/2 mx-auto" />
          <Skeleton className="h-5 w-1/4 mx-auto" />
        </div>

        {/* Details Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
          {/* Items Skeleton (2/3 width) */}
          <div className="lg:col-span-2 space-y-4 p-6 border rounded-lg">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-3 pt-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/6" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/6" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/6" />
              </div>
            </div>
          </div>

          {/* Summary Skeleton (1/3 width) */}
          <div className="lg:col-span-1 space-y-4 p-6 border rounded-lg">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-3 text-sm pt-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <Skeleton className="h-px w-full my-2" />
              <div className="flex justify-between font-bold text-base">
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-5 w-1/3" />
              </div>

              <Skeleton className="h-4 w-2/3 pt-4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>

        {/* Buttons Skeleton */}
        <div className="flex flex-wrap justify-center gap-3 pt-4">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
    </div>
  );
}
