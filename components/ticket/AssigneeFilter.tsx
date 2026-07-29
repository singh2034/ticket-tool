"use client";

import { useRouter, useSearchParams } from "next/navigation";

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
}

interface Props {
  users: User[];
}

export default function AssigneeFilter({ users }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams);

    if (value === "ALL") {
      params.delete("assignee");
    } else {
      params.set("assignee", value);
    }

    router.push(`/tickets?${params.toString()}`);
  }

  return (
    <Select
      defaultValue={searchParams.get("assignee") ?? "ALL"}
      onValueChange={handleChange}
    >
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Assignee" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="ALL">All Assignees</SelectItem>

        {users.map((user) => (
          <SelectItem key={user.id} value={user.id}>
            {user.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}