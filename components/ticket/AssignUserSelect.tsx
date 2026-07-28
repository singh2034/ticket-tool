"use client";

import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface User {
  id: string;
  name: string;
  role: string;
}

interface Props {
  ticketId: string;
  assignedToId: string | null;
  users: User[];
}

export default function AssignUserSelect({
  ticketId,
  assignedToId,
  users,
}: Props) {
  const router = useRouter();

  async function handleChange(value: string) {
    await fetch(`/api/tickets/${ticketId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        assignedToId: value === "unassigned" ? null : value,
      }),
    });

    router.refresh();
  }

  return (
    <Select
      value={assignedToId ?? "unassigned"}
      onValueChange={handleChange}
    >
      <SelectTrigger>
        <SelectValue placeholder="Assign User" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="unassigned">
          Unassigned
        </SelectItem>

        {users.map((user) => (
          <SelectItem key={user.id} value={user.id}>
            {user.name} ({user.role})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}