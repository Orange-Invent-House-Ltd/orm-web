'use client'

import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { useEffect, useRef, useState } from 'react'
import { RefreshCw, TrendingUp, XCircle } from 'lucide-react'
import Link from 'next/link'
import { useFetchPtbAggregatedBalance, useFetchUbaAggregatedBalance, useFetchZenithAggregatedBalance } from '@/api/query'
import { useFinanceStore } from '@/store/financeStore'

const CURRENCY_CONFIG = {
  NGN: { color: '#10b981', icon: '₦', bg: '#10b98115' },
  USD: { color: '#60a5fa', icon: '$', bg: '#60a5fa15' },
  EUR: { color: '#f59e0b', icon: '€', bg: '#f59e0b15' },
  GBP: { color: '#8b5cf6', icon: '£', bg: '#8b5cf615' },
} as const

function formatBalance(amount: string | number, currency: string): string {
  const num = parseFloat(String(amount))
  const cfg = CURRENCY_CONFIG[currency as keyof typeof CURRENCY_CONFIG]
  const icon = cfg?.icon ?? (currency === 'NGN' ? '₦' : currency.charAt(0))
  
  return `${icon}${num.toLocaleString('en-US', { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  })}`
}

export default function ZenithBankPage() {
  const { setActiveBank } = useFinanceStore()
  const [page, setPage] = useState(1)    
  const [size, setSize] = useState(6)
  const [search, setSearch] = useState('')
 const [searchInput, setSearchInput] = useState('')

  const { data: zenith, isLoading, error, refetch } = useFetchZenithAggregatedBalance({page, size, search})
  const { data: uba } = useFetchUbaAggregatedBalance({page, size, search})
  const { data: ptb } = useFetchPtbAggregatedBalance({page, size, search})

  const accounts = zenith?.data || []
  const statsRef = useRef<HTMLDivElement>(null)

  /* Aggregate totals per currency */
  const aggregatedBalance = accounts.reduce((acc: any, account: any) => {
    const currency = account.currency
    const config = CURRENCY_CONFIG[currency as keyof typeof CURRENCY_CONFIG] ?? {
      color: '#6b7280', icon: currency.charAt(0), bg: '#6b728015',
    }
    if (!acc[currency]) {
      acc[currency] = {
        total_currency_balance: 0,
        total_available_balance: 0,
        accountCount: 0,
        ...config,
      }
    }
    acc[currency].total_currency_balance += parseFloat(account.currentBalance)
    acc[currency].total_available_balance += parseFloat(account.availableBalance)
    acc[currency].accountCount += 1
    return acc
  }, {} as Record<string, any>)

  useEffect(() => {
    if (!statsRef.current || accounts.length === 0) return
    const cards = statsRef.current.querySelectorAll('.stat-card')
    gsap.fromTo(cards, { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.09, duration: 0.55, ease: 'power2.out' })
  }, [accounts.length])

  const bankName = accounts[0]?.bankName ?? 'Zenith Bank'

  return (
    <div className="md:p-8 p-3 " style={{ backgroundColor: '#0d1a11' }}>

      {/* Breadcrumb + title */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8">
        <div className="flex items-center gap-2 text-xs mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
          <span>Institutions</span><span>/</span>
          <span style={{ color: '#13ec5b' }}>{bankName}</span>
        </div>
        <div className="flex  md:flex-row flex-col md:items-center items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base font-black"
              style={{ backgroundColor: '#13ec5b22', color: '#13ec5b', border: '1px solid #13ec5b44' }}>
              {bankName.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight truncate
    ">{bankName}</h1>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Manage Accounts</p>
            </div>
          </div>
          <button className="sm:w-fit w-full  flex items-center justify-center mt-2 gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:opacity-80"
            style={{ backgroundColor: '#13ec5b15', color: '#13ec5b', border: '1px solid #13ec5b33' }}
          onClick={()=> refetch()}>
            <RefreshCw size={15}   className="cursor-pointer" /> Refresh All
          </button>
        </div>
      </motion.div>

      {/* Aggregated currency totals */}
      <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {Object.entries(aggregatedBalance).map(([currency, data]: [string, any], idx) => (
          <div key={idx} className="stat-card rounded-2xl p-5"
            style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
                  style={{ backgroundColor: data.bg, color: data.color }}>
                  {data.icon}
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    Total {currency}
                  </p>
                  <p className="text-xl font-bold text-white " title={data.total_currency_balance}>
                    {formatBalance(data.total_currency_balance, currency)}
                  </p>
                </div>
              </div>
              <TrendingUp size={16} style={{ color: data.color }} />
            </div>
            {/* Available total */}
            <div className="rounded-xl px-3 py-2.5"
              style={{ backgroundColor: `${data.color}10`, border: `1px solid ${data.color}22` }}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Total Available Balance
              </p>
              <p className="text-sm font-bold" style={{ color: data.color }} title={data.total_available_balance}>
                {formatBalance(data.total_available_balance, currency)}
              </p>
            </div>
            <p className="text-xs mt-2.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
              {data.accountCount} account{data.accountCount !== 1 ? 's' : ''}
            </p>
          </div>
        ))}
      </div>

      {/* Tab bar */}
      <div className="flex gap-6 mb-6 justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <button className="pb-3 text-sm font-bold" style={{ color: '#13ec5b', borderBottom: '2px solid #13ec5b' }}>
          All Accounts
        </button>
          
        <motion.div className="flex items-center gap-2">
          {zenith?.meta?.totalResults > accounts.length &&
            <button className="text-sm font-bold text-white/70 hover:opacity-80 mr-6 underline"
              onClick={() => setSize(zenith?.meta?.totalResults)}
            >See All</button>
          }
         {/* <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && setSearch(searchInput)}
            className="bg-transparent border border-white/10 rounded-lg px-3 py-1.5 text-sm w-48 focus:outline-none focus:ring-1 focus:ring-white/20 text-white"
            placeholder="Search accounts..."
          />
          <motion.button
            onClick={() => setSearch(searchInput)}
            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white transition-colors border border-white/10"
            whileTap={{ scale: 0.95 }}
          >
           Search
           </motion.button> */}
       </motion.div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-16" style={{ color: 'rgba(255,255,255,0.4)' }}>
          <RefreshCw size={20} className="animate-spin mr-3" /> Loading accounts...
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-2xl p-5 mb-6 flex items-center gap-3"
          style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <XCircle size={18} style={{ color: '#ef4444' }} />
          <p className="text-sm" style={{ color: '#ef4444' }}>Failed to load accounts. Please try again.</p>
        </div>
      )}

      {/* Account cards */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {accounts.map((acc: any, i: number) => {
            const isActive: boolean = acc.isActive
            const currencyCfg = CURRENCY_CONFIG[acc.currency as keyof typeof CURRENCY_CONFIG]
            const accentColor = currencyCfg?.color ?? '#13ec5b'
            const balanceAsOf = acc.balanceAsOf
              ? new Date(acc.balanceAsOf).toLocaleString('en-US', {
                  month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
                })
              : null

            return (
              <Link key={acc.accountNumber ?? i} href="/transactions"
              onClick={()=> {
                localStorage.setItem('bankName','zenith')
                setActiveBank(acc.accountNumber)
              }}
              >
              <motion.div key={acc.accountNumber ?? i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.45 }}
                className="rounded-2xl p-6 cursor-pointer group transition-all"
                style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                whileHover={{ scale: 1.01, boxShadow: `0 0 30px ${accentColor}` }} 
              >
                {/* Account name + number + isActive + currency */}
                <div className="flex justify-between items-start mb-5">
                  <div className="flex-1 pr-3">
                    <p className="text-sm font-bold text-white leading-snug mb-1.5">{acc.accountName}</p>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>Acct No:</span>
                      <span className="text-sm font-mono font-bold text-white">{acc.accountNumber}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    {/* Currency tag */}
                    <div className="rounded-lg px-2 py-1 text-xs font-bold"
                      style={{ backgroundColor: `${accentColor}18`, color: accentColor }}>
                      {acc.currency}
                    </div>
                    {/* isActive badge */}
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full flex items-center gap-1"
                      style={{
                        backgroundColor: isActive ? 'rgba(19,236,91,0.1)' : 'rgba(148,163,184,0.1)',
                        color: isActive ? '#13ec5b' : '#94a3b8',
                        border: `1px solid ${isActive ? 'rgba(19,236,91,0.22)' : 'rgba(148,163,184,0.15)'}`,
                      }}>
                      <span className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: isActive ? '#13ec5b' : '#94a3b8', display: 'inline-block' }} />
                      {isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {/* ── Current Balance ── */}
                <div className="mb-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1"
                    style={{ color: 'rgba(255,255,255,0.35)' }}>
                    Current Balance
                  </p>
                  <p className="text-2xl font-extrabold text-white tracking-tight" title={acc.currentBalance}>
                    {formatBalance(acc.currentBalance, acc.currency)}
                  </p>
                </div>

                {/* ── Available Balance ── */}
                <div className="rounded-xl px-3 py-2.5 mb-4"
                  style={{ backgroundColor: `${accentColor}08`, border: `1px solid ${accentColor}1a` }}>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5"
                    style={{ color: 'rgba(255,255,255,0.35)' }}>
                    Available Balance
                  </p>
                  <p className="text-base font-bold" style={{ color: accentColor }} title={acc.availableBalance}>
                    {formatBalance(acc.availableBalance, acc.currency)}
                  </p>
                </div>

                {/* Footer */}
                <div className="pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="flex items-center justify-between mb-2">
                    {/* Sync status */}
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor:
                            acc.lastUpdateStatus === 'SUCCESS' ? '#13ec5b'
                            : acc.lastUpdateStatus === 'PENDING' ? '#f59e0b'
                            : '#ef4444',
                        }} />
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        {acc.lastUpdateStatus === 'SUCCESS' ? 'Live Sync'
                          : acc.lastUpdateStatus === 'PENDING' ? 'Sync Pending'
                          : 'Sync Failed'}
                      </span>
                    </div>
                    {/* Balance as-of timestamp */}
                    {balanceAsOf && (
                      <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.28)' }}>
                        As of {balanceAsOf}
                      </span>
                    )}
                  </div>

                  {/* Optional error message
                  {acc.lastUpdateMessage && (
                    <p className="text-[10px] mb-2" style={{ color: 'rgba(255,100,100,0.65)' }}>
                      {acc.lastUpdateMessage}
                    </p>
                  )} */}

                  <button className="text-[10px] font-bold uppercase tracking-widest transition-opacity hover:opacity-60"
                    style={{ color: 'rgba(255,255,255,0.35)' }}>
                    View Transactions →
                  </button>
                </div>
        </motion.div>
        </Link>
            )
          })}
      
        </div>
      )}  

      {zenith?.meta?.totalResults > accounts.length &&
        <motion.button
          className="mt-4 w-fit flex items-center justify-center mx-auto p-4 mb-16 bg-white/10 rounded-lg text-white font-bold text-sm"
          whileTap={{ scale: 0.98 }}
          onClick={() => setSize(prev => prev + 6)}
          whileHover={{ scale: 1.02, boxShadow: `0 0 30px #13ec5b` }}

        >
          Load More
        </motion.button>
      }
    </div>
  )
}
