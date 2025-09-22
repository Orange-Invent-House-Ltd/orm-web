/* eslint-disable @typescript-eslint/no-explicit-any */
import { CheckCircle, ChevronRight, Filter, Search, X, AlertCircle, Loader2 } from "lucide-react";
import { useTheme } from "../../custom-hooks/useTheme";
import { useState, useEffect, useCallback } from "react";
import { useTransactionStore } from "../../store/transactions";
import { useFetchStatements } from "../../api/query";
import { useNavigate } from "react-router-dom";

// Search Modal Component
export const SearchModal = ({
    isVisible,
    onClose
}: {
    isVisible: boolean;
    onClose: () => void;
}) => {
    const { isDarkMode } = useTheme();
    const navigate = useNavigate();

    const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [localError, setLocalError] = useState<string | null>(null);
    const [shouldSearch, setShouldSearch] = useState(false); // New state to control when to search
    const [searchQueryParams, setSearchQueryParams] = useState<any>(null); // Store the actual search params

    const {
        loadTransactionsSuccess,
        loadTransactionsError,
        startLoading,
        clearData
    } = useTransactionStore();

    // Only fetch when shouldSearch is true and we have query parameters
    const { data, isLoading, error } = useFetchStatements(
        shouldSearch && searchQueryParams ? searchQueryParams : undefined
    );

    // Close modal when Escape key is pressed
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isVisible) {
                handleClose();
            }
        };

        if (isVisible) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isVisible]);

    // Reset state when modal closes
    const handleClose = useCallback(() => {
        setSelectedFilter(null);
        setSearchTerm('');
        setLocalError(null);
        setShouldSearch(false);
        setSearchQueryParams(null);
        onClose();
    }, [onClose]);

    // Handle search results
    useEffect(() => {
        if (shouldSearch && data) {
            // Update store with search results
            loadTransactionsSuccess(data?.data || data, { searchTerm });

            // Navigate to transaction list
            navigate('/transactions');

            // Close modal after successful search
            handleClose();
        }
    }, [data, shouldSearch, loadTransactionsSuccess, searchTerm, navigate, handleClose]);

    // Handle errors
    useEffect(() => {
        if (shouldSearch && error) {
            const errorMessage = error.message || 'Search failed. Please try again.';
            setLocalError(errorMessage);
            loadTransactionsError(errorMessage);
            // Reset search state to allow retry
            setShouldSearch(false);
        }
    }, [error, shouldSearch, loadTransactionsError]);

    // Clear error when search term changes
    useEffect(() => {
        if (localError) {
            setLocalError(null);
        }
    }, [searchTerm, selectedFilter]);

    const filterOptions: Record<string, { label: string; placeholder: string }> = {
        'amount': {
            label: 'Amount',
            placeholder: 'Enter amount (e.g., 1000 or 1000.50)'
        },
        'account_type': {
            label: 'Account Type',
            placeholder: 'Enter account type (e.g., savings, current)'
        },
        'account_number': {
            label: 'Account Number',
            placeholder: 'Enter account number'
        },
        'description': {
            label: 'Description',
            placeholder: 'Enter transaction description'
        },
        'account_holder_name': {
            label: 'Account Name',
            placeholder: 'Enter account holder name'
        }
    };

    const buildSearchParams = useCallback(() => {
        if (!selectedFilter || !searchTerm.trim()) return null;

        const params: any = {};

        switch (selectedFilter) {
            case 'amount':
                // Validate amount format
                const amount = parseFloat(searchTerm.replace(/,/g, ''));
                if (isNaN(amount)) {
                    setLocalError('Please enter a valid amount');
                    return null;
                }
                params.amount = amount.toString();
                break;
            case 'account_type':
                params.account_type = searchTerm.trim();
                break;
            case 'account_number':
                params.account_number = searchTerm.trim();
                break;
            case 'description':
                params.search = searchTerm.trim();
                break;
            case 'account_holder_name':
                params.account_holder_name = searchTerm.trim();
                break;
            default:
                params.search = searchTerm.trim();
        }

        return params;
    }, [selectedFilter, searchTerm]);

    const handleSearch = useCallback(() => {
        const trimmedSearchTerm = searchTerm.trim();

        if (!trimmedSearchTerm) {
            setLocalError('Please enter a search term');
            return;
        }

        if (!selectedFilter) {
            setLocalError('Please select a search filter');
            return;
        }

        const params = buildSearchParams();
        if (!params) return; // Error already set in buildSearchParams

        console.log('Starting search for:', trimmedSearchTerm, 'with filter:', selectedFilter);

        // Clear previous data and start loading
        clearData();
        startLoading({ searchTerm: trimmedSearchTerm });

        // Set the query parameters and trigger the API call
        setSearchQueryParams(params);
        setShouldSearch(true); // This will trigger the useFetchStatements hook
        setLocalError(null);
    }, [searchTerm, selectedFilter, buildSearchParams, clearData, startLoading]);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    const handleFilterSelect = (key: string) => {
        setSelectedFilter(key);
        setSearchTerm('');
        setLocalError(null);
        setShouldSearch(false);
        setSearchQueryParams(null);
    };

    const handleClearSearch = () => {
        setSelectedFilter(null);
        setSearchTerm('');
        setLocalError(null);
        setShouldSearch(false);
        setSearchQueryParams(null);
    };

    const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isLoading) {
            handleSearch();
        }
    };

    const canSearch = selectedFilter && searchTerm.trim() && !isLoading;

    // Don't render if not visible
    if (!isVisible) return null;

    return (
        <div
            className="fixed inset-0 bg-black/80 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={handleBackdropClick}
        >
            <div
                className={`
                    w-full h-full sm:w-auto sm:h-auto sm:min-w-[400px] sm:max-w-[500px]
                    sm:max-h-[90vh] rounded-none sm:rounded-2xl
                    ${isDarkMode ? 'bg-gray-900' : 'bg-white'}
                `}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className={`
                    flex items-center justify-between p-4 sm:p-6
                    border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}
                `}>
                    <button
                        onClick={handleClose}
                        className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                            }`}
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Search Transactions
                    </h2>

                    <div className="w-9"></div>
                </div>

                <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-120px)] sm:max-h-[calc(90vh-120px)]">
                    {/* Error Display */}
                    {localError && (
                        <div className={`mb-4 p-3 rounded-lg border flex items-start space-x-2 ${isDarkMode
                            ? 'bg-red-900/20 border-red-800 text-red-300'
                            : 'bg-red-50 border-red-200 text-red-700'
                            }`}>
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium">Search Error</p>
                                <p className="text-xs mt-1 opacity-90">{localError}</p>
                            </div>
                        </div>
                    )}

                    {/* Search Field */}
                    {selectedFilter && (
                        <div className="mb-6">
                            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Search by {filterOptions[selectedFilter]?.label}
                            </label>
                            <div className={`
                                flex items-center space-x-2 p-3 rounded-xl border
                                ${isDarkMode
                                    ? 'bg-gray-800 border-gray-700'
                                    : 'bg-gray-50 border-gray-200'
                                }
                            `}>
                                <Search className={`w-5 h-5 flex-shrink-0 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={handleSearchTermChange}
                                    onKeyPress={handleKeyPress}
                                    placeholder={filterOptions[selectedFilter]?.placeholder}
                                    className={`flex-1 min-w-0 bg-transparent outline-none ${isDarkMode
                                        ? 'text-white placeholder-gray-400'
                                        : 'text-gray-900 placeholder-gray-500'
                                        }`}
                                    autoFocus
                                    disabled={isLoading}
                                />
                                {isLoading && (
                                    <Loader2 className="w-5 h-5 flex-shrink-0 text-emerald-500 animate-spin" />
                                )}
                                <button
                                    onClick={handleClearSearch}
                                    className={`p-1 rounded flex-shrink-0 transition-colors ${isDarkMode
                                        ? 'text-gray-500 hover:bg-gray-700'
                                        : 'text-gray-500 hover:bg-gray-100'
                                        }`}
                                    disabled={isLoading}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Selected Filter Display */}
                    {selectedFilter && (
                        <div className="mb-4">
                            <div className={`
                                inline-flex items-center space-x-2 px-3 py-2 rounded-full border
                                max-w-full
                                ${isDarkMode
                                    ? 'bg-emerald-900/30 border-emerald-700'
                                    : 'bg-emerald-50 border-emerald-200'
                                }
                            `}>
                                <Filter className={`w-4 h-4 flex-shrink-0 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                                <span className={`text-sm font-medium truncate ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                    Filter: {filterOptions[selectedFilter]?.label}
                                </span>
                                <button
                                    onClick={handleClearSearch}
                                    disabled={isLoading}
                                    className={`p-1 rounded flex-shrink-0 transition-colors ${isDarkMode ? 'hover:bg-emerald-800' : 'hover:bg-emerald-100'}`}
                                >
                                    <X className={`w-3 h-3 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Search By Section */}
                    <div className="mb-6">
                        <h3 className={`text-base sm:text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Search By
                        </h3>

                        <div className="space-y-2">
                            {Object.entries(filterOptions).map(([key, { label }]) => {
                                const isSelected = selectedFilter === key;

                                return (
                                    <button
                                        key={key}
                                        onClick={() => handleFilterSelect(key)}
                                        disabled={isLoading}
                                        className={`
                                            w-full flex items-center justify-between 
                                            p-3 sm:p-4 rounded-xl border transition-all
                                            disabled:opacity-50 disabled:cursor-not-allowed
                                            ${isSelected
                                                ? (isDarkMode
                                                    ? 'bg-emerald-900/30 border-emerald-500 text-emerald-400'
                                                    : 'bg-emerald-50 border-emerald-500 text-emerald-600')
                                                : (isDarkMode
                                                    ? 'bg-gray-800 border-gray-700 text-white hover:border-emerald-600'
                                                    : 'bg-gray-50 border-gray-200 text-gray-900 hover:border-emerald-300')
                                            }
                                        `}
                                    >
                                        <span className={`font-medium text-left min-w-0 flex-1 ${isSelected ? 'font-semibold' : ''}`}>
                                            {label}
                                        </span>
                                        <div className="flex-shrink-0 ml-2">
                                            {isSelected ? (
                                                <CheckCircle className="w-5 h-5" />
                                            ) : (
                                                <ChevronRight className="w-5 h-5 text-gray-400" />
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Search Button */}
                    {selectedFilter && (
                        <div className="sticky bottom-0 pt-4 mt-6 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={handleSearch}
                                disabled={!canSearch}
                                className={`w-full py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center space-x-2 ${canSearch
                                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Searching...</span>
                                    </>
                                ) : (
                                    <>
                                        <Search className="w-5 h-5" />
                                        <span>Search Transactions</span>
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {/* Help Text */}
                    {!selectedFilter && (
                        <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium mb-2">Search Your Transactions</p>
                            <p className="text-sm">Select a filter above to start searching through your transaction history.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};