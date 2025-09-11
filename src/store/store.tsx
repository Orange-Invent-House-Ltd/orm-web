import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define the Account interface to match your API
interface Account {
  account_id: number;
  account_number: string;
  balance: string;
  currency: string;
  account_holder_name: string;
  bank_name: string;
}

// Updated interface to support grouped accounts by bank
interface BankEntry {
  bankName: string;
  currencyBalances: {
    [currency: string]: number;
  };
  syncAccounts: Account[];
  totalBalance: number;
  bankLogo?: string; // Add optional logo URL
}

// Store interface
interface BankStore {
  // State
  bankEntries: BankEntry[];
  selectedBankEntry: BankEntry | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setBankEntries: (entries: BankEntry[]) => void;
  setSelectedBankEntry: (entry: BankEntry | null) => void;
  addBankEntry: (entry: BankEntry) => void;
  removeBankEntry: (bankName: string) => void;
  updateBankEntry: (bankName: string, entry: Partial<BankEntry>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Computed getters
  getBankByName: (bankName: string) => BankEntry | undefined;
  getTotalBalanceByCurrency: (currency: string) => number;
  getAllCurrencies: () => string[];
}

// Create the store with persistence
export const useBankStore = create<BankStore>()(
  persist(
    (set, get) => ({
      // Initial state
      bankEntries: [],
      selectedBankEntry: null,
      isLoading: false,
      error: null,

      // Actions
      setBankEntries: (entries) => 
        set({ bankEntries: entries, error: null }),

      setSelectedBankEntry: (entry) => 
        set({ selectedBankEntry: entry }),

      addBankEntry: (entry) => 
        set((state) => ({
          bankEntries: [...state.bankEntries, entry],
          error: null
        })),

      removeBankEntry: (bankName) => 
        set((state) => ({
          bankEntries: state.bankEntries.filter(entry => entry.bankName !== bankName),
          selectedBankEntry: state.selectedBankEntry?.bankName === bankName 
            ? null 
            : state.selectedBankEntry
        })),

      updateBankEntry: (bankName, updates) => 
        set((state) => ({
          bankEntries: state.bankEntries.map(entry =>
            entry.bankName === bankName 
              ? { ...entry, ...updates }
              : entry
          )
        })),

      setLoading: (loading) => 
        set({ isLoading: loading }),

      setError: (error) => 
        set({ error, isLoading: false }),

      clearError: () => 
        set({ error: null }),

      // Computed getters
      getBankByName: (bankName) => 
        get().bankEntries.find(entry => entry.bankName === bankName),

      getTotalBalanceByCurrency: (currency) => 
        get().bankEntries.reduce((total, entry) => 
          total + (entry.currencyBalances[currency] || 0), 0),

      getAllCurrencies: () => {
        const currencies = new Set<string>();
        get().bankEntries.forEach(entry => {
          Object.keys(entry.currencyBalances).forEach(currency => {
            currencies.add(currency);
          });
        });
        return Array.from(currencies);
      }
    }),
    {
      name: 'bank-storage', // unique name for localStorage key
      storage: createJSONStorage(() => sessionStorage), // use sessionStorage instead of localStorage
    }
  )
);

// Selector hooks for better performance
export const useBankEntries = () => useBankStore((state) => state.bankEntries);
export const useSelectedBankEntry = () => useBankStore((state) => state.selectedBankEntry);
export const useBankLoading = () => useBankStore((state) => state.isLoading);
export const useBankError = () => useBankStore((state) => state.error);