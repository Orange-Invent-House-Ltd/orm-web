/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';

export interface Transaction {
  id: string;
  ptid: string;
  AcctNo: string;
  AcctName: string;
  TransDate: string;
  ValueDate: string;
  TranCode: string;
  Description: string;
  Mode: string;
  DebitAmt: string;
  DebitAmtFormatted: string;
  CreditAmt: string;
  CreditAmtFormatted: string;
  RunningBalance: string;
  RunningBalanceFormatted: string;
  Currency: string;
}

interface TransactionStore {
  selectedTransaction: Transaction | null;
  setSelectedTransaction: (transaction: Transaction | null) => void;
  transactions: Transaction[] | null;
  setTransactions: (transactions: Transaction[] | null) => void;

  // Enhanced state management
  currentAccountNumber: string | null;
  setCurrentAccountNumber: (accountNumber: string | null) => void;
  searchTerm: string | null;
  setSearchTerm: (searchTerm: string | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;

  // Add method to clear all data
  clearData: () => void;

  // Add method to handle successful data loading
  loadTransactionsSuccess: (transactions: Transaction[], source?: { accountNumber?: string; searchTerm?: string }) => void;

  // Add method to handle loading errors
  loadTransactionsError: (error: string) => void;

  // Add method to start loading
  startLoading: (source?: { accountNumber?: string; searchTerm?: string }) => void;
}

export const useTransactionStore = create<TransactionStore>((set, get) => ({
  selectedTransaction: null,
  transactions: null,
  currentAccountNumber: null,
  searchTerm: null,
  isLoading: false,
  error: null,

  setSelectedTransaction: (transaction) => set({ selectedTransaction: transaction }),

  setTransactions: (transactions) => set({
    transactions,
    isLoading: false,
    error: null
  }),

  setCurrentAccountNumber: (accountNumber) => set({
    currentAccountNumber: accountNumber,
    searchTerm: null,
    error: null,
    isLoading: accountNumber ? true : false,
    // Don't clear transactions immediately - let the component handle it
  }),

  setSearchTerm: (searchTerm) => set({
    searchTerm,
    currentAccountNumber: null,
    error: null,
    isLoading: searchTerm ? true : false,
    // Don't clear transactions immediately - let the component handle it
  }),

  setIsLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({
    error,
    isLoading: false
  }),

  clearData: () => set({
    selectedTransaction: null,
    transactions: null,
    currentAccountNumber: null,
    searchTerm: null,
    isLoading: false,
    error: null
  }),

  // Enhanced methods for better state management
  startLoading: (source) => set({
    isLoading: true,
    error: null,
    currentAccountNumber: source?.accountNumber || get().currentAccountNumber,
    searchTerm: source?.searchTerm || get().searchTerm,
  }),

  loadTransactionsSuccess: (transactions, source) => set({
    transactions,
    isLoading: false,
    error: null,
    currentAccountNumber: source?.accountNumber || get().currentAccountNumber,
    searchTerm: source?.searchTerm || get().searchTerm,
  }),

  loadTransactionsError: (error) => set({
    error,
    isLoading: false,
    // Don't clear existing transactions on error - user might want to see cached data
  }),
}));