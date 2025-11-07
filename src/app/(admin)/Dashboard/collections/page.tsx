// app/(admin)/dashboard/collections/page.tsx
"use client"; // Needs to be a client component to use useQuery

import { useQuery } from "@tanstack/react-query";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DataTable } from "../shared/data-table";
import { columns } from "../../Dashboard/components/admin/collections/columns";
import { fetchCollections } from "@/lib/CollectionApi";
import { CollectionForm } from "../../Dashboard/components/admin/collections/collection-form";
import { Skeleton } from "@/components/ui/skeleton";

export default function CollectionsPage() {
  // Fetch data on the client using TanStack Query for automatic refetching
  const {
    data: collections,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["collections"],
    queryFn: fetchCollections,
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Collections</CardTitle>
            <CardDescription>Manage your product collections.</CardDescription>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Collection
                </span>
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-2xl">
              <SheetHeader>
                <SheetTitle>Create a New Collection</SheetTitle>
                <SheetDescription>
                  Fill in the details for your new collection.
                </SheetDescription>
              </SheetHeader>
              <div className="py-8 h-[calc(100vh-8rem)] overflow-y-auto px-6">
                <CollectionForm />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        )}
        {error && (
          <p className="text-destructive">Failed to load collections.</p>
        )}
        {collections && <DataTable columns={columns} data={collections} />}
      </CardContent>
    </Card>
  );
}
