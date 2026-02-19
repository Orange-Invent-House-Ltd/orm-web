'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { TrendingUp, AlertTriangle, Building2, ArrowUpRight, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { BANKS, TRANSACTIONS, CHART_DATA, PIE_DATA, formatCurrency } from '@/lib/data'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] } }),
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div
      className="rounded-xl p-3 text-xs"
      style={{ backgroundColor: '#0b1a0f', border: '1px solid rgba(255,255,255,0.1)', minWidth: 140 }}
    >
      <p className="font-bold text-white mb-2">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} className="flex justify-between gap-4" style={{ color: p.color }}>
          <span>{p.name}</span>
          <span className="font-bold">${p.value}M</span>
        </p>
      ))}
    </div>
  )
}

const CustomPieTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div
      className="rounded-xl px-3 py-2 text-xs"
      style={{ backgroundColor: '#0b1a0f', border: '1px solid rgba(255,255,255,0.1)' }}
    >
      <p style={{ color: payload[0].payload.color }} className="font-bold">{payload[0].name}</p>
      <p className="text-white">${payload[0].value}M USD equivalent</p>
    </div>
  )
}

export default function DashboardPage() {
  const kpiRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!kpiRef.current) return
    const cards = kpiRef.current.querySelectorAll('.kpi-card')
    gsap.fromTo(cards, { y: 30, opacity: 0 }, {
      y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'power2.out',
    })
  }, [])

  const totalNGN = BANKS.reduce((a, b) => a + b.totalNGN, 0)
  const totalUSD = BANKS.reduce((a, b) => a + b.totalUSD, 0)
  const totalEUR = BANKS.reduce((a, b) => a + b.totalEUR, 0)
  const pendingTx = TRANSACTIONS.filter((t) => t.status === 'pending').length
  const flagged = TRANSACTIONS.filter((t) => t.flagged).length
  const recentTx = TRANSACTIONS.slice(0, 5)

  return (
    <div className="p-8 min-h-screen" style={{ backgroundColor: '#0d1a11' }}>
      {/* Page title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard Overview</h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Real-time view of all your financial institutions
        </p>
      </motion.div>

      {/* KPI Row */}
      <div ref={kpiRef} className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {/* Total NGN */}
        <div
          className="kpi-card rounded-2xl p-6 relative overflow-hidden"
          style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div
            className="absolute top-0 right-0 w-28 h-28 rounded-full pointer-events-none"
            style={{ backgroundColor: 'rgba(19,236,91,0.05)', filter: 'blur(30px)', transform: 'translate(30%, -30%)' }}
          />
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>Total Balance NGN</p>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
              style={{ backgroundColor: 'rgba(19,236,91,0.12)', color: '#13ec5b' }}
            >₦</div>
          </div>
          <p className="text-3xl font-extrabold text-white tracking-tight">
            ₦{(totalNGN / 1000000).toFixed(1)}M
          </p>
          <div className="flex items-center gap-1 mt-2 text-xs font-semibold" style={{ color: '#13ec5b' }}>
            <TrendingUp size={12} /> +1.3% vs last month
          </div>
        </div>

        {/* Total USD */}
        <div
          className="kpi-card rounded-2xl p-6 relative overflow-hidden"
          style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>Total Balance USD</p>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
              style={{ backgroundColor: 'rgba(96,165,250,0.12)', color: '#60a5fa' }}
            >$</div>
          </div>
          <p className="text-3xl font-extrabold text-white tracking-tight">
            ${(totalUSD / 1000).toFixed(1)}K
          </p>
          <div className="flex items-center gap-1 mt-2 text-xs font-semibold" style={{ color: '#60a5fa' }}>
            <TrendingUp size={12} /> +2.8% vs last month
          </div>
        </div>

        {/* Alerts */}
        <div
          className="kpi-card rounded-2xl p-6 relative overflow-hidden"
          style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,100,100,0.15)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>Pending / Flagged</p>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#ef4444' }} />
          </div>
          <p className="text-3xl font-extrabold text-white tracking-tight">{pendingTx + flagged}</p>
          <p className="text-xs mt-2" style={{ color: 'rgba(255,100,100,0.7)' }}>
            {pendingTx} pending · {flagged} flagged for review
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Bar Chart */}
        <motion.div
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="lg:col-span-2 rounded-2xl p-6"
          style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-white font-bold text-base">Total Balance by Bank</h3>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>USD equivalent (millions)</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              {BANKS.map((b) => (
                <span key={b.id} className="flex items-center gap-1.5 font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  <span className="w-2 h-2 rounded-sm inline-block" style={{ backgroundColor: b.color }} />
                  {b.name}
                </span>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={CHART_DATA} barGap={4} barCategoryGap="28%">
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="zenith" name="Zenith Bank" fill="#13ec5b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="usna" name="USNA" fill="#60a5fa" radius={[4, 4, 0, 0]} />
              <Bar dataKey="gtbank" name="GTBank" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="rounded-2xl p-6"
          style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <h3 className="text-white font-bold text-base mb-1">Portfolio Distribution</h3>
          <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>By institution share</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={PIE_DATA}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {PIE_DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {PIE_DATA.map((entry) => (
              <div key={entry.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>{entry.name}</span>
                </div>
                <span className="font-bold text-white">${entry.value}M</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* EUR + Recent Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* EUR Summary */}
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="rounded-2xl p-6"
          style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <h3 className="text-white font-bold text-base mb-4">EUR Balances by Bank</h3>
          <div className="space-y-4">
            {BANKS.map((bank) => (
              <div key={bank.id}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {bank.name}
                  </span>
                  <span className="text-sm font-bold text-white">€{bank.totalEUR.toLocaleString()}</span>
                </div>
                <div className="h-1.5 rounded-full w-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: bank.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(bank.totalEUR / totalEUR) * 100}%` }}
                    transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex justify-between items-center">
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Total EUR</span>
              <span className="font-bold text-white">€{totalEUR.toLocaleString()}</span>
            </div>
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="lg:col-span-2 rounded-2xl overflow-hidden"
          style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div
            className="px-6 py-4 flex items-center justify-between"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          >
            <h3 className="text-white font-bold text-base">Recent Transactions</h3>
            <Link
              href="/transactions"
              className="text-xs font-bold flex items-center gap-1 transition-opacity hover:opacity-70"
              style={{ color: '#13ec5b' }}
            >
              View All <ArrowUpRight size={13} />
            </Link>
          </div>
          <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
            {recentTx.map((tx, i) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.07 }}
                className="px-6 py-3.5 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black"
                    style={{ backgroundColor: tx.bankColor + '20', color: tx.bankColor }}
                  >
                    {tx.bankName[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white leading-none">{tx.merchant}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      {tx.bankName} · {tx.date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className="text-sm font-bold"
                    style={{ color: tx.amount > 0 ? '#13ec5b' : '#fff' }}
                  >
                    {formatCurrency(tx.amount, tx.currency)}
                  </p>
                  <span
                    className="text-[10px] font-bold uppercase"
                    style={{
                      color:
                        tx.status === 'completed' ? '#13ec5b'
                        : tx.status === 'pending' ? '#f59e0b'
                        : '#ef4444',
                    }}
                  >
                    {tx.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
