// components/admin/payments/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { IPayment, PaymentStatus } from "../../lib/definitions";
import Link from "next/link";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { DataTableColumnHeader } from "../shared/data-table-column-header";
import { VariantProps } from "class-variance-authority";

// --- Helpers ---
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    amount
  );

const formatDate = (date: Date) => new Date(date).toLocaleString();

type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

// --- Columns ---
export const columns: ColumnDef<IPayment>[] = [
  {
    accessorKey: "_id",
    header: "Transaction ID",
    cell: ({ row }) => (
      <div className="font-mono text-sm">{row.getValue("_id")}</div>
    ),
  },
  {
    accessorKey: "orderId",
    header: "Order ID",
    cell: ({ row }) => (
      <Link
        href={`/dashboard/orders/${row.original.orderId}`}
        className="font-medium text-primary hover:underline"
      >
        {row.getValue("orderId")}
      </Link>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as PaymentStatus;

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
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => (
      <div className="text-right font-medium">
        {formatCurrency(row.getValue("amount"))}
      </div>
    ),
  },
  {
    accessorKey: "customerName",
    header: "Customer",
  },
  {
    accessorKey: "paymentMethod",
    header: "Method",
  },
  {
    accessorKey: "paymentDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => <div>{formatDate(row.getValue("paymentDate"))}</div>,
  },
];
