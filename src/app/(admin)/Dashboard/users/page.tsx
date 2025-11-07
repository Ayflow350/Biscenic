// app/(admin)/dashboard/users/page.tsx

import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "../shared/data-table";
import { columns } from "./columns";
import { fetchUsers } from "../../lib/data";

export default async function UsersPage() {
  const users = await fetchUsers();

  return (
    <div className="grid flex-1 items-start gap-4 sm:gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                Manage your registered users and view their details.
              </CardDescription>
            </div>
            {/* The "Add User" button would trigger a Dialog or Sheet component */}
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add User
              </span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={users} />
        </CardContent>
      </Card>
    </div>
  );
}
