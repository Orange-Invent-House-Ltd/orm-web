/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Search, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../custom-hooks/useTheme';
import { HeaderCard } from '../components/home/home_header';
import { AiFinancialPredictionCard } from '../components/home/ai_prediction_card';
import { RevenueBarChart, RevenueLineChart } from '../components/charts/barCharts';
import { SearchModal } from '../components/home/search_modal';
import LoadingOverlay from '../components/reuseable/loading-overlay';
import Footer from '../components/reuseable/footer';
import { NavigationBar } from '../components/reuseable/buttom_nav';
// import { useNavigate } from 'react-router-dom';
import { useFetchAggregatedBalance, useFetchStatements } from '../api/query';
import { BankListItem } from '../components/home/bank_list';
import { useTransactionStore } from '../store/transactions';
import { useNavigate } from 'react-router-dom';

// Updated interfaces to match API structure and store requirements
interface ApiAccount {
  accountName: string;
  accountNumber: string;
  currentBalance: string;
  availableBalance: string;
  currency: string;
}

interface Account {
  account_id: number;
  account_number: string;
  balance: string;
  currency: string;
  account_holder_name: string;
  bank_name: string;
}

interface BankEntry {
  bankName: string;
  currencyBalances: {
    [currency: string]: number;
  };
  syncAccounts: Account[];
  totalBalance: number;
  bankLogo?: string;
}

// Main Home Component
const HomeScreen = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isBalanceVisible, setIsBalanceVisible] = useState<boolean>(true);
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'bar' | 'line'>('bar');
  const { data, isLoading, error } = useFetchAggregatedBalance();

  const navigate = useNavigate();
  // Parse balances by currency and accounts from API response
  const balancesByCurrency = data?.balancesByCurrency || {};
  const aggregatedAccounts = data?.aggregatedAccounts || [];


  // Build aggregatedBalances for HeaderCard
  const aggregatedBalances = Object.keys(balancesByCurrency).reduce((acc, currency) => {
    acc[currency] = {
      total_currency_balance: parseFloat(balancesByCurrency[currency].totalCurrentBalance),
      total_available_balance: parseFloat(balancesByCurrency[currency].totalAvailableBalance),
      accountCount: balancesByCurrency[currency].accountCount,
      lastSuccessfulSyncTime: balancesByCurrency[currency].lastSuccessfulSyncTime,
      banks: balancesByCurrency[currency].banks || {},
    };
    return acc;
  }, {} as Record<string, {
    total_currency_balance: number;
    total_available_balance: number;
    accountCount: number;
    lastSuccessfulSyncTime: string;
    banks: Record<string, number>;
  }>);

  // Create bank entries by grouping accounts by bank name (extracted from account names)
  const createBankEntries = (): BankEntry[] => {
    // Group accounts by extracting bank information from account names
    // Since we don't have explicit bank names, we'll group by currency and account type
    const bankGroups: { [key: string]: ApiAccount[] } = {};

    aggregatedAccounts.forEach((account: any) => {
      // Extract potential bank identifier or use account type
      let bankKey = 'Kaduna State Government'; // Default since all accounts seem to be government accounts

      // You can customize this logic based on your actual bank identification needs
      if (account.accountName.includes('TSA')) {
        bankKey = 'Treasury Single Account (TSA)';
      } else if (account.accountName.includes('Tax') || account.accountName.includes('VAT') || account.accountName.includes('Withholding')) {
        bankKey = 'Tax Collection Accounts';
      } else if (account.accountName.includes('Domiciliary')) {
        bankKey = 'Foreign Currency Accounts';
      } else if (account.accountName.includes('Insurance') || account.accountName.includes('Retirement') || account.accountName.includes('Fund')) {
        bankKey = 'Special Purpose Funds';
      }

      if (!bankGroups[bankKey]) {
        bankGroups[bankKey] = [];
      }
      bankGroups[bankKey].push({
        accountName: account.accountName,
        accountNumber: account.accountNumber,
        currentBalance: account.currentBalance,
        availableBalance: account.availableBalance,
        currency: account.currency
      });
    });

    // Convert groups to BankEntry format
    return Object.entries(bankGroups).map(([bankName, apiAccounts]) => {
      const currencyBalances: { [currency: string]: number } = {};
      let totalBalance = 0;

      // Transform API accounts to store-compatible format
      const storeAccounts: Account[] = apiAccounts.map((apiAccount, index) => {
        const balance = parseFloat(apiAccount.currentBalance);
        if (!currencyBalances[apiAccount.currency]) {
          currencyBalances[apiAccount.currency] = 0;
        }
        currencyBalances[apiAccount.currency] += balance;
        totalBalance += balance;

        return {
          account_id: index + 1, // Generate ID since API doesn't provide one
          account_number: apiAccount.accountNumber,
          balance: apiAccount.currentBalance,
          currency: apiAccount.currency,
          account_holder_name: apiAccount.accountName,
          bank_name: bankName
        };
      });

      return {
        bankName,
        currencyBalances,
        syncAccounts: storeAccounts,
        totalBalance,
        bankLogo: undefined // Add bank logos later if needed
      };
    });
  };

  const bankEntries = createBankEntries();
  const { setTransactions } = useTransactionStore();
  const { data: trasdata } = useFetchStatements();

  // Toggle balance visibility
  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  // Generate mock inflows/outflows for charts (replace with real data if available)
  const mockInflows = [300000000, 250000000, 400000000, 180000000, 350000000];
  const mockOutflows = [20000000, 15000000, 30000000, 12000000, 25000000];

  // If there's an error, display it
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Data</h2>
          <p className="text-gray-600">{error.message || 'Failed to fetch bank data'}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`transition-all duration-300 w-full min-h-screen sm:p-6 p-2 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
      {isLoading && <LoadingOverlay />}

      {/* Header */}
      <header className={`sticky top-0 z-40 shadow-sm border-b transition-all duration-300 ${isDarkMode
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-200'
        }`}>
        <div className="w-full mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              <button
                onClick={() => setIsSearchVisible(true)}
                className={`p-2 rounded-lg transition-colors flex-shrink-0 ${isDarkMode
                  ? 'hover:bg-gray-700 text-gray-400'
                  : 'hover:bg-gray-100 text-gray-600'
                  }`}
              >
                {isSearchVisible ? (
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
              <h1 className={`text-sm sm:text-lg lg:text-xl font-semibold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                Kaduna State Revenue Monitoring
              </h1>
            </div>

            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors flex-shrink-0 ${isDarkMode
                ? 'hover:bg-gray-700 text-yellow-500'
                : 'hover:bg-gray-100 text-gray-600'
                }`}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Balance Overview Header */}
        <div className="flex flex-row items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <div className="min-w-0">
            <h2 className={`text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
              Balance Overview
            </h2>
            <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
              Monitor your financial metrics
            </p>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg flex-shrink-0 self-start sm:self-center">
            <span className="text-white font-bold text-sm sm:text-lg lg:text-xl tracking-wider">KSRM</span>
          </div>
        </div>

        {/* Currency Cards */}
        <div className="flex flex-row overflow-x-auto pb-7 sm:pb-4 mb-6 sm:mb-8 gap-4 w-full no-scrollbar">
          {Object.keys(aggregatedBalances).length === 0 ? (
            <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <p className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {isLoading ? 'Loading currency data...' : 'No currency data available'}
              </p>
            </div>
          ) : (
            Object.entries(aggregatedBalances).map(([currency, currencyData]) => (
              <HeaderCard
                key={currency}
                title="Total Balance:"
                currency={currency}
                amount={currencyData.total_currency_balance}
                isVisible={isBalanceVisible}
                onToggleVisibility={toggleBalanceVisibility}
              />
            ))
          )}
        </div>

        {/* AI Prediction Card */}
        <div className="mb-6 sm:mb-8">
          <AiFinancialPredictionCard
            aggregatedBalances={aggregatedBalances}
            onAnalyze={() => console.log('Manual AI analysis triggered')}
          />
        </div>

        {/* Bank Lists Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-1 h-4 sm:h-6 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full"></div>
              <h3 className={`text-lg sm:text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                Account Groups
              </h3>
            </div>
            <div>
              <div className={`px-3 py-1 rounded-lg self-start sm:self-center ${isDarkMode ? 'bg-emerald-900/30' : 'bg-emerald-100'
                }`}>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                  }`}>
                  {Object.keys(balancesByCurrency).length} currencies • {aggregatedAccounts.length} accounts
                </span>
              </div>
              <div className={`px-3 py-1 mt-4 rounded-lg self-start sm:self-center ${isDarkMode ? 'bg-emerald-900/30' : 'bg-emerald-100'
                }`}>
                <button
                  onClick={() => {
                    setTransactions(trasdata?.data);
                    navigate('/transactions');

                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className={`text-md cursor-pointer ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>

                  View all Transactions
                </button>
              </div>
            </div>
          </div>

          {/* Bank List Items */}
          <div className="space-y-3 sm:space-y-4 lg:space-y-5">
            {bankEntries.length === 0 ? (
              <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <p className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {isLoading ? 'Loading account data...' : 'No account data available'}
                </p>
              </div>
            ) : (
              bankEntries.map((bankEntry, index) => (
                <BankListItem
                  key={`${bankEntry.bankName}-${index}`}
                  bankEntry={bankEntry}
                  isVisible={isBalanceVisible}
                />
              ))
            )}
          </div>
        </div>

        {/* Charts Section */}
        <div className="mb-6 sm:mb-8">
          <div className="mb-4 sm:mb-6">
            <h3 className={`text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-left ${isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
              Transaction Charts
            </h3>

            {/* Tab Bar */}
            <div className={`p-1 rounded-xl inline-flex w-full sm:w-auto ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
              <button
                onClick={() => setActiveTab('bar')}
                className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${activeTab === 'bar'
                  ? (isDarkMode
                    ? 'bg-gray-700 text-white shadow-sm'
                    : 'bg-white text-gray-900 shadow-sm')
                  : (isDarkMode
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900')
                  }`}
              >
                Bar Chart
              </button>
              <button
                onClick={() => setActiveTab('line')}
                className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${activeTab === 'line'
                  ? (isDarkMode
                    ? 'bg-gray-700 text-white shadow-sm'
                    : 'bg-white text-gray-900 shadow-sm')
                  : (isDarkMode
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900')
                  }`}
              >
                Line Chart
              </button>
            </div>
          </div>

          {/* Chart Content */}
          <div className="w-full rounded-xl">
            {activeTab === 'bar' ? (
              <RevenueBarChart
                inflows={mockInflows}
                outflows={mockOutflows}
                isDarkMode={isDarkMode}
                currency='NGN'
              />
            ) : (
              <RevenueLineChart
                inflows={mockInflows}
                outflows={mockOutflows}
                isDarkMode={isDarkMode}
                title="Monthly Trends"
                currency="NGN"
              />
            )}
          </div>
        </div>

        {/* Additional spacing for mobile scroll */}
        <div className="h-4 sm:h-0"></div>
      </main>

      {/* Search Modal */}
      <SearchModal
        isVisible={isSearchVisible}
        onClose={() => setIsSearchVisible(false)}
      />
      <Footer />
      <NavigationBar />
    </div>
  );
};

export default HomeScreen;