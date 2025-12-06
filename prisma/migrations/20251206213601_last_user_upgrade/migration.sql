/*
  Warnings:

  - You are about to drop the column `resetToken` on the `Workflows` table. All the data in the column will be lost.
  - You are about to drop the column `resetTokenExpiry` on the `Workflows` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpiry" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Workflows" DROP COLUMN "resetToken",
DROP COLUMN "resetTokenExpiry";
