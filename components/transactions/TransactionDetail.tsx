'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Clock, Hash, CreditCard,
  CheckCircle2, AlertCircle, ArrowUpCircle, ArrowDownCircle,
} from 'lucide-react'
import { useFinanceStore } from '@/store/financeStore'
import type { StatementTransaction } from '@/app/(dashboard)/transactions/page'

function formatCurrency(amount: string | number, currency = 'NGN') {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(num)
}

const ACCENT = '#13ec5b'
const DEBIT_COLOR = '#ef4444'

export default function TransactionDetail() {
  const { selectedTransaction, setSelectedTransaction } = useFinanceStore()
  const tx = selectedTransaction as StatementTransaction | null

  const isCredit = tx?.Mode === 'CREDIT'
  const accentColor = isCredit ? ACCENT : DEBIT_COLOR
  const displayAmount = isCredit
    ? parseFloat(tx?.CreditAmt ?? '0')
    : parseFloat(tx?.DebitAmt ?? '0')

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
            style={{ backgroundColor: 'rgba(7,14,9,0.75)', backdropFilter: 'blur(4px)' }}
          />

          {/* Panel
              Mobile  : slides up from bottom, full width, 92vh tall (feels like a sheet)
              Desktop : slides in from right, 45% wide, full height (original behaviour)
          */}
          <motion.aside
            key="panel"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed z-50 flex flex-col
                        /* mobile: bottom sheet */
                        bottom-0 left-0 right-0 h-[92dvh] rounded-t-3xl
                        /* md+: right panel */
                        md:inset-y-0 md:left-auto md:right-0 md:h-full md:rounded-none"
            style={{
              width: undefined,            /* let Tailwind handle width */
              backgroundColor: '#0b1a0f',
              borderLeft: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '-16px 0 40px rgba(0,0,0,0.6)',
            }}
          >
            {/* Inline style for md+ width — Tailwind can't do arbitrary responsive inline */}
            <style>{`
              @media (min-width: 768px) {
                .tx-panel { width: 50% !important; }
              }
              @media (max-width: 767px) {
                .tx-panel { width: 100% !important; box-shadow: 0 -16px 40px rgba(0,0,0,0.6) !important; border-left: none !important; border-top: 1px solid rgba(255,255,255,0.08) !important; }
              }
            `}</style>

            {/* Top accent line */}
            <div
              className="absolute top-0 left-0 w-full h-[2px] rounded-t-3xl md:rounded-none"
              style={{ background: `linear-gradient(to right, transparent, ${accentColor}80, transparent)` }}
            />

            {/* Mobile drag handle pill */}
            <div className="flex justify-center pt-3 pb-1 md:hidden">
              <div className="w-10 h-1 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.18)' }} />
            </div>

            {/* Header */}
            <div
              className="flex items-center justify-between px-5 sm:px-8 py-4 sm:py-5"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black"
                  style={{ backgroundColor: accentColor + '20', color: accentColor }}
                >
                  {isCredit ? <ArrowDownCircle size={18} /> : <ArrowUpCircle size={18} />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white leading-none">Transaction Detail</h3>
                  <p className="text-xs mt-0.5 truncate max-w-[200px] sm:max-w-none" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {tx.TranCode} · {tx.ptid}
                  </p>
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

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-6 sm:py-8">

              {/* Amount hero */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-6 sm:mb-8"
              >
                <p
                  className="text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  {isCredit ? 'Credit Amount' : 'Debit Amount'}
                </p>
                <h1
                  className="text-3xl sm:text-5xl font-black tracking-tighter break-all"
                  style={{ color: accentColor }}
                >
                  {isCredit ? '+' : '-'}{formatCurrency(displayAmount, tx.Currency)}
                </h1>

                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
                    style={{ backgroundColor: accentColor + '18', color: accentColor, border: `1px solid ${accentColor}33` }}
                  >
                    {isCredit ? '↓ Credit' : '↑ Debit'}
                  </span>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
                    style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    {tx.Currency}
                  </span>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold tracking-wide"
                    style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    {tx.TranCode}
                  </span>
                </div>
              </motion.div>

              {/* Core Metadata */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 }}
                className="mb-6 sm:mb-8"
              >
                <h4
                  className="text-xs font-black uppercase tracking-[0.2em] mb-4"
                  style={{ color: accentColor }}
                >
                  Core Metadata
                </h4>
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  {[
                    { icon: <CreditCard size={14} />, label: 'Account Name', value: tx.AcctName },
                    { icon: <Hash size={14} />,       label: 'Account No',   value: tx.AcctNo   },
                    { icon: <Hash size={14} />,       label: 'PTID',         value: tx.ptid     },
                    { icon: <Clock size={14} />,      label: 'Trans Date',   value: tx.TransDate },
                    { icon: <Clock size={14} />,      label: 'Value Date',   value: tx.ValueDate },
                  ].map((item, i, arr) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-3.5 gap-3 transition-colors hover:bg-white/[0.02]"
                      style={{ borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                    >
                      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                        <span style={{ color: 'rgba(255,255,255,0.35)' }}>{item.icon}</span>
                        <span className="text-xs sm:text-sm whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.5)' }}>
                          {item.label}
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-white text-right truncate max-w-[55%]">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Transaction Details */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.26 }}
                className="mb-6 sm:mb-8"
              >
                <h4
                  className="text-xs font-black uppercase tracking-[0.2em] mb-4"
                  style={{ color: accentColor }}
                >
                  Transaction Details
                </h4>
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  {[
                    { label: 'Description',     value: tx.Description },
                    { label: 'Credit Amount',   value: tx.CreditAmtFormatted },
                    { label: 'Debit Amount',    value: tx.DebitAmtFormatted },
                    { label: 'Running Balance', value: `${tx.RunningBalanceFormatted} ${tx.Currency}` },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start justify-between px-4 sm:px-5 py-3 sm:py-3.5 gap-3"
                      style={{ borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                    >
                      <span className="text-xs sm:text-sm shrink-0" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        {item.label}
                      </span>
                      <span
                        className="text-xs sm:text-sm font-semibold text-white text-right"
                        style={{ wordBreak: 'break-word' }}
                      >
                        {item.value}
                      </span>
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
                <h4
                  className="text-xs font-black uppercase tracking-[0.2em] mb-4"
                  style={{ color: accentColor }}
                >
                  Security Insights
                </h4>
                <div
                  className="rounded-2xl p-4 sm:p-5 space-y-4"
                  style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div className="flex gap-3 sm:gap-4 items-start">
                    <div
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: ACCENT + '18' }}
                    >
                      <CheckCircle2 size={18} style={{ color: ACCENT }} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Transaction Verified</p>
                      <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        Record retrieved from secure banking channel.
                      </p>
                    </div>
                  </div>

                  <div className="h-px" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} />

                  <div className="flex gap-3 sm:gap-4 items-start">
                    <div
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: accentColor + '18' }}
                    >
                      <AlertCircle size={18} style={{ color: accentColor }} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">AES-256 Encrypted</p>
                      <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        End-to-end encrypted transmission.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}