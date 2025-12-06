// app/api/verifytoken/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Look for a user whose token matches AND has not expired
    const user = await db.user.findFirst({
      where: {
        resetToken: hashedToken,
        resetTokenExpiry: {
          gt: new Date(), // expiry time is in the future
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid token or token has expired" },
        { status: 400 }
      );
    }

    // Only return what the frontend actually needs
    return NextResponse.json({ email: user.email }, { status: 200 });
  } catch (err) {
    console.error("Error verifying token:", err);
    return NextResponse.json(
      { error: "Error verifying token" },
      { status: 500 }
    );
  }
}
