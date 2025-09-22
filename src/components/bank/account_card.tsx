/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { ChevronRight, Building, CreditCard, User } from "lucide-react";
import { useTheme } from "../../custom-hooks/useTheme";
import { useNavigate } from "react-router-dom";
import { useFetchStatements } from "../../api/query";
import { useTransactionStore } from "../../store/transactions";
import LoadingOverlay from "../reuseable/loading-overlay";

interface Transaction {
  accountNumber: string;
  accountType: string;
  valueDate: string;
  transDate: string;
  tranCode: string;
  amount: number;
  referenceNo: string;
  description: string;
  accountName: string;
  currency: string;
  drCr: string;
  debitAmount: number;
  creditAmount: number;
  balance: number;
  runningBalance: number;
}

// Full Details Account Card Component
export const CompactAccountCard = ({
  accountNumber,
  accountHolderName,
  balance,
  currency,
  bankName,
  bankLogo,
  accountType,
  isSelected,
  onTap,
}: {
  accountNumber: string;
  accountHolderName: string;
  balance: any;
  currency: string;
  bankName: string;
  bankLogo: string;
  accountType: string;
  isSelected: boolean;
  onTap: () => void;
  transactions: Transaction[];
}) => {
  const { isDarkMode } = useTheme();
  const [imageError, setImageError] = useState(false);
  const [isCurrentlyLoading, setIsCurrentlyLoading] = useState(false);
  const navigate = useNavigate();

  const {
    loadTransactionsSuccess,
    loadTransactionsError,
    startLoading,
    currentAccountNumber,
    isLoading: globalIsLoading
  } = useTransactionStore();


  // In CompactAccountCard component
  const shouldFetch = !!accountNumber && currentAccountNumber === accountNumber;

  const { data, isLoading, error } = useFetchStatements(
    shouldFetch ? { account_number: accountNumber } : undefined
  );


  // Track if this specific card is loading
  useEffect(() => {
    if (shouldFetch) {
      setIsCurrentlyLoading(isLoading);
    } else {
      setIsCurrentlyLoading(false);
    }
  }, [isLoading, shouldFetch]);

  // Disable loading when data or error is present
  useEffect(() => {
    if ((data || error) && shouldFetch) {
      setIsCurrentlyLoading(false);
    }
  }, [data, error, shouldFetch]);

  // Handle the navigation and data fetching
  const [shouldStartFetch, setShouldStartFetch] = useState(false);

  const handlenav = () => {
    // Only start loading/fetching, do not navigate yet
    setShouldStartFetch(true);
    startLoading({ accountNumber });
  };

  // Update store and navigate when data changes and fetch was triggered from this card
  useEffect(() => {
    if (data && shouldFetch && shouldStartFetch) {
      loadTransactionsSuccess(data?.data, { accountNumber });
      setShouldStartFetch(false);
      navigate('/transactions');
    }
  }, [data, loadTransactionsSuccess, shouldFetch, accountNumber, shouldStartFetch, navigate]);

  // Update error state and reset fetch trigger
  useEffect(() => {
    if (error && shouldFetch && shouldStartFetch) {
      loadTransactionsError(error.message || 'Failed to fetch transactions');
      setShouldStartFetch(false);
    }
  }, [error, loadTransactionsError, shouldFetch, shouldStartFetch]);

  const formatBalance = (balance: any) => {
    const numBalance = parseFloat(balance) || 0;
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numBalance);
  };

  const getAccountTypeColor = (type: any) => {
    switch (type?.toLowerCase()) {
      case 'savings': return 'text-emerald-500';
      case 'current': return 'text-blue-500';
      case 'checking': return 'text-purple-500';
      case 'revenue': return 'text-orange-500';
      default: return 'text-gray-500';
    }
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

  const BankIcon = () => {
    if (bankLogo && !imageError) {
      return (
        <img
          src={bankLogo}
          alt={`${bankName} logo`}
          className="w-full h-full object-contain"
          onError={() => setImageError(true)}
        />
      );
    }

    return (
      <Building className={`w-4 h-4 sm:w-6 sm:h-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
    );
  };

  return (
    <>
      {/* Only show loading overlay if this specific card is loading and the fetch is for this card */}
      {isCurrentlyLoading && shouldFetch && <LoadingOverlay />}
      <div
        onClick={onTap}
        className={`
          w-full min-h-[280px] sm:min-h-[320px] lg:min-h-[350px] 
          max-w-full sm:max-w-sm mx-auto
          rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 
          shadow-sm border 
          transition-all duration-300 cursor-pointer 
          transform hover:scale-[1.01] sm:hover:scale-[1.02] hover:shadow-lg
          flex flex-col
          ${isSelected
            ? (isDarkMode
              ? 'bg-emerald-900/30 border-emerald-500 shadow-emerald-500/20'
              : 'bg-emerald-50 border-emerald-300 shadow-emerald-200/50')
            : (isDarkMode
              ? 'bg-gray-800 border-gray-700 hover:border-emerald-600 hover:bg-gray-800/80'
              : 'bg-white border-gray-200 hover:border-emerald-300 hover:shadow-emerald-100/50')
          }
        `}
      >
        {/* Account Header with Avatar */}
        <div className="flex items-start justify-between mb-4 sm:mb-6">
          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <span className="text-white font-bold text-sm sm:text-lg lg:text-xl">
                {accountHolderName?.charAt(0) || 'A'}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className={`font-bold text-sm sm:text-base lg:text-lg leading-tight mb-1 sm:mb-2 truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {accountHolderName || 'Account Holder'}
              </h3>
              <div className="flex items-center space-x-2">
                <div className={`w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded flex items-center justify-center flex-shrink-0 ${(!bankLogo || imageError)
                  ? (isDarkMode ? 'bg-gray-600' : 'bg-gray-200')
                  : ''
                  }`}>
                  <BankIcon />
                </div>
                <p className={`text-xs sm:text-sm font-medium truncate ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {bankName}
                </p>
              </div>
            </div>
          </div>
          {isSelected && (
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-emerald-500 rounded-full flex-shrink-0 shadow-sm"></div>
          )}
        </div>

        {/* Full Account Details */}
        <div className={`rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5 mb-4 sm:mb-6 space-y-3 sm:space-y-4 ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50/80'}`}>
          {/* Account Number */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0 ${isDarkMode ? 'bg-gray-600' : 'bg-white'
              }`}>
              <CreditCard className={`w-3 h-3 sm:w-4 sm:h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Account Number
              </p>
              <p className={`font-bold text-sm sm:text-base ${isDarkMode ? 'text-white' : 'text-gray-900'} font-mono tracking-wider truncate`}>
                {accountNumber || 'N/A'}
              </p>
            </div>
          </div>

          {/* Account Type */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0 ${isDarkMode ? 'bg-gray-600' : 'bg-white'
              }`}>
              <User className={`w-3 h-3 sm:w-4 sm:h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Account Type
              </p>
              <p className={`font-bold text-sm sm:text-base ${getAccountTypeColor(accountType)} truncate`}>
                {accountType || 'Standard'}
              </p>
            </div>
          </div>
        </div>

        {/* Balance Section - Enhanced */}
        <div className="text-center flex-1 flex flex-col justify-center py-2 sm:py-4">
          <p className={`text-xs sm:text-sm font-semibold mb-2 sm:mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Available Balance
          </p>
          <div className={`px-3 sm:px-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-sm ${isDarkMode ? 'bg-gradient-to-r from-gray-700 to-gray-600' : 'bg-gradient-to-r from-gray-50 to-gray-100'
            }`}>
            <p className={`text-xl sm:text-2xl lg:text-3xl font-black leading-tight break-all ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {getCurrencySymbol(currency)}{formatBalance(balance)}
            </p>
            <p className={`text-xs sm:text-sm font-medium mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {currency?.toUpperCase() || 'NGN'}
            </p>
          </div>
        </div>

        {/* View Transaction History Button */}
        <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-opacity-20 border-gray-400">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click
              handlenav();
            }}
            disabled={isCurrentlyLoading || globalIsLoading || shouldStartFetch}
            className={`w-full flex items-center justify-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${isDarkMode
              ? 'bg-emerald-900/30 hover:bg-emerald-800/40 border border-emerald-700/50'
              : 'bg-emerald-50/50 hover:bg-emerald-100/70 border border-emerald-200/50'
              }`}
          >
            <span className={`text-xs sm:text-sm font-semibold ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'
              }`}>
              {isCurrentlyLoading && shouldFetch
                ? 'Loading Transactions...'
                : 'View Transaction History'
              }
            </span>
            {!isCurrentlyLoading && (
              <ChevronRight className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                }`} />
            )}
          </button>
        </div>

        {/* Account Status Indicator */}
        <div className="mt-2 sm:mt-3 text-center">
          <div className={`inline-flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium ${isDarkMode
            ? 'bg-green-900/30 text-green-300 border border-green-700/30'
            : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full flex-shrink-0"></div>
            <span className="whitespace-nowrap">Active Account</span>
          </div>
        </div>
      </div>
    </>
  );
};