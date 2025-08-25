"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import {
  createSchedule,
  activateSchedule,
  deactivateSchedule,
  getCronFromFrequency,
  updateOrCreateSchedule,
} from "@/lib/trigger";

interface SavePreferencesInput {
  categories: string[];
  frequency: string;
}

export async function saveUserPreferences(input: SavePreferencesInput) {
  const user = await currentUser();

  if (!user) {
    return {
      success: false,
      error: "You must be logged in to save preferences.",
    };
  }

  const { categories, frequency } = input;

  if (!categories || !Array.isArray(categories) || categories.length === 0) {
    return {
      success: false,
      error: "Please select at least one category",
    };
  }

  if (!frequency || !["daily", "weekly", "biweekly"].includes(frequency)) {
    return {
      success: false,
      error: "Please select a valid frequency",
    };
  }

  try {
    const email =
      user.primaryEmailAddress?.emailAddress ||
      user.emailAddresses?.[0]?.emailAddress;

    const dbUser = await prisma.user.upsert({
      where: { clerk_id: user.id },
      update: {
        email: email || "",
        name: user.firstName
          ? `${user.firstName} ${user.lastName || ""}`.trim()
          : null,
      },
      create: {
        clerk_id: user.id,
        email: email || "",
        name: user.firstName
          ? `${user.firstName} ${user.lastName || ""}`.trim()
          : null,
      },
    });

    const existingPreferences = await prisma.userPreferences.findUnique({
      where: { user_id: dbUser.id },
    });

    const isNewUser = !existingPreferences;
    const frequencyChanged = existingPreferences?.frequency !== frequency;

    await prisma.userPreferences.upsert({
      where: { user_id: dbUser.id },
      update: {
        categories: categories,
        frequency: frequency,
        is_active: true,
      },
      create: {
        user_id: dbUser.id,
        categories: categories,
        frequency: frequency,
        is_active: true,
      },
    });

    const cron = getCronFromFrequency(frequency);

    if (isNewUser) {
      await createSchedule(user.id, cron);
    } else if (frequencyChanged) {
      await updateOrCreateSchedule(user.id, frequency);
    } else {
      const activated = await activateSchedule(user.id);
      if (!activated) {
        await createSchedule(user.id, cron);
      }
    }

    revalidatePath("/dashboard");
    revalidatePath("/select");

    return {
      success: true,
      message: "Your newsletter preferences have been saved!",
    };
  } catch (error) {
    console.error("Error in saveUserPreferences:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

export async function updatePreferenceStatus(isActive: boolean) {
  const user = await currentUser();

  if (!user) {
    return {
      success: false,
      error: "You must be logged in to update preferences.",
    };
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { clerk_id: user.id },
      include: {
        preferences: true,
      },
    });

    if (!dbUser || !dbUser.preferences) {
      return {
        success: false,
        error: "User preferences not found",
      };
    }

    await prisma.userPreferences.update({
      where: { user_id: dbUser.id },
      data: { is_active: isActive },
    });

    if (!isActive) {
      await deactivateSchedule(user.id);
    } else {
      const activated = await activateSchedule(user.id);

      if (!activated) {
        const cron = getCronFromFrequency(dbUser.preferences.frequency);
        await createSchedule(user.id, cron);
      }
    }

    revalidatePath("/dashboard");

    return {
      success: true,
      message: isActive ? "Newsletter activated" : "Newsletter paused",
    };
  } catch (error) {
    console.error("Error in updatePreferenceStatus:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

export async function getUserPreferences() {
  const user = await currentUser();

  if (!user) {
    return {
      success: false,
      error: "You must be logged in to fetch preferences.",
      data: null,
    };
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { clerk_id: user.id },
      include: {
        preferences: true,
      },
    });

    return {
      success: true,
      data: dbUser?.preferences || null,
    };
  } catch (error) {
    console.error("Error in getUserPreferences:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
      data: null,
    };
  }
}
