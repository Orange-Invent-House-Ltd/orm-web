import { Eye, EyeOff } from "lucide-react";
import { useTheme } from "../../custom-hooks/useTheme";

// Header Card Component
export const HeaderCard = ({ 
  title, 
  currency, 
  amount, 
  isVisible, 
  onToggleVisibility 
}: { 
  title: string; 
  currency: string; 
  amount: number; 
  isVisible: boolean; 
  onToggleVisibility: () => void; 
}) => {
  const { isDarkMode } = useTheme();

  const formatAmount = (amount: number) => {
    if (!isVisible) return '••••••••';
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getCurrencyColor = (currency: string) => {
    switch (currency) {
      case 'NGN': return 'from-emerald-500 to-teal-600';
      case 'USD': return 'from-green-500 to-emerald-600';
      case 'EUR': return 'from-teal-500 to-cyan-600';
      default: return 'from-emerald-500 to-teal-600';
    }
  };

  return (
    <div className={`
       min-w-0 flex-shrink-0
      sm:max-w-[300px] md:max-w-[320px] lg:max-w-[350px]
      rounded-2xl p-4 sm:p-6 
      shadow-lg border transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex justify-between items-start mb-3 sm:mb-4">
        <div className="min-w-0 flex-1 mr-2">
          <p className={`text-xs sm:text-sm mb-1 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {title}
          </p>
          <p className={`text-base sm:text-lg font-semibold truncate ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {currency}
          </p>
        </div>
        <button
          onClick={onToggleVisibility}
          className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
            isDarkMode 
              ? 'hover:bg-gray-700 text-gray-400' 
              : 'hover:bg-gray-100 text-gray-600'
          }`}
        >
          {isVisible ? (
            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </button>
      </div>
      <div className={`bg-gradient-to-r ${getCurrencyColor(currency)} rounded-xl p-3 sm:p-4`}>
        <p className="text-lg sm:text-xl md:text-2xl font-bold text-white break-all">
          {currency} {formatAmount(amount)}
        </p>
      </div>
    </div>
  );
};