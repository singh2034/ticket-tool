import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { notFound } from "next/navigation";
import StatusSelect from "@/components/ticket/StatusSelect";
import PrioritySelect from "@/components/ticket/PrioritySelect";

interface Props {
  params: Promise<{
    id: String;
  }>;
}

export default async function TicketDetailsPage({ params }: Props) {
  const { id } = await params;

  const res = await fetch(`http://localhost:3000/api/tickets/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    return notFound();
  }

  const ticket = await res.json();

  return (
    <div className="max-w-3xl p-6 space-y-4">
      <h1 className="text-3xl font-bold">Ticket Title: {ticket.title}</h1>

      <div className="space-y-2">
        <Label className="text-2xl">Status</Label>
        <StatusSelect ticketId={ticket.id} status={ticket.status} />
      </div>

      <div>
        <Label className="text-2xl">Priority</Label>
        <PrioritySelect ticketId={ticket.id} priority={ticket.priority} />
      </div>

      <div>
        <strong className="text-2xl">Description:</strong>
        <p className="mt-2">{ticket.description}</p>
      </div>
    </div>
  );
}
