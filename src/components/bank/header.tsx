/* eslint-disable @typescript-eslint/no-explicit-any */
import { Eye, EyeOff, TrendingDown, TrendingUp, Building2 } from "lucide-react";
import { useTheme } from "../../custom-hooks/useTheme";

export const BankHeader = ({ rev, currency, revamount, outflowamount, isVisible, onVisibilityToggle, outflow, currentBalance }: {
  rev?: string;
  currency?: string;
  revamount?: any;
  outflowamount?: any;
  isVisible?: boolean;
  onVisibilityToggle?: () => void;
  outflow?: string;
  currentBalance?: any;
}) => {
  const { isDarkMode } = useTheme();

  const formatAmount = (amount: number | string) => {
    if (!isVisible) return '••••••••';
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(typeof amount === 'string' ? Number(amount) : amount);
  };

  const getCurrencySymbol = (currency: any) => {
    switch (currency?.toUpperCase()) {
      case 'NGN': return '₦';
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      default: return currency ? currency + ' ' : '₦';
    }
  };


  return (
    <div className={`w-full rounded-2xl p-6 transition-all duration-300 shadow-lg ${isDarkMode
      ? 'bg-gray-800 border border-gray-700'
        : 'bg-white border border-gray-200'
      }`}>
      {/* Header with currency and visibility toggle */}
      <div className="flex justify-between items-center mb-8">
        <div className={`px-4 py-2 rounded-full border ${isDarkMode
          ? 'bg-gray-700/80 border-gray-600 text-white'
            : 'bg-gray-50 border-gray-200 text-gray-800'
          }`}>
          <span className="text-sm font-semibold tracking-wide">
            {currency || 'NGN'}
          </span>
        </div>

        {onVisibilityToggle && (
          <button
            onClick={onVisibilityToggle}
            className={`p-3 rounded-xl border transition-colors ${isDarkMode
              ? 'bg-gray-700/80 border-gray-600 text-gray-400 hover:text-white hover:bg-gray-600'
                : 'bg-gray-50 border-gray-200 text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
          >
            {isVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </button>
        )}
      </div>

      {/* Three-column layout for financial metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Inflow */}
        <div className={`p-5 rounded-xl border transition-all duration-300 ${isDarkMode
          ? 'bg-gray-700/30 border-gray-600/50'
          : 'bg-emerald-50 border-emerald-200/50'
          }`}>
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDarkMode
              ? 'bg-emerald-900/50 border border-emerald-700'
              : 'bg-emerald-100 border border-emerald-200'
              }`}>
              <TrendingUp className={`w-5 h-5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                }`} />
            </div>
          </div>
          <div>
            <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
              {rev || 'Total Inflow'}
            </p>
            <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
              {getCurrencySymbol(currency)}{formatAmount(revamount || 0)}
            </p>
          </div>
        </div>

        {/* Total Outflow */}
        <div className={`p-5 rounded-xl border transition-all duration-300 ${isDarkMode
          ? 'bg-gray-700/30 border-gray-600/50'
          : 'bg-red-50 border-red-200/50'
          }`}>
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDarkMode
              ? 'bg-red-900/50 border border-red-700'
              : 'bg-red-100 border border-red-200'
              }`}>
              <TrendingDown className={`w-5 h-5 ${isDarkMode ? 'text-red-400' : 'text-red-600'
                }`} />
            </div>
          </div>
          <div>
            <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
              {outflow || 'Total Outflow'}
            </p>
            <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
              {getCurrencySymbol(currency)}{formatAmount(outflowamount || 0)}
            </p>
          </div>
        </div>

        {/* Current Balance */}
        <div className={`p-5 rounded-xl border transition-all duration-300 ${isDarkMode
          ? 'bg-gray-700/30 border-gray-600/50'
          : 'bg-blue-50 border-blue-200/50'
          }`}>
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDarkMode
              ? 'bg-blue-900/50 border border-blue-700'
              : 'bg-blue-100 border border-blue-200'
              }`}>
              <Building2 className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'
                }`} />
            </div>
          </div>
          <div>
            <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
              Current Balance
            </p>
            <p className={`text-xl font-bold ${currentBalance >= 0
              ? (isDarkMode ? 'text-green-400' : 'text-green-600')
              : (isDarkMode ? 'text-red-400' : 'text-red-600')
              }`}>
              {getCurrencySymbol(currency)}{formatAmount(currentBalance)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};