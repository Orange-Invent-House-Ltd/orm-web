'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download, Filter, Search, TrendingUp, TrendingDown, Activity, Layers } from 'lucide-react'
import { useFinanceStore } from '@/store/financeStore'
import TransactionDetail from '@/components/transactions/TransactionDetail'
import Pagination from '@/components/reuseable/Pagination'
import { useFetchUbaStatements, useFetchZenithStatements, useFetchPtbStatements } from '@/api/query'
import BankSelectionModal from '@/components/ChooseBank'
import { CSVLink } from 'react-csv'

// ─── types ────────────────────────────────────────────────────────────────────
export interface StatementTransaction {
  id: string
  ptid: string
  AcctNo: string
  AcctName: string
  TransDate: string
  ValueDate: string
  TranCode: string
  Description: string
  Mode: 'CREDIT' | 'DEBIT'
  DebitAmt: string
  DebitAmtFormatted: string
  CreditAmt: string
  CreditAmtFormatted: string
  RunningBalance: string
  RunningBalanceFormatted: string
  Currency: string
}

// ─── helpers ──────────────────────────────────────────────────────────────────
function formatCurrency(amount: string | number, currency = 'NGN') {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)
}

function modeColor(mode: string) {
  return mode === 'CREDIT' ? '#13ec5b' : '#ef4444'
}

// ─── CSV column definitions ───────────────────────────────────────────────────
const CSV_HEADERS = [
  { label: 'Transaction ID',              key: 'id'                       },
  { label: 'PTID',                        key: 'ptid'                     },
  { label: 'Account Number',              key: 'AcctNo'                   },
  { label: 'Account Name',               key: 'AcctName'                 },
  { label: 'Transaction Date',            key: 'TransDate'                },
  { label: 'Value Date',                  key: 'ValueDate'                },
  { label: 'Tran Code',                   key: 'TranCode'                 },
  { label: 'Description',                 key: 'Description'              },
  { label: 'Mode',                        key: 'Mode'                     },
  { label: 'Debit Amount',               key: 'DebitAmt'                 },
  { label: 'Debit Amount (Formatted)',    key: 'DebitAmtFormatted'        },
  { label: 'Credit Amount',              key: 'CreditAmt'                },
  { label: 'Credit Amount (Formatted)',   key: 'CreditAmtFormatted'       },
  { label: 'Running Balance',             key: 'RunningBalance'           },
  { label: 'Running Balance (Formatted)', key: 'RunningBalanceFormatted'  },
  { label: 'Currency',                    key: 'Currency'                 },
]

// ─── component ────────────────────────────────────────────────────────────────
export default function TransactionsPage() {
  const { setSelectedTransaction, activeBank, setActiveBank } = useFinanceStore()

  const [apiSearch,  setApiSearch]  = useState(activeBank ?? '')
  const [inputValue, setInputValue] = useState(activeBank ?? '')
  const [modeFilter, setModeFilter] = useState<'all' | 'CREDIT' | 'DEBIT'>('all')
  const [page,       setPage]       = useState(1)
  const [showModal,  setShowModal]  = useState(!activeBank)
  const [bankName,   setBankName]   = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedBank = localStorage.getItem('bankName')
      if (storedBank) setBankName(storedBank.replace(/"/g, ''))
    }
  }, [])

  const { data: zenithData, isLoading: zenithLoading } = useFetchZenithStatements(
    { size: 100, page, search: apiSearch },
    { enabled: bankName === 'zenith' }
  )
  const { data: ubaData, isLoading: ubaLoading } = useFetchUbaStatements(
    { size: 100, page, search: apiSearch },
    { enabled: bankName === 'uba' }
  )
  const { data: ptbData, isLoading: ptbLoading } = useFetchPtbStatements(
    { size: 100, page, search: apiSearch },
    { enabled: bankName === 'ptb' }
  )

  const fetchStatement: any =
    bankName === 'zenith' ? zenithData :
    bankName === 'uba'    ? ubaData    :
    bankName === 'ptb'    ? ptbData    :
    undefined

  const isLoading =
    bankName === 'zenith' ? zenithLoading :
    bankName === 'uba'    ? ubaLoading    :
    bankName === 'ptb'    ? ptbLoading    :
    false

  useEffect(() => {
    if ((activeBank && bankName !== '') || (activeBank === '' && bankName !== '')) {
      setPage(1)
      setShowModal(false)
    } else if (!activeBank && bankName === '') {
      setShowModal(true)
    }
  }, [activeBank])

  useEffect(() => { setPage(1) }, [bankName])

  const data: StatementTransaction[] = fetchStatement?.data ?? []

  // ── handlers ──────────────────────────────────────────────────────────────
  const handleSearch = () => {
    setApiSearch(inputValue.trim())
    setActiveBank('')
    setPage(1)
  }

  const handleModeFilter = (mode: 'all' | 'CREDIT' | 'DEBIT') => {
    setModeFilter(mode)
    setPage(1)
    if (mode === 'all') {
      setApiSearch(''); setInputValue(''); setActiveBank('')
    } else {
      setApiSearch(mode); setInputValue(''); setActiveBank('')
    }
  }

  const handleSelectBank = (bank: { label: string; icon: string; value: string }) => {
    localStorage.setItem('bankName', bank.value)
    setBankName(bank.value)
    setPage(1)
    setShowModal(false)
  }

  // ── derived stats ─────────────────────────────────────────────────────────
  const currency      = data[0]?.Currency ?? 'NGN'
  const latestBalance = data[0] ? parseFloat(data[0].RunningBalance) : 0
  const totalCredit   = data.reduce((s, tx) => s + parseFloat(tx.CreditAmt || '0'), 0)
  const totalDebit    = data.reduce((s, tx) => s + parseFloat(tx.DebitAmt  || '0'), 0)
  const creditCount   = data.filter((t) => t.Mode === 'CREDIT').length
  const debitCount    = data.filter((t) => t.Mode === 'DEBIT').length

  const stats = [
    { label: 'Running Balance', value: formatCurrency(latestBalance, currency), badge: currency,           badgeColor: '#13ec5b', sub: 'Latest closing balance', Icon: Activity    },
    { label: 'Total Credits',   value: formatCurrency(totalCredit,   currency), badge: `+${creditCount}`,  badgeColor: '#13ec5b', sub: 'Inflow this period',      Icon: TrendingUp   },
    { label: 'Total Debits',    value: formatCurrency(totalDebit,    currency), badge: `-${debitCount}`,   badgeColor: '#ef4444', sub: 'Outflow this period',     Icon: TrendingDown },
    { label: 'Transactions',    value: (fetchStatement?.meta?.totalResults ?? data.length).toLocaleString(), badge: 'Total', badgeColor: '#60a5fa', sub: 'All records', Icon: Layers },
  ]

  const csvFilename = `transactions_${bankName}_${new Date().toISOString().split('T')[0]}.csv`

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <>
      <BankSelectionModal isOpen={showModal} onClose={() => {}} onSelectBank={handleSelectBank} />

      <div className="min-h-screen" style={{ backgroundColor: '#0d1a11' }}>
        <TransactionDetail />

        {/* ── Page padding: tight on mobile, generous on desktop ── */}
        <div className="p-4 sm:p-6 lg:p-8">

          {/* ── Header ── */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Transaction History
                </h1>
                {bankName && (
                  <span
                    className="px-3 py-1 rounded-lg text-xs font-bold uppercase"
                    style={{ backgroundColor: '#13ec5b20', color: '#13ec5b', border: '1px solid #13ec5b30' }}
                  >
                    {bankName}
                  </span>
                )}
              </div>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Review and manage your global financial movements
              </p>
            </div>

            {/* Export button — full-width on xs, auto on sm+ */}
            <CSVLink
              data={data}
              headers={CSV_HEADERS}
              filename={csvFilename}
              className="flex items-center justify-center gap-2 w-full sm:w-auto"
              style={{
                padding: '10px 16px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 700,
                textDecoration: 'none',
                transition: 'opacity 0.2s',
                backgroundColor: data.length === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: data.length === 0 ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.85)',
                pointerEvents: data.length === 0 ? 'none' : 'auto',
                cursor: data.length === 0 ? 'not-allowed' : 'pointer',
                flexShrink: 0,
              }}
            >
              <Download size={15} />
              Export CSV
              {data.length > 0 && (
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 6px', borderRadius: '6px', backgroundColor: '#13ec5b20', color: '#13ec5b' }}>
                  {data.length} rows
                </span>
              )}
            </CSVLink>
          </motion.div>

          {/* ── Stats grid: 1 col → 2 col → 4 col ── */}
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 * i }}
                className="rounded-2xl p-4 sm:p-5"
                style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs sm:text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{s.label}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: s.badgeColor + '18', color: s.badgeColor }}>
                    {s.badge}
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <p className="text-base sm:text-xl font-bold text-white tracking-tight leading-none">
                    {isLoading ? '—' : s.value}
                  </p>
                  <s.Icon size={18} style={{ color: s.badgeColor + 'aa' }} />
                </div>
                <p className="text-xs mt-2 italic" style={{ color: 'rgba(255,255,255,0.3)' }}>{s.sub}</p>
              </motion.div>
            ))}
          </div>

          {/* ── Filters ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="rounded-2xl p-3 sm:p-4 mb-4 sm:mb-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            {/* Search row */}
            <div className="flex items-center gap-2 w-full sm:flex-1 sm:min-w-[260px]">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.35)' }} />
                <input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search by name, description, PTID…"
                  className="w-full text-sm text-white placeholder:text-white/20 rounded-xl pl-9 pr-4 py-2 focus:outline-none transition-all"
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                />
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleSearch}
                className="px-4 py-2 rounded-xl text-sm text-white border border-white/10 whitespace-nowrap transition-colors hover:bg-white/10"
                style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
              >
                Search
              </motion.button>
            </div>

            {/* Mode pills + count — side by side on mobile, pushed right on desktop */}
            <div className="flex items-center justify-between sm:justify-start sm:gap-3 w-full sm:w-auto sm:ml-auto">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Filter size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
                {(['all', 'CREDIT', 'DEBIT'] as const).map((m) => {
                  const active = modeFilter === m
                  const color  = m === 'DEBIT' ? '#ef4444' : m === 'CREDIT' ? '#13ec5b' : '#60a5fa'
                  return (
                    <button
                      key={m}
                      onClick={() => handleModeFilter(m)}
                      className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                      style={{
                        backgroundColor: active ? color + '20' : 'rgba(255,255,255,0.05)',
                        color:           active ? color         : 'rgba(255,255,255,0.5)',
                        border:          active ? `1px solid ${color}40` : '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      {m === 'all' ? 'All' : m}
                    </button>
                  )
                })}
              </div>

              <span className="text-sm ml-3 sm:ml-0" style={{ color: 'rgba(255,255,255,0.4)' }}>
                <span className="text-white font-bold">{data.length}</span>
                <span className="hidden sm:inline"> transactions</span>
                <span className="inline sm:hidden"> txns</span>
                {modeFilter !== 'all' && (
                  <span className="ml-1 text-xs opacity-60 hidden sm:inline">({modeFilter} only)</span>
                )}
              </span>
            </div>
          </motion.div>

          {/* ── Table (scrollable on mobile) ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl overflow-hidden"
            style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="overflow-x-auto -webkit-overflow-scrolling-touch">
              <table className="w-full text-left" style={{ minWidth: '720px' }}>
                <thead>
                  <tr
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ backgroundColor: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.35)' }}
                  >
                    {['Trans Date', 'PTID', 'Account Name', 'Description', 'Mode', 'Credit', 'Debit', 'Balance'].map((h) => (
                      <th key={h} className="px-4 sm:px-5 py-3 sm:py-4 whitespace-nowrap" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={8} className="px-5 py-16 text-center text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        Loading transactions…
                      </td>
                    </tr>
                  ) : data.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-5 py-16 text-center text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        No transactions found.
                      </td>
                    </tr>
                  ) : (
                    data.map((tx, i) => (
                      <motion.tr
                        key={tx.id ?? i}
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 + i * 0.03 }}
                        className="cursor-pointer group transition-colors hover:bg-white/[0.025]"
                        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
                        onClick={() => setSelectedTransaction(tx)}
                      >
                        <td className="px-4 sm:px-5 py-3 sm:py-4 whitespace-nowrap">
                          <p className="text-sm font-medium text-white">{tx.TransDate}</p>
                          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{tx.ValueDate}</p>
                        </td>

                        <td className="px-4 sm:px-5 py-3 sm:py-4 font-mono text-xs whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.45)' }}>
                          {tx.ptid}
                        </td>

                        <td className="px-4 sm:px-5 py-3 sm:py-4">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div
                              className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0"
                              style={{ backgroundColor: '#13ec5b20', color: '#13ec5b' }}
                            >
                              {tx.AcctName?.[0] ?? '?'}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-white leading-tight max-w-[120px] sm:max-w-[160px] truncate">{tx.AcctName}</p>
                              <p className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.35)' }}>{tx.AcctNo}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 sm:px-5 py-3 sm:py-4 max-w-[160px] sm:max-w-[220px]">
                          <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.5)' }} title={tx.Description}>
                            {tx.Description}
                          </p>
                          <p className="text-xs mt-0.5 font-mono" style={{ color: 'rgba(255,255,255,0.25)' }}>{tx.TranCode}</p>
                        </td>

                        <td className="px-4 sm:px-5 py-3 sm:py-4">
                          <span
                            className="px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide"
                            style={{ backgroundColor: modeColor(tx.Mode) + '18', color: modeColor(tx.Mode), border: `1px solid ${modeColor(tx.Mode)}33` }}
                          >
                            {tx.Mode}
                          </span>
                        </td>

                        <td className="px-4 sm:px-5 py-3 sm:py-4 text-right text-sm font-bold whitespace-nowrap" style={{ color: '#13ec5b' }}>
                          {parseFloat(tx.CreditAmt) > 0 ? `+${tx.CreditAmtFormatted}` : '—'}
                        </td>

                        <td className="px-4 sm:px-5 py-3 sm:py-4 text-right text-sm font-bold whitespace-nowrap" style={{ color: '#ef4444' }}>
                          {parseFloat(tx.DebitAmt) > 0 ? `-${tx.DebitAmtFormatted}` : '—'}
                        </td>

                        <td className="px-4 sm:px-5 py-3 sm:py-4 text-right whitespace-nowrap">
                          <p className="text-sm font-bold text-white">{tx.RunningBalanceFormatted}</p>
                          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{tx.Currency}</p>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* ── Pagination — stacks vertically on mobile ── */}
            <div
              className="px-4 sm:px-5 py-3 sm:py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.02)' }}
            >
              <span className="text-sm text-center sm:text-left" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Page <span className="text-white font-bold">{page}</span> of{' '}
                <span className="text-white font-bold">{fetchStatement?.meta?.totalPages ?? 1}</span>
                <span className="ml-2 text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
                  ({fetchStatement?.meta?.totalResults ?? data.length} total)
                </span>
              </span>
              <div className="flex justify-center sm:justify-end">
                <Pagination page={page} totalPages={fetchStatement?.meta?.totalPages ?? 1} onPageChange={setPage} />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </>
  )
}