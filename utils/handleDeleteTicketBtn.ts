import { useState } from "react";

async function handleDeleteTicketBtn(ticketData: {
  id: string;
  userId: string;
  date: string;
  text: string;
  source: string;
  summary: string;
  category: string;
  priority: string;
  team: string;
  suggestedReply: string;
  automationIdea: string;
}) {
  //console.log("Saving ticket data:", ticketData);
  try {
    //console.log("ticketData", ticketData)
    const res = await fetch("/api/tickets", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: ticketData.id }),
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

export default handleDeleteTicketBtn;
