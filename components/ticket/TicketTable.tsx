import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
        </TableRow>
      </TableHeader>

      <TableBody>
        {tickets.map((ticket) => (
          <TableRow key={ticket.id}>
            <TableCell>{ticket.title}</TableCell>
            <TableCell>{ticket.status}</TableCell>
            <TableCell>{ticket.priority}</TableCell>
            <TableCell>{ticket.createdBy.name}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
