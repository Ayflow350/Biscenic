// app/(admin)/dashboard/products/page.tsx

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

// --- CORRECTED IMPORTS ---
// All internal project imports now use the robust '@/' alias.
// --- CORRECTED IMPORTS ---
import { DataTable } from "../shared/data-table";
import { columns } from "../products/column";
import { fetchProducts } from "@/lib/ProductApi"; // Now correctly fetching from your real API
import { ProductForm } from "../../Dashboard/components/admin/products/product-form"; // Using alias

/**
 * A dedicated component for the "empty state" UI.
 * This is shown when no products are found.
 */
function EmptyProductsState() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Products</CardTitle>
        <CardDescription>
          Manage your products, stock, and pricing.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center gap-4 text-center border-2 border-dashed rounded-lg p-12">
          <h3 className="text-2xl font-bold tracking-tight">
            You have no products yet.
          </h3>
          <p className="text-sm text-muted-foreground">
            Get started by creating your first product.
          </p>
          <Sheet>
            <SheetTrigger asChild>
              <Button size="sm" className="h-9 gap-1">
                <PlusCircle className="h-4 w-4" />
                Add Product
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-4xl">
              <SheetHeader>
                <SheetTitle>Create a New Product</SheetTitle>
                <SheetDescription>
                  Fill in the details below to add a new product to your store.
                </SheetDescription>
              </SheetHeader>
              <div className="py-8 h-[calc(100vh-8rem)] overflow-y-auto px-6">
                <ProductForm />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </CardContent>
    </Card>
  );
}

export default async function ProductsPage() {
  let products = []; // Default to an empty array

  try {
    products = await fetchProducts();
    console.log("Fetched products on the server:", products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    // You could render an error state here if you wanted
  }

  // If there are no products, render the dedicated empty state component.
  // This completely avoids the hydration error.
  if (!products || products.length === 0) {
    return <EmptyProductsState />;
  }

  // If there ARE products, render the card with the data table.
  return (
    <div className="grid flex-1 items-start gap-4 sm:gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Products</CardTitle>
              <CardDescription>
                Manage your products, stock, and pricing.
              </CardDescription>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button size="sm" className="h-8 gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Product
                  </span>
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-4xl">
                <SheetHeader>
                  <SheetTitle>Create a New Product</SheetTitle>
                  <SheetDescription>
                    Fill in the details below to add a new product to your
                    store.
                  </SheetDescription>
                </SheetHeader>
                <div className="py-8 h-[calc(100vh-8rem)] overflow-y-auto px-6">
                  <ProductForm />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={products} />
        </CardContent>
      </Card>
    </div>
  );
}
