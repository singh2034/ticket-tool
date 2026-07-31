import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("Bl@ckorder998", 10);

  await prisma.user.create({
    data: {
      name: "Aayush",
      email: "aayush@admin.com",
      password,
      role: "ADMIN",
    },
  });
}

main()
  .finally(() => prisma.$disconnect());