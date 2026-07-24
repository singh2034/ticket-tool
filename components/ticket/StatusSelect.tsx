"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StatusSelectProps {
  ticketId: string;
  status: string;
}

export default function StatusSelect({ ticketId, status }: StatusSelectProps) {
  return (
    <Select
      defaultValue={status}
      onValueChange={async (value) => {
        const res = await fetch(`/api/tickets/${ticketId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: value,
          }),
        });

        if (!res.ok) {
          alert("Failed to update status");
        }
      }}
    >
      <SelectTrigger className="w-[220px]">
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="OPEN">OPEN</SelectItem>
        <SelectItem value="IN_PROGRESS">IN PROGRESS</SelectItem>
        <SelectItem value="RESOLVED">RESOLVED</SelectItem>
        <SelectItem value="CLOSED">CLOSED</SelectItem>
      </SelectContent>
    </Select>
  );
}
