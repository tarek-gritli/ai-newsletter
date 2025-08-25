import Link from "next/link";
import { useRouter } from "next/navigation";
import { CirclePause, CirclePlay, CreditCard, SquarePen } from "lucide-react";
import { UserPreferences } from "@/lib/types";

interface ActionsCardProps {
  preferences: UserPreferences | null;
  onToggleStatus: (isActive: boolean) => void;
  isPending?: boolean;
}

export const ActionsCard = ({
  preferences,
  onToggleStatus,
  isPending = false,
}: ActionsCardProps) => {
  const router = useRouter();

  const handleUpdatePreferences = () => {
    router.push("/select");
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Actions</h2>

      <div className="space-y-4">
        <ActionButton
          onClick={handleUpdatePreferences}
          icon={<SquarePen className="w-5 h-5 mr-2" />}
          label="Update Preferences"
          variant="primary"
        />

        {preferences && (
          <>
            {preferences.is_active ? (
              <ActionButton
                onClick={() => onToggleStatus(false)}
                icon={<CirclePause className="w-5 h-5 mr-2" />}
                label={isPending ? "Pausing..." : "Pause Newsletter"}
                variant="danger"
                disabled={isPending}
              />
            ) : (
              <ActionButton
                onClick={() => onToggleStatus(true)}
                icon={<CirclePlay className="w-5 h-5 mr-2" />}
                label={isPending ? "Resuming..." : "Resume Newsletter"}
                variant="success"
                disabled={isPending}
              />
            )}
          </>
        )}

        <Link
          href="/subscribe"
          className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          <CreditCard className="w-5 h-5 mr-2" />
          Manage Subscription
        </Link>
      </div>
    </div>
  );
};

interface ActionButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  variant: "primary" | "danger" | "success";
  disabled?: boolean;
}

const ActionButton = ({
  onClick,
  icon,
  label,
  variant,
  disabled = false,
}: ActionButtonProps) => {
  const variants = {
    primary: "border-transparent text-white bg-blue-600 hover:bg-blue-700",
    danger: "border-red-300 text-red-700 bg-red-50 hover:bg-red-100",
    success: "border-green-300 text-green-700 bg-green-50 hover:bg-green-100",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center justify-center px-4 py-3 border text-sm font-medium rounded-md transition-colors cursor-pointer ${
        variants[variant]
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {icon}
      {label}
    </button>
  );
};
