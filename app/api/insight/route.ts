
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

// Helper to get logged-in userId from NextAuth or custom session-token
async function getLoggedInUserId(req: NextRequest): Promise<string | null> {
  // Prefer custom session-token if it exists
  const sessionToken = req.cookies.get("session-token")?.value;

  if (sessionToken) {
    const dbSession = await db.session.findUnique({
      where: { token: sessionToken },
    });

    if (dbSession && dbSession.expiresAt >= new Date()) {
      return dbSession.userId;
    }
  }

  const session = await auth();

  if (session?.user?.email) {
    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });
    if (user) return user.id;
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getLoggedInUserId(req);

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();

    const {
      type,
      date,
      summary,
      recurringIssues,
      automationIdeas,
      suggestedFaqs,
      name
    } = body;

    if (
      !type ||
      !date ||
      !summary ||
      !recurringIssues ||
      !automationIdeas ||
      !suggestedFaqs ||
      !name
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const insights = await db.insights.create({
      data: {
        type,
        userId, 
        date,
        name,
        summary,
        recurringIssues,
        automationIdeas,
        suggestedFaqs,
      },
    });


    return NextResponse.json({ insights }, { status: 201 });
  } catch (err) {
    console.error("Error creating insight:", err);
    return NextResponse.json(
      { error: "Failed to create insight" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getLoggedInUserId(req);

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const insight = await db.insights.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });

    //console.log("Workflow", workflow);

    return NextResponse.json({ insight }, { status: 200 });
  } catch (err) {
    console.error("Error fetching insight:", err);
    return NextResponse.json(
      { error: "Failed to fetch insight" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = await getLoggedInUserId(req);

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await req.json();
    //console.log("id", id);

    if (!id) {
      return NextResponse.json(
        { error: "Insight id is required" },
        { status: 400 }
      );
    }

    const insight = await db.insights.findUnique({ where: { id } });

    if (!insight || insight.userId !== userId) {
      return NextResponse.json(
        { error: "Insight not found" },
        { status: 404 }
      );
    }

    await db.insights.delete({ where: { id } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Error deleting insight:", err);
    return NextResponse.json(
      { error: "Failed to delete insight" },
      { status: 500 }
    );
  }
}
