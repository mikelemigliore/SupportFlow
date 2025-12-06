// app/api/resetpassword/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { password, email, token } = await req.json();

    if (!password || !email) {
      return NextResponse.json(
        { error: "Password and email are required" },
        { status: 400 }
      );
    }

    // Optional but recommended: check token again on backend
    // so someone can't just post { email, newPassword } without the reset link.
    let user = null;

    if (token) {
      const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      user = await db.user.findFirst({
        where: {
          email,
          resetToken: hashedToken,
          resetTokenExpiry: {
            gt: new Date(), // still valid
          },
        },
      });
    } else {
      // fallback: if you really want to only trust the email
      user = await db.user.findUnique({
        where: { email },
      });
    }

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json(
      { message: "User's password is updated" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in resetpassword route:", err);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
