import { Info } from "lucide-react";

const infoItems = [
  "Your newsletter is automatically generated based on your selected categories",
  "Newsletters are delivered to your email at 9 AM according to your chosen frequency",
  "You can pause or resume your newsletter at any time",
  "Update your preferences anytime to change categories or frequency",
];

export const InfoSection = () => {
  return (
    <div className="mt-8 bg-blue-50 rounded-lg p-6">
      <div className="flex items-center mb-3">
        <Info className="w-5 h-5 text-blue-900 mr-2" />
        <h3 className="text-lg font-medium text-blue-900">How it works</h3>
      </div>
      <ul className="text-blue-800 space-y-2">
        {infoItems.map((item, index) => (
          <li key={index} className="flex items-start">
            <span className="mr-2">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};