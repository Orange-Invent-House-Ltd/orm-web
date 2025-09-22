import { useTheme } from "../../custom-hooks/useTheme";
import { useState } from "react";
import { useBankStore } from "../../store/store";
import { useNavigate } from "react-router-dom";

// Define the Account interface to match your store's expected format
interface Account {
  account_id: number;
  account_number: string;
  balance: string;
  currency: string;
  account_holder_name: string;
  bank_name: string;
}

// API Account interface (what comes from the API)
// interface ApiAccount {
//   accountName: string;
//   accountNumber: string;
//   currentBalance: string;
//   availableBalance: string;
//   currency: string;
// }

// Updated interface to support grouped accounts by bank/category
interface BankEntry {
  bankName: string;
  currencyBalances: {
    [currency: string]: number;
  };
  syncAccounts: Account[];
  totalBalance: number;
  bankLogo?: string;
}

// Bank List Item Component for Grouped Accounts
interface BankListItemProps {
  bankEntry: BankEntry;
  isVisible: boolean;
}

// Updated BankListItem component
export const BankListItem = ({
  bankEntry,
  isVisible
}: BankListItemProps) => {
  const { isDarkMode } = useTheme();
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [imageError, setImageError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const navigate = useNavigate();

  // Zustand store actions
  const { setSelectedBankEntry } = useBankStore();

  const createRipple = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const newRipple = {
      id: Date.now(),
      x,
      y
    };

    setRipples(prev => [...prev, newRipple]);

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
  };

  const handleBankClick = (event: React.MouseEvent<HTMLDivElement>) => {
    createRipple(event);
    setSelectedBankEntry(bankEntry);
    navigate(`/${encodeURIComponent(bankEntry.bankName)}`);
  };

  const toggleExpanded = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const formatAmount = (amount: number | string) => {
    if (!isVisible) return '••••••••';
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numAmount);
  };

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'NGN': return '₦';
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      default: return currency + ' ';
    }
  };

  // Generate icon based on bank/category name
  const getBankIcon = (bankName: string) => {
    const name = bankName.toLowerCase();
    if (name.includes('tsa') || name.includes('treasury')) return '🏛️';
    if (name.includes('tax') || name.includes('vat')) return '📊';
    if (name.includes('foreign') || name.includes('domiciliary')) return '💱';
    if (name.includes('fund') || name.includes('insurance')) return '🛡️';
    return '🏦';
  };

  // Bank logo component with fallback
  const BankLogo = () => {
    if (bankEntry.bankLogo && !imageError) {
      return (
        <img 
          src={bankEntry.bankLogo} 
          alt={`${bankEntry.bankName} logo`}
          className="w-full h-full object-contain"
          onError={() => setImageError(true)}
        />
      );
    }
    
    // Fallback to icon or initials
    return (
      <span className="text-white text-lg">
        {getBankIcon(bankEntry.bankName)}
      </span>
    );
  };

  return (
    <div 
      className={`
        rounded-2xl p-4 sm:p-6 relative overflow-hidden cursor-pointer
        shadow-sm border transition-all duration-300 hover:shadow-md ${
        isDarkMode 
          ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
          : 'bg-white border-gray-200 hover:border-gray-300'
      }`}
      onClick={handleBankClick}
    >
      {/* Ripple Effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/20 pointer-events-none animate-ping"
          style={{
            left: ripple.x - 50,
            top: ripple.y - 50,
            width: 100,
            height: 100,
            animationDuration: '600ms',
            animationIterationCount: 1,
          }}
        />
      ))}

      {/* Mobile Layout */}
      <div className="block sm:hidden">
        <div className="flex items-start space-x-4 mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-emerald-600 to-teal-700' 
              : 'bg-gradient-to-r from-emerald-500 to-teal-600'
          }`}>
            <BankLogo />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className={`font-semibold text-sm truncate ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {bankEntry.bankName}
            </h3>
            <p className={`text-xs ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {bankEntry.syncAccounts.length} account{bankEntry.syncAccounts.length !== 1 ? 's' : ''}
              • {Object.keys(bankEntry.currencyBalances).length} currenc{Object.keys(bankEntry.currencyBalances).length !== 1 ? 'ies' : 'y'}
            </p>
          </div>
          <button
            onClick={toggleExpanded}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
        </div>
        
        {/* Currency balances for mobile */}
        <div className="space-y-2">
          {Object.entries(bankEntry.currencyBalances).map(([currency, amount]) => (
            <div key={currency} className={`flex justify-between items-center p-2 rounded-lg ${
              isDarkMode ? 'bg-gray-750/50' : 'bg-gray-50'
            }`}>
              <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {currency} Balance:
              </span>
              <span className={`text-sm font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                {getCurrencySymbol(currency)}{formatAmount(amount)}
              </span>
            </div>
          ))}
        </div>

        {/* Expandable account details for mobile */}
        {isExpanded && (
          <div className={`mt-4 p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
            <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              Individual Accounts:
            </h4>
            <div className="space-y-2">
              {bankEntry.syncAccounts.map((account, idx) => (
                <div key={idx} className={`text-xs p-2 rounded ${isDarkMode ? 'bg-gray-600/30' : 'bg-white/50'}`}>
                  <div className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    {account.account_holder_name}
                  </div>
                  <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {account.account_number} • {account.currency}
                  </div>
                  <div className={`font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    {getCurrencySymbol(account.currency)}{formatAmount(account.balance)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex items-start justify-between">
        <div className="flex items-center space-x-4 min-w-0 flex-1 mr-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-emerald-600 to-teal-700' 
              : 'bg-gradient-to-r from-emerald-500 to-teal-600'
          }`}>
            <BankLogo />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className={`font-semibold text-lg truncate ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {bankEntry.bankName}
            </h3>
            <p className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {bankEntry.syncAccounts.length} account{bankEntry.syncAccounts.length !== 1 ? 's' : ''}
              • {Object.keys(bankEntry.currencyBalances).length} currenc{Object.keys(bankEntry.currencyBalances).length !== 1 ? 'ies' : 'y'}
            </p>
            
            {/* Show account preview on desktop */}
            {bankEntry.syncAccounts.length > 0 && (
              <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {bankEntry.syncAccounts.slice(0, 2).map((account, idx) => (
                  <div key={idx}>• {account.account_holder_name}</div>
                ))}
                {bankEntry.syncAccounts.length > 2 && (
                  <div>• ... and {bankEntry.syncAccounts.length - 2} more</div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Desktop Currency Balances - Right aligned */}
        <div className="text-right flex-shrink-0">
          <div className="space-y-2">
            {Object.entries(bankEntry.currencyBalances).map(([currency, amount]) => (
              <div key={currency} className={`p-3 rounded-lg min-w-[200px] ${
                isDarkMode ? 'bg-gray-750/50' : 'bg-gray-50'
              }`}>
                <p className={`text-xs font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {currency} Balance
                </p>
                <p className={`text-lg font-bold ${
                  isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                }`}>
                  {getCurrencySymbol(currency)}{formatAmount(amount)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};