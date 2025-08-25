import { UserPreferences } from "@/lib/types";
import Link from "next/link";

interface PreferencesCardProps {
  preferences: UserPreferences | null;
}

export const PreferencesCard = ({ preferences }: PreferencesCardProps) => {
  if (!preferences) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Current Preferences
        </h2>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No preferences set yet</p>
          <Link
            href="/select"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Set Up Newsletter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        Current Preferences
      </h2>

      <div className="space-y-4">
        <PreferenceItem title="Categories">
          <div className="flex flex-wrap gap-2">
            {preferences.categories.map((category) => (
              <span
                key={category}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              >
                {category}
              </span>
            ))}
          </div>
        </PreferenceItem>

        <PreferenceItem title="Frequency">
          <p className="text-gray-600 capitalize">{preferences.frequency}</p>
        </PreferenceItem>

        <PreferenceItem title="Email">
          <p className="text-gray-600">{preferences.email}</p>
        </PreferenceItem>

        <PreferenceItem title="Status">
          <div className="flex items-center">
            <StatusIndicator isActive={preferences.is_active} />
            <span className="text-gray-600">
              {preferences.is_active ? "Active" : "Inactive"}
            </span>
          </div>
        </PreferenceItem>

        <PreferenceItem title="Created">
          <p className="text-gray-600">
            {new Date(preferences.created_at).toLocaleDateString()}
          </p>
        </PreferenceItem>
      </div>
    </div>
  );
};

const PreferenceItem = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
    {children}
  </div>
);

const StatusIndicator = ({ isActive }: { isActive: boolean }) => (
  <div
    className={`w-3 h-3 rounded-full mr-2 ${
      isActive ? "bg-green-500" : "bg-red-500"
    }`}
    aria-label={isActive ? "Active" : "Inactive"}
  />
);
