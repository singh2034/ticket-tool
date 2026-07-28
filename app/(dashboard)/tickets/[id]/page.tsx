import { Label } from "@/components/ui/label";
import { notFound } from "next/navigation";
import StatusSelect from "@/components/ticket/StatusSelect";
import PrioritySelect from "@/components/ticket/PrioritySelect";
import CommentList from "@/components/ticket/CommentList";
import AddCommentForm from "@/components/ticket/AddCommentForm";
import AssignUserSelect from "@/components/ticket/AssignUserSelect";
import { prisma } from "@/lib/prisma";
import DeleteTicketButton from "@/components/ticket/DeleteTicketButton";

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
  const users = await prisma.user.findMany({
    where: {
      role: {
        in: ["ADMIN", "AGENT"],
      },
    },
    select: {
      id: true,
      name: true,
      role: true,
    },
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

      <div className="space-y-2">
        <Label className="text-2xl">Assigned To</Label>

        <AssignUserSelect
          ticketId={ticket.id}
          assignedToId={ticket.assignedToId}
          users={users}
        />
      </div>

      <div>
        <strong className="text-2xl">Description:</strong>
        <p className="mt-2">{ticket.description}</p>
      </div>

      <div className="space-y-2">
        <Label className="text-2xl">Comments</Label>

        <CommentList ticketId={ticket.id} />
        <AddCommentForm ticketId={ticket.id} />
      </div>

      <DeleteTicketButton ticketId={ticket.id} />
    </div>
  );
}
