import TicketTable from "@/components/ticket/TicketTable";
import TicketSearch from "@/components/ticket/TicketSearch";
import StatusFilter from "@/components/ticket/StatusFilter";
import PriorityFilter from "@/components/ticket/PriorityFilter";
import AssigneeFilter from "@/components/ticket/AssigneeFilter";
import Pagination from "@/components/ticket/Pagination";
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
    page?: string;
    sort?: string;
    order?: string;
  }>;
}

export default async function TicketsPage({ searchParams }: Props) {
  const { search, status, priority, assignee, page, sort, order } =
    await searchParams;

  // pagination function
  const currentPage = Number(page) || 1;
  const pageSize = 10;

  // sorting
  const sortField = sort ?? "createdAt";
  const sortOrder = order === "asc" ? "asc" : "desc";

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

  // console.log("Current Page:", currentPage);
  // console.log("Skip:", (currentPage - 1) * pageSize);

  const totalTickets = await prisma.ticket.count({
    where: {
      ...(role === "USER" && {
        createdById: userId,
      }),

      ...(role === "AGENT" && {
        assignedToId: userId,
      }),

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
  });

  const totalPages = Math.ceil(totalTickets / pageSize);

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
      [sortField]: sortOrder,
    },

    skip: (currentPage - 1) * pageSize,
    take: pageSize,
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

        <div className="mt-6 space-y-6">
          <TicketTable tickets={tickets} />
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
      </div>
    </>
  );
}
