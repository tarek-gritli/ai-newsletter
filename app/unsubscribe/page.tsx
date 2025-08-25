"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check, X } from "lucide-react";

export default function UnsubscribePage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    const processUnsubscribe = async () => {
      if (!token) {
        setStatus("error");
        setMessage("No unsubscribe token provided.");
        return;
      }

      try {
        const response = await fetch(`/api/unsubscribe?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage(
            data.message || "You have been successfully unsubscribed."
          );
        } else {
          setStatus("error");
          setMessage(data.error || "Failed to unsubscribe.");
        }
      } catch (error: unknown) {
        setStatus("error");
        setMessage("An error occurred while processing your request.");
      }
    };

    processUnsubscribe();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            {status === "loading" && (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Processing...
                </h2>
                <p className="mt-2 text-gray-600">
                  Please wait while we process your request.
                </p>
              </>
            )}

            {status === "success" && (
              <>
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Successfully Unsubscribed
                </h2>
                <p className="mt-2 text-gray-600">{message}</p>
                <p className="mt-4 text-sm text-gray-500">
                  You will no longer receive newsletter emails from us.
                </p>
              </>
            )}

            {status === "error" && (
              <>
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Unsubscribe Failed
                </h2>
                <p className="mt-2 text-gray-600">{message}</p>
                <p className="mt-4 text-sm text-gray-500">
                  Please contact support if this error persists.
                </p>
              </>
            )}

            <div className="mt-6">
              <Link
                href="/dashboard"
                className="text-blue-600 hover:text-blue-500 text-sm font-medium"
              >
                ← Return to dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
