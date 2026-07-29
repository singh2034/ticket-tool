import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// get unique id of the ticket
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const ticket = await prisma.ticket.findUnique({
      where: { id },
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
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
    if (!ticket) {
      return NextResponse.json(
        { message: "Ticket not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(ticket, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

// update the ticket status by ID
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const role = session.user.role;
    const { id } = await params;
    const body = await request.json();
    const { status, priority, assignedToId } = body;
    const existingTicket = await prisma.ticket.findUnique({
      where: { id },
    });
    if (!existingTicket) {
      return NextResponse.json(
        { message: "Ticket not Found" },
        { status: 404 },
      );
    }
    if (role === "AGENT" && existingTicket.assignedToId !== session.user.id) {
      return NextResponse.json(
        { message: "Forbidden" }, //You are not assigned to this ticket
        { status: 403 },
      );
    }
    if (role === "USER") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    if (assignedToId) {
      const agent = await prisma.user.findUnique({
        where: { id: assignedToId },
      });

      if (!agent) {
        return NextResponse.json(
          { message: "Assigned user not found" },
          { status: 404 },
        );
      }
    }
    if (role === "AGENT" && assignedToId !== undefined) {
      return NextResponse.json(
        { message: "Forbidden" }, //Only admins can assign tickets
        { status: 403 },
      );
    }
    const updateData: {
      status?: typeof status;
      priority?: typeof priority;
      assignedToId?: string | null;
    } = {};

    if (status !== undefined) {
      updateData.status = status;
    }

    if (priority !== undefined) {
      updateData.priority = priority;
    }

    if (role === "ADMIN" && assignedToId !== undefined) {
      updateData.assignedToId = assignedToId;
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id },
      data: updateData,
    });
    return NextResponse.json(updatedTicket, {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}

// delete ticket
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    const { id } = await params;

    const ticket = await prisma.ticket.findUnique({
      where: { id },
    });

    if (!ticket) {
      return NextResponse.json(
        { message: "Ticket not found" },
        { status: 404 },
      );
    }

    await prisma.comment.deleteMany({
      where: {
        ticketId: id,
      },
    });

    await prisma.ticket.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      { message: "Ticket deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
