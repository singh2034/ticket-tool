/*
  Warnings:

  - Added the required column `name` to the `OTP` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passwordHash` to the `OTP` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OTP" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "passwordHash" TEXT NOT NULL;
