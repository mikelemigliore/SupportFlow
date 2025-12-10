
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
  name?: string;
  bottlenecks?: string;
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
  suggestedFaqs?: string;
}) {

  if (Data.type === "Ticket") {
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

  if (Data.type === "Workflow") {
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

  if (Data.type === "Insight") {
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
      return { success: true };
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
