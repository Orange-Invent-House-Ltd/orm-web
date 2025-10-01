/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useTheme } from "../custom-hooks/useTheme";
import { ArrowLeft, Inbox, Moon, Sun } from "lucide-react";
import { BankHeader } from "../components/bank/header";
import { CompactAccountCard } from "../components/bank/account_card";
import { RevenueBarChart } from "../components/charts/barCharts";
import { useBankStore, useSelectedBankEntry } from "../store/store";
import Footer from "../components/reuseable/footer";
import { NavigationBar } from "../components/reuseable/buttom_nav";

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
  transactions?: Transaction[];
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

const BankScreen = ({ bankName: propBankName }: { bankName?: string }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  // Get data from Zustand store
  const selectedBankEntry = useSelectedBankEntry();
  const { getBankByName } = useBankStore();

  // Determine which bank data to use
  const [currentBankData, setCurrentBankData] = useState<any>(null);

  useEffect(() => {
    // Priority order: selectedBankEntry from store > getBankByName > fallback to mock data
    if (selectedBankEntry) {
      setCurrentBankData({
        bankName: selectedBankEntry.bankName,
        bankLogo: selectedBankEntry.bankLogo,
        syncAccounts: selectedBankEntry.syncAccounts.map((account: any,) => ({
          id: account.account_id,
          accountId: account.account_id.toString(),
          accountNumber: account.account_number,
          accountHolderName: account.account_holder_name,
          balance: account.balance,
          currency: account.currency,
          bankName: account.bank_name,
          bankLogo: selectedBankEntry.bankLogo,
          transactionReferenceNo: `TXN${account.account_id}`,
          accountType: 'Government Account',
          amount: account.balance,
          // Generate mock transactions for each account
          transactions: generateMockTransactions(account.account_number, account.balance, account.currency)
        }))
      });
    } else if (propBankName) {
      const bankFromStore = getBankByName(propBankName);
      if (bankFromStore) {
        setCurrentBankData({
          bankName: bankFromStore.bankName,
          bankLogo: bankFromStore.bankLogo,
          syncAccounts: bankFromStore.syncAccounts.map((account) => ({
            id: account.account_id,
            accountId: account.account_id.toString(),
            accountNumber: account.account_number,
            accountHolderName: account.account_holder_name,
            balance: account.balance,
            currency: account.currency,
            bankName: account.bank_name,
            bankLogo: bankFromStore.bankLogo,
            transactionReferenceNo: `TXN${account.account_id}`,
            accountType: 'Government Account',
            amount: account.balance,
            transactions: generateMockTransactions(account.account_number, account.balance, account.currency)
          }))
        });
      }
    }
  }, [selectedBankEntry, propBankName, getBankByName]);

  // Generate mock transactions for demonstration
  const generateMockTransactions = (accountNumber: string, balance: string, currency: string): Transaction[] => {
    const mockTransactions: Transaction[] = [];
    const currentBalance = parseFloat(balance) || 0;
    let runningBalance = currentBalance;

    // Generate 10 mock transactions
    for (let i = 0; i < 10; i++) {
      const isCredit = Math.random() > 0.3; // 70% chance of credit
      const amount = Math.floor(Math.random() * 1000000) + 10000; // Random amount between 10k and 1M
      const transactionDate = new Date();
      transactionDate.setDate(transactionDate.getDate() - i);

      if (isCredit) {
        runningBalance -= amount;
      }

      mockTransactions.push({
        accountNumber,
        accountType: 'Government Account',
        valueDate: transactionDate.toISOString().split('T')[0],
        transDate: transactionDate.toISOString().split('T')[0],
        tranCode: isCredit ? 'CR' : 'DR',
        amount,
        referenceNo: `REF${Date.now()}${i}`,
        description: isCredit ? 'Revenue Collection' : 'Government Expenditure',
        accountName: 'Kaduna State Government',
        currency,
        drCr: isCredit ? 'CR' : 'DR',
        debitAmount: isCredit ? 0 : amount,
        creditAmount: isCredit ? amount : 0,
        balance: runningBalance,
        runningBalance
      });
    }

    return mockTransactions.reverse(); // Show newest first
  };

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  const onAccountSelected = (account: any) => {
    setSelectedAccount(account);
  };

  // Helper method to safely convert balance to double
  const getBalanceAsDouble = (balance: string | number) => {
    if (balance == null) return 0.0;
    if (typeof balance === 'number') return balance;
    if (typeof balance === 'string') {
      return parseFloat(balance) || 0.0;
    }
    return 0.0;
  };

  // Get aggregated balances
  const getAggregatedBalances = () => {
    const balances: { [currency: string]: { totalInflow: number; totalOutflow: number } } = {};

    if (!currentBankData?.syncAccounts) return balances;

    for (const account of currentBankData.syncAccounts) {
      const currency = account.currency || 'NGN';
      const amount = getBalanceAsDouble(account.balance);

      if (!balances[currency]) {
        balances[currency] = {
          totalInflow: 0.0,
          totalOutflow: 0.0,
        };
      }

      balances[currency].totalInflow += amount;
    }

    return balances;
  };

  // Show loading state if no data is available yet
  if (!currentBankData) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-all duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Loading bank data...
          </p>
        </div>
      </div>
    );
  }

  const aggregatedBalances = getAggregatedBalances();
  const mockInflows = [300000000, 250000000, 400000000, 180000000, 350000000];
  const mockOutflows = [20000000, 15000000, 30000000, 12000000, 25000000];

  // Bank Logo Component with fallback and enhanced styling
  // const BankLogoDisplay = ({ size = "w-20 h-20" }: { size?: string }) => {
  //   const [imageError, setImageError] = useState(false);

  //   if (currentBankData.bankLogo && !imageError) {
  //     return (
  //       <img 
  //         src={currentBankData.bankLogo} 
  //         alt={`${currentBankData.bankName} logo`}
  //         className={`${size} object-contain rounded-lg`}
  //         onError={() => setImageError(true)}
  //       />
  //     );
  //   }

  //   // Generate icon based on bank name
  //   const getBankIcon = (bankName: string) => {
  //     const name = bankName.toLowerCase();
  //     if (name.includes('tsa') || name.includes('treasury')) return '🏛️';
  //     if (name.includes('tax') || name.includes('vat')) return '📊';
  //     if (name.includes('foreign') || name.includes('domiciliary')) return '💱';
  //     if (name.includes('fund') || name.includes('insurance')) return '🛡️';
  //     return '🏦';
  //   };

  //   // Fallback to icon if no logo or image failed to load
  //   return (
  //     <div className={`${size} bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center`}>
  //       <span className="text-white text-2xl">
  //         {getBankIcon(currentBankData.bankName)}
  //       </span>
  //     </div>
  //   );
  // };

  return (
    <div className={`min-h-screen transition-all duration-300 sm:p-6 p-2 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
      {/* Header */}
      <header className={`shadow-sm border-b transition-all duration-300 ${isDarkMode
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'
        }`}>
        <div className="mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className={`p-2 rounded-lg transition-colors ${isDarkMode
                    ? 'hover:bg-gray-700 text-gray-400'
                    : 'hover:bg-gray-100 text-gray-600'
                  }`}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className={`text-md font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                Kaduna State Revenue Monitoring
              </h1>
            </div>

            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${isDarkMode
                  ? 'hover:bg-gray-700 text-yellow-500'
                  : 'hover:bg-gray-100 text-gray-600'
                }`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto px-4">
        {/* Bank Overview Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className={`text-2xl sm:text-3xl font-bold mb-2 mt-7 ${isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
              {currentBankData.bankName}
            </h2>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {currentBankData.syncAccounts.length} account(s) • {Object.keys(aggregatedBalances).length} currencies
            </p>
          </div>
          {/* Display Bank Logo */}
          {/* <BankLogoDisplay size="w-16 h-16 sm:w-24 sm:h-24" /> */}
        </div>

        {/* Currency Cards */}
        <div className="flex overflow-x-auto space-x-4 pb-4 mb-8 no-scrollbar">
          {Object.entries(aggregatedBalances).map(([currency, balance]) => (
            <BankHeader
              key={currency}
              rev="Total Balance"
              currency={currency}
              revamount={balance.totalInflow}
              outflowamount={balance.totalOutflow}
              isVisible={isBalanceVisible}
              onVisibilityToggle={toggleBalanceVisibility}
              outflow="Total Outflow"
            />
          ))}
        </div>

        {/* Bank Accounts Section */}
        <div className="mb-8">
          <h3 className={`text-xl font-semibold mb-6 text-left ${isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
            Individual Accounts
          </h3>

          {currentBankData.syncAccounts.length === 0 ? (
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <Inbox className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'
                  }`} />
                <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                  No accounts found for {currentBankData.bankName}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentBankData.syncAccounts.map((account: any) => (
                <CompactAccountCard
                  key={account.id}
                  accountNumber={account.accountNumber}
                  accountHolderName={account.accountHolderName}
                  balance={account.balance?.toString()}
                  currency={account.currency}
                  bankName={account.bankName || currentBankData.bankName}
                  bankLogo={account.bankLogo || ''}
                  accountType={account.accountType}
                  transactions={account.transactions || []}
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
        <div className="mb-8">
          <h3 className={`text-xl font-semibold mb-6 text-left ${isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
            Transaction Overview
          </h3>

          <div className="h-96">
            <RevenueBarChart
              inflows={mockInflows}
              outflows={mockOutflows}
              isDarkMode={isDarkMode}
              currency="NGN"
            />
          </div>
        </div>

        {/* Additional spacing for mobile scroll */}
        <div className="h-4 sm:h-0"></div>
      </main>

      <Footer />
      <NavigationBar />
    </div>
  );
};

export default BankScreen;