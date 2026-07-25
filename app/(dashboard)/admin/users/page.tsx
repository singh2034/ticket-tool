import { prisma } from "@/lib/prisma";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Just Fetch and Display the users

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Users</CardTitle>
        <Button asChild>
          <Link href={"/admin/users/new"}>New User</Link>
        </Button>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{user.role}</Badge>
                </TableCell>
                <TableCell>{user.createdAt.toLocaleDateString()}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/users/${user.id}`}>View</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/users/${user.id}/edit`}>Edit</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
