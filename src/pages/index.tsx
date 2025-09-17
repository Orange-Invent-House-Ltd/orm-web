/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Search, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../custom-hooks/useTheme';
import { HeaderCard } from '../components/home/home_header';
import { AiFinancialPredictionCard } from '../components/home/ai_prediction_card';
import { RevenueBarChart, RevenueLineChart } from '../components/charts/barCharts';
import { SearchModal } from '../components/home/search_modal';
import LoadingOverlay from '../components/reuseable/loading-overlay';
import Footer from '../components/reuseable/footer';
import { NavigationBar } from '../components/reuseable/buttom_nav';
import { useFetchBanks } from '../api/mutation';
import { useNavigate } from 'react-router-dom';

// Types
interface AccountData {
  status: string;
  accountNumber: string;
  data: string;
}

interface BankEntry {
  bankName: string;
  accountNumber: string;
  currentBalance: number;
  availableBalance: number;
}

interface AggregatedBalance {
  total_currency_balance: number;
  banks: Record<string, number>;
}

interface AggregatedBalances {
  [currency: string]: AggregatedBalance;
}

// Main Home Component
const HomeScreen = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isBalanceVisible, setIsBalanceVisible] = useState<boolean>(true);
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'bar' | 'line'>('bar');
  const [accountData, setAccountData] = useState<AccountData | null>(null);
  const [currentBalance, setCurrentBalance] = useState<number>(0);
  const [availableBalance, setAvailableBalance] = useState<number>(0);

  const navigate = useNavigate();

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  const { mutate, isPending: isLoadingBanks } = useFetchBanks();

  const parseBalanceData = (dataString: string): { current: number; available: number } => {
    try {
      // Extract current and available balance from the string
      const currentMatch = dataString.match(/Current Bal:\s*([\d,.]+)/);
      const availableMatch = dataString.match(/Available Bal:\s*([\d,.]+)/);

      const current = currentMatch ? parseFloat(currentMatch[1].replace(/,/g, '')) : 0;
      const available = availableMatch ? parseFloat(availableMatch[1].replace(/,/g, '')) : 0;

      return { current, available };
    } catch (error) {
      console.error('Error parsing balance data:', error);
      return { current: 0, available: 0 };
    }
  };

  useEffect(() => {
    mutate({
      account_number: '1225711874',
      customer_id: 1309,
      username: 'KADUNASTATEGOVTSA',
      password: 'password1'
    }, {
      onSuccess: (data: any) => {
        console.log('Bank data fetched successfully:', data);
        setAccountData(data);

        if (data?.data) {
          const { current, available } = parseBalanceData(data.data);
          setCurrentBalance(current);
          setAvailableBalance(available);
        }
      },
      onError: (error: any) => {
        console.error('Error fetching bank data:', error);
      }
    });
  }, [mutate]);

  // Create aggregated balances using actual data
  const aggregatedBalances: AggregatedBalances = currentBalance > 0 ? {
    NGN: {
      total_currency_balance: currentBalance,
      banks: {
        'Zenith Bank': currentBalance
      }
    }
  } : {};

  // Generate mock inflows/outflows for charts (replace with real data if available)
  const mockInflows: number[] = [300000000, 250000000, 400000000, 180000000, 350000000];
  const mockOutflows: number[] = [20000000, 15000000, 30000000, 12000000, 25000000];

  // Create bank entry from actual data
  const bankEntries: BankEntry[] = accountData ? [{
    bankName: 'Zenith Bank',
    accountNumber: accountData.accountNumber,
    currentBalance: currentBalance,
    availableBalance: availableBalance,
  }] : [];

  return (
    <div className={`transition-all duration-300 w-full min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
      {isLoadingBanks && <LoadingOverlay />}

      {/* Header */}
      <header className={`sticky top-0 z-40 shadow-sm border-b transition-all duration-300 ${isDarkMode
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-200'
        }`}>
        <div className="w-full mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-18">
            <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 min-w-0 flex-1">
              <button
                onClick={() => setIsSearchVisible(!isSearchVisible)}
                className={`p-1.5 sm:p-2 rounded-lg transition-colors flex-shrink-0 ${isDarkMode
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
              <h1 className={`text-sm sm:text-base lg:text-lg xl:text-xl font-semibold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                Orange Revenue Monitoring
              </h1>
            </div>

            <button
              onClick={toggleTheme}
              className={`p-1.5 sm:p-2 rounded-lg transition-colors flex-shrink-0 ${isDarkMode
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
      <main className="w-full mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-3 sm:py-4 lg:py-6 xl:py-8 pb-24 sm:pb-6">
        {/* Balance Overview Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 lg:mb-8 gap-3 sm:gap-4">
          <div className="min-w-0 flex-1">
            <h2 className={`text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold mb-1 sm:mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
              Balance Overview
            </h2>
            <p className={`text-xs sm:text-sm lg:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
              Monitor your financial metrics
            </p>
          </div>
          <div className="bg-gradient-to-r from-red-500 to-pink-500 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-full shadow-lg flex-shrink-0 self-start sm:self-center">
            <span className="text-white font-bold text-xs sm:text-sm lg:text-base xl:text-lg tracking-wider">ORM</span>
          </div>
        </div>

        {/* Currency Cards */}
        <div className="flex flex-col sm:flex-row overflow-x-auto pb-4 sm:pb-6 mb-4 sm:mb-6 lg:mb-8 gap-3 sm:gap-4 w-full">
          {Object.keys(aggregatedBalances).length === 0 ? (
            <div className={`p-4 sm:p-6 rounded-lg w-full sm:w-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <p className={`text-center text-sm sm:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {isLoadingBanks ? 'Loading balance data...' : 'No balance data available'}
              </p>
            </div>
          ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4 w-full">
                {/* Current Balance Card */}
              <HeaderCard
                  key="current-balance"
                  title="Current Balance:"
                  currency="NGN"
                  amount={currentBalance}
                isVisible={isBalanceVisible}
                onToggleVisibility={toggleBalanceVisibility}
              />
                {/* Available Balance Card */}
                <HeaderCard
                  key="available-balance"
                  title="Available Balance:"
                  currency="USD"
                  amount={availableBalance}
                  isVisible={isBalanceVisible}
                  onToggleVisibility={toggleBalanceVisibility}
                />
              </div>
          )}
        </div>

        {/* AI Prediction Card */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <AiFinancialPredictionCard
            aggregatedBalances={aggregatedBalances}
            onAnalyze={() => console.log('Manual AI analysis triggered')}
          />
        </div>

        {/* Account Information Section */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 lg:mb-6 gap-3 sm:gap-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-1 h-4 sm:h-5 lg:h-6 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full flex-shrink-0"></div>
              <h3 className={`text-base sm:text-lg lg:text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                Account Information
              </h3>
            </div>
            <div className={`px-2 sm:px-3 py-1 rounded-lg self-start sm:self-center ${isDarkMode ? 'bg-emerald-900/30' : 'bg-emerald-100'
              }`}>
              <span className={`text-xs sm:text-sm font-medium ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                }`}>
                {/* Optional account number display */}
              </span>
            </div>
          </div>

          {/* Account Details */}
          <div className="space-y-3 sm:space-y-4 lg:space-y-5">
            {bankEntries.length === 0 ? (
              <div className={`p-4 sm:p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <p className={`text-center text-sm sm:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {isLoadingBanks ? 'Loading account data...' : 'No account data available'}
                </p>
              </div>
            ) : (
                bankEntries.map((account, index) => (
                  <div
                    key={`${account.accountNumber}-${index}`}
                  className={`p-3 sm:p-4 lg:p-6 rounded-lg shadow-lg border transition-all duration-200 cursor-pointer hover:shadow-xl ${isDarkMode
                    ? 'bg-gray-800 border-gray-700 hover:bg-gray-750 hover:border-gray-600'
                    : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                    }`}
                    onClick={() => navigate(`/${account.bankName}`, { state: { accountNumber: account.accountNumber } })}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-3 sm:gap-4">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${isDarkMode ? 'bg-orange-900/30' : 'bg-orange-100'
                        }`}>
                        <span className={`font-bold text-sm sm:text-base lg:text-lg ${isDarkMode ? 'text-orange-400' : 'text-orange-600'
                          }`}>
                          Z
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className={`font-semibold text-sm sm:text-base lg:text-lg truncate ${isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                          {account.bankName}
                        </h4>
                        <p className={`text-xs sm:text-sm truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                          Account: {account.accountNumber}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="min-w-0">
                      <p className={`text-xs sm:text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                        Current Balance
                      </p>
                      <p className={`text-sm sm:text-base lg:text-lg font-bold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                        {isBalanceVisible
                          ? `₦${account.currentBalance.toLocaleString()}`
                          : '₦••••••••'
                        }
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs sm:text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                        Available Balance
                      </p>
                      <p className={`text-sm sm:text-base lg:text-lg font-bold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                        {isBalanceVisible
                          ? `₦${account.availableBalance.toLocaleString()}`
                          : '₦••••••••'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Charts Section */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <div className="mb-3 sm:mb-4 lg:mb-6">
            <h3 className={`text-base sm:text-lg lg:text-xl font-semibold mb-3 sm:mb-4 text-left ${isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
              Transaction Charts
            </h3>

            {/* Tab Bar */}
            <div className={`p-1 rounded-xl inline-flex w-full sm:w-auto ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
              <button
                onClick={() => setActiveTab('bar')}
                className={`flex-1 sm:flex-none px-3 sm:px-4 lg:px-6 py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm lg:text-base ${activeTab === 'bar'
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
                className={`flex-1 sm:flex-none px-3 sm:px-4 lg:px-6 py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm lg:text-base ${activeTab === 'line'
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
          <div className="w-full rounded-xl overflow-hidden">
            <div className="h-64 sm:h-80 lg:h-96">
              {activeTab === 'bar' ? (
                <RevenueBarChart
                  inflows={mockInflows}
                  outflows={mockOutflows}
                  isDarkMode={isDarkMode}
                  currency="NGN"
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
        </div>
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