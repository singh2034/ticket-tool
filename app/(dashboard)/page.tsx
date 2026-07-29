import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import StatsCard from "@/components/dashboard/StatsCard";

export default async function Home() {
  const session = await auth();

  const userId = session?.user?.id;
  const role = session?.user?.role;

  // open tickets
  const openTickets = await prisma.ticket.count({
    where: {
      status: "OPEN",

      ...(role === "USER" && {
        createdById: userId,
      }),

      ...(role === "AGENT" && {
        assignedToId: userId,
      }),
    },
  });

  // in progress tickets
  const inProgressTickets = await prisma.ticket.count({
    where: {
      status: "IN_PROGRESS",

      ...(role === "USER" && {
        createdById: userId,
      }),

      ...(role === "AGENT" && {
        assignedToId: userId,
      }),
    },
  });

  // resolved tickets

  const resolvedTickets = await prisma.ticket.count({
    where: {
      status: "RESOLVED",

      ...(role === "USER" && {
        createdById: userId,
      }),

      ...(role === "AGENT" && {
        assignedToId: userId,
      }),
    },
  });

  // closed tickets
  const closedTickets = await prisma.ticket.count({
    where: {
      status: "CLOSED",

      ...(role === "USER" && {
        createdById: userId,
      }),

      ...(role === "AGENT" && {
        assignedToId: userId,
      }),
    },
  });

  // total tickets
  const totalTickets = await prisma.ticket.count({
    where: {
      ...(role === "USER" && {
        createdById: userId,
      }),

      ...(role === "AGENT" && {
        assignedToId: userId,
      }),
    },
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Welcome, {session?.user?.name} 👋
        </h1>

        <p className="text-muted-foreground">
          You are logged in as{" "}
          <span className="font-semibold">{session?.user?.role}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard title="Open Tickets" value={openTickets} />

        <StatsCard title="In Progress Tickets" value={inProgressTickets} />

        <StatsCard title="Resolved Tickets" value={resolvedTickets} />

        <StatsCard title="Closed Tickets" value={closedTickets} />

        <StatsCard title="Total Tickets" value={totalTickets} />
      </div>
    </div>
  );
}
