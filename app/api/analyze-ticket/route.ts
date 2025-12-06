// app/api/analyze-ticket/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Types for your structured output
type Priority = "low" | "medium" | "high";
type Team =
  | "Support"
  | "IT"
  | "SRE"
  | "Payments"
  | "Identity"
  | "Logistics"
  | "Other";

function normalizePriority(value: unknown): Priority {
  const v = String(value || "").toLowerCase();

  if (v === "low") return "low";
  if (v === "medium" || v === "med") return "medium";

  // Anything else ("high", "critical", "urgent", "p1", etc.) -> high
  return "high";
}

function normalizeTeam(value: unknown): Team {
  const v = String(value || "").toLowerCase();

  if (v.includes("support")) return "Support";
  if (v === "it" || v.includes("helpdesk") || v.includes("service desk"))
    return "IT";
  if (v.includes("sre") || v.includes("reliability")) return "SRE";
  if (v.includes("payment") || v.includes("billing")) return "Payments";
  if (v.includes("identity") || v.includes("auth") || v.includes("login"))
    return "Identity";
  if (
    v.includes("logistics") ||
    v.includes("shipping") ||
    v.includes("delivery")
  )
    return "Logistics";

  return "Other";
}

export async function POST(req: Request) {
  try {
    const { text, source } = await req.json();

    if (!text) {
      return NextResponse.json(
        { error: "Missing ticket text" },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are an assistant that analyzes support/IT/system tickets and returns JSON only.",
        },
        {
          role: "user",
          content: `
Source: ${source}
Ticket text:
"""${text}"""

Analyze this ticket and return a JSON object with the following EXACT shape:

{
  "summary": "short 1–2 sentence summary of the ticket",
  "category": "short label like 'Login', 'Billing', 'Infrastructure', 'Shipping', 'Access', etc.",
  "priority": "one of ['low', 'medium', 'high'] ONLY.",
  "team": "one of ['Support', 'IT', 'SRE', 'Payments', 'Identity', 'Logistics', 'Other'] ONLY.",
  "suggestedReply": "what a human agent should reply, if this is customer- or employee-facing. If it's a pure system alert, you can put a short internal note instead.",
  "automationIdea": "one concrete idea for automation or monitoring that would reduce similar tickets in the future."
}

Return ONLY valid JSON. Do not include any explanations or additional text.
`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw);

    const result = {
      date: new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      summary: parsed.summary ?? "",
      category: parsed.category ?? "Uncategorized",
      priority: normalizePriority(parsed.priority),
      team: normalizeTeam(parsed.team),
      suggestedReply: parsed.suggestedReply ?? "",
      automationIdea: parsed.automationIdea ?? "",
    };

    //console.log("Result", result);

    return NextResponse.json(result);
  } catch (err) {
    console.error("analyze-ticket error", err);
    return NextResponse.json(
      { error: "Failed to analyze ticket" },
      { status: 500 }
    );
  }
}
