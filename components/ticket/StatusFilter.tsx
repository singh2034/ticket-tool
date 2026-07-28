"use client";

import { useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  counts: {
    all: number;
    open: number;
    inProgress: number;
    resolved: number;
    closed: number;
  };
}

export default function StatusFilter({ counts }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams);

    if (value === "ALL") {
      params.delete("status");
    } else {
      params.set("status", value);
    }

    router.push(`/tickets?${params.toString()}`);
  }

  return (
    <Select
      defaultValue={searchParams.get("status") ?? "ALL"}
      onValueChange={handleChange}
    >
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Status" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="ALL">All Status ({counts.all})</SelectItem>
        <SelectItem value="OPEN">Open ({counts.open})</SelectItem>
        <SelectItem value="IN_PROGRESS">
          In Progress ({counts.inProgress})
        </SelectItem>
        <SelectItem value="RESOLVED">Resolved ({counts.resolved})</SelectItem>
        <SelectItem value="CLOSED">Closed ({counts.closed})</SelectItem>
      </SelectContent>
    </Select>
  );
}
