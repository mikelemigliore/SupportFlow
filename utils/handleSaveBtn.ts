import { useState } from "react";

async function handleSaveBtn(ticketData: {
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
    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ticketData),
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

export default handleSaveBtn;
