import { useState } from "react";

type WorkflowProps = {
  title: string;
  team: string;
  workflowType?: string;
  system?: string;
  text: string;
};

async function handleSaveBtn(Data: {
  type: string;
  userId: string;
  bottlenecks?: string;
  highLevelComparison?: string;
  keyDifferences?: string;
  recommendations?: string;
  date: string;
  text?: string;
  source?: string;
  summary?: string;
  category?: string;
  priority?: string;
  team?: string;
  suggestedReply?: string;
  automationIdea?: string;
  workflowA?: WorkflowProps;
  workflowB?: WorkflowProps;
  automationIdeas?: string;
  recurringIssues?: string;
  overallSummary?: string;
  suggestedFaqs?: string;
}) {
  //console.log("Saving ticket data:", ticketData);
  if (Data.type === "ticket") {
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Data),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save ticket");
      }

      return { success: true, ticket: data.ticket };
    } catch (err: any) {
      console.error("Save ticket failed:", err);
      return {
        success: false,
        error: err?.message || "Unknown error",
      };
    }
  }

  if (Data.type === "workflow") {
    //console.log("Data", Data);
    try {
      const res = await fetch("/api/workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Data),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save workflow");
      }

      return { success: true, workflow: data.workflow };
    } catch (err: any) {
      console.error("Save workflow failed:", err);
      return {
        success: false,
        error: err?.message || "Unknown error",
      };
    }
  }

  if (Data.type === "insight") {
    //console.log("Data", Data);
    try {
      const res = await fetch("/api/insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Data),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save insight");
      }
      //console.log("Allright", Data);
      return { success: true };
      //return { success: true, insight: data.insight };
    } catch (err: any) {
      console.error("Save insight failed:", err);
      return {
        success: false,
        error: err?.message || "Unknown error",
      };
    }
  }
}

export default handleSaveBtn;
