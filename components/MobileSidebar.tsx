'use client'

import { Menu, X } from 'lucide-react'
import React from 'react'
import Sidebar from './Sidebar'
import { useFinanceStore } from '@/store/financeStore'

function MobileSidebar() {
  const { isMobileOpen, setIsMobileOpen } = useFinanceStore()

  return (
    <>
      {/* Toggle button */}
      <button
        className="fixed top-1 right-4 z-[300] p-2 rounded-md text-white cursor-pointer"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Toggle sidebar"
      >
        {isMobileOpen ? <X /> : <Menu />}
      </button>

     
      {isMobileOpen && (
        <>
          {/* Backdrop — unmounts instantly on close */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileOpen(false)}
          />

          {/* Sidebar panel */}
          <div className="fixed top-0 right-0 h-full z-50">
            <Sidebar />
          </div>
        </>
      )}
    </>
  )
}

export default MobileSidebar