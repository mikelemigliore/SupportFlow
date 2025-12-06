-- CreateTable
CREATE TABLE "WorkflowA" (
    "id" TEXT NOT NULL,
    "workflowsId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "team" TEXT NOT NULL,
    "workflowType" TEXT,
    "system" TEXT,
    "text" TEXT NOT NULL,

    CONSTRAINT "WorkflowA_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowB" (
    "id" TEXT NOT NULL,
    "workflowsId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "team" TEXT NOT NULL,
    "workflowType" TEXT,
    "system" TEXT,
    "text" TEXT NOT NULL,

    CONSTRAINT "WorkflowB_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WorkflowA" ADD CONSTRAINT "WorkflowA_workflowsId_fkey" FOREIGN KEY ("workflowsId") REFERENCES "Workflows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowB" ADD CONSTRAINT "WorkflowB_workflowsId_fkey" FOREIGN KEY ("workflowsId") REFERENCES "Workflows"("id") ON DELETE CASCADE ON UPDATE CASCADE;
