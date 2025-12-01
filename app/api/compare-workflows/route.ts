// app/api/compare-workflows/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type WorkflowProps = {
  title: string;
  team: string;
  workflowType?: string;
  system?: string;
  text: string;
};

export async function POST(req: Request) {
  try {
    const { workflowA, workflowB } = (await req.json()) as {
      workflowA: WorkflowProps;
      workflowB: WorkflowProps;
    };

    if (!workflowA || !workflowB) {
      return NextResponse.json(
        { error: "No workflows provided" },
        { status: 400 }
      );
    }

    // Study better, this is different from the other two, this is different because it is an object,
    // not an array like the other two, therefore we don't use .map
    const workflowABlock = `
Title: ${workflowA.title || "Not provided"}
Team: ${workflowA.team || "Not provided"}
Type: ${workflowA.workflowType || "Not provided"}
System: ${workflowA.system || "Not provided"}

Steps / Description:
${workflowA.text || "Not provided"}
`;

    const workflowBBlock = `
Title: ${workflowB.title || "Not provided"}
Team: ${workflowB.team || "Not provided"}
Type: ${workflowB.workflowType || "Not provided"}
System: ${workflowB.system || "Not provided"}

Steps / Description:
${workflowB.text || "Not provided"}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are an assistant that compares two operational workflows (support, IT, SRE, logistics, etc.) and returns JSON only.",
        },
        {
          role: "user",
          content: `
You are given two workflows, A and B. Compare them, find bottlenecks, and suggest improvements and automation opportunities.

Workflow A:
${workflowABlock}

Workflow B:
${workflowBBlock}

Return a JSON object with this exact shape:

{
  "highLevelComparison": "1–3 sentence summary of how workflow B differs from workflow A and what they are generally about.",
  "keyDifferences": [
    "Difference 1 between A and B...",
    "Difference 2...",
    "Difference 3..."
  ],
  "bottlenecks": [
    "Specific bottleneck or inefficiency in either workflow...",
    "Another bottleneck..."
  ],
  "recommendations": [
    "Concrete recommendation 1 for improving the workflows...",
    "Recommendation 2..."
  ],
  "automationIdeas": [
    "Automation or monitoring idea 1 that could reduce manual work or errors...",
    "Automation idea 2..."
  ]
}

Return ONLY valid JSON. Do not include any explanations or extra text.
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
      highLevelComparison: parsed.highLevelComparison ?? "",
      keyDifferences: parsed.keyDifferences ?? [],
      bottlenecks: parsed.bottlenecks ?? [],
      recommendations: parsed.recommendations ?? [],
      automationIdeas: parsed.automationIdeas ?? [],
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error("compare-workflows error", err);
    return NextResponse.json(
      { error: "Failed to compare workflows" },
      { status: 500 }
    );
  }
}
