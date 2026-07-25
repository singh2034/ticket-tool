"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function CreateTicketForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        createdById: "cms0ewpip0000audxyshmm5mq", // hard-coded user ID
      }),
    });
    if (res.ok) {
      router.push("/tickets");
      router.refresh();
    }
  }

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-6">New Ticket</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ticket title */}
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Ticket Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        {/* ticket description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Enter your query"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        {/* submit */}
        <Button type="submit">
            Create Ticket
        </Button>
      </form>
    </div>
  );
}
