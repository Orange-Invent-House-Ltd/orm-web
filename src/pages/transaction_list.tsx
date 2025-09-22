/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowLeft, Moon, Receipt, Sun, Search, Filter, X } from "lucide-react";
import { AllTransactions } from "../components/transactionList.tsx/list_comp";
import { TransactionDetailsModal } from "../components/transactionList.tsx/transaction_modal";
import { useTheme } from "../custom-hooks/useTheme";
import { useState } from "react";
import Footer from "../components/reuseable/footer";
import { NavigationBar } from "../components/reuseable/buttom_nav";
import { useTransactionStore } from "../store/transactions";
import { useFetchStatements } from "../api/query";
import LoadingOverlay from "../components/reuseable/loading-overlay";

// Main Transaction List Component
const TransactionList = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [transactionType, setTransactionType] = useState('all');

  // Use the Zustand store only for selected transaction
  const { 
    selectedTransaction, 
    setSelectedTransaction
  } = useTransactionStore();

  // Get transactions directly from API
  const account_number = localStorage.getItem('accn');
  const { data, isLoading } = useFetchStatements({ account_number,search: searchQuery, });

  console.log(data);

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
;

  const clearFilters = () => {
    setSearchQuery('');
    setTransactionType('all');
  };

  

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      {isLoading && <LoadingOverlay/>}
      <header className={`shadow-sm border-b transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
              <button
                onClick={() => window.history.back()}
                className={`p-1.5 sm:p-2 rounded-lg transition-colors flex-shrink-0 ${
                  isDarkMode 
                    ? 'hover:bg-gray-700 text-gray-400' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <h1 className={`text-lg sm:text-xl font-semibold truncate ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Transaction History
              </h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-1.5 sm:p-2 rounded-lg transition-colors flex-shrink-0 ${
                  isDarkMode 
                    ? 'hover:bg-gray-700 text-gray-400' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={toggleTheme}
                className={`p-1.5 sm:p-2 rounded-lg transition-colors flex-shrink-0 ${
                  isDarkMode 
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
              <div className={`flex-1 relative ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
              } rounded-lg`}>
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="text"
                  placeholder="Search by narration, description..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className={`w-full pl-10 pr-4 py-2 bg-transparent border-none outline-none ${
                    isDarkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
              <button
                onClick={clearFilters}
                className={`p-2 rounded-lg ${
                  isDarkMode ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4">
        {/* Transaction Count */}
        <div className="mb-4 sm:mb-6">
          {data?.data?.length !== undefined &&  <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {data?.data?.length} transaction{data?.data?.length !== 1 ? 's' : ''} found
          </p> }
        </div>

        {/* Transactions List */}
        {data?.data?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-20">
            <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 ${
              isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
            }`}>
              <Receipt className={`w-6 h-6 sm:w-8 sm:h-8 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            </div>
            <p className={`text-base sm:text-lg font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {data.length === 0 ? 'No transactions found' : 'No matching transactions found'}
            </p>
            {(transactionType !== 'all' || searchQuery) && (
              <button
                onClick={clearFilters}
                className={`mt-4 px-4 py-2 rounded-lg text-sm ${
                  isDarkMode 
                    ? 'bg-gray-700 text-white hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-2">
            {data?.data?.map((transaction:any) => (
              <AllTransactions
                key={transaction.id}
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