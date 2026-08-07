'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  User,
  LogOut,
  ChevronRight,
  Landmark,
  CircleDollarSign,
  Building2,
} from 'lucide-react'
import logo from '../assets/logo.png'
import Image from 'next/image'
import { useFinanceStore } from '@/store/financeStore'
import { useAggregatedBalances } from '@/api/query'

const navItem = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0 },
}

const BANK_COLORS: Record<string, string> = {
  ZENITH: '#13ec5b',
  UBA: '#60a5fa',
  PREMIUMTRUST: '#f59e0b',
}

function formatBankName(name: string): string {
  const map: Record<string, string> = {
    ZENITH: 'Zenith Bank',
    UBA: 'UBA',
    PREMIUMTRUST: 'Premium Trust Bank',
  }
  return map[name] ?? name.charAt(0) + name.slice(1).toLowerCase()
}

export default function Sidebar() {
  const { setIsMobileOpen } = useFinanceStore()
  const { data } = useAggregatedBalances()
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/')
  }

  const handleLogout = () => {
    router.push('/login')
  }

  const uniqueBanks: string[] = data
    ? Array.from(new Set(
        (data.nonMdaAccounts?.aggregatedAccounts ?? [])
          .map((a: any) => a.bankName.toUpperCase())
      ))
    : []

  const bankRoute = [
    {
      route: '/dashboard',
      name: 'Dashboard',
      icon: LayoutDashboard,
      color: '#13ec5b',
    },
    ...uniqueBanks.map((bank) => ({
      route: `/banks/${bank}`,
      name: formatBankName(bank),
      icon: Landmark,
      color: BANK_COLORS[bank] ?? '#a78bfa',
      initial: bank.slice(0, 3),
    })),
  ]

  const activeBank = bankRoute.find((bank) => isActive(bank.route))

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
                  onClick={() => setIsMobileOpen(false)}
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

        {/* MDA Accounts */}
        <motion.div variants={navItem} className="pt-2">
          <p
            className="px-3 text-[10px] font-bold uppercase tracking-[0.18em] mb-2"
            style={{ color: 'rgba(255,255,255,0.3)' }}
          >
            MDA
          </p>
          <Link
            href="/mda"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative group"
            style={{
              backgroundColor: isActive('/mda') ? 'rgba(245,158,11,0.12)' : 'transparent',
              color: isActive('/mda') ? '#f59e0b' : 'rgba(255,255,255,0.55)',
            }}
            onClick={() => setIsMobileOpen(false)}
          >
            {isActive('/mda') && (
              <motion.div
                layoutId="mda-pill"
                className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-full"
                style={{ backgroundColor: '#f59e0b' }}
              />
            )}
            <Building2 size={18} />
            <span className="text-sm font-semibold">MDA Accounts</span>
          </Link>
        </motion.div>
      </motion.nav>

      {/* Bottom: Profile + Logout */}
      <div className="px-3 pb-4 space-y-1" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
        <div
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
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white leading-none">KDGOV</p>
          </div>
          <User size={14} style={{ color: 'rgba(255,255,255,0.3)' }} />
        </div>

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
