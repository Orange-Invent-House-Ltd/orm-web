/* eslint-disable @typescript-eslint/no-unused-vars */
import { ArrowLeftRight, ChevronRight, Clock, PiggyBank, Receipt, TrendingDown, TrendingUp } from "lucide-react";
import { useTheme } from "../../custom-hooks/useTheme";

// Transaction Item Component
export const AllTransactions = ({ 
  onTap, 
  transactionType, 
  accountType, 
  amount, 
  amountFormatted,
  currency,
  description,
  createdAt,
  accountHolderName,
  runningBalance,
  // valueDate,
  // Props that match your transaction data structure
  transaction_type,
  account_type,
  created_at,
  account_holder_name
}: {
  onTap: () => void;
  transactionType: string;
  accountType: string;
  amount: string;
  amountFormatted?: string;
  currency: string;
  description: string;
  createdAt: string;
  accountHolderName: string;
  runningBalance?: string;
  valueDate?: string;
  // Optional fallback props
  transaction_type?: string;
  account_type?: string;
  created_at?: string;
  account_holder_name?: string;
  // Remove unused props that don't exist in your data
  originatingAccountNo?: string;
  transactionReferenceNo?: string;
  originatingBank?: string;
  originating_bank?: string;
  originating_account_no?: string;
}) => {
  const { isDarkMode } = useTheme();
  
  // Use fallback values if primary props are not available
  const finalTransactionType = transactionType || transaction_type || 'unknown';
  const finalAccountType = accountType || account_type || '';
  const finalAccountHolderName = accountHolderName || account_holder_name || 'Unknown Account';
  const finalCreatedAt = createdAt || created_at || '';
  
  // Use formatted amount if provided, otherwise format the raw amount
  const displayAmount = amountFormatted || formatAmount(amount);

  const getTransactionColor = (type: string) => {
    if (!type) return '#64748B';
    
    switch (type.toLowerCase()) {
      case 'credit': return '#22C55E';
      case 'debit': return '#EF4444';
      case 'transfer': return '#3B82F6';
      case 'deposit': return '#8B5CF6';
      default: return '#64748B';
    }
  };

  const getTransactionIcon = (type: string) => {
    if (!type) return Receipt;
    
    switch (type.toLowerCase()) {
      case 'credit': return TrendingUp;
      case 'debit': return TrendingDown;
      case 'transfer': return ArrowLeftRight;
      case 'deposit': return PiggyBank;
      default: return Receipt;
    }
  };

  const getTransactionTypeText = (type: string) => {
    if (!type) return 'Transaction';
    
    switch (type.toLowerCase()) {
      case 'credit': return 'Credit';
      case 'debit': return 'Debit';
      case 'transfer': return 'Transfer';
      case 'deposit': return 'Deposit';
      default: return type;
    }
  };

  function formatDate(dateString: string) {
    try {
      if (!dateString) return 'Unknown date';
      
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) {
        return dateString || 'Unknown date';
      }
      
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      console.error('Error formatting date:', e);
      return dateString || 'Unknown date';
    }
  }

  function formatAmount(amount: string) {
    const numAmount = parseFloat(amount) || 0;
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numAmount);
  }

  const color = getTransactionColor(finalTransactionType);
  const IconComponent = getTransactionIcon(finalTransactionType);

  return (
    <div 
      onClick={onTap}
      className={`rounded-lg sm:rounded-xl border transition-all duration-300 cursor-pointer transform hover:scale-[1.01] sm:hover:scale-[1.02] hover:shadow-lg active:scale-[0.99] ${
        isDarkMode 
          ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' 
          : 'bg-white border-gray-200 hover:bg-gray-50'
      }`}
    >
      <div className="p-3 sm:p-4">
        {/* Mobile Layout (stacked) */}
        <div className="sm:hidden">
          {/* Header Row */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start space-x-3 flex-1 min-w-0">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center border flex-shrink-0 mt-0.5"
                style={{ 
                  background: `linear-gradient(135deg, ${color}15, ${color}05)`,
                  borderColor: `${color}30`
                }}
              >
                <IconComponent 
                  className="w-4 h-4"
                  style={{ color }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`font-semibold text-sm truncate pr-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {finalAccountHolderName}
                  </h3>
                </div>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} truncate mb-1.5`}>
                  {finalAccountType}
                </p>
                <div className="flex items-center space-x-1">
                  <Clock className={`w-3 h-3 flex-shrink-0 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <span className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {formatDate(finalCreatedAt)}
                  </span>   
                </div>
              </div>
            </div>
            <div 
              className="px-2 py-1 rounded-md text-xs font-bold tracking-wider whitespace-nowrap ml-2 flex-shrink-0 mt-0.5"
              style={{ 
                backgroundColor: `${color}20`,
                color: color
              }}
            >
              {getTransactionTypeText(finalTransactionType).toUpperCase()}
            </div>
          </div>
          
          {/* Content Row */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 pr-2">
              {description && (
                <p className={`text-xs italic truncate mb-1.5 leading-tight ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  "{description}"
                </p>
              )}
              {runningBalance && (
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} truncate leading-tight`}>
                  Balance: {runningBalance}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-1 flex-shrink-0">
              <p 
                className="text-lg font-bold whitespace-nowrap text-right"
                style={{ color }}
              >
                {currency} {displayAmount}
              </p>
              <ChevronRight className={`w-4 h-4 flex-shrink-0 ${
                isDarkMode ? 'text-gray-500' : 'text-gray-400'
              }`} />
            </div>
          </div>
        </div>

        {/* Desktop/Tablet Layout (horizontal) */}
        <div className="hidden sm:flex items-center justify-between space-x-4">
          {/* Left Section - Icon and Info */}
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            {/* Transaction Icon */}
            <div 
              className="w-11 h-11 md:w-12 md:h-12 rounded-2xl flex items-center justify-center border flex-shrink-0"
              style={{ 
                background: `linear-gradient(135deg, ${color}15, ${color}05)`,
                borderColor: `${color}30`
              }}
            >
              <IconComponent 
                className="w-5 h-5"
                style={{ color }}
              />
            </div>

            {/* Transaction Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1.5">
                <h3 className={`font-semibold text-sm md:text-base truncate pr-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {finalAccountHolderName}
                </h3>
                {/* Status Badge - Hidden on smaller screens */}
                <div 
                  className="hidden md:block px-2.5 py-1 rounded-md text-xs font-bold tracking-wider flex-shrink-0 ml-4"
                  style={{ 
                    backgroundColor: `${color}20`,
                    color: color
                  }}
                >
                  {getTransactionTypeText(finalTransactionType).toUpperCase()}
                </div>
              </div>
              
              <div className="flex items-center space-x-3 mb-1.5">
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} truncate flex-shrink-0`}>
                  {finalAccountType}
                </p>
                <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>•</span>
                <div className="flex items-center space-x-1.5 flex-1 min-w-0">
                  <Clock className={`w-3 h-3 flex-shrink-0 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <span className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {formatDate(finalCreatedAt)}
                  </span>
                </div>
              </div>
              
              {description && (
                <p className={`text-xs italic truncate mb-1 leading-tight text-left ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  "{description}"
                </p>
              )}
              
              {runningBalance && (
                <p className={`text-xs text-left ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} truncate leading-tight`}>
                  Balance: {runningBalance}
                </p>
              )}
            </div>
          </div>

          {/* Right Section - Amount and Arrow */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            {/* Amount and Badge for medium screens */}
            <div className="text-right">
              {/* Show badge on medium screens only */}
              <div 
                className="md:hidden mb-1.5 px-2.5 py-1 rounded-md text-xs font-bold tracking-wider inline-block"
                style={{ 
                  backgroundColor: `${color}20`,
                  color: color
                }}
              >
                {getTransactionTypeText(finalTransactionType).toUpperCase()}
              </div>
              <p 
                className="text-base md:text-lg font-bold whitespace-nowrap"
                style={{ color }}
              >
                {currency} {displayAmount}
              </p>
            </div>
            <ChevronRight className={`w-4 h-4 flex-shrink-0 ${
              isDarkMode ? 'text-gray-500' : 'text-gray-400'
            }`} />
          </div>
        </div>
      </div>
    </div>
  );
};