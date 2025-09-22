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
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  selectedTransaction: null,
  setSelectedTransaction: (transaction) => set({ selectedTransaction: transaction }),
}));