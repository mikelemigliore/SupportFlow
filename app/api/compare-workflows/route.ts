// app/api/compare-workflows/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

const teams = [
  { value: "support-tier-1", label: "Support – Tier 1" },
  { value: "support-tier-2", label: "Support – Tier 2" },
  { value: "support-escalations", label: "Support – Escalations" },

  { value: "it-helpdesk", label: "IT – Helpdesk" },
  { value: "it-infrastructure", label: "IT – Infrastructure" },
  { value: "it-security", label: "IT – Security" },
  { value: "it-identity-access", label: "IT – Identity & Access" },

  { value: "sre", label: "SRE – Site Reliability Engineering" },
  { value: "devops", label: "DevOps / Platform Engineering" },
  { value: "cloud-ops", label: "Cloud Operations" },

  { value: "engineering-frontend", label: "Engineering – Frontend" },
  { value: "engineering-backend", label: "Engineering – Backend" },
  { value: "engineering-fullstack", label: "Engineering – Fullstack" },
  { value: "engineering-quality", label: "Engineering – QA" },

  { value: "billing-team", label: "Billing & Finance" },
  { value: "payments-team", label: "Payments" },

  { value: "logistics-team", label: "Logistics & Shipping" },
  { value: "inventory-team", label: "Inventory Management" },
  { value: "procurement-team", label: "Procurement" },
  { value: "supplier-relations", label: "Supplier Relations" },

  { value: "hr-team", label: "Human Resources" },
  { value: "talent-team", label: "HR – Talent & Onboarding" },
  { value: "payroll-team", label: "HR – Payroll" },

  { value: "sales-team", label: "Sales" },
  { value: "marketing-team", label: "Marketing" },
  { value: "customer-success", label: "Customer Success" },

  { value: "legal-team", label: "Legal" },
  { value: "compliance-team", label: "Compliance" },
];

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

    const getTeamLabel = (teamValue?: string) => {
      if (!teamValue) return "Not provided";
      const match = teams.find(
        (t) => t.value === teamValue || t.label === teamValue
      );
      return match?.label ?? teamValue;
    };

    const teamLabel = getTeamLabel(workflowA.team);

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
  "team": ${teamLabel || "Not provided"}
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
      team: parsed.team ?? "",
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
