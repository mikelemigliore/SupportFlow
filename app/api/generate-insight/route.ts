// app/api/analyze-ticket/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { tickets } = await req.json();

    if (!Array.isArray(tickets) || tickets.length === 0) {
      return NextResponse.json(
        { error: "No tickets provided" },
        { status: 400 }
      );
    }

    // Study, IMPORTANT
    const ticketBlock = tickets
      .map(
        (t) => `
Ticket:
- Date: ${t.date}
- Source: ${t.source}
- Priority: ${t.priority}
- Summary: ${t.summary}
- Text: ${t.text}
`
      )
      .join("\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are an assistant that analyzes multiple support/IT/system tickets and returns JSON only.",
        },
        {
          role: "user",
          content: `
You are given a set of tickets. Find patterns and recommend improvements.

Tickets:
${ticketBlock}

Return a JSON object with this exact shape:

{

  "overallSummary": "1–3 sentence summary of what these tickets are mostly about.",
  "recurringIssues": [
    "Issue pattern 1...",
    "Issue pattern 2..."
  ],
  "automationIdeas": [
    "Automation idea 1...",
    "Automation idea 2..."
  ],
  "suggestedFaqs": [
    "FAQ/article idea 1...",
    "FAQ/article idea 2..."
  ]
}

/*
Important formatting rules:

- "overallSummary" must be a single string (1–3 sentences).
- "recurringIssues" must be an array of BETWEEN 1 AND 5 strings.
- "automationIdeas" must be an array of BETWEEN 1 AND 5 strings.
- "suggestedFaqs" must be an array of BETWEEN 1 AND 5 strings.
- Each string in the arrays should be a single concise bullet/idea.
- Do NOT include more than 5 items in any array.
*/

Return ONLY valid JSON. Do not include any explanations or extra text.
`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw);

    const toBulletString = (value: unknown): string => {
      if (Array.isArray(value)) {
        return value.map((v, i) => `${i + 1}. ${String(v)}`).join("\n");
      }
      if (value == null) return "";
      return String(value);
    };

    const result = {
      date: new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      overallSummary: toBulletString(parsed.overallSummary),
      recurringIssues: toBulletString(parsed.recurringIssues),
      automationIdeas: toBulletString(parsed.automationIdeas),
      suggestedFaqs: toBulletString(parsed.suggestedFaqs),
    };

    //console.log("result", result)

    return NextResponse.json(result);
  } catch (err) {
    console.error("generate-insight error", err);
    return NextResponse.json(
      { error: "Failed to generate insights" },
      { status: 500 }
    );
  }
}
