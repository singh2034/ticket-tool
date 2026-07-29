import { auth } from "@/auth";
import AddCommentForm from "@/components/ticket/AddCommentForm";
import AssignUserSelect from "@/components/ticket/AssignUserSelect";
import CommentList from "@/components/ticket/CommentList";
import DeleteTicketButton from "@/components/ticket/DeleteTicketButton";
import PrioritySelect from "@/components/ticket/PrioritySelect";
import StatusSelect from "@/components/ticket/StatusSelect";
import { Label } from "@/components/ui/label";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function TicketDetailsPage({ params }: Props) {
  const session = await auth();

  const role = session?.user?.role;
  const isAdmin = role === "ADMIN";
  const isAgent = role === "AGENT";
  const isUser = role === "USER";

  if (!session?.user?.id) {
    return notFound();
  }

  const { id } = await params;

  const userId = session.user.id;

  const ticket = await prisma.ticket.findFirst({
    where: {
      id,

      ...(role === "USER" && {
        createdById: userId,
      }),

      ...(role === "AGENT" && {
        assignedToId: userId,
      }),
    },

    include: {
      createdBy: true,
      assignedTo: true,
      comments: {
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!ticket) {
    return notFound();
  }

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

  return (
    <div className="max-w-3xl p-6 space-y-4">
      <h1 className="text-3xl font-bold">Ticket Title: {ticket.title}</h1>

      <div className="space-y-2">
        <Label className="text-2xl">Status</Label>
        {isUser ? (
          <Badge
            variant={
              ticket.status === "OPEN"
                ? "destructive"
                : ticket.status === "IN_PROGRESS"
                  ? "secondary"
                  : ticket.status === "RESOLVED"
                    ? "default"
                    : "outline"
            }
          >
            {ticket.status.replace("_", " ")}
          </Badge>
        ) : (
          <StatusSelect ticketId={ticket.id} status={ticket.status} />
        )}
      </div>

      <div>
        <Label className="text-2xl">Priority</Label>
        {isUser ? (
          <Badge
            variant={
              ticket.priority === "HIGH"
                ? "destructive"
                : ticket.priority === "MEDIUM"
                  ? "secondary"
                  : "outline"
            }
          >
            {ticket.priority}
          </Badge>
        ) : (
          <PrioritySelect ticketId={ticket.id} priority={ticket.priority} />
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-2xl">Assigned To</Label>

        {isAdmin ? (
          <AssignUserSelect
            ticketId={ticket.id}
            assignedToId={ticket.assignedToId}
            users={users}
          />
        ) : (
          <p className="font-medium">
            {ticket.assignedTo?.name ?? "Unassigned"}
          </p>
        )}
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

      {isAdmin && <DeleteTicketButton ticketId={ticket.id} />}
    </div>
  );
}
