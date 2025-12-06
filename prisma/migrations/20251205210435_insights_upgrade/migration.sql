-- CreateTable
CREATE TABLE "Insights" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "overallSummary" TEXT NOT NULL,
    "recurringIssues" TEXT NOT NULL,
    "automationIdeas" TEXT NOT NULL,
    "suggestedFaqs" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Insights_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Insights_userId_createdAt_idx" ON "Insights"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "Insights" ADD CONSTRAINT "Insights_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
