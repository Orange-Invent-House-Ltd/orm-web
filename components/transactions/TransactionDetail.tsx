'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  X, MapPin, Clock, Hash, Building2, CreditCard, Download,
  Flag, ShieldAlert, CheckCircle2, AlertCircle,
} from 'lucide-react'
import { Transaction, formatCurrency } from '@/lib/data'
import { useFinanceStore } from '@/store/financeStore'

export default function TransactionDetail() {
  const { selectedTransaction: tx, setSelectedTransaction } = useFinanceStore()

  return (
    <AnimatePresence>
      {tx && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedTransaction(null)}
            className="fixed inset-0 z-40"
            style={{ backgroundColor: 'rgba(7,14,9,0.7)', backdropFilter: 'blur(4px)' }}
          />

          {/* Panel */}
          <motion.aside
            key="panel"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 h-full z-50 flex flex-col"
            style={{
              width: '45%',
              backgroundColor: '#0b1a0f',
              borderLeft: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '-16px 0 40px rgba(0,0,0,0.6)',
            }}
          >
            {/* Top accent */}
            <div
              className="absolute top-0 left-0 w-full h-[2px]"
              style={{ background: `linear-gradient(to right, transparent, ${tx.bankColor}80, transparent)` }}
            />

            {/* Header */}
            <div
              className="flex items-center justify-between px-8 py-5"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black"
                  style={{ backgroundColor: tx.bankColor + '20', color: tx.bankColor }}
                >
                  {tx.bankName[0]}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white leading-none">Transaction Analysis</h3>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{tx.bankName}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:opacity-70"
                style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
              >
                <X size={16} style={{ color: 'rgba(255,255,255,0.7)' }} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-8 py-8">
              {/* Amount */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Total Amount
                </p>
                <h1
                  className="text-5xl font-black tracking-tighter"
                  style={{ color: tx.amount > 0 ? '#13ec5b' : '#fff' }}
                >
                  {formatCurrency(tx.amount, tx.currency)}
                </h1>

                <div className="flex flex-wrap items-center gap-2 mt-4">
                  {/* Status badge */}
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
                    style={{
                      backgroundColor:
                        tx.status === 'completed' ? 'rgba(19,236,91,0.14)'
                        : tx.status === 'pending' ? 'rgba(245,158,11,0.14)'
                        : 'rgba(239,68,68,0.14)',
                      color:
                        tx.status === 'completed' ? '#13ec5b'
                        : tx.status === 'pending' ? '#f59e0b'
                        : '#ef4444',
                      border: `1px solid ${tx.status === 'completed' ? '#13ec5b33' : tx.status === 'pending' ? '#f59e0b33' : '#ef444433'}`,
                    }}
                  >
                    {tx.status === 'completed' ? '✓ Completed' : tx.status === 'pending' ? '⏳ Pending' : '✗ Failed'}
                  </span>

                  {tx.flagged && (
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
                      style={{ backgroundColor: 'rgba(245,158,11,0.14)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }}
                    >
                      ⚠ Flagged
                    </span>
                  )}
                </div>
              </motion.div>

              {/* Core Metadata */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 }}
                className="mb-8"
              >
                <h4
                  className="text-xs font-black uppercase tracking-[0.2em] mb-4"
                  style={{ color: tx.bankColor }}
                >
                  Core Metadata
                </h4>
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  {[
                    { icon: <Building2 size={14} />, label: 'Bank', value: tx.bankName },
                    { icon: <CreditCard size={14} />, label: 'Account', value: tx.accountNumber },
                    { icon: <Hash size={14} />, label: 'Reference', value: tx.reference },
                    { icon: <Clock size={14} />, label: 'Date & Time', value: `${tx.date}, ${tx.time}` },
                    { icon: <MapPin size={14} />, label: 'Location', value: tx.location ?? 'N/A' },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-white/[0.02]"
                      style={{ borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                    >
                      <div className="flex items-center gap-2.5">
                        <span style={{ color: 'rgba(255,255,255,0.35)' }}>{item.icon}</span>
                        <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{item.label}</span>
                      </div>
                      <span className="text-sm font-semibold text-white text-right max-w-[55%] truncate">{item.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Transaction Details */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.26 }}
                className="mb-8"
              >
                <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-4" style={{ color: tx.bankColor }}>
                  Transaction Details
                </h4>
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  {[
                    { label: 'Merchant', value: tx.merchant },
                    { label: 'Category', value: tx.category },
                    { label: 'Description', value: tx.description },
                    { label: 'Currency', value: tx.currency },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-5 py-3.5"
                      style={{ borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                    >
                      <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{item.label}</span>
                      <span className="text-sm font-semibold text-white">{item.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Security */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.34 }}
              >
                <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-4" style={{ color: tx.bankColor }}>
                  Security Insights
                </h4>
                <div
                  className="rounded-2xl p-5 space-y-4"
                  style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  {tx.flagged ? (
                    <div className="flex gap-4 items-start">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: 'rgba(245,158,11,0.12)' }}
                      >
                        <ShieldAlert size={18} style={{ color: '#f59e0b' }} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Unusual Transaction Detected</p>
                        <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                          Transaction flagged for manual review. Origin: {tx.location ?? 'Unknown'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-4 items-start">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: 'rgba(19,236,91,0.12)' }}
                      >
                        <CheckCircle2 size={18} style={{ color: '#13ec5b' }} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Transaction Verified</p>
                        <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                          Merchant category matches your established operational profile.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="h-px" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} />

                  <div className="flex gap-4 items-start">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: tx.bankColor + '18' }}
                    >
                      <AlertCircle size={18} style={{ color: tx.bankColor }} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">AES-256 Encrypted</p>
                      <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        End-to-end encrypted via {tx.bankName} secure channel.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Footer Actions */}
            <div
              className="px-8 py-6 space-y-3"
              style={{
                borderTop: '1px solid rgba(255,255,255,0.06)',
                backgroundColor: 'rgba(255,255,255,0.01)',
              }}
            >
              {tx.flagged && (
                <button
                  className="w-full h-12 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:opacity-90"
                  style={{ backgroundColor: tx.bankColor, color: '#0b1a0f' }}
                >
                  <Flag size={16} /> Flag for Manual Review
                </button>
              )}
              <button
                className="w-full h-12 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:opacity-80"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  color: 'rgba(255,255,255,0.7)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <Download size={16} /> Download Receipt (PDF)
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
