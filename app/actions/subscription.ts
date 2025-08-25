"use server";

import { prisma } from "@/lib/prisma";

export async function checkUserSubscription(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { clerk_id: userId },
      include: { subscription: true },
    });

    if (!user) {
      return { hasActiveSubscription: false };
    }

    const hasActiveSubscription =
      user.subscription?.status === "active" &&
      user.subscription.current_period_end > new Date();

    return { hasActiveSubscription };
  } catch (error) {
    console.error("Error checking subscription:", error);
    return { hasActiveSubscription: false };
  }
}