import { useState } from "react";

// type WorkflowProps = {
//   title: string;
//   team: string;
//   workflowType?: string;
//   system?: string;
//   text: string;
// };

async function handleDeleteTicketBtn(Data: {
  type: string;
  id: string;
  userId: string;
  // bottlenecks?: string;
  // highLevelComparison?: string;
  // keyDifferences?: string;
  // recommendations?: string;
  // date: string;
  // text?: string;
  // source?: string;
  // summary?: string;
  // category?: string;
  // priority?: string;
  // team?: string;
  // suggestedReply?: string;
  // automationIdea?: string;
  // workflowA?: WorkflowProps;
  // workflowB?: WorkflowProps;
}) {
  //console.log("Saving ticket data:", ticketData);
  if (Data.type === "ticket") {
    try {
      //console.log("ticketData", ticketData)
      const res = await fetch("/api/tickets", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: Data.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete ticket");
      }

      return { success: true };
    } catch (err: any) {
      console.error("Delete ticket failed:", err);
      return {
        success: false,
        error: err?.message || "Unknown error",
      };
    }
  }

  if (Data.type === "workflow") {
    try {
      //console.log("ticketData", ticketData)
      const res = await fetch("/api/workflow", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: Data.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete workflow");
      }

      return { success: true };
    } catch (err: any) {
      console.error("Delete workflow failed:", err);
      return {
        success: false,
        error: err?.message || "Unknown error",
      };
    }
  }


    if (Data.type === "insight") {
    try {
      //console.log("ticketData", ticketData)
      const res = await fetch("/api/insight", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: Data.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete insight");
      }

      return { success: true };
    } catch (err: any) {
      console.error("Delete insight failed:", err);
      return {
        success: false,
        error: err?.message || "Unknown error",
      };
    }
  }
}

export default handleDeleteTicketBtn;
