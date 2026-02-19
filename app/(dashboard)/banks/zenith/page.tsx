'use client'

import { use } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { useEffect, useRef } from 'react'
import { RefreshCw, Download, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import Link from 'next/link'
import { BANKS, TRANSACTIONS, formatCurrency, Currency } from '@/lib/data'
import { useFinanceStore } from '@/store/financeStore'

export default function BankPage() {
  

  
  const bank = {
    id: 'zenith',
    name: 'Zenith Bank',
    initial: 'Z',
    color: '#13ec5b',
    totalNGN: 142500000,
    totalUSD: 170400.50,
    totalEUR: 8200.00,
    accounts: [
      { id: 'z1', type: 'Checking Account', number: '**** 1234', currency: 'NGN', balance: 142500000, lastSync: '2 mins ago', syncStatus: 'live', change: 1.2 },
      { id: 'z2', type: 'Savings Account', number: '**** 5678', currency: 'USD', balance: 45000.50, lastSync: '2 mins ago', syncStatus: 'live', change: 2.1 },
      { id: 'z3', type: 'Business Operating', number: '**** 9012', currency: 'EUR', balance: 8200.00, lastSync: '5 mins ago', syncStatus: 'pending', change: -0.3 },
      { id: 'z4', type: 'Investment Portfolio', number: '**** 3456', currency: 'USD', balance: 125400.00, lastSync: '1 hour ago', syncStatus: 'synced', change: 3.4 },
    ],
  };
  const { setActiveBankId } = useFinanceStore()
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setActiveBankId(bank.id)
    if (!statsRef.current) return
    const cards = statsRef.current.querySelectorAll('.stat-card')
    gsap.fromTo(cards, { y: 24, opacity: 0 }, {
      y: 0, opacity: 1, stagger: 0.09, duration: 0.55, ease: 'power2.out',
    })
  }, [bank.id])

  const bankTxs = TRANSACTIONS.filter((t) => t.bankId === bank.id).slice(0, 6)

  const totalNGN = bank.accounts.filter((a) => a.currency === 'NGN').reduce((s, a) => s + a.balance, 0)
  const totalUSD = bank.accounts.filter((a) => a.currency === 'USD').reduce((s, a) => s + a.balance, 0)
  const totalEUR = bank.accounts.filter((a) => a.currency === 'EUR').reduce((s, a) => s + a.balance, 0)

  return (
    <div className="p-8 min-h-screen" style={{ backgroundColor: '#0d1a11' }}>
      {/* Breadcrumb + title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 text-xs mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
          <span>Institutions</span>
          <span>/</span>
          <span style={{ color: bank.color }}>{bank.name}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-base font-black"
              style={{ backgroundColor: bank.color + '22', color: bank.color, border: `1px solid ${bank.color}44` }}
            >
              {bank.initial}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">{bank.name}</h1>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Manage Accounts</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all"
              style={{ backgroundColor: bank.color + '15', color: bank.color, border: `1px solid ${bank.color}33` }}
            >
              <RefreshCw size={15} /> Refresh All
            </button>
          </div>
        </div>
      </motion.div>

      {/* Currency totals */}
      <div ref={statsRef} className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total NGN', value: `₦${(totalNGN / 1000000).toFixed(2)}M`, icon: '₦', color: bank.color, bg: bank.color + '15' },
          { label: 'Total USD', value: `$${totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: '$', color: '#60a5fa', bg: '#60a5fa15' },
          { label: 'Total EUR', value: `€${totalEUR.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: '€', color: '#f59e0b', bg: '#f59e0b15' },
        ].map((item) => (
          <div
            key={item.label}
            className="stat-card rounded-2xl p-5 flex items-center justify-between"
            style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
                style={{ backgroundColor: item.bg, color: item.color }}
              >
                {item.icon}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {item.label}
                </p>
                <p className="text-xl font-bold text-white">{item.value}</p>
              </div>
            </div>
            <TrendingUp size={16} style={{ color: item.color }} />
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-6 mb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        {['All Accounts'].map((tab, i) => (
          <button
            key={tab}
            className="pb-3 text-sm font-bold transition-colors"
            style={{
              color: i === 0 ? bank.color : 'rgba(255,255,255,0.4)',
              borderBottom: i === 0 ? `2px solid ${bank.color}` : '2px solid transparent',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Account cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {bank.accounts.map((acc, i) => (
          <motion.div
            key={acc.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.45 }}
            className="rounded-2xl p-6 cursor-pointer group transition-all hover:scale-[1.01]"
            style={{
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
            whileHover={{ boxShadow: `0 0 24px ${bank.color}18` }}
          >
            <div className="flex justify-between items-start mb-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {acc.type}
                </span>
                <h3 className="text-white font-bold text-lg mt-0.5">{acc.number}</h3>
              </div>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: bank.color + '18', color: bank.color }}
              >
                {acc.currency}
              </div>
            </div>

            <div className="mb-5">
              <p className="text-2xl font-extrabold text-white tracking-tight">
                {formatCurrency(acc.balance, acc.currency as Currency).replace('+', '')}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: acc.syncStatus === 'live' ? '#13ec5b' : acc.syncStatus === 'pending' ? '#f59e0b' : '#94a3b8' }}
                />
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {acc.syncStatus === 'live' ? 'Live Sync' : 'Last Sync'}: {acc.lastSync}
                </span>
                {acc.syncStatus === 'live' && (
                  <span className="text-[10px] font-bold" style={{ color: '#13ec5b' }}>●</span>
                )}
              </div>
            </div>

            <div
              className="flex items-center justify-between pt-4"
              style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div className="flex items-center gap-1 text-xs font-bold" style={{ color: acc.change >= 0 ? '#13ec5b' : '#ef4444' }}>
                {acc.change > 0 ? <TrendingUp size={12} /> : acc.change < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
                {acc.change > 0 ? '+' : ''}{acc.change}%
              </div>
              <Link
                href="/transactions"
                className="text-[10px] font-bold uppercase tracking-widest transition-colors"
                style={{ color: 'rgba(255,255,255,0.35)' }}
              >
                View Transactions →
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl overflow-hidden"
        style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Recent Activity — {bank.name}
          </h3>
          <button className="text-xs font-bold flex items-center gap-1.5 transition-opacity hover:opacity-70" style={{ color: bank.color }}>
            <Download size={13} /> Download Statement
          </button>
        </div>

        {bankTxs.length === 0 ? (
          <div className="px-6 py-10 text-center" style={{ color: 'rgba(255,255,255,0.3)' }}>
            No transactions found for this bank.
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Merchant / Source</th>
                <th className="px-6 py-3">Account</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {bankTxs.map((tx, i) => (
                <tr
                  key={tx.id}
                  className="transition-colors hover:bg-white/[0.02]"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
                >
                  <td className="px-6 py-4 text-sm font-medium text-white">{tx.date}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-white font-medium">{tx.merchant}</div>
                    <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{tx.description}</div>
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{tx.accountNumber}</td>
                  <td className="px-6 py-4">
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase"
                      style={{
                        backgroundColor:
                          tx.status === 'completed' ? 'rgba(19,236,91,0.12)'
                          : tx.status === 'pending' ? 'rgba(245,158,11,0.12)'
                          : 'rgba(239,68,68,0.12)',
                        color:
                          tx.status === 'completed' ? '#13ec5b'
                          : tx.status === 'pending' ? '#f59e0b'
                          : '#ef4444',
                      }}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td
                    className="px-6 py-4 text-right text-sm font-bold"
                    style={{ color: tx.amount > 0 ? '#13ec5b' : '#fff' }}
                  >
                    {formatCurrency(tx.amount, tx.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>
    </div>
  )
}
