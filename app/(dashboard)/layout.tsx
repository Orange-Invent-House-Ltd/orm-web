'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import MobileSidebar from '@/components/MobileSidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div>
    <div className='relative'>
        <div className='hidden h-full md:flex md:flex-col md:fixed md:inset-y-0 bg-gray-900'>
          <Sidebar/>
        </div>
        <div className='md:hidden block'>
          <MobileSidebar/>

        </div>
       
      </div>
      <main className='md:ml-72'
        >
          {children}
        </main>
      
    </div>
  )
}
