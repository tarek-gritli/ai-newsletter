import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "No unsubscribe token provided" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { unsubscribe_token: token },
      include: { preferences: true },
    });

    if (!user || !user.preferences) {
      return NextResponse.json({ error: "Invalid unsubscribe token" }, { status: 404 });
    }

    await prisma.userPreferences.update({
      where: { user_id: user.id },
      data: { is_active: false },
    });

    return NextResponse.json({ 
      success: true, 
      message: "You have been successfully unsubscribed from the newsletter." 
    });
  } catch (error) {
    console.error("Error processing unsubscribe:", error);
    return NextResponse.json({ error: "Failed to process unsubscribe request" }, { status: 500 });
  }
}