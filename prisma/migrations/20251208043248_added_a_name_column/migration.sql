/*
  Warnings:

  - Added the required column `nameInsight` to the `Insights` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameTicket` to the `Tickets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameWorkflow` to the `Workflows` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Insights" ADD COLUMN     "nameInsight" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Tickets" ADD COLUMN     "nameTicket" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Workflows" ADD COLUMN     "nameWorkflow" TEXT NOT NULL;
