/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { ArrowLeftRight, Building, Calendar, CreditCard, FileText, PiggyBank, Receipt, TrendingDown, TrendingUp, User, X } from "lucide-react";
import { useTheme } from "../../custom-hooks/useTheme";

// Transaction Details Modal
export const TransactionDetailsModal = ({ transaction, isVisible, onClose }: { transaction: any; isVisible: boolean; onClose: () => void; }) => {
  const { isDarkMode } = useTheme();
  
  if (!isVisible || !transaction) return null;

  // Helper function to get field value with fallbacks
  const getFieldValue = (primary: string, fallback: string, defaultValue: string = 'N/A') => {
    return transaction[primary] || transaction[fallback] || defaultValue;
  };

  // Extract values with proper fallbacks
  const transactionType = getFieldValue('type', 'transaction_type', 'unknown');
  const accountType = getFieldValue('accountType', 'account_type', 'Unknown Account');
  const accountHolderName = getFieldValue('accountHolderName', 'account_holder_name', 'Unknown Account Holder');
  const originatingAccountNo = getFieldValue('originatingAccountNo', 'originating_account_no', '');
  const originatingBank = getFieldValue('originatingBank', 'originating_bank', '');
  const createdAt = getFieldValue('createdAt', 'created_at', '');
  const amount = transaction.amount || '0.00';
  const currency = transaction.currency || 'NGN';
  const description = transaction.description || '';
  const transactionRef = transaction.transaction_reference_no || transaction.id || 'N/A';
  const sessionId = transaction.session_id || 'N/A';

  const getTransactionColor = (type: string) => {
    if (!type) return '#64748B'; // Default color if type is undefined
    
    switch (type.toLowerCase()) {
      case 'credit': return '#22C55E';
      case 'debit': return '#EF4444';
      case 'transfer': return '#3B82F6';
      case 'deposit': return '#8B5CF6';
      default: return '#64748B';
    }
  };

  const getTransactionIcon = (type: string) => {
    if (!type) return Receipt; // Default icon if type is undefined
    
    switch (type.toLowerCase()) {
      case 'credit': return TrendingDown;
      case 'debit': return TrendingUp;
      case 'transfer': return ArrowLeftRight;
      case 'deposit': return PiggyBank;
      default: return Receipt;
    }
  };

  const getTransactionTypeText = (type: string) => {
    if (!type) return 'Transaction'; // Default text if type is undefined
    
    switch (type.toLowerCase()) {
      case 'credit': return 'Credit';
      case 'debit': return 'Debit';
      case 'transfer': return 'Transfer';
      case 'deposit': return 'Deposit';
      default: return 'Transaction';
    }
  };

  const formatAmount = (amount: string) => {
    const numAmount = parseFloat(amount) || 0;
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numAmount);
  };

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'Unknown date';
      
      const date = new Date(dateString);
      
      // Handle invalid dates
      if (isNaN(date.getTime())) {
        return dateString || 'Unknown date';
      }
      
      return date.toLocaleDateString('en-US', { 
        month: 'long', 
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
  };

  const color = getTransactionColor(transactionType);
  const IconComponent = getTransactionIcon(transactionType);

  const DetailRow = ({ icon: Icon, label, value }: { icon: any; label: string; value: string | number; }) => (
    <div className="flex items-start space-x-3 mb-3 last:mb-0">
      <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
        isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
      }`}>
        <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-0.5`}>{label}</p>
        <p className={`text-sm font-semibold break-words ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{value || 'N/A'}</p>
      </div>
    </div>
  );

  const DetailSection = ({ title, children }: { title: string; children: React.ReactNode; }) => (
    <div className={`rounded-lg sm:rounded-xl p-3 sm:p-4 border ${
      isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
    }`}>
      <h3 className={`text-sm font-bold mb-3 sm:mb-4 ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        {title}
      </h3>
      {children}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
      <div className={`w-full max-w-sm sm:max-w-md rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div 
          className="px-4 sm:px-6 py-4 sm:py-5 relative flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${color}15, transparent)`
          }}
        >
          <div className="flex items-center space-x-3">
            <div 
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center border flex-shrink-0"
              style={{ 
                background: `linear-gradient(135deg, ${color}20, ${color}10)`,
                borderColor: `${color}40`
              }}
            >
              <IconComponent 
                className="w-4 h-4 sm:w-5 sm:h-5"
                style={{ color }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className={`text-base sm:text-lg font-bold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Transaction Details
              </h2>
              <p className="text-sm font-semibold truncate" style={{ color }}>
                {getTransactionTypeText(transactionType)}
              </p>
            </div>
            <button
              onClick={onClose}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 ${
                isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-4 sm:pb-6">
          {/* Amount Display */}
          <div className="text-center py-4 sm:py-6">
            <p 
              className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 break-words"
              style={{ color }}
            >
              {currency} {formatAmount(amount)}
            </p>
            <div 
              className="inline-block px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold tracking-wider border"
              style={{ 
                backgroundColor: `${color}20`,
                borderColor: `${color}40`,
                color: color
              }}
            >
              {getTransactionTypeText(transactionType).toUpperCase()}
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {/* Transaction Information */}
            <DetailSection title="Transaction Information">
              <DetailRow 
                icon={Calendar}
                label="Date & Time"
                value={formatDate(createdAt)}
              />
              <DetailRow 
                icon={CreditCard}
                label="Account Type"
                value={accountType}
              />
              <DetailRow 
                icon={Receipt}
                label="Reference Number"
                value={transactionRef}
              />
              {sessionId && sessionId !== 'N/A' && (
                <DetailRow 
                  icon={Receipt}
                  label="Session ID"
                  value={sessionId}
                />
              )}
            </DetailSection>

            {/* Account Details */}
            <DetailSection title="Account Details">
              <DetailRow 
                icon={User}
                label="Account Holder"
                value={accountHolderName}
              />
              {originatingAccountNo && (
                <DetailRow 
                  icon={CreditCard}
                  label="Account Number"
                  value={originatingAccountNo}
                />
              )}
              {originatingBank && (
                <DetailRow 
                  icon={Building}
                  label="Bank"
                  value={originatingBank}
                />
              )}
            </DetailSection>

            {/* Description */}
            {description && (
              <DetailSection title="Description">
                <DetailRow 
                  icon={FileText}
                  label="Details"
                  value={description}
                />
              </DetailSection>
            )}

            {/* Additional Information */}
            <DetailSection title="Additional Information">
              <DetailRow 
                icon={Receipt}
                label="Transaction Type"
                value={getTransactionTypeText(transactionType)}
              />
              <DetailRow 
                icon={CreditCard}
                label="Currency"
                value={currency}
              />
            </DetailSection>
          </div>
        </div>

        {/* Fixed Close Button */}
        <div className="flex-shrink-0 px-4 sm:px-6 pb-4 sm:pb-6 pt-2">
          <button
            onClick={onClose}
            className="w-full py-3 sm:py-3.5 rounded-xl sm:rounded-2xl font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl text-sm sm:text-base"
            style={{ 
              background: `linear-gradient(135deg, ${color}, ${color}cc)`,
              boxShadow: `0 10px 30px ${color}40`
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};