/*
  Warnings:

  - You are about to drop the column `nameInsight` on the `Insights` table. All the data in the column will be lost.
  - You are about to drop the column `nameTicket` on the `Tickets` table. All the data in the column will be lost.
  - You are about to drop the column `nameWorkflow` on the `Workflows` table. All the data in the column will be lost.
  - Added the required column `name` to the `Insights` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Tickets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Workflows` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Insights" DROP COLUMN "nameInsight",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Tickets" DROP COLUMN "nameTicket",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Workflows" DROP COLUMN "nameWorkflow",
ADD COLUMN     "name" TEXT NOT NULL;
