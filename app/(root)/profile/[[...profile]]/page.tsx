import { UserProfile } from "@clerk/nextjs";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <UserProfile
          appearance={{
            elements: {
              card: "shadow-lg",
              headerTitle: "text-2xl font-bold",
              headerSubtitle: "text-gray-600",
              formButtonPrimary:
                "bg-blue-600 hover:bg-blue-700 text-sm normal-case",
              formFieldLabel: "text-sm font-medium text-gray-700",
              formFieldInput:
                "rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500",
              footerActionLink: "text-blue-600 hover:text-blue-700 font-medium",
            },
          }}
          routing="path"
          path="/profile"
        />
      </div>
    </div>
  );
}