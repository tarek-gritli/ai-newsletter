"use client";

import { useEffect, useState, useTransition } from "react";
import { PreferencesCard } from "@/components/dashboard/PreferencesCard";
import { ActionsCard } from "@/components/dashboard/ActionsCard";
import { InfoSection } from "@/components/dashboard/InfoSection";
import { LoadingState } from "@/components/dashboard/LoadingState";
import {
  getUserPreferences,
  updatePreferenceStatus,
} from "@/app/actions/user-preferences";
import { UserPreferences } from "@/lib/types";

export default function DashboardPage() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchPreferences = async () => {
      const result = await getUserPreferences();
      if (result.success) {
        setPreferences(result.data);
      }
      setIsLoading(false);
    };
    fetchPreferences();
  }, []);

  const handleToggleStatus = (isActive: boolean) => {
    startTransition(async () => {
      const result = await updatePreferenceStatus(isActive);
      if (result.success) {
        setPreferences((prev) =>
          prev ? { ...prev, is_active: isActive } : null
        );
      }
    });
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Your Newsletter Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Manage your personalized newsletter preferences
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PreferencesCard preferences={preferences} />
          <ActionsCard
            preferences={preferences}
            onToggleStatus={handleToggleStatus}
            isPending={isPending}
          />
        </div>

        <InfoSection />
      </div>
    </main>
  );
}
