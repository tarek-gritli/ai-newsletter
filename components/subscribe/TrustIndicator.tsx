import { ReactNode } from "react";

interface TrustIndicatorProps {
  icon: ReactNode;
  title: string;
  description: string;
  iconBgColor: string;
  iconColor: string;
}

export const TrustIndicator = ({ 
  icon, 
  title, 
  description, 
  iconBgColor, 
  iconColor 
}: TrustIndicatorProps) => {
  return (
    <div className="flex flex-col items-center">
      <div className={`w-12 h-12 ${iconBgColor} rounded-full flex items-center justify-center mb-3`}>
        <div className={iconColor}>
          {icon}
        </div>
      </div>
      <h4 className="font-semibold text-gray-900 mb-1">
        {title}
      </h4>
      <p className="text-sm text-gray-600 text-center">
        {description}
      </p>
    </div>
  );
};