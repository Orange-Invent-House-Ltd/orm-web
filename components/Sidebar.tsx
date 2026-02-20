'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  User,
  LogOut,
  ChevronRight,
  Building2,
  Landmark,
  Wallet,
  CreditCard,
  CircleDollarSign,
} from 'lucide-react'
 import logo from '../assets/logo.png'
import Image from 'next/image'
import { useFinanceStore } from '@/store/financeStore'

const navItem = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0 },
}

// Bank routes with proper icons and colors
const bankRoute = [
  {
    route: '/banks/zenith',
    name: 'Zenith Bank',
    icon: Landmark,
    color: '#13ec5b', // Green
    initial: 'ZB',
  },
  {
    route: '/banks/uba',
    name: 'UBA',
        icon: Landmark,

    color: '#0a5c2e', // Dark green
    initial: 'UB',
  },
  {
    route: '/banks/ptb',
    name: 'Premium Trust Bank',
       icon: Landmark,

    color: '#1e7b4b', // Medium green
    initial: 'PTB',
  },
 
]

export default function Sidebar() {
    const { setActiveBank, setIsMobileOpen} = useFinanceStore()
  
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/')
  }

  const handleLogout = () => {
    router.push('/login')
  }

  // Find active bank for the pill indicator
  const activeBank = bankRoute.find(bank => isActive(bank.route))

  return (
    <aside
      className="w-64 flex-shrink-0 flex flex-col h-screen sticky top-0"
      style={{
        backgroundColor: '#0b1a0f',
        borderRight: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="px-5 py-6 flex items-center gap-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <Image
          src={logo}
          alt="FinancePro Logo"
          width={36}
          height={36}
        />
        <div>
          <p className="text-white font-bold text-sm leading-none">Kaduna Banks</p>
          <p className="text-xs mt-0.5 font-medium" style={{ color: 'rgba(19,236,91,0.6)' }}>
            Account Oversight
          </p>
        </div>
      </motion.div>

      {/* Nav */}
      <motion.nav
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.06 } } }}
        className="flex-1 overflow-y-auto px-3 pt-4 pb-2 space-y-1"
      >
        {/* Dashboard */}
        {/* <motion.div variants={navItem}>
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative"
            style={{
              backgroundColor: isActive('/dashboard') ? 'rgba(19,236,91,0.12)' : 'transparent',
              color: isActive('/dashboard') ? '#13ec5b' : 'rgba(255,255,255,0.55)',
            }}
          >
            {isActive('/dashboard') && (
              <motion.div
                layoutId="sidebar-pill"
                className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-full"
                style={{ backgroundColor: '#13ec5b' }}
              />
            )}
            <LayoutDashboard size={18} />
            <span className="text-sm font-semibold">Dashboard</span>
          </Link>
        </motion.div> */}

        {/* Banks section */}
        <motion.div variants={navItem} className="pt-3 pb-1">
          <p
            className="px-3 text-[10px] font-bold uppercase tracking-[0.18em] mb-2"
            style={{ color: 'rgba(255,255,255,0.3)' }}
          >
            Banks
          </p>
          <div className="space-y-0.5">
            {bankRoute.map((bank, inx) => {
              const active = isActive(bank.route)
              const IconComponent = bank.icon
              
              return (
                <Link
                  key={inx}
                  href={bank.route}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative group"
                  style={{
                    backgroundColor: active ? 'rgba(255,255,255,0.06)' : 'transparent',
                    color: active ? '#fff' : 'rgba(255,255,255,0.5)',
                  }}
                  onClick={() => {
                    setIsMobileOpen(false)
                    setActiveBank('')
                    localStorage.removeItem('bankName')
                  }}
                >
                  {active && (
                    <motion.div
                      layoutId="bank-pill"
                      className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-full"
                      style={{ backgroundColor: bank.color }}
                    />
                  )}
                  
                  {/* Icon container */}
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor: active ? bank.color + '22' : 'rgba(255,255,255,0.05)',
                      color: active ? bank.color : 'rgba(255,255,255,0.4)',
                    }}
                  >
                    <IconComponent size={16} />
                  </div>
                  
                  <span className="text-sm font-medium flex-1">{bank.name}</span>
                  
                  {active && (
                    <ChevronRight 
                      size={14} 
                      style={{ color: bank.color }} 
                      className="animate-pulse"
                    />
                  )}
                </Link>
              )
            })}
          </div>
        </motion.div>

        {/* Transactions */}
        <motion.div variants={navItem} className="pt-2">
          <p
            className="px-3 text-[10px] font-bold uppercase tracking-[0.18em] mb-2"
            style={{ color: 'rgba(255,255,255,0.3)' }}
          >
            Activity
          </p>
          <Link
            href="/transactions"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative group"
            style={{
              backgroundColor: isActive('/transactions') ? 'rgba(19,236,91,0.12)' : 'transparent',
              color: isActive('/transactions') ? '#13ec5b' : 'rgba(255,255,255,0.55)',
            }}
                    
            onClick={() =>  setIsMobileOpen(false) }
          >
            {isActive('/transactions') && (
              <motion.div
                layoutId="transactions-pill"
                className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-full"
                style={{ backgroundColor: '#13ec5b' }}
              />
            )}
            <CircleDollarSign size={18} />
            <span className="text-sm font-semibold">All Transactions</span>
          </Link>
        </motion.div>
      </motion.nav>

      {/* Bottom: Profile + Logout */}
      <div className="px-3 pb-4 space-y-1" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
        <Link
          href="/profile"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative"
          style={{
            backgroundColor: isActive('/profile') ? 'rgba(255,255,255,0.06)' : 'transparent',
            color: isActive('/profile') ? '#fff' : 'rgba(255,255,255,0.5)',
          }}
        >
          {isActive('/profile') && (
            <motion.div
              layoutId="profile-pill"
              className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-full"
              style={{ backgroundColor: '#13ec5b' }}
            />
          )}
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ backgroundColor: 'rgba(19,236,91,0.12)', color: '#13ec5b' }}
          >
            AC
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white leading-none">Alex Chen</p>
            <p className="text-xs mt-0.5 truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>Admin</p>
          </div>
          <User size={14} style={{ color: 'rgba(255,255,255,0.3)' }} />
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group hover:bg-red-500/10"
          style={{ color: 'rgba(255,100,100,0.65)' }}
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  )
}