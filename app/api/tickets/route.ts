import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// create a new ticket
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, createdById } = body;

    if (!title || !description || !createdById) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: createdById,
      },
    });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // last Ticket feature added - for ticket number counting TK-001
    const counter = await prisma.counter.upsert({
      where: {
        id: 1,
      },
      update: {},
      create: {
        id: 1,
        nextTicketNumber: 1,
      },
    });

    // create ticket call
    const ticket = await prisma.ticket.create({
      data: {
        ticketNumber: counter.nextTicketNumber,
        title,
        description,
        createdById,
      },
    });

    // update counter
    await prisma.counter.update({
      where: { id: 1 },
      data: {
        nextTicketNumber: {
          increment: 1,
        },
      },
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

// get the ticket
export async function GET() {
  try {
    const tickets = await prisma.ticket.findMany({
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
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
