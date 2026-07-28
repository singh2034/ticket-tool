import TicketTable from "@/components/ticket/TicketTable";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function TicketsPage() {
  const tickets = await prisma.ticket.findMany({
    include: { createdBy: true },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Tickets</h1>
      <Link href="/tickets/new">
        <Button>Create Ticket</Button>
      </Link>
      <TicketTable tickets={tickets} />
    </div>
  );
}
