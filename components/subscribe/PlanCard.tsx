import { Plan } from "@/lib/plans";
import { Check } from "lucide-react";

interface PlanCardProps {
  plan: Plan;
  isSelected: boolean;
  onSelect: () => void;
  features: string[];
}

export const PlanCard = ({
  plan,
  isSelected,
  onSelect,
  features,
}: PlanCardProps) => {
  const isYearlyPlan = plan.id === "year";
  const savings = isYearlyPlan
    ? Math.round(((12 * 9.99 - plan.price) / (12 * 9.99)) * 100)
    : 0;

  return (
    <div
      className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl h-full flex flex-col ${
        isSelected
          ? "border-blue-500 shadow-blue-100 ring-2 ring-blue-500 ring-opacity-50"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      {isYearlyPlan && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
            Most Popular
          </span>
        </div>
      )}

      <div className="p-8 flex flex-col flex-grow">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
          <div className="flex items-baseline justify-center">
            <span className="text-4xl font-bold text-gray-900">
              ${plan.price}
            </span>
            <span className="text-gray-500 ml-2">/{plan.interval}</span>
          </div>
          <div className="h-6 mt-2">
            {isYearlyPlan && savings > 0 && (
              <p className="text-sm text-green-600 font-medium">
                Save {savings}% compared to monthly
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4 mb-8 flex-grow">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center">
              <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onSelect}
          aria-pressed={isSelected}
          className={`w-full py-3 px-6 rounded-xl font-medium transition-all duration-200 mt-auto ${
            isSelected
              ? "bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {isSelected ? "Selected" : "Select Plan"}
        </button>
      </div>
    </div>
  );
};
