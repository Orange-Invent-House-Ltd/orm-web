/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Transaction {
  id: string;
  transaction_reference_no: string;
  session_id: string;
  transaction_type: string;
  type?: string;
  amount: string;
  currency: string;
  accountType?: string;
  originatingAccountNo?: string;
  description?: string;
  createdAt?: string;
  originating_account_no?: string;
  created_at?: string;
  account_holder_name: string;
  accountHolderName?: string;
  originatingBank?: string;
}

interface TransactionFilters {
  transactionType: string;
  searchQuery: string;
}

interface TransactionStore {
  transactions: Transaction[];
  selectedTransaction: Transaction | null;
  filters: TransactionFilters;
  setTransactions: (transactions: any[]) => void;
  setSelectedTransaction: (transaction: Transaction | null) => void;
  setFilters: (filters: Partial<TransactionFilters>) => void;
  getFilteredTransactions: () => Transaction[];
  clearTransactions: () => void;
}

// Define the storage key
const STORAGE_KEY = 'transaction-store';

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set, get) => ({
      transactions: [],
      selectedTransaction: null,
      filters: {
        transactionType: 'all',
        searchQuery: ''
      },

      setTransactions: (transactions: any[]) => {
        if (!transactions || !Array.isArray(transactions)) {
          set({ transactions: [] });
          return;
        }

        const transactionsWithIds = transactions.map((transaction, index) => ({
          ...transaction,
          // Ensure ID is properly set
          id: transaction.id || transaction.transaction_reference_no || `txn-${Date.now()}-${index}`,
          
          // Map transaction type consistently
          type: transaction.type || transaction.transaction_type || 'unknown',
          
          // Map account type with fallback
          accountType: transaction.accountType || transaction.account_type || 'Unknown Account',
          
          // Map account holder name - handle both possible field names
          accountHolderName: transaction.accountHolderName || transaction.account_holder_name || 'Unknown Account Holder',
          
          // Map originating account number
          originatingAccountNo: transaction.originatingAccountNo || transaction.originating_account_no || '',
          
          // Map originating bank
          originatingBank: transaction.originatingBank || transaction.originating_bank || '',
          
          // Map created date - handle both possible field names
          createdAt: transaction.createdAt || transaction.created_at || '',
          
          // Ensure description is mapped
          description: transaction.description || '',
          
          // Ensure other fields are preserved
          amount: transaction.amount || '0.00',
          currency: transaction.currency || 'NGN',
          transaction_reference_no: transaction.transaction_reference_no || transaction.id || '',
          session_id: transaction.session_id || '',
          transaction_type: transaction.transaction_type || transaction.type || 'unknown',
          account_holder_name: transaction.account_holder_name || transaction.accountHolderName || 'Unknown Account Holder'
        }));
        
        set({ transactions: transactionsWithIds });
      },

      setSelectedTransaction: (transaction) => set({ selectedTransaction: transaction }),

      setFilters: (newFilters) => 
        set((state) => ({ 
          filters: { ...state.filters, ...newFilters } 
        })),

      getFilteredTransactions: () => {
        const { transactions, filters } = get();
        
        return transactions.filter((transaction) => {
          const matchesType = filters.transactionType === 'all' || 
                            (transaction.type && transaction.type.toLowerCase() === filters.transactionType.toLowerCase()) ||
                            (transaction.transaction_type && transaction.transaction_type.toLowerCase() === filters.transactionType.toLowerCase());
          
          const matchesSearch = filters.searchQuery === '' || 
                              Object.values(transaction).some(value => 
                                value && value.toString().toLowerCase().includes(filters.searchQuery.toLowerCase())
                              );
          
          return matchesType && matchesSearch;
        });
      },

      clearTransactions: () => set({ transactions: [] })
    }),
    {
      name: STORAGE_KEY, // unique name for the storage
      storage: createJSONStorage(() => sessionStorage), // use sessionStorage
      // Optional: Only persist certain parts of the state
      partialize: (state) => ({
        transactions: state.transactions,
        // You can choose what to persist - filters might not need to be persisted
        // filters: state.filters,
        // selectedTransaction: state.selectedTransaction
      }),
    }
  )
);

// Optional: Utility function to manually clear the storage if needed
export const clearTransactionStorage = () => {
  sessionStorage.removeItem(STORAGE_KEY);
};

// Optional: Utility function to get the stored data directly
export const getStoredTransactions = (): Transaction[] => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.state.transactions || [];
    }
  } catch (error) {
    console.error('Error reading stored transactions:', error);
  }
  return [];
};

// Debug utility to log transaction field mapping
export const debugTransactionFields = (transaction: any) => {
  console.log('Transaction field mapping:', {
    original: transaction,
    mapped: {
      id: transaction.id || transaction.transaction_reference_no,
      type: transaction.type || transaction.transaction_type,
      accountType: transaction.accountType || transaction.account_type,
      accountHolderName: transaction.accountHolderName || transaction.account_holder_name,
      originatingAccountNo: transaction.originatingAccountNo || transaction.originating_account_no,
      originatingBank: transaction.originatingBank || transaction.originating_bank,
      createdAt: transaction.createdAt || transaction.created_at,
      amount: transaction.amount,
      currency: transaction.currency,
      description: transaction.description
    }
  });
};