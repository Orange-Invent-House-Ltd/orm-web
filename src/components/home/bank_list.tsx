import { useTheme } from "../../custom-hooks/useTheme";
import { useState } from "react";
import { useBankStore } from "../../store/store";
import { useNavigate } from "react-router-dom";

// Define the Account interface to match your API
interface Account {
  account_id: number;
  account_number: string;
  balance: string;
  currency: string;
  account_holder_name: string;
  bank_name: string;
}

// Updated interface to support grouped accounts by bank
interface BankEntry {
  bankName: string;
  currencyBalances: {
    [currency: string]: number;
  };
  syncAccounts: Account[];
  totalBalance: number;
  bankLogo?: string; // Add optional logo URL
}
// Bank List Item Component for Grouped Accounts
interface BankListItemProps {
  bankEntry: BankEntry;
  isVisible: boolean;
}

// Updated BankListItem component with logo support
export const BankListItem = ({
  bankEntry,
  isVisible
}: BankListItemProps) => {
  const { isDarkMode } = useTheme();
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [imageError, setImageError] = useState(false);

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

  const formatAmount = (amount: number) => {
    if (!isVisible) return '••••••••';
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
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

  // Bank logo component with fallback
  const BankLogo = () => {
    if (bankEntry.bankLogo && !imageError) {
      return (
        <img 
          src={bankEntry.bankLogo} 
          alt={`${bankEntry.bankName} logo`}
          className="w-full h-full object-contain "
          onError={() => setImageError(true)}
        />
      );
    }
    
    // Fallback to initials if no logo or image failed to load
    return (
      <span className="text-white font-bold text-sm sm:text-lg">
        {bankEntry.bankName.charAt(0)}
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
          <div className={`${!bankEntry.bankLogo || imageError ? 'w-10 h-10 sm:w-12 sm:h-12' : 'w-16 h-16'} rounded-xl flex items-center justify-center flex-shrink-0 ${
            // Only show gradient background if no logo or logo failed to load
            (!bankEntry.bankLogo || imageError) 
              ? (isDarkMode 
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700' 
                  : 'bg-gradient-to-r from-emerald-500 to-teal-600')
              : '' // Neutral background for logos
          }`}>
            <BankLogo />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className={`font-semibold text-sm sm:text-base truncate ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {bankEntry.bankName}
            </h3>
            <p className={`text-xs sm:text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {bankEntry.syncAccounts.length} account{bankEntry.syncAccounts.length !== 1 ? 's' : ''}
              • {Object.keys(bankEntry.currencyBalances).length} currenc{Object.keys(bankEntry.currencyBalances).length !== 1 ? 'ies' : 'y'}
            </p>
          </div>
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
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex items-center justify-between">
        <div className="flex items-center space-x-4 min-w-0 flex-1 mr-4">
          <div className={`${!bankEntry.bankLogo || imageError ? 'w-10 h-10 sm:w-12 sm:h-12' : 'w-16 h-16'} rounded-xl flex items-center justify-center flex-shrink-0 ${
            // Only show gradient background if no logo or logo failed to load
            (!bankEntry.bankLogo || imageError) 
              ? (isDarkMode 
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700' 
                  : 'bg-gradient-to-r from-emerald-500 to-teal-600')
              : '' // Neutral background for logos
          }`}>
            <BankLogo />
          </div>
          <div className="min-w-0">
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
          </div>
        </div>
        
        {/* Desktop Currency Balances - Right aligned like original design */}
        <div className="text-right flex-shrink-0">
          <div className="space-y-2">
            {Object.entries(bankEntry.currencyBalances).map(([currency, amount]) => (
              <div key={currency} className={`p-3 rounded-lg ${
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