import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { message: "Email and OTP are required" },
        { status: 400 },
      );
    }

    const verification = await prisma.oTP.findFirst({
      where: {
        email,
      },
    });

    if (!verification) {
      return NextResponse.json(
        { message: "Invalid OTP" },
        { status: 400 },
      );
    }

    const otpValid = await bcrypt.compare(
      otp,
      verification.otp,
    );

    if (!otpValid) {
      return NextResponse.json(
        { message: "Invalid OTP" },
        { status: 400 },
      );
    }

    if (verification.expiresAt < new Date()) {
      await prisma.oTP.delete({
        where: {
          id: verification.id,
        },
      });

      return NextResponse.json(
        { message: "OTP has expired" },
        { status: 400 },
      );
    }

    const user = await prisma.user.create({
      data: {
        name: verification.name,
        email: verification.email,
        password: verification.passwordHash,
        role: "USER",
      },
    });

    await prisma.oTP.delete({
      where: {
        id: verification.id,
      },
    });

    return NextResponse.json(
      {
        message: "Email verified successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}