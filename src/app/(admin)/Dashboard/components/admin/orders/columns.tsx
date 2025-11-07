// components/admin/orders/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  IOrder,
  OrderStatus,
  PaymentStatus,
} from "../../../../lib/definitions";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { DataTableColumnHeader } from "../../../shared/data-table-column-header";
import { VariantProps } from "class-variance-authority";

// --- Helpers ---
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    amount
  );

const formatDate = (date: Date) => new Date(date).toLocaleDateString();

type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

// --- Columns ---
export const columns: ColumnDef<IOrder>[] = [
  {
    accessorKey: "_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order ID" />
    ),
    cell: ({ row }) => (
      <Link
        href={`/dashboard/orders/${row.original._id}`}
        className="font-medium text-primary hover:underline"
      >
        {row.getValue("_id")}
      </Link>
    ),
  },
  {
    accessorKey: "customerName",
    header: "Customer",
  },
  {
    accessorKey: "status",
    header: "Order Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as OrderStatus;

      // ✅ Type-safe mapping
      const orderStatusVariantMap: Record<OrderStatus, BadgeVariant> = {
        [OrderStatus.PROCESSING]: "secondary",
        [OrderStatus.SHIPPED]: "default",
        [OrderStatus.DELIVERED]: "success",
        [OrderStatus.CANCELED]: "destructive",
      };

      const variant: BadgeVariant = orderStatusVariantMap[status] ?? "default";

      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment",
    cell: ({ row }) => {
      const status = row.getValue("paymentStatus") as PaymentStatus;

      // ✅ Type-safe mapping
      const paymentStatusVariantMap: Record<PaymentStatus, BadgeVariant> = {
        [PaymentStatus.PAID]: "success",
        [PaymentStatus.PENDING]: "secondary",
        [PaymentStatus.FAILED]: "destructive",
      };

      const variant: BadgeVariant =
        paymentStatusVariantMap[status] ?? "default";

      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total" />
    ),
    cell: ({ row }) => (
      <div className="text-right">
        {formatCurrency(row.getValue("totalAmount"))}
      </div>
    ),
  },
  {
    accessorKey: "orderDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => <div>{formatDate(row.getValue("orderDate"))}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/orders/${row.original._id}`}>
              View Order
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>Mark as Shipped</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
