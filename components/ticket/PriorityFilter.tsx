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
    low: number;
    medium: number;
    high: number;
  };
}

export default function PriorityFilter({ counts }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams);

    if (value === "ALL") {
      params.delete("priority");
    } else {
      params.set("priority", value);
    }

    router.push(`/tickets?${params.toString()}`);
  }

  return (
    <Select
      defaultValue={searchParams.get("priority") ?? "ALL"}
      onValueChange={handleChange}
    >
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Priority" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="ALL">All ({counts.all})</SelectItem>
        <SelectItem value="LOW">Low ({counts.low})</SelectItem>
        <SelectItem value="MEDIUM">Medium ({counts.medium})</SelectItem>
        <SelectItem value="HIGH">High ({counts.high})</SelectItem>
      </SelectContent>
    </Select>
  );
}