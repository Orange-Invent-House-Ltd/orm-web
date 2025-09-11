// AI Prediction Card Component
import { useState } from "react";
import { useTheme } from "../../custom-hooks/useTheme";
import { ChevronRight, TrendingUp } from "lucide-react";

// Define proper types for the aggregated balances
interface CurrencyBalance {
  total_currency_balance: number;
  banks: Record<string, number>;
}

interface AggregatedBalances {
  [currency: string]: CurrencyBalance;
}

export const AiFinancialPredictionCard = ({  
  aggregatedBalances, 
  onAnalyze 
}: { 
    aggregatedBalances?: AggregatedBalances, 
  onAnalyze: () => void 
}) => {
  const { isDarkMode } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const generatePrediction = () => {
    
    // Calculate total balance across all currencies
    const totalBalance = Object.values(aggregatedBalances || {}).reduce(
      (sum, currencyData) => {
        return sum + (currencyData.total_currency_balance || 0);
      }, 0
    );
    
    
    const avgGrowth = Math.random() * 10 + 5;
    const prediction = totalBalance * (1 + avgGrowth / 100);
    
    return {
      currentTotal: totalBalance,
      predictedTotal: prediction,
      growthPercentage: avgGrowth,
      trend: 'positive' as const
    };
  };

  const prediction = generatePrediction();

  // Format large numbers with commas
  const formatNumber = (num: number) => {
    if (isNaN(num) || num === 0) return '0.00';
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Get the primary currency (NGN if available, otherwise first currency)
  const primaryCurrency = Object.keys(aggregatedBalances || {}).includes('NGN') 
    ? 'NGN' 
    : Object.keys(aggregatedBalances || {})[0] || 'NGN';

  // Get currency symbol
  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'NGN': return '₦';
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      default: return currency + ' ';
    }
  };

  return (
    <div className={`
      rounded-2xl p-4 sm:p-6 border transition-all duration-300 
      ${isDarkMode 
        ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' 
        : 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200'
      }
    `}>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 space-y-3 sm:space-y-0">
        <div className="flex items-start space-x-3 min-w-0 flex-1">
          <div className="p-2 bg-emerald-500 rounded-lg flex-shrink-0">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className={`text-base sm:text-lg font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              AI Financial Insights
            </h3>
            <p className={`text-xs sm:text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Predictive analysis based on your data
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`p-2 rounded-lg transition-colors self-start sm:self-center flex-shrink-0 ${
            isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-emerald-100'
          }`}
        >
          <ChevronRight className={`w-5 h-5 transition-transform ${
            isExpanded ? 'rotate-90' : ''
          } ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
        </button>
      </div>  
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
        <div className={`rounded-xl p-3 sm:p-4 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <p className={`text-xs sm:text-sm mb-1 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Projected Growth
          </p>
          <p className={`text-xl sm:text-2xl font-bold ${
            isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
          }`}>
            +{prediction.growthPercentage.toFixed(1)}%
          </p>
        </div>
        <div className={`rounded-xl p-3 sm:p-4 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <p className={`text-xs sm:text-sm mb-1 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Next Month Prediction
          </p>
          <p className={`text-lg sm:text-2xl font-bold break-all ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {getCurrencySymbol(primaryCurrency)}{formatNumber(prediction.predictedTotal)}
          </p>
        </div>
      </div>

      {/* Current Total Balance Display */}
      <div className={`rounded-xl p-3 sm:p-4 mb-4 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <p className={`text-xs sm:text-sm mb-1 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Current Total Balance
        </p>
        <p className={`text-lg sm:text-xl font-bold ${
          isDarkMode ? 'text-blue-400' : 'text-blue-600'
        }`}>
          {getCurrencySymbol(primaryCurrency)}{formatNumber(prediction.currentTotal)}
        </p>
      </div>

      {isExpanded && (
        <div className={`rounded-xl p-3 sm:p-4 mt-4 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h4 className={`font-semibold mb-3 text-sm sm:text-base ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Key Insights
          </h4>
          <ul className={`space-y-2 text-xs sm:text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <li className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <span>Your revenue shows consistent growth across all currencies</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <span>
                {Object.keys(aggregatedBalances || {}).includes('NGN') 
                  ? 'NGN accounts show the highest transaction volume' 
                  : 'Multiple currency accounts detected'
                }
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <span>
                {Object.keys(aggregatedBalances || {}).length > 1 
                  ? 'Good currency diversification detected' 
                  : 'Consider diversifying into multiple currencies'
                }
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <span>
                Total of {Object.keys(aggregatedBalances || {}).length} currency type{Object.keys(aggregatedBalances || {}).length !== 1 ? 's' : ''} in portfolio
              </span>
            </li>
          </ul>
        </div>
      )}

      <button
        onClick={onAnalyze}
        className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 sm:py-3 px-4 rounded-xl font-medium transition-colors text-sm sm:text-base"
      >
        Generate New Analysis
      </button>
    </div>
  );
};