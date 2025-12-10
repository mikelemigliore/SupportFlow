/*
  Warnings:

  - You are about to drop the column `overallSummary` on the `Insights` table. All the data in the column will be lost.
  - You are about to drop the column `highLevelComparison` on the `Workflows` table. All the data in the column will be lost.
  - Added the required column `summary` to the `Insights` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Insights` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Tickets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `summary` to the `Workflows` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Workflows` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Insights" DROP COLUMN "overallSummary",
ADD COLUMN     "summary" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Tickets" ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Workflows" DROP COLUMN "highLevelComparison",
ADD COLUMN     "summary" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;
