import { SubscriptionGuard } from "@/components/subscription-guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SubscriptionGuard>{children}</SubscriptionGuard>;
}