
async function handleDeleteTicketBtn(Data: {
  type: string;
  id: string;
  userId: string;
}) {

  if (Data.type === "ticket") {
    try {

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
