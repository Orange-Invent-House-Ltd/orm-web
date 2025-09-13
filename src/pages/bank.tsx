/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useTheme } from "../custom-hooks/useTheme";
import {
  Building2,
  Inbox,
  Moon,
  Sun,
  Calendar,
  X,
  ChevronLeft
} from "lucide-react";
import { BankHeader } from "../components/bank/header";
import { CompactAccountCard } from "../components/bank/account_card";
import { RevenueBarChart } from "../components/charts/barCharts";
import Footer from "../components/reuseable/footer";
import { NavigationBar } from "../components/reuseable/buttom_nav";
import { useFetchStatements } from "../api/mutation";
import { useNavigate } from "react-router-dom";

interface Account {
  id: number;
  accountId: string;
  accountNumber: string;
  accountHolderName: string;
  balance: string;
  currency: string;
  bankName: string;
  transactionReferenceNo: string;
  accountType: string;
  amount: string;
}

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

const BankScreen = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(true); // Show calendar on initial load
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [dateError, setDateError] = useState<string>("");
  const [hasFetchedData, setHasFetchedData] = useState(false);
  const [noDataFound, setNoDataFound] = useState(false);

  const navigate = useNavigate()

  const { mutate: statement } = useFetchStatements();

  // Parse CSV data function
  const parseCSVData = (csvData: string): Transaction[] => {
    // Check if the response contains "No Data found"
    if (csvData.includes("<Row> No Data found </Row>") || csvData.trim() === "") {
      setNoDataFound(true);
      return [];
    }

    setNoDataFound(false);

    const lines = csvData.split('\n');
    const headers = lines[0].split(',');
    const transactions: Transaction[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = line.split(',');
      if (values.length < headers.length) continue;

      try {
        const transaction: Transaction = {
          accountNumber: values[0] || '',
          accountType: values[1] || '',
          valueDate: values[2] || '',
          transDate: values[3] || '',
          tranCode: values[5] || '',
          amount: parseFloat(values[6]) || 0,
          referenceNo: values[12] || '',
          description: values[13] || '',
          accountName: values[14] || '',
          currency: values[17] || 'NGN',
          drCr: values[18] || '',
          debitAmount: parseFloat(values[20]) || 0,
          creditAmount: parseFloat(values[21]) || 0,
          balance: parseFloat(values[22]) || 0,
          runningBalance: parseFloat(values[33]) || 0
        };
        transactions.push(transaction);
      } catch (error) {
        console.error('Error parsing transaction:', error);
      }
    }

    return transactions;
  };

  const fetchStatementData = () => {
    if (!fromDate || !toDate) {
      setDateError("Please select both from and to dates");
      return;
    }

    if (new Date(fromDate) > new Date(toDate)) {
      setDateError("From date cannot be after to date");
      return;
    }

    setDateError("");
    setIsLoading(true);
    setShowDatePicker(false);

    statement({
      account_number: '1225711874',
      from_datetime: fromDate,
      to_datetime: toDate,
      response_type: 'CSV',
    }, {
      onSuccess: (data: any) => {
        console.log('Statement data fetched successfully:', data);
        if (data.data) {
          const parsedTransactions = parseCSVData(data.data);
          setTransactions(parsedTransactions);
        }
        setIsLoading(false);
        setHasFetchedData(true);
      },
      onError: (error: any) => {
        console.error('Error fetching statement data:', error);
        setIsLoading(false);
        setHasFetchedData(true);
      }
    });
  };

  // Static bank data based on CSV
  const currentBankData = {
    bankName: "Kaduna State Government Treasury",
    bankLogo: null,
    syncAccounts: [{
      id: 1225711874,
      accountId: "1225711874",
      accountNumber: "1225711874",
      accountHolderName: "KAD STATE GOVT TREASURY SINGLE ACCT",
      balance: transactions.length > 0 ? transactions[transactions.length - 1].runningBalance.toString() : "0",
      currency: "NGN",
      bankName: "Kaduna State Government Treasury",
      bankLogo: null,
      transactionReferenceNo: "TXN1225711874",
      accountType: "Current",
      amount: transactions.length > 0 ? transactions[transactions.length - 1].runningBalance.toString() : "0"
    }]
  };

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  const onAccountSelected = (account: any) => {
    setSelectedAccount(account);
  };

  // Calculate transaction analytics from CSV data
  const getTransactionAnalytics = () => {
    const totalInflow = transactions
      .filter(t => t.creditAmount > 0)
      .reduce((sum, t) => sum + t.creditAmount, 0);

    const totalOutflow = transactions
      .filter(t => t.debitAmount > 0)
      .reduce((sum, t) => sum + t.debitAmount, 0);

    // Group transactions by day for chart data
    const dailyData: { [date: string]: { inflow: number; outflow: number } } = {};

    transactions.forEach(transaction => {
      const date = transaction.transDate;
      if (!dailyData[date]) {
        dailyData[date] = { inflow: 0, outflow: 0 };
      }
      dailyData[date].inflow += transaction.creditAmount;
      dailyData[date].outflow += transaction.debitAmount;
    });

    const chartInflows = Object.values(dailyData).map(d => d.inflow);
    const chartOutflows = Object.values(dailyData).map(d => d.outflow);

    return {
      totalInflow,
      totalOutflow,
      chartInflows: chartInflows.length > 0 ? chartInflows : [0],
      chartOutflows: chartOutflows.length > 0 ? chartOutflows : [0],
      transactionCount: transactions.length,
      currentBalance: transactions.length > 0 ? transactions[transactions.length - 1].runningBalance : 0
    };
  };

  // Show loading state if loading
  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-all duration-300 px-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 sm:h-24 sm:w-24 lg:h-32 lg:w-32 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className={`text-base sm:text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Loading bank data...
          </p>
        </div>
      </div>
    );
  }

  // Show date picker if not yet fetched data
  if (showDatePicker) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-all duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
        } p-4 sm:p-6`}>
        <div className={`w-full max-w-sm sm:max-w-md rounded-xl shadow-lg p-4 sm:p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg sm:text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Select Date Range
            </h2>
            <button
              onClick={() => setShowDatePicker(false)}
              className={`p-1 rounded-full ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-neutral-400 text-xs sm:text-sm font-medium block text-left mb-4 sm:mb-6">
            You can only select 1 month at a time e.g. 2023-01-01 to 2023-01-31
          </p>

          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 text-left ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                From Date
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className={`w-full p-3 rounded-lg border text-sm sm:text-base ${isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 text-left ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                To Date
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className={`w-full p-3 rounded-lg border text-sm sm:text-base ${isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
              />
            </div>

            {dateError && (
              <p className="text-red-500 text-sm mt-2">{dateError}</p>
            )}

            <button
              onClick={fetchStatementData}
              disabled={!fromDate || !toDate}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors text-sm sm:text-base
                ${(!fromDate || !toDate)
                  ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
            >
              Fetch Statement
            </button>
          </div>
        </div>
      </div>
    );
  }

  const analytics = getTransactionAnalytics();

  // Bank Logo Component with fallback
  const BankLogoDisplay = ({ size = "w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24" }: { size?: string }) => {
    const [imageError, setImageError] = useState(false);

    if (currentBankData.bankLogo && !imageError) {
      return (
        <img
          src={currentBankData.bankLogo}
          alt={`${currentBankData.bankName} logo`}
          className={`${size} object-contain rounded-lg`}
          onError={() => setImageError(true)}
        />
      );
    }

    // Fallback to icon
    return (
      <div className={`${size} bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center`}>
        <Building2 className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
      {/* Header */}
      <header className={`shadow-sm border-b transition-all duration-300 ${isDarkMode
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-200'
        }`}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
              <button
                onClick={() => navigate(-1)}
                className={`p-2 rounded-lg transition-colors ${isDarkMode
                  ? 'hover:bg-gray-700 text-gray-400'
                  : 'hover:bg-gray-100 text-gray-600'
                  } cursor-pointer flex-shrink-0`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h1 className={`text-sm sm:text-base lg:text-lg font-semibold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                Treasury Account Monitoring
              </h1>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              <button
                onClick={() => setShowDatePicker(true)}
                className={`p-2 rounded-lg transition-colors ${isDarkMode
                  ? 'hover:bg-gray-700 text-gray-400'
                  : 'hover:bg-gray-100 text-gray-600'
                  } cursor-pointer`}
              >
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => setShowDatePicker(true)}
                className={`text-xs sm:text-sm cursor-pointer hidden sm:block ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}
              >
                {fromDate} to {toDate}
              </button>

              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${isDarkMode
                  ? 'hover:bg-gray-700 text-yellow-500'
                  : 'hover:bg-gray-100 text-gray-600'
                  }`}
              >
                {isDarkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-6">
        {/* Bank Overview Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 pt-4 sm:pt-6">
          <div className="mb-4 sm:mb-0">
            <h2 className={`text-xl sm:text-2xl lg:text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
              {currentBankData.bankName}
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {fromDate} to {toDate}
              </p>
              <span className={`hidden sm:inline ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>•</span>
              <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {analytics.transactionCount} transactions
              </p>
            </div>
          </div>
          <div className="self-center sm:self-auto">
            <BankLogoDisplay />
          </div>
        </div>

        {/* Show empty state if no transactions */}
        {hasFetchedData && transactions.length === 0 || noDataFound ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4">
            <div className="w-48 h-48 sm:w-64 sm:h-64 mb-6">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <circle cx="100" cy="100" r="90" fill="#E5E7EB" />
                <path d="M70,50 C70,40 90,40 90,50 C90,60 70,60 70,50" stroke="#9CA3AF" strokeWidth="2" fill="none" />
                <path d="M110,50 C110,40 130,40 130,50 C130,60 110,60 110,50" stroke="#9CA3AF" strokeWidth="2" fill="none" />
                <path d="M60,90 C60,70 140,70 140,90 C140,110 60,110 60,90" fill="#9CA3AF" />
                <path d="M70,80 C70,70 90,70 90,80 C90,90 70,90 70,80" fill="white" />
                <path d="M110,80 C110,70 130,70 130,80 C130,90 110,90 110,80" fill="white" />
                <path d="M80,120 C80,110 120,110 120,120" stroke="#6B7280" strokeWidth="2" fill="none" />
              </svg>
            </div>
            <h3 className={`text-lg sm:text-xl font-semibold mb-2 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              No Transactions Found
            </h3>
            <p className={`text-center max-w-md text-sm sm:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              There are no transactions for the selected date range. Please try a different date range.
            </p>
            <button
              onClick={() => setShowDatePicker(true)}
              className="mt-6 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors text-sm sm:text-base"
            >
              Select Different Dates
            </button>
          </div>
        ) : (
          <>
              {/* Currency Cards */}
              <div className="flex overflow-x-auto space-x-4 pb-4 mb-6 sm:mb-8 no-scrollbar">
                <BankHeader
                  rev=" Total Inflow"
                  currency="NGN"
                  revamount={analytics.totalInflow}
                  outflowamount={analytics.totalOutflow}
                  isVisible={isBalanceVisible}
                  onVisibilityToggle={toggleBalanceVisibility}
                  outflow="Total Outflow"
                  currentBalance={analytics.currentBalance}
                />
              </div>

              {/* Bank Accounts Section */}
              <div className="mb-6 sm:mb-8">
                <h3 className={`text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-left ${isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                  Bank Accounts
                </h3>

                {currentBankData.syncAccounts.length === 0 ? (
                  <div className="h-60 sm:h-80 flex items-center justify-center">
                    <div className="text-center">
                      <Inbox className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'
                        }`} />
                      <p className={`text-base sm:text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                        No accounts found
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {currentBankData.syncAccounts.map((account: any) => (
                      <CompactAccountCard
                        key={account.id}
                        accountNumber={account.accountNumber}
                        accountHolderName={account.accountHolderName}
                        transactions={transactions}
                        balance={analytics.currentBalance.toString()}
                        currency={account.currency}
                        bankName={account.bankName}
                        bankLogo={account.bankLogo}
                        accountType={account.accountType}
                        isSelected={selectedAccount?.accountId === account.accountId}
                        onTap={() => {
                          if (selectedAccount?.accountId === account.accountId) {
                            setSelectedAccount(null);
                          } else {
                            setSelectedAccount(account);
                            onAccountSelected(account);
                          }
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Charts Section */}
              <div className="mb-6 sm:mb-8">
                <h3 className={`text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-left ${isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                  Transaction Analytics
                </h3>

                <div className="h-64 sm:h-80 lg:h-96">
                  <RevenueBarChart
                    inflows={analytics.chartInflows}
                    outflows={analytics.chartOutflows}
                    isDarkMode={isDarkMode}
                    currency="NGN"
                  />
                </div>
              </div>

            {/* Recent Transactions */}
              <div className="mb-6 sm:mb-8">
                <h3 className={`text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-left ${isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                Recent Transactions
              </h3>

              <div className={`rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                } overflow-hidden`}>
                  <div className="max-h-80 sm:max-h-96 overflow-y-auto">
                  {transactions.slice(0, 10).map((transaction, index) => (
                    <div key={index} className={`p-3 sm:p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'
                      } last:border-b-0`}>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4 text-left">
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium text-sm sm:text-base truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {transaction.description}
                          </p>
                          <p className={`text-xs sm:text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {transaction.transDate} • {transaction.referenceNo}
                          </p>
                        </div>
                        <div className="text-left sm:text-right flex-shrink-0">
                          <p className={`font-semibold text-sm sm:text-base ${transaction.creditAmount > 0
                            ? 'text-green-500'
                            : 'text-red-500'
                            }`}>
                            {transaction.creditAmount > 0 ? '+' : '-'}₦{(transaction.creditAmount || transaction.debitAmount).toLocaleString()}
                          </p>
                          <p className={`text-xs sm:text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Balance: ₦{transaction.runningBalance.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer isDarkMode={isDarkMode} />
      <NavigationBar />
    </div>
  );
};

export default BankScreen;