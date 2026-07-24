"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PrioritySelectProps {
  ticketId: string;
  priority: string;
}

export default function PrioritySelect({
  ticketId,
  priority,
}: PrioritySelectProps) {
  return (
    <Select
      defaultValue={priority}
      onValueChange={async (value) => {
        const res = await fetch(`/api/tickets/${ticketId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ priority: value }),
        });
        if (!res.ok) {
          alert("Failed to update priority");
        }
      }}
    >
      <SelectTrigger className="w-[220px]">
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="LOW">LOW</SelectItem>
        <SelectItem value="MEDIUM">MEDIUM</SelectItem>
        <SelectItem value="HIGH">HIGH</SelectItem>
      </SelectContent>
    </Select>
  );
}
