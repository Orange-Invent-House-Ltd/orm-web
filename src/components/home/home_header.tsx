import { Eye, EyeOff } from "lucide-react";
import { useTheme } from "../../custom-hooks/useTheme";

// Header Card Component
export const HeaderCard = ({
  title2,
  title,
  currency,
  amount,
  amount2,
  isVisible,
  onToggleVisibility
}: {
    title2?: string;
    title?: string;
    currency?: string;
    amount?: number;
    amount2?: number;
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

  const getCurrencyGradient = (currency: string) => {
    switch (currency) {
      case 'NGN': return 'from-emerald-500 via-teal-500 to-cyan-600';
      case 'USD': return 'from-green-500 via-emerald-500 to-teal-600';
      case 'EUR': return 'from-blue-500 via-indigo-500 to-purple-600';
      default: return 'from-emerald-500 via-teal-500 to-cyan-600';
    }
  };

  const getCurrencyIcon = (currency: string) => {
    switch (currency) {
      case 'NGN': return '₦';
      case 'USD': return '$';
      case 'EUR': return '€';
      default: return '₦';
    }
  };

  return (
    <div className={`
      relative overflow-hidden w-full
      min-w-0 flex-shrink-0 flex-grow
      rounded-2xl p-1 shadow-xl
      transition-all duration-300 hover:shadow-2xl hover:-translate-y-1
      ${isDarkMode
        ? 'bg-gradient-to-br from-gray-800 to-gray-900'
        : 'bg-gradient-to-br from-white to-gray-50'
      }
    `}>
      {/* Subtle animated background */}
      <div className={`absolute inset-0 bg-gradient-to-r ${getCurrencyGradient(currency || 'NGN')} opacity-5`}>
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent animate-pulse" />
      </div>

      <div className="relative p-5 sm:p-6">
        {/* Header with Currency Badge */}
        <div className="flex flex-row items-start xs:items-center justify-between gap-3 mb-6">
          <div className="flex items-center space-x-3 flex-wrap">
            {/* Currency Badge */}
            <div className={`
              relative px-3 py-1.5 rounded-full
              bg-gradient-to-r ${getCurrencyGradient(currency || 'NGN')}
              shadow-lg transform transition-transform hover:scale-105
            `}>
              <span className="text-white font-bold text-sm whitespace-nowrap">
                {currency}
              </span>
              <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${getCurrencyGradient(currency || 'NGN')} blur opacity-30`} />
            </div>

            {/* Live Indicator */}
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full animate-pulse ${isDarkMode ? 'bg-green-400' : 'bg-green-500'
                }`} />
              <span className={`text-xs font-medium whitespace-nowrap ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                Live
              </span>
            </div>
          </div>

          {/* Visibility Toggle */}
          <button
            onClick={onToggleVisibility}
            className={`
              p-2.5 rounded-xl transition-all duration-200 flex-shrink-0  
              hover:scale-105 active:scale-95
              ${isDarkMode
                ? 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white'
                : 'bg-gray-100/50 hover:bg-gray-200/50 text-gray-600 hover:text-gray-800'
              }
            `}
          >
            {isVisible ? (
              <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
        </div>

        {/* Primary Amount Section */}
        <div className="mb-4">
          <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
            {title}
          </p>

          <div className={`
            relative p-4 sm:p-5 rounded-xl
            bg-gradient-to-r ${getCurrencyGradient(currency || 'NGN')}
            shadow-lg transform transition-all duration-300
            hover:shadow-xl hover:scale-[1.02]
          `}>
            {/* Glossy overlay */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/10 via-transparent to-white/20" />

            <div className="relative flex flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-baseline space-x-1 min-w-0 flex-1">
                <span className="text-white/90 text-lg sm:text-xl font-medium flex-shrink-0">
                  {getCurrencyIcon(currency || 'NGN')}
                </span>
                <span className="text-white font-bold text-lg sm:text-xl  tracking-tight break-all">
                  {formatAmount(amount || 0.00)}
                </span>
              </div>

              {/* Floating accent */}
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 self-start sm:self-center">
                <div className="w-3 h-3 rounded-full bg-white/60" />
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Amount Section (if exists) */}
        {amount2 !== undefined && (
          <div>
            <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
              {title2}
            </p>

            <div className={`
              relative p-4 rounded-xl border-2 border-dashed
              transition-all duration-300 hover:scale-[1.01]
              ${isDarkMode
                ? 'border-gray-600 bg-gray-800/30'
                : 'border-gray-300 bg-gray-50/30'
              }
            `}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-baseline space-x-1 min-w-0 flex-1">
                  <span className={`text-sm font-medium flex-shrink-0 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                    {getCurrencyIcon(currency || 'NGN')}
                  </span>
                  <span className={`font-bold text-lg sm:text-xl break-all ${isDarkMode ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                    {formatAmount(amount2 || 0.00)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Stats */}
        {/* <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200/20 dark:border-gray-700/30">
          <div className="flex items-center space-x-2">
            <div className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-blue-400' : 'bg-blue-500'
              }`} />
            <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'
              }`}>
              Updated now
            </span>
          </div>

          <div className={`px-2 py-1 rounded-full text-xs font-medium ${isDarkMode
            ? 'bg-green-500/20 text-green-400'
            : 'bg-green-100 text-green-700'
            }`}>
            Active
          </div>
        </div> */}
      </div>
    </div>
  );
};