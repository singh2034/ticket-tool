import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Role, Prisma } from "@prisma/client";

//  get an user by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: " Internal Server Error" },
      { status: 500 },
    );
  }
}

// update user
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, email, role, password } = body;
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const data: {
      name?: string;
      email?: string;
      role?: Role;
      password?: string;
    } = {};

    if (name) data.name = name;
    if (email) data.email = email;
    if (role) data.role = role as Role;

    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return NextResponse.json(
      {
        message: "User updated successfully",
        user: updatedUser,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// delete user
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    // no need of the below function
    // const existingUser = await prisma.user.findMany({ where: { id } });
    // if (!existingUser) {
    //   return NextResponse.json({ error: "User not found" }, { status: 404 });
    // }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
