
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

// Helper to get logged-in userId from NextAuth OR custom session-token
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
      bottlenecks,
      team,
      summary,
      keyDifferences,
      recommendations,
      workflowA,
      workflowB,
      name,
    } = body;

    if (
      !type ||
      !date ||
      !bottlenecks ||
      !summary ||
      !keyDifferences ||
      !recommendations ||
      !workflowA ||
      !workflowB ||
      !team ||
      !name
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const workflow = await db.workflows.create({
      data: {
        type,
        userId, 
        date,
        bottlenecks,
        summary,
        keyDifferences,
        recommendations,
        team,
        name,

        workflowA: {
          create: {
            title: workflowA.title,
            team: workflowA.team,
            workflowType: workflowA.workflowType,
            system: workflowA.system,
            text: workflowA.text,
          },
        },
        workflowB: {
          create: {
            title: workflowB.title,
            team: workflowB.team,
            workflowType: workflowB.workflowType,
            system: workflowB.system,
            text: workflowB.text,
          },
        },
      },

      include: {
        workflowA: true,
        workflowB: true,
      },
    });


    return NextResponse.json({ workflow }, { status: 201 });
  } catch (err) {
    console.error("Error creating workflow:", err);
    return NextResponse.json(
      { error: "Failed to create workflow" },
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

    const workflow = await db.workflows.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      include: {
        workflowA: true,
        workflowB: true,
      },
    });


    return NextResponse.json({ workflow }, { status: 200 });
  } catch (err) {
    console.error("Error fetching workflow:", err);
    return NextResponse.json(
      { error: "Failed to fetch workflow" },
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

    if (!id) {
      return NextResponse.json(
        { error: "Workflow id is required" },
        { status: 400 }
      );
    }

    const workflow = await db.workflows.findUnique({ where: { id } });

    if (!workflow || workflow.userId !== userId) {
      return NextResponse.json(
        { error: "Workflow not found" },
        { status: 404 }
      );
    }

    await db.workflows.delete({ where: { id } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Error deleting workflow:", err);
    return NextResponse.json(
      { error: "Failed to delete workflow" },
      { status: 500 }
    );
  }
}
