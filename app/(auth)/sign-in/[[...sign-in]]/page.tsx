import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary:
              "bg-blue-600 hover:bg-blue-700 text-sm normal-case",
            card: "shadow-lg",
            headerTitle: "text-2xl font-bold",
            headerSubtitle: "text-gray-600",
            socialButtonsBlockButton:
              "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700",
            socialButtonsBlockButtonText: "font-semibold",
            formFieldLabel: "text-sm font-medium text-gray-700",
            formFieldInput:
              "rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500",
            footerActionLink: "text-blue-600 hover:text-blue-700 font-medium",
          },
        }}
        routing="path"
        path="/sign-in"
        fallbackRedirectUrl="/dashboard"
        signUpUrl="/sign-up"
      />
    </div>
  );
}
