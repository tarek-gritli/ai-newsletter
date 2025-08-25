import { schedules } from "@trigger.dev/sdk";

export const findScheduleByDeduplicationKey = async (
  deduplicationKey: string
) => {
  try {
    const schedulesPage = await schedules.list({});
    return schedulesPage.data.find(
      (schedule) => schedule.deduplicationKey === deduplicationKey
    );
  } catch (error) {
    console.error("Error finding schedule:", error);
    return null;
  }
};

export const createSchedule = async (
  deduplicationKey: string,
  cron: string
) => {
  try {
    await schedules.create({
      task: "newsletter-schedule",
      deduplicationKey: deduplicationKey,
      cron: cron,
      timezone: "Africa/Tunis",
      externalId: deduplicationKey,
    });
    console.log("✅ Scheduled task for:", deduplicationKey);
  } catch (error) {
    console.error("❌ Schedule creation failed:", error);
  }
};

export const deleteSchedule = async (deduplicationKey: string) => {
  try {
    const existingSchedule = await findScheduleByDeduplicationKey(
      deduplicationKey
    );
    if (existingSchedule) await schedules.del(existingSchedule.id);
  } catch (error) {
    console.error("❌ Schedule deletion failed:", error);
  }
};

export const activateSchedule = async (deduplicationKey: string) => {
  try {
    const existingSchedule = await findScheduleByDeduplicationKey(
      deduplicationKey
    );
    if (existingSchedule) {
      await schedules.activate(existingSchedule.id);
      console.log("✅ Schedule activated for:", deduplicationKey);
      return true;
    }
    return false;
  } catch (error) {
    console.error("❌ Schedule activation failed:", error);
    return false;
  }
};

export const deactivateSchedule = async (deduplicationKey: string) => {
  try {
    const existingSchedule = await findScheduleByDeduplicationKey(
      deduplicationKey
    );
    if (existingSchedule) {
      await schedules.deactivate(existingSchedule.id);
      console.log("⏸️ Schedule deactivated for:", deduplicationKey);
      return true;
    }
    return false;
  } catch (error) {
    console.error("❌ Schedule deactivation failed:", error);
    return false;
  }
};

export const getCronFromFrequency = (frequency: string): string => {
  switch (frequency) {
    case "daily":
      return "0 9 * * *";
    case "weekly":
      return "0 9 * * 1";
    case "biweekly":
      return "0 9 * * 1/2";
    default:
      return "0 9 * * 1";
  }
};

export const updateOrCreateSchedule = async (
  deduplicationKey: string,
  frequency: string
) => {
  const cron = getCronFromFrequency(frequency);
  await deleteSchedule(deduplicationKey);
  await createSchedule(deduplicationKey, cron);
};
