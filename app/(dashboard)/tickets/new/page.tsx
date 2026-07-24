"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";

import CreateTicketForm from "@/components/ticket/CreateTicketForm";

export default function NewTicketPage() {
  // const [title, setTitle] = useState("");
  // const [description, setDescription] = useState("");

  // const router = useRouter();

  // async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  //   e.preventDefault();

  //   const res = await fetch("/api/tickets", {
  //     method: "POST",
  //     headers: {
  //       "content-type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       title,
  //       description,
  //       createdById: "cmrx9jugm0000auejp40mx5mp", // hard-coded user ID
  //     }),
  //   });
  //   if (res.ok) {
  //     router.push("/tickets");
  //     router.refresh();
  //   }
  // }

  return (
    <div className="p-6 w-full mx-auto">
      <CreateTicketForm />
    </div>
  );
}
