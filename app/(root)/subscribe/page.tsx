"use client";

import { useState, useTransition } from "react";
import { availablePlans } from "@/lib/plans";
import { PLAN_FEATURES, TRUST_INDICATORS } from "@/lib/constants";
import { PlanCard } from "@/components/subscribe/PlanCard";
import { TrustIndicator } from "@/components/subscribe/TrustIndicator";
import { createCheckoutSession } from "@/app/actions/checkout";
import { CircleCheck, DollarSign, LoaderCircle, Lock, Zap } from "lucide-react";

export default function SubscribePage() {
  const [planChoice, setPlanChoice] = useState<"month" | "year">("month");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = () => {
    setError(null);
    startTransition(async () => {
      const result = await createCheckoutSession(planChoice);
      if (result.success && result.url) {
        window.location.href = result.url;
      } else if (result.error) {
        setError(result.error);
      }
    });
  };

  const getTrustIcon = (id: string) => {
    switch (id) {
      case "money-back":
        return <CircleCheck className="w-6 h-6" />;
      case "secure":
        return <Lock className="w-6 h-6" />;
      case "instant":
        return <Zap className="w-6 h-6" />;
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <DollarSign className="text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Unlock Your Personalized Newsletter
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan to get your AI-powered weekly newsletters
            delivered straight to your inbox
          </p>
        </header>

        <section
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
          role="group"
          aria-labelledby="plans-heading"
        >
          <h2 id="plans-heading" className="sr-only">
            Available subscription plans
          </h2>
          {availablePlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isSelected={planChoice === plan.id}
              onSelect={() => setPlanChoice(plan.id)}
              features={PLAN_FEATURES}
            />
          ))}
        </section>

        {error && (
          <div
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center"
            role="alert"
          >
            {error}
          </div>
        )}

        <div className="text-center">
          <button
            onClick={handleSubscribe}
            disabled={isPending}
            aria-busy={isPending}
            className="inline-flex items-center px-8 py-2 bg-blue-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isPending ? (
              <>
                <LoaderCircle className="-ml-1 mr-3 text-white animate-spin" />
                <span>Redirecting to Checkout...</span>
              </>
            ) : (
              <>
                <Lock className="mr-2 w-4 h-4" />
                <span>Subscribe & Continue</span>
              </>
            )}
          </button>

          <p className="text-sm text-gray-500 mt-4">
            Secure payment powered by Stripe • Cancel anytime
          </p>
        </div>

        <section
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
          aria-labelledby="trust-heading"
        >
          <h2 id="trust-heading" className="sr-only">
            Why trust us
          </h2>
          {TRUST_INDICATORS.map((indicator) => (
            <TrustIndicator
              key={indicator.id}
              icon={getTrustIcon(indicator.id)}
              title={indicator.title}
              description={indicator.description}
              iconBgColor={indicator.iconBgColor}
              iconColor={indicator.iconColor}
            />
          ))}
        </section>
      </div>
    </main>
  );
}
