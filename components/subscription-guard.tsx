import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { checkUserSubscription } from "@/app/actions/subscription";

export async function SubscriptionGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { hasActiveSubscription } = await checkUserSubscription(userId);

  if (!hasActiveSubscription) {
    redirect("/subscribe");
  }

  return <>{children}</>;
}
