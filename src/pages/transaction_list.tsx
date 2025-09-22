/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowLeft, Moon, Receipt, Sun, Search, Filter, X, AlertCircle } from "lucide-react";
import { AllTransactions } from "../components/transactionList.tsx/list_comp";
import { TransactionDetailsModal } from "../components/transactionList.tsx/transaction_modal";
import { useTheme } from "../custom-hooks/useTheme";
import { useState, useEffect } from "react";
import Footer from "../components/reuseable/footer";
import { NavigationBar } from "../components/reuseable/buttom_nav";
import { useTransactionStore } from "../store/transactions";
import LoadingOverlay from "../components/reuseable/loading-overlay";

// Main Transaction List Component
const TransactionList = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [transactionType, setTransactionType] = useState('all');
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [totalCredit, setTotalCredit] = useState(0);
  const [totalDebit, setTotalDebit] = useState(0);

  // Use the Zustand store
  const {
    selectedTransaction,
    setSelectedTransaction,
    transactions,
    isLoading,
    error,
    currentAccountNumber,
    searchTerm: storeSearchTerm,
    setError,
  } = useTransactionStore();

  // Calculate totals and filter transactions
  useEffect(() => {
    if (!transactions || transactions?.length === 0) {
      setFilteredTransactions([]);
      setTotalCredit(0);
      setTotalDebit(0);
      return;
    }

    let filtered = [...transactions];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((transaction: any) =>
        transaction.Description?.toLowerCase().includes(query) ||
        transaction.AcctName?.toLowerCase().includes(query) ||
        transaction.AcctNo?.toLowerCase().includes(query) ||
        transaction.ptid?.toLowerCase().includes(query) ||
        transaction.TranCode?.toLowerCase().includes(query)
      );
    }

    // Apply transaction type filter
    if (transactionType !== 'all') {
      filtered = filtered.filter((transaction: any) => {
        const mode = transaction.Mode?.toLowerCase();
        return transactionType === 'credit' ? mode === 'credit' : mode === 'debit';
      });
    }

    // Calculate totals for filtered transactions
    const creditTotal = filtered.reduce((sum, transaction) => {
      return sum + (parseFloat(transaction.CreditAmt) || 0);
    }, 0);

    const debitTotal = filtered.reduce((sum, transaction) => {
      return sum + (parseFloat(transaction.DebitAmt) || 0);
    }, 0);

    setFilteredTransactions(filtered);
    setTotalCredit(creditTotal);
    setTotalDebit(debitTotal);
  }, [transactions, searchQuery, transactionType]);

  // Format currency function
  // const formatCurrency = (amount: number, currency: string = 'NGN') => {
  //   return new Intl.NumberFormat('en-US', {
  //     style: 'currency',
  //     currency: currency,
  //     minimumFractionDigits: 2,
  //     maximumFractionDigits: 2,
  //   }).format(amount);
  // };

  const getCurrencySymbol = (currency: string = 'NGN') => {
    switch (currency?.toUpperCase()) {
      case 'NGN': return '₦';
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      default: return '₦';
    }
  };

  const showTransactionDetails = (transaction: any) => {
    setSelectedTransaction(transaction);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTransaction(null);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setTransactionType('all');
  };

  const handleRetry = () => {
    setError(null);
    // You might want to trigger a re-fetch here depending on your API setup
  };

  const handleGoBack = () => {
    setError(null);
    window.history.back();
  };

  // Determine if we have data or should show empty state
  const hasTransactions = transactions && transactions.length > 0;
  const hasFilteredTransactions = filteredTransactions && filteredTransactions.length > 0;
  const isFiltered = searchQuery.trim() || transactionType !== 'all';

  // Show loading state
  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <LoadingOverlay />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`shadow-sm border-b transition-all duration-300 ${isDarkMode
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-200'
        }`}>
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
              <button
                onClick={handleGoBack}
                className={`p-1.5 sm:p-2 rounded-lg transition-colors flex-shrink-0 ${isDarkMode
                  ? 'hover:bg-gray-700 text-gray-400'
                  : 'hover:bg-gray-100 text-gray-600'
                  }`}
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <div className="flex-1 min-w-0">
                <h1 className={`text-lg sm:text-xl font-semibold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Transaction History
                </h1>
                {(currentAccountNumber || storeSearchTerm) && (
                  <p className={`text-xs sm:text-sm truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {currentAccountNumber ? `Account: ${currentAccountNumber}` : `Search: "${storeSearchTerm}"`}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-1.5 sm:p-2 rounded-lg transition-colors flex-shrink-0 ${isDarkMode
                  ? 'hover:bg-gray-700 text-gray-400'
                  : 'hover:bg-gray-100 text-gray-600'
                  }`}
              >
                <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={toggleTheme}
                className={`p-1.5 sm:p-2 rounded-lg transition-colors flex-shrink-0 ${isDarkMode
                  ? 'hover:bg-gray-700 text-yellow-500'
                  : 'hover:bg-gray-100 text-gray-600'
                  }`}
              >
                {isDarkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className={`pb-3 transition-all duration-300 ${showFilters ? 'block' : 'hidden'}`}>
            <div className="flex items-center space-x-2 mb-2">
              <div className={`flex-1 relative ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg`}>
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  type="text"
                  placeholder="Search by description, account, reference..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className={`w-full pl-10 pr-4 py-2 bg-transparent border-none outline-none text-sm ${isDarkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'}`}
                />
              </div>

              {/* Transaction Type Filter */}
              <select
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
                className={`px-3 py-2 rounded-lg border text-sm ${isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-gray-100 border-gray-200 text-gray-900'
                  }`}
              >
                <option value="all">All Types</option>
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
              </select>

              <button
                onClick={clearFilters}
                className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4">
        {/* Show error state */}
        {error && (
          <div className={`mb-6 p-4 rounded-lg border ${isDarkMode
            ? 'bg-red-900/20 border-red-800 text-red-300'
            : 'bg-red-50 border-red-200 text-red-700'
            }`}>
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-medium">Error Loading Transactions</p>
                <p className="text-sm mt-1 opacity-90">{error}</p>
                <button
                  onClick={handleRetry}
                  className={`mt-2 px-3 py-1 rounded text-sm transition-colors ${isDarkMode
                    ? 'bg-red-800 hover:bg-red-700 text-red-100'
                    : 'bg-red-100 hover:bg-red-200 text-red-800'
                    }`}
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Transaction Count and Summary */}
        {!error && hasTransactions && (
          <div className="mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
              <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Showing {filteredTransactions.length} of {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
                {isFiltered && <span className="ml-1">(filtered)</span>}
              </p>

              {/* Clear filters button if any filters are active */}
              {isFiltered && (
                <button
                  onClick={clearFilters}
                  className={`text-xs px-3 py-1 rounded-full transition-colors ${isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* Total Credit and Debit Cards */}
            {hasFilteredTransactions && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Total Credit Card */}
                <div className={`p-4 rounded-xl border ${isDarkMode
                  ? 'bg-green-900/20 border-green-800'
                  : 'bg-green-50 border-green-200'
                  }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
                        Total Credit
                      </p>
                      <p className={`text-2xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-900'}`}>
                        {getCurrencySymbol()}{totalCredit.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-green-800/30' : 'bg-green-100'}`}>
                      <span className={`text-lg font-semibold ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
                        ↑
                      </span>
                    </div>
                  </div>
                  <p className={`text-xs mt-2 ${isDarkMode ? 'text-green-400/70' : 'text-green-700/70'}`}>
                    {filteredTransactions.filter(t => t.Mode?.toLowerCase() === 'credit').length} credit transaction(s)
                  </p>
                </div>

                {/* Total Debit Card */}
                <div className={`p-4 rounded-xl border ${isDarkMode
                  ? 'bg-red-900/20 border-red-800'
                  : 'bg-red-50 border-red-200'
                  }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>
                        Total Debit
                      </p>
                      <p className={`text-2xl font-bold ${isDarkMode ? 'text-red-400' : 'text-red-900'}`}>
                        {getCurrencySymbol()}{totalDebit.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-red-800/30' : 'bg-red-100'}`}>
                      <span className={`text-lg font-semibold ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>
                        ↓
                      </span>
                    </div>
                  </div>
                  <p className={`text-xs mt-2 ${isDarkMode ? 'text-red-400/70' : 'text-red-700/70'}`}>
                    {filteredTransactions.filter(t => t.Mode?.toLowerCase() === 'debit').length} debit transaction(s)
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Content based on state */}
        {!error && (
          <>
            {/* No transactions at all */}
            {!hasTransactions ? (
              <div className="flex flex-col items-center justify-center py-12 sm:py-20">
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <Receipt className={`w-8 h-8 sm:w-10 sm:h-10 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                </div>
                <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  No transactions found
                </h3>
                <p className={`text-sm text-center max-w-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {currentAccountNumber
                    ? 'This account has no transaction history yet. Transactions will appear here once they are processed.'
                    : storeSearchTerm
                      ? 'No transactions match your search criteria. Try searching with different terms.'
                      : 'Select an account to view transaction history or use the search feature to find specific transactions.'
                  }
                </p>
              </div>
            ) : (
              <>
                {/* No filtered results */}
                {!hasFilteredTransactions && isFiltered ? (
                  <div className="flex flex-col items-center justify-center py-12 sm:py-20">
                    <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <Search className={`w-8 h-8 sm:w-10 sm:h-10 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                    </div>
                    <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      No matching transactions found
                    </h3>
                    <p className={`text-sm text-center max-w-sm mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      Try adjusting your search terms or filters to find what you're looking for.
                    </p>
                    <button
                      onClick={clearFilters}
                      className={`px-4 py-2 rounded-lg text-sm transition-colors ${isDarkMode
                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      Clear filters
                    </button>
                  </div>
                ) : (
                  /* Transaction List */
                  <div className="space-y-4 sm:space-y-2">
                    {filteredTransactions?.map((transaction: any, index: number) => (
                      <AllTransactions
                        key={transaction.ptid || `transaction-${index}`}
                        onTap={() => showTransactionDetails(transaction)}
                        transactionType={transaction.Mode || ''}
                        accountType={transaction.TranCode || ''}
                        amount={transaction.Mode === 'DEBIT' ? transaction.DebitAmt : transaction.CreditAmt}
                        amountFormatted={transaction.Mode === 'DEBIT' ? transaction.DebitAmtFormatted : transaction.CreditAmtFormatted}
                        originatingAccountNo={transaction.AcctNo || ''}
                        transactionReferenceNo={transaction.ptid}
                        currency={transaction.Currency}
                        description={transaction.Description || ''}
                        createdAt={transaction.TransDate || ''}
                        accountHolderName={transaction.AcctName || ''}
                        runningBalance={transaction.RunningBalanceFormatted}
                        valueDate={transaction.ValueDate}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}

        <Footer />
        <NavigationBar />
      </main>

      {/* Transaction Details Modal */}
      <TransactionDetailsModal
        transaction={selectedTransaction}
        isVisible={showModal}
        onClose={closeModal}
      />
    </div>
  );
};

export default TransactionList;