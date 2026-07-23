// export async function getTickets() {
//   const res = await fetch("http://localhost:3000/api/tickets", {
//     cache: "no-store",
//   });
//   if (!res.ok) {
//     throw new Error("failed to fetch tickets");
//   }
//   return res.json();
// }

export async function getTicket(id: string) {
  const res = await fetch("/api/tickets/${id}");

  if (!res.ok) {
    throw new Error("failed to fetch ticket");
  }
  return res.json();
}

export async function createTicket(data: {
  title: string;
  description: string;
  createdById: string;
}) {
  const res = await fetch("/api/tickets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("failed to create ticket");
  }
  return res.json();
}
