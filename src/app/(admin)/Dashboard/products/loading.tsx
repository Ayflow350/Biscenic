// app/(admin)/dashboard/products/loading.tsx

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ProductsLoadingSkeleton() {
  return (
    <div className="grid flex-1 items-start gap-4 sm:gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            {/* Placeholder for Title and Description */}
            <div className="space-y-2">
              <Skeleton className="h-7 w-32" />
              <Skeleton className="h-4 w-72" />
            </div>
            {/* Placeholder for the "Add Product" button */}
            <Skeleton className="h-9 w-28 rounded-md" />
          </div>
        </CardHeader>
        <CardContent>
          {/* Placeholder for the DataTable */}
          <div className="space-y-3">
            {/* Simulate a table header */}
            <Skeleton className="h-12 w-full rounded-md" />
            {/* Simulate table rows */}
            <div className="space-y-2">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
