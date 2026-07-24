import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Ticket = {
  id: string;
  title: string;
  status: string;
  priority: string;
  createdBy: {
    name: string;
  };
};

export default function TicketTable({ tickets }: { tickets: Ticket[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Created By</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {tickets.map((ticket) => (
          <TableRow key={ticket.id}>
            <TableCell>{ticket.title}</TableCell>
            <TableCell>{ticket.status}</TableCell>
            <TableCell>{ticket.priority}</TableCell>
            <TableCell>{ticket.createdBy.name}</TableCell>
            <TableCell>
              <Link href={`/tickets/${ticket.id}`}>
                <Button size={"sm"}>Open</Button>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
