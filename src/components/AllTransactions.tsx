/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { FileText, TrendingDown, TrendingUp, X, Search } from "lucide-react";

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
            <TrendingUp className="w-4 h-4 text-green-500" />
        ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex mt-5 justify-center z-50 p-4">
            <div className={`max-w-8xl w-full max-h-[90vh] rounded-2xl shadow-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                {/* Modal Header */}
                <div className={`flex justify-between items-center p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                    <div>
                        <h2 className={` text-left text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                            Transaction History
                        </h2>
                        <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                            {accountName} • {filteredTransactions.length} of {transactions.length} transactions
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-lg hover:bg-opacity-10 hover:bg-gray-500 transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Search and Filter Section */}
                <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700 bg-gray-700/30' : 'border-gray-200 bg-gray-50'}`}>
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search Input */}
                        <div className="relative">
                            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            <input
                                type="text"
                                placeholder="Search by date, code, amount, reference, description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={` w-5xl pl-10 pr-4 py-2 rounded-lg border ${isDarkMode
                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                    } focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                            />
                        </div>

                        {/* Filter Buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    setFilterType("all")
                                    setSearchTerm('')
                                }}
                                className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterType === "all"
                                    ? (isDarkMode ? 'bg-emerald-600 text-white' : 'bg-emerald-600 text-white')
                                    : (isDarkMode ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
                                    }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilterType("credit")}
                                className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterType === "credit"
                                    ? 'bg-green-600 text-white'
                                    : (isDarkMode ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
                                    }`}
                            >
                                Inflows
                            </button>
                            <button
                                onClick={() => setFilterType("debit")}
                                className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterType === "debit"
                                    ? 'bg-red-600 text-white'
                                    : (isDarkMode ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
                                    }`}
                            >
                                Outflows
                            </button>
                        </div>
                    </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {filteredTransactions.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'
                                }`} />
                            <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                {transactions.length === 0 ? 'No transactions found' : 'No matching transactions'}
                            </p>
                            {searchTerm && (
                                <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                    Try adjusting your search or filter criteria
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Desktop Table View */}
                            <div className="hidden md:block">
                                <div className={`overflow-auto rounded-xl border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'
                                    }`}>
                                    <table className="w-full min-w-[800px] overflow-auto">
                                        <thead className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                                            }`}>
                                            <tr>
                                                <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-[120px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                                    }`}>
                                                    Date
                                                </th>
                                                <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-[250px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                                    }`}>
                                                    Description
                                                </th>
                                                <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-[140px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                                    }`}>
                                                    Reference
                                                </th>
                                                <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-[100px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                                    }`}>
                                                    Type
                                                </th>
                                                <th className={`px-4 py-3 text-right text-xs font-medium uppercase tracking-wider w-[120px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                                    }`}>
                                                    Amount
                                                </th>
                                                <th className={`px-4 py-3 text-right text-xs font-medium uppercase tracking-wider w-[140px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                                    }`}>
                                                    Balance
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'
                                            }`}>
                                            {filteredTransactions.map((transaction, index) => (
                                                <tr key={index} className={`text-left hover:bg-opacity-5 hover:bg-gray-500 transition-colors ${index % 2 === 0
                                                    ? (isDarkMode ? 'bg-gray-800' : 'bg-white')
                                                    : (isDarkMode ? 'bg-gray-700/20' : 'bg-gray-50/50')
                                                    }`}>
                                                    <td className={`px-4 py-3 text-sm whitespace-nowrap ${isDarkMode ? 'text-gray-300' : 'text-gray-900'
                                                        }`}>
                                                        {formatTransactionDate(transaction.transDate)}
                                                    </td>
                                                    <td className={`px-4 py-3 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'
                                                        }`}>
                                                        <div className="" title={transaction.description}>
                                                            {transaction.description || 'No description'}
                                                        </div>
                                                    </td>
                                                    <td className={`px-4 py-3 text-sm whitespace-nowrap ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                                        }`}>
                                                        <div className="" title={transaction.referenceNo}>
                                                            {transaction.referenceNo}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm whitespace-nowrap">
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
                                                    <td className={`px-4 py-3 text-sm text-right whitespace-nowrap font-semibold ${transaction.creditAmount > 0
                                                        ? 'text-green-600'
                                                        : 'text-red-600'
                                                        }`}>
                                                        {getAmountDisplay(transaction)}
                                                    </td>
                                                    <td className={`px-4 py-3 text-sm text-right whitespace-nowrap ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                                        }`}>
                                                        ₦{formatAmount(transaction.runningBalance)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Mobile Card View */}
                            <div className="md:hidden space-y-4">
                                {filteredTransactions.map((transaction, index) => (
                                    <div key={index} className={`rounded-xl border p-4 ${isDarkMode
                                        ? 'bg-gray-700/30 border-gray-600'
                                        : 'bg-white border-gray-200'
                                        }`}>
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center space-x-2">
                                                {getTransactionIcon(transaction)}
                                                <span className={`text-sm font-medium ${transaction.creditAmount > 0
                                                    ? 'text-green-600'
                                                    : 'text-red-600'
                                                    }`}>
                                                    {getTransactionType(transaction)}
                                                </span>
                                            </div>
                                            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                                }`}>
                                                {formatTransactionDate(transaction.transDate)}
                                            </span>
                                        </div>

                                        <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                            }`}>
                                            {transaction.description || 'No description'}
                                        </p>

                                        <p className={`text-xs mb-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                            Ref: {transaction.referenceNo}
                                        </p>

                                        <div className="flex justify-between items-center">
                                            <span className={`text-lg font-bold ${transaction.creditAmount > 0
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                                }`}>
                                                {getAmountDisplay(transaction)}
                                            </span>
                                            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
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