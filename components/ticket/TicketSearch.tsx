"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";

export default function TicketSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    router.push(`/tickets?${params.toString()}`);
  }

  return (
    <Input
      placeholder="Search by ticket number or title..."
      defaultValue={searchParams.get("search") ?? ""}
      onChange={(e) => handleChange(e.target.value)}
    />
  );
}