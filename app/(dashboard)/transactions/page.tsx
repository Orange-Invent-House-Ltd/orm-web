'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Filter, Calendar, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { TRANSACTIONS, formatCurrency } from '@/lib/data'
import { useFinanceStore } from '@/store/financeStore'
import TransactionDetail from '@/components/transactions/TransactionDetail'

const PAGE_SIZE = 8

export default function TransactionsPage() {
  const { setSelectedTransaction, selectedTransaction } = useFinanceStore()
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [bankFilter, setBankFilter] = useState<string>('all')
  const [search, setSearch] = useState('')

  const banks = [...new Set(TRANSACTIONS.map((t) => t.bankName))]

  const filtered = TRANSACTIONS.filter((t) => {
    const matchStatus = statusFilter === 'all' || t.status === statusFilter
    const matchBank = bankFilter === 'all' || t.bankId === bankFilter
    const matchSearch = !search || t.merchant.toLowerCase().includes(search.toLowerCase()) || t.reference.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchBank && matchSearch
  })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const stats = {
    total: TRANSACTIONS.reduce((s, t) => s + Math.abs(t.amount), 0),
    pending: TRANSACTIONS.filter((t) => t.status === 'pending').length,
    success: ((TRANSACTIONS.filter((t) => t.status === 'completed').length / TRANSACTIONS.length) * 100).toFixed(1),
    settled: TRANSACTIONS.filter((t) => t.status === 'completed' && t.amount > 0).reduce((s, t) => s + t.amount, 0),
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0d1a11' }}>
      <TransactionDetail />

      <div className="p-8">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Transaction History</h1>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Review and manage your global financial movements
            </p>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-80"
            style={{
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.8)',
            }}
          >
            <Download size={15} /> Export CSV
          </button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Volume', value: `$${(stats.total / 1000).toFixed(1)}K`, badge: '+12.5%', badgeColor: '#13ec5b', sub: 'Last 30 days' },
            { label: 'Pending Trx', value: stats.pending.toString(), badge: 'Active', badgeColor: '#f59e0b', sub: `Requires approval: ${Math.floor(stats.pending / 2)}` },
            { label: 'Success Rate', value: `${stats.success}%`, badge: '+0.1%', badgeColor: '#13ec5b', sub: 'Avg response: 1.2s' },
            { label: 'Settled Today', value: `$${(stats.settled / 1000).toFixed(1)}K`, badge: 'Static', badgeColor: 'rgba(255,255,255,0.4)', sub: 'Refreshed 2m ago' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="rounded-2xl p-5"
              style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{s.label}</span>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded"
                  style={{ backgroundColor: s.badgeColor + '18', color: s.badgeColor }}
                >
                  {s.badge}
                </span>
              </div>
              <p className="text-2xl font-bold text-white tracking-tight">{s.value}</p>
              <p className="text-xs mt-1.5 italic" style={{ color: 'rgba(255,255,255,0.3)' }}>{s.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl p-4 mb-5 flex flex-wrap items-center gap-3"
          style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          {/* Search */}
          <div className="relative flex-1 min-w-[180px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.35)' }} />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search transactions..."
              className="w-full text-sm text-white placeholder:text-white/20 rounded-xl pl-9 pr-4 py-2 focus:outline-none transition-all"
              style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
            {['all', 'completed', 'pending', 'failed'].map((s) => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setPage(1) }}
                className="px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all"
                style={{
                  backgroundColor: statusFilter === s ? 'rgba(19,236,91,0.15)' : 'rgba(255,255,255,0.05)',
                  color: statusFilter === s ? '#13ec5b' : 'rgba(255,255,255,0.5)',
                  border: statusFilter === s ? '1px solid rgba(19,236,91,0.3)' : '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {s === 'all' ? 'All Status' : s}
              </button>
            ))}
          </div>

          {/* Bank filter */}
          <div className="flex items-center gap-2 flex-wrap">
            {['all', ...banks].map((b) => {
              const bId = b === 'all' ? 'all' : TRANSACTIONS.find((t) => t.bankName === b)?.bankId ?? 'all'
              return (
                <button
                  key={b}
                  onClick={() => { setBankFilter(bId); setPage(1) }}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                  style={{
                    backgroundColor: bankFilter === bId ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)',
                    color: bankFilter === bId ? '#fff' : 'rgba(255,255,255,0.45)',
                    border: bankFilter === bId ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  {b === 'all' ? 'All Banks' : b}
                </button>
              )
            })}
          </div>

          <div className="ml-auto text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            <span className="text-white font-bold">{filtered.length}</span> transactions
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl overflow-hidden"
          style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ backgroundColor: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.35)' }}
                >
                  <th className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Date</th>
                  <th className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Merchant</th>
                  <th className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Bank</th>
                  <th className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Reference</th>
                  <th className="px-5 py-4 text-right" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Amount</th>
                  <th className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Status</th>
                  <th className="px-5 py-4 text-center" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>View</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((tx, i) => (
                  <motion.tr
                    key={tx.id}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.04 }}
                    className="transition-all cursor-pointer group"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
                    onClick={() => setSelectedTransaction(tx)}
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-white">{tx.date}</p>
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{tx.time}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black"
                          style={{ backgroundColor: tx.bankColor + '20', color: tx.bankColor }}
                        >
                          {tx.merchant[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{tx.merchant}</p>
                          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{tx.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tx.bankColor }} />
                        <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>{tx.bankName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{tx.reference}</td>
                    <td
                      className="px-5 py-4 text-right text-sm font-bold"
                      style={{ color: tx.amount > 0 ? '#13ec5b' : '#fff' }}
                    >
                      {formatCurrency(tx.amount, tx.currency)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            backgroundColor: tx.status === 'completed' ? '#13ec5b' : tx.status === 'pending' ? '#f59e0b' : '#ef4444',
                          }}
                        />
                        <span
                          className="text-xs font-medium capitalize"
                          style={{
                            color: tx.status === 'completed' ? '#13ec5b' : tx.status === 'pending' ? '#f59e0b' : '#ef4444',
                          }}
                        >
                          {tx.status}
                        </span>
                        {tx.flagged && (
                          <span className="text-xs" style={{ color: '#f59e0b' }}>⚠</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button
                        className="text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-lg transition-all group-hover:opacity-100 opacity-40"
                        style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)' }}
                      >
                        View
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div
            className="px-5 py-4 flex items-center justify-between"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.02)' }}
          >
            <span className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Page <span className="text-white font-bold">{page}</span> of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
                style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <ChevronLeft size={14} className="text-white" />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className="w-8 h-8 rounded-lg text-sm font-bold transition-all"
                  style={{
                    backgroundColor: page === n ? '#13ec5b' : 'rgba(255,255,255,0.05)',
                    color: page === n ? '#0b1a0f' : 'rgba(255,255,255,0.6)',
                  }}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
                style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <ChevronRight size={14} className="text-white" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
