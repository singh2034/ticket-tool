// "use client";

import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DeleteUserButton from "@/components/user/DeleteUserButton";

export default async function ViewUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // const router = useRouter();
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    notFound();
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>User Details</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <p className="text-sm text-muted-foreground">Name</p>
          <p className="font-medium">{user.name}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Email</p>
          <p className="font-medium">{user.email}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Role</p>
          <Badge>{user.role}</Badge>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Created At</p>
          <p>{user.createdAt.toLocaleString()}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Updated At</p>
          <p>{user.updatedAt.toLocaleString()}</p>
        </div>

        <div className="flex gap-2">
          <Button asChild>
            <Link href={`/admin/users/${user.id}/edit`}>Edit User</Link>
          </Button>

          {/* Delete User - Function */}
          <div>
            <DeleteUserButton userId={user.id} />
          </div>

          <Button variant="outline" asChild>
            <Link href="/admin/users">Back</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
