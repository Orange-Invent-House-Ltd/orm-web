/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { ChevronRight, Building, CreditCard, User, } from "lucide-react";
import { useTheme } from "../../custom-hooks/useTheme";
import TransactionModal from "../AllTransactions";


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
  transactions
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

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
      <Building className={`w-6 h-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
    );
  };

  return (
    <>
      <div
        onClick={onTap}
        className={`
          w-full min-h-[350px] max-w-sm mx-auto
          rounded-2xl p-6 shadow-sm border 
          transition-all duration-300 cursor-pointer 
          transform hover:scale-[1.02] hover:shadow-lg
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
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4 min-w-0 flex-1">
            <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <span className="text-white font-bold text-xl">{accountHolderName?.charAt(0) || 'A'}</span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className={`font-bold text-lg leading-tight mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {accountHolderName || 'Account Holder'}
              </h3>
              <div className="flex items-center space-x-2">
                <div className={`w-10 h-10 rounded flex items-center justify-center ${(!bankLogo || imageError)
                    ? (isDarkMode ? 'bg-gray-600' : 'bg-gray-200')
                    : ''
                  }`}>
                  <BankIcon />
                </div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {bankName}
                </p>
              </div>
            </div>
          </div>
          {isSelected && (
            <div className="w-4 h-4 bg-emerald-500 rounded-full flex-shrink-0 shadow-sm"></div>
          )}
        </div>

        {/* Full Account Details */}
        <div className={`rounded-xl p-5 mb-6 space-y-4 ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50/80'}`}>
          {/* Account Number */}
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-gray-600' : 'bg-white'
              }`}>
              <CreditCard className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Account Number
              </p>
              <p className={`font-bold text-base ${isDarkMode ? 'text-white' : 'text-gray-900'} font-mono tracking-wider`}>
                {accountNumber || 'N/A'}
              </p>
            </div>
          </div>

          {/* Account Type */}
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-gray-600' : 'bg-white'
              }`}>
              <User className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Account Type
              </p>
              <p className={`font-bold text-base ${getAccountTypeColor(accountType)}`}>
                {accountType || 'Standard'}
              </p>
            </div>
          </div>
        </div>

        {/* Balance Section - Enhanced */}
        <div className="text-center flex-1 flex flex-col justify-center py-4">
          <p className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Available Balance
          </p>
          <div className={`px-4 py-4 rounded-2xl shadow-sm ${isDarkMode ? 'bg-gradient-to-r from-gray-700 to-gray-600' : 'bg-gradient-to-r from-gray-50 to-gray-100'
            }`}>
            <p className={`text-3xl font-black leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {getCurrencySymbol(currency)}{formatBalance(balance)}
            </p>
            <p className={`text-sm font-medium mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {currency?.toUpperCase() || 'NGN'}
            </p>
          </div>
        </div>

        {/* View Transaction History Button */}
        <div className="mt-6 pt-4 border-t border-opacity-20 border-gray-400">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent card selection
              setIsModalOpen(true);
            }}
            className={`w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${isDarkMode
              ? 'bg-emerald-900/30 hover:bg-emerald-800/40 border border-emerald-700/50'
              : 'bg-emerald-50/50 hover:bg-emerald-100/70 border border-emerald-200/50'
              }`}
          >
            <span className={`text-sm font-semibold ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'
              }`}>
              View Transaction History
            </span>
            <ChevronRight className={`w-5 h-5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
              }`} />
          </button>
        </div>

        {/* Account Status Indicator */}
        <div className="mt-3 text-center">
          <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${isDarkMode
            ? 'bg-green-900/30 text-green-300 border border-green-700/30'
              : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Active Account</span>
          </div>
        </div>
      </div>

      {/* Transaction History Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transactions={transactions}
        accountName={accountHolderName}
        isDarkMode={isDarkMode}
      />
    </>
  );
};