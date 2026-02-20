import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Transaction } from '@/lib/data'

interface FinanceStore {
  selectedTransaction: {} | null
  setSelectedTransaction: (t: {} | null) => void
  activeBank: string;
  setActiveBank: (acc: string) => void
  isMobileOpen: boolean;
  setIsMobileOpen: (isOpen: boolean) => void;
}

export const useFinanceStore = create<FinanceStore>()(
   (set) => ({
      selectedTransaction: null,
      setSelectedTransaction: (t) => set({ selectedTransaction: t }),
      activeBank: '',
    setActiveBank: (acc) => set({ activeBank: acc }),
      isMobileOpen: false,
      setIsMobileOpen: (isOpen) => set({ isMobileOpen: isOpen }),
    })
  // persist(
   
  //   // {
  //   //   name: 'finance', 
  //   //   storage: createJSONStorage(() => localStorage), 
  //   // }
  // )
)