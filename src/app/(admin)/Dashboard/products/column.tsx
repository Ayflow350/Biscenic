// components/admin/products/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { VariantProps } from "class-variance-authority";

// --- CORRECTED IMPORTS ---
import { Product } from "../../lib/definitions"; // Using alias
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge, badgeVariants } from "@/components/ui/badge"; // Import badgeVariants
import { DataTableColumnHeader } from "../shared/data-table-column-header"; // Using alias

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

// Create a precise type for the Badge's `variant` prop
type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "availabilityStatus",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("availabilityStatus") as string;
      // This is the fully type-safe way to handle variants
      const statusVariantMap: Record<string, BadgeVariant> = {
        AVAILABLE: "success", // Use the custom "success" variant
        COMING_SOON: "secondary",
        OUT_OF_STOCK: "destructive",
        DISCONTINUED: "outline",
      };
      const variant: BadgeVariant = statusVariantMap[status] ?? "default";

      return <Badge variant={variant}>{status.replace(/_/g, " ")}</Badge>;
    },
  },
  {
    accessorKey: "pricing",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => (
      <div className="text-right">
        {formatCurrency(row.getValue("pricing"))}
      </div>
    ),
  },
  {
    accessorKey: "stockQuantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stock" />
    ),
    cell: ({ row }) => (
      <div className="text-right">{row.getValue("stockQuantity")}</div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
