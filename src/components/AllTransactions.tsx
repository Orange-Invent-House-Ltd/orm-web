/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { FileText, TrendingDown, TrendingUp, X, Search, Filter } from "lucide-react";

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

// Transaction History Modal Component
const TransactionModal = ({ isOpen, onClose, transactions, accountName, isDarkMode }: {
    isOpen: boolean;
    onClose: () => void;
    transactions: Transaction[];
    accountName: string;
    isDarkMode: boolean;
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState<"all" | "debit" | "credit">("all");
    const [showFilters, setShowFilters] = useState(false);

    if (!isOpen) return null;

    // Function to format date from "30052025" to "30-05-2025"
    const formatTransactionDate = (dateStr: string): string => {
        if (!dateStr || dateStr.length !== 8) return dateStr || 'N/A';

        try {
            const day = dateStr.substring(0, 2);
            const month = dateStr.substring(2, 4);
            const year = dateStr.substring(4, 8);
            return `${day}-${month}-${year}`;
        } catch (error) {
            console.error('Error formatting date:', error);
            return dateStr;
        }
    };

    // Filter transactions based on search term and type
    const filteredTransactions = transactions.filter((transaction) => {
        // Filter by type (debit/credit)
        if (filterType === "debit" && transaction.debitAmount <= 0) return false;
        if (filterType === "credit" && transaction.creditAmount <= 0) return false;

        // If no search term, return all filtered by type
        if (!searchTerm.trim()) return true;

        // Format date for search
        const formattedDate = formatTransactionDate(transaction.transDate);

        // Search across multiple fields
        const searchLower = searchTerm.toLowerCase();
        return (
            transaction.transDate.toLowerCase().includes(searchLower) ||
            formattedDate.toLowerCase().includes(searchLower) ||
            transaction.tranCode.toLowerCase().includes(searchLower) ||
            transaction.amount.toString().includes(searchTerm) ||
            transaction.referenceNo.toLowerCase().includes(searchLower) ||
            transaction.description.toLowerCase().includes(searchLower) ||
            transaction.accountName.toLowerCase().includes(searchLower) ||
            transaction.debitAmount.toString().includes(searchTerm) ||
            transaction.creditAmount.toString().includes(searchTerm)
        );
    });

    const formatAmount = (amount: any) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(Math.abs(amount));
    };

    const getTransactionType = (transaction: any) => {
        return transaction.creditAmount > 0 ? 'Inflow' : 'Outflow';
    };

    const getAmountDisplay = (transaction: any) => {
        const amount = transaction.creditAmount > 0 ? transaction.creditAmount : transaction.debitAmount;
        const sign = transaction.creditAmount > 0 ? '+' : '-';
        return `${sign}₦${formatAmount(amount)}`;
    };

    const getTransactionIcon = (transaction: any) => {
        return transaction.creditAmount > 0 ? (
            <TrendingUp className="w-4 h-4 text-green-500 flex-shrink-0" />
        ) : (
                <TrendingDown className="w-4 h-4 text-red-500 flex-shrink-0" />
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className={`w-full max-w-7xl h-full max-h-[95vh] sm:max-h-[90vh] rounded-none sm:rounded-2xl shadow-2xl flex flex-col ${isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                {/* Modal Header */}
                <div className={`flex justify-between items-center p-4 sm:p-6 border-b flex-shrink-0 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                    <div className="min-w-0 flex-1 mr-4">
                        <h2 className={`text-lg sm:text-xl lg:text-2xl font-bold mb-1 sm:mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                            Transaction History
                        </h2>
                        <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            } truncate`}>
                            {accountName} • {filteredTransactions.length} of {transactions.length} transactions
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-lg hover:bg-opacity-10 hover:bg-gray-500 transition-colors flex-shrink-0 ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        <X className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                </div>

                {/* Search and Filter Section */}
                <div className={`p-3 sm:p-4 border-b flex-shrink-0 ${isDarkMode ? 'border-gray-700 bg-gray-700/30' : 'border-gray-200 bg-gray-50'}`}>
                    <div className="space-y-3">
                        {/* Search Input with Filter Toggle */}
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                <input
                                    type="text"
                                    placeholder="Search transactions..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={`w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-lg border text-sm ${isDarkMode
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                        } focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                                />
                            </div>

                            {/* Mobile Filter Toggle */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`sm:hidden p-2 rounded-lg border ${isDarkMode
                                    ? 'bg-gray-700 border-gray-600 text-gray-300'
                                    : 'bg-white border-gray-300 text-gray-700'
                                    }`}
                            >
                                <Filter className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Filter Buttons - Always visible on desktop, toggleable on mobile */}
                        <div className={`${showFilters ? 'flex' : 'hidden'} sm:flex flex-wrap gap-2`}>
                            <button
                                onClick={() => {
                                    setFilterType("all")
                                    setSearchTerm('')
                                    setShowFilters(false)
                                }}
                                className={`px-3 py-2 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-colors ${filterType === "all"
                                    ? (isDarkMode ? 'bg-emerald-600 text-white' : 'bg-emerald-600 text-white')
                                    : (isDarkMode ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
                                    }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => {
                                    setFilterType("credit")
                                    setShowFilters(false)
                                }}
                                className={`px-3 py-2 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-colors ${filterType === "credit"
                                    ? 'bg-green-600 text-white'
                                    : (isDarkMode ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
                                    }`}
                            >
                                Inflows
                            </button>
                            <button
                                onClick={() => {
                                    setFilterType("debit")
                                    setShowFilters(false)
                                }}
                                className={`px-3 py-2 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-colors ${filterType === "debit"
                                    ? 'bg-red-600 text-white'
                                    : (isDarkMode ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
                                    }`}
                            >
                                Outflows
                            </button>
                        </div>
                    </div>
                </div>

                {/* Modal Content - Scrollable */}
                <div className="flex-1 overflow-hidden">
                    {filteredTransactions.length === 0 ? (
                        <div className="flex items-center justify-center h-full p-6">
                            <div className="text-center">
                                <FileText className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'
                                    }`} />
                                <p className={`text-base sm:text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                    }`}>
                                    {transactions.length === 0 ? 'No transactions found' : 'No matching transactions'}
                                </p>
                                {searchTerm && (
                                    <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                        Try adjusting your search or filter criteria
                                    </p>
                                )}
                            </div>
                        </div>
                    ) : (
                            <div className="h-full overflow-y-auto">
                            {/* Desktop Table View */}
                                <div className="hidden lg:block p-4 sm:p-6">
                                <div className={`overflow-auto rounded-xl border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'
                                    }`}>
                                        <table className="w-full">
                                        <thead className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                                            }`}>
                                            <tr>
                                                    <th className={`px-3 sm:px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                                    }`}>
                                                    Date
                                                </th>
                                                    <th className={`px-3 sm:px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                                    }`}>
                                                    Description
                                                </th>
                                                    <th className={`px-3 sm:px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                                    }`}>
                                                    Reference
                                                </th>
                                                    <th className={`px-3 sm:px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                                    }`}>
                                                    Type
                                                </th>
                                                    <th className={`px-3 sm:px-4 py-3 text-right text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                                    }`}>
                                                    Amount
                                                </th>
                                                    <th className={`px-3 sm:px-4 py-3 text-right text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                                    }`}>
                                                    Balance
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'
                                            }`}>
                                            {filteredTransactions.map((transaction, index) => (
                                                <tr key={index} className={`hover:bg-opacity-5 hover:bg-gray-500 transition-colors ${index % 2 === 0
                                                    ? (isDarkMode ? 'bg-gray-800' : 'bg-white')
                                                    : (isDarkMode ? 'bg-gray-700/20' : 'bg-gray-50/50')
                                                    }`}>
                                                    <td className={`px-3 sm:px-4 py-3 text-sm whitespace-nowrap ${isDarkMode ? 'text-gray-300' : 'text-gray-900'
                                                        }`}>
                                                        {formatTransactionDate(transaction.transDate)}
                                                    </td>
                                                    <td className={`px-3 sm:px-4 py-3 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'
                                                        }`}>
                                                        <div className="max-w-xs truncate" title={transaction.description}>
                                                            {transaction.description || 'No description'}
                                                        </div>
                                                    </td>
                                                    <td className={`px-3 sm:px-4 py-3 text-sm whitespace-nowrap ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                                        }`}>
                                                        <div className="max-w-xs truncate" title={transaction.referenceNo}>
                                                            {transaction.referenceNo}
                                                        </div>
                                                    </td>
                                                    <td className="px-3 sm:px-4 py-3 text-sm whitespace-nowrap">
                                                        <div className="flex items-center space-x-2">
                                                            {getTransactionIcon(transaction)}
                                                            <span className={`font-medium ${transaction.creditAmount > 0
                                                                ? 'text-green-600'
                                                                : 'text-red-600'
                                                                }`}>
                                                                {getTransactionType(transaction)}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className={`px-3 sm:px-4 py-3 text-sm text-right whitespace-nowrap font-semibold ${transaction.creditAmount > 0
                                                        ? 'text-green-600'
                                                        : 'text-red-600'
                                                        }`}>
                                                        {getAmountDisplay(transaction)}
                                                    </td>
                                                    <td className={`px-3 sm:px-4 py-3 text-sm text-right whitespace-nowrap ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                                        }`}>
                                                        ₦{formatAmount(transaction.runningBalance)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                                {/* Tablet Table View (simplified) */}
                                <div className="hidden md:block lg:hidden p-3 sm:p-4">
                                    <div className={`overflow-auto rounded-xl border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'
                                        }`}>
                                        <table className="w-full">
                                            <thead className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                                                }`}>
                                                <tr>
                                                    <th className={`px-3 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                                        }`}>
                                                        Date & Description
                                                    </th>
                                                    <th className={`px-3 py-3 text-center text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                                        }`}>
                                                        Type
                                                    </th>
                                                    <th className={`px-3 py-3 text-right text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                                        }`}>
                                                        Amount
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'
                                                }`}>
                                                {filteredTransactions.map((transaction, index) => (
                                                    <tr key={index} className={`hover:bg-opacity-5 hover:bg-gray-500 transition-colors ${index % 2 === 0
                                                        ? (isDarkMode ? 'bg-gray-800' : 'bg-white')
                                                        : (isDarkMode ? 'bg-gray-700/20' : 'bg-gray-50/50')
                                                        }`}>
                                                        <td className={`px-3 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'
                                                            }`}>
                                                            <div className="text-sm font-medium">
                                                                {formatTransactionDate(transaction.transDate)}
                                                            </div>
                                                            <div className={`text-xs mt-1 truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                                                }`} title={transaction.description}>
                                                                {transaction.description || 'No description'}
                                                            </div>
                                                        </td>
                                                        <td className="px-3 py-3 text-center">
                                                            <div className="flex items-center justify-center space-x-2">
                                                                {getTransactionIcon(transaction)}
                                                                <span className={`text-xs font-medium ${transaction.creditAmount > 0
                                                                    ? 'text-green-600'
                                                                    : 'text-red-600'
                                                                    }`}>
                                                                    {getTransactionType(transaction)}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-3 py-3 text-right">
                                                            <div className={`text-sm font-semibold ${transaction.creditAmount > 0
                                                                ? 'text-green-600'
                                                                : 'text-red-600'
                                                                }`}>
                                                                {getAmountDisplay(transaction)}
                                                            </div>
                                                            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                                                }`}>
                                                                Bal: ₦{formatAmount(transaction.runningBalance)}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                            {/* Mobile Card View */}
                                <div className="md:hidden p-3 space-y-3">
                                {filteredTransactions.map((transaction, index) => (
                                    <div key={index} className={`rounded-xl border p-4 ${isDarkMode
                                        ? 'bg-gray-700/30 border-gray-600'
                                        : 'bg-white border-gray-200'
                                        }`}>
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center space-x-2 min-w-0 flex-1">
                                                {getTransactionIcon(transaction)}
                                                <span className={`text-sm font-medium truncate ${transaction.creditAmount > 0
                                                    ? 'text-green-600'
                                                    : 'text-red-600'
                                                    }`}>
                                                    {getTransactionType(transaction)}
                                                </span>
                                            </div>
                                            <span className={`text-xs ml-2 flex-shrink-0 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                                }`}>
                                                {formatTransactionDate(transaction.transDate)}
                                            </span>
                                        </div>

                                        <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                            }`}>
                                            {transaction.description || 'No description'}
                                        </p>

                                        <p className={`text-xs mb-3 truncate ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                            Ref: {transaction.referenceNo}
                                        </p>

                                        <div className="flex justify-between items-center">
                                            <span className={`text-base sm:text-lg font-bold ${transaction.creditAmount > 0
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                                }`}>
                                                {getAmountDisplay(transaction)}
                                            </span>
                                            <span className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                                }`}>
                                                Balance: ₦{formatAmount(transaction.runningBalance)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TransactionModal;