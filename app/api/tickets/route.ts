import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// Create a new ticket
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const body = await request.json();
    const { title, description } = body;

    if (!title || !description) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const ticket = await prisma.$transaction(async (tx) => {
      const counter = await tx.counter.upsert({
        where: {
          id: 1,
        },
        update: {},
        create: {
          id: 1,
          nextTicketNumber: 1,
        },
      });

      const ticket = await tx.ticket.create({
        data: {
          ticketNumber: counter.nextTicketNumber,
          title,
          description,
          createdById: userId,
        },
      });

      await tx.ticketHistory.create({
        data: {
          ticketId: ticket.id,
          userId,
          action: "CREATED",
        },
      });

      await tx.counter.update({
        where: {
          id: 1,
        },
        data: {
          nextTicketNumber: {
            increment: 1,
          },
        },
      });

      return ticket;
    });
    return NextResponse.json(ticket, {
      status: 201,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// Get tickets
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const role = session.user.role;

    const tickets = await prisma.ticket.findMany({
      where:
        role === "ADMIN"
          ? {}
          : role === "AGENT"
            ? {
                assignedToId: userId,
              }
            : {
                createdById: userId,
              },

      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        success: true,
        count: tickets.length,
        data: tickets,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
