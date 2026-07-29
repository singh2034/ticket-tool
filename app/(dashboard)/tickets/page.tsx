import TicketTable from "@/components/ticket/TicketTable";
import TicketSearch from "@/components/ticket/TicketSearch";
import StatusFilter from "@/components/ticket/StatusFilter";
import PriorityFilter from "@/components/ticket/PriorityFilter";
import AssigneeFilter from "@/components/ticket/AssigneeFilter";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";

interface Props {
  searchParams: Promise<{
    search?: string;
    status?: string;
    priority?: string;
    assignee?: string;
  }>;
}

export default async function TicketsPage({ searchParams }: Props) {
  const { search, status, priority, assignee } = await searchParams;

  // status filter
  const [total, open, inProgress, resolved, closed] = await Promise.all([
    prisma.ticket.count(),
    prisma.ticket.count({ where: { status: "OPEN" } }),
    prisma.ticket.count({ where: { status: "IN_PROGRESS" } }),
    prisma.ticket.count({ where: { status: "RESOLVED" } }),
    prisma.ticket.count({ where: { status: "CLOSED" } }),
  ]);

  // priority filter
  const [low, medium, high] = await Promise.all([
    prisma.ticket.count({
      where: { priority: "LOW" },
    }),
    prisma.ticket.count({
      where: { priority: "MEDIUM" },
    }),
    prisma.ticket.count({
      where: { priority: "HIGH" },
    }),
  ]);

  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;
  const role = session.user.role;

  // assignee
  const users = await prisma.user.findMany({
    where: {
      role: {
        in: ["ADMIN", "AGENT"],
      },
    },
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
    },
  });

  const tickets = await prisma.ticket.findMany({
    where: {
      
      // security
      ...(role === "USER" && {
        createdById: userId,
      }),

      ...(role === "AGENT" && {
        assignedToId: userId,
      }),

      // basic UI
      ...(search && {
        OR: [
          {
            title: {
              contains: search,
            },
          },
          {
            ticketNumber: Number(search) || -1,
          },
        ],
      }),

      ...(status && {
        status: status as "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED",
      }),

      ...(priority && {
        priority: priority as "LOW" | "MEDIUM" | "HIGH",
      }),

      ...(assignee && {
        assignedToId: assignee,
      }),
    },
    include: {
      createdBy: true,
      assignedTo: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  // for ticket testing output
  // console.log(JSON.stringify(tickets, null, 2));

  return (
    <>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Tickets</h1>

          <Link href="/tickets/new">
            <Button>Create Ticket</Button>
          </Link>
        </div>

        <div className="mt-4 space-y-4">
          <TicketSearch />
          <div className="flex gap-4">
            <StatusFilter
              counts={{
                all: total,
                open,
                inProgress,
                resolved,
                closed,
              }}
            />
            <PriorityFilter
              counts={{
                all: total,
                low,
                medium,
                high,
              }}
            />
            <AssigneeFilter users={users} />
          </div>
        </div>

        <div className="mt-6">
          <TicketTable tickets={tickets} />
        </div>
      </div>
    </>
  );
}
