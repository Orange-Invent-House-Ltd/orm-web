/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { ArrowLeftRight, Building, Calendar, CreditCard, FileText, PiggyBank, Receipt, TrendingDown, TrendingUp, User, X } from "lucide-react";
import { useTheme } from "../../custom-hooks/useTheme";

// Transaction Details Modal
export const TransactionDetailsModal = ({ transaction, isVisible, onClose }: { transaction: any; isVisible: boolean; onClose: () => void; }) => {
  const { isDarkMode } = useTheme();
  
  if (!isVisible || !transaction) return null;

  // Extract values from your actual transaction data structure
  const transactionType = transaction.Mode || 'unknown';
  const accountType = transaction.TranCode || 'Unknown Account';
  const accountHolderName = transaction.AcctName || 'Unknown Account Holder';
  const originatingAccountNo = transaction.AcctNo || '';
  const amount = transaction.Mode === 'DEBIT' ? transaction.DebitAmt : transaction.CreditAmt;
  const amountFormatted = transaction.Mode === 'DEBIT' ? transaction.DebitAmtFormatted : transaction.CreditAmtFormatted;
  const currency = transaction.Currency || 'NGN';
  const description = transaction.Description || '';
  const transactionRef = transaction.ptid || 'N/A';
  const createdAt = transaction.TransDate || '';
  const valueDate = transaction.ValueDate || '';
  const runningBalance = transaction.RunningBalanceFormatted || '';

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
    <div className="flex items-start space-x-3 mb-4 last:mb-0">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
        isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
      }`}>
        <Icon className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-medium mb-1.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {label}
        </p>
        <p className={`text-sm font-semibold break-words leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {value || 'N/A'}
        </p>
      </div>
    </div>
  );

  const DetailSection = ({ title, children }: { title: string; children: React.ReactNode; }) => (
    <div className={`rounded-xl p-4 border ${
      isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
    }`}>
      <h3 className={`text-sm font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </h3>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`w-full max-w-md rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div 
          className="px-6 py-5 relative flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${color}15, transparent)`
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center border flex-shrink-0"
                style={{ 
                  background: `linear-gradient(135deg, ${color}20, ${color}10)`,
                  borderColor: `${color}40`
                }}
              >
                <IconComponent 
                  className="w-5 h-5"
                  style={{ color }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className={`text-lg font-bold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Transaction Details
                </h2>
                <p className="text-sm font-semibold truncate mt-0.5" style={{ color }}>
                  {getTransactionTypeText(transactionType)}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 ml-4 ${
                isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {/* Amount Display */}
          <div className="text-center py-6 border-b mb-6" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
            <p 
              className="text-3xl font-black mb-3 break-words leading-tight"
              style={{ color }}
            >
              {currency} {amountFormatted || formatAmount(amount)}
            </p>
            <div 
              className="inline-block px-3 py-1.5 rounded-full text-xs font-bold tracking-wider border"
              style={{ 
                backgroundColor: `${color}20`,
                borderColor: `${color}40`,
                color: color
              }}
            >
              {getTransactionTypeText(transactionType).toUpperCase()}
            </div>
          </div>

          <div className="space-y-4">
            {/* Transaction Information */}
            <DetailSection title="Transaction Information">
              <DetailRow 
                icon={Calendar}
                label="Transaction Date"
                value={formatDate(createdAt)}
              />
              {valueDate && valueDate !== createdAt && (
                <DetailRow 
                  icon={Calendar}
                  label="Value Date"
                  value={formatDate(valueDate)}
                />
              )}
              <DetailRow 
                icon={CreditCard}
                label="Transaction Code"
                value={accountType}
              />
              <DetailRow 
                icon={Receipt}
                label="Reference Number"
                value={transactionRef}
              />
            </DetailSection>

            {/* Account Details */}
            <DetailSection title="Account Details">
              <DetailRow 
                icon={User}
                label="Account Name"
                value={accountHolderName}
              />
              {originatingAccountNo && (
                <DetailRow 
                  icon={CreditCard}
                  label="Account Number"
                  value={originatingAccountNo}
                />
              )}
            </DetailSection>

            {/* Amount Details */}
            <DetailSection title="Amount Details">
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
              {runningBalance && (
                <DetailRow 
                  icon={Building}
                  label="Running Balance"
                  value={runningBalance}
                />
              )}
            </DetailSection>

            {/* Description */}
            {description && (
              <DetailSection title="Transaction Narration">
                <DetailRow 
                  icon={FileText}
                  label="Details"
                  value={description}
                />
              </DetailSection>
            )}
          </div>
        </div>

        {/* Fixed Close Button */}
        <div className="flex-shrink-0 px-6 pb-6 pt-4">
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl text-base"
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