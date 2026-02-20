'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import MobileSidebar from '@/components/MobileSidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#0d1a11' }}>
    <div className='relative'>
        <div className='hidden h-full md:flex md:flex-col md:fixed md:inset-y-0 bg-gray-900'>
          <Sidebar/>
        </div>
        <div className='md:hidden block'>
          <MobileSidebar/>

        </div>
       
      </div>
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -18 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 overflow-y-auto md:ml-72"
          style={{ backgroundColor: '#0d1a11' }}
        >
          {children}
        </motion.main>
      </AnimatePresence>
    </div>
  )
}
