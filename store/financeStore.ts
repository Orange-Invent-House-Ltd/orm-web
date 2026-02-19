import { create } from 'zustand'
import { Transaction } from '@/lib/data'

interface FinanceStore {
  selectedTransaction: Transaction | null
  setSelectedTransaction: (t: Transaction | null) => void
  activeBankId: string
  setActiveBankId: (id: string) => void
}

export const useFinanceStore = create<FinanceStore>((set) => ({
  selectedTransaction: null,
  setSelectedTransaction: (t) => set({ selectedTransaction: t }),
  activeBankId: 'zenith',
  setActiveBankId: (id) => set({ activeBankId: id }),
}))
