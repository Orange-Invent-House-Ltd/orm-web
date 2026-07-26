"use client";

import { useEffect, useRef, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp, Building2, RefreshCw, Landmark } from "lucide-react";
import { useAggregatedBalances } from "@/api/query";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

const BANK_COLORS: Record<string, string> = {
  ZENITH: "#13ec5b",
  UBA: "#60a5fa",
  PREMIUMTRUST: "#f59e0b",
};

const BANK_LABELS: Record<string, string> = {
  ZENITH: "Zenith Bank",
  UBA: "UBA",
  PREMIUMTRUST: "PremiumTrust",
};

/** Full number with commas and 2 decimals e.g. ₦14,886,945,310.09 */
function formatNGN(value: number) {
  return (
    "₦" +
    value.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

function formatUSD(value: number) {
  return (
    "$" +
    value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

/** Abbreviated for Y-axis only */
function shortNGN(value: number) {
  if (value >= 1_000_000_000) return `₦${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(0)}M`;
  return `₦${value.toLocaleString()}`;
}

const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl p-3 text-xs"
      style={{
        backgroundColor: "#0b1a0f",
        border: "1px solid rgba(255,255,255,0.1)",
        minWidth: 220,
      }}
    >
      <p className="font-bold text-white mb-2">{label}</p>
      {payload.map((p: any) => (
        <p
          key={p.dataKey}
          className="flex justify-between gap-4"
          style={{ color: p.color }}
        >
          <span>{p.name}</span>
          <span className="font-bold">{formatNGN(p.value)}</span>
        </p>
      ))}
    </div>
  );
};

const CustomPieTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl px-3 py-2 text-xs"
      style={{
        backgroundColor: "#0b1a0f",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <p style={{ color: payload[0].payload.color }} className="font-bold">
        {payload[0].name}
      </p>
      <p className="text-white">{formatNGN(payload[0].value)}</p>
    </div>
  );
};

export default function DashboardPage() {
  const { data, isLoading, refetch } = useAggregatedBalances();
  const kpiRef = useRef<HTMLDivElement>(null);
  const [chartView, setChartView] = useState<"nonMda" | "mda">("nonMda");

  const {
    totalNGN,
    totalUSD,
    bankTotals,
    pieData,
    barData,
    mdaBankTotals,
    mdaPieData,
    mdaBarData,
    mdaTotalNGN,
    lastSync,
    syncedCount,
    trackedCount,
  } = useMemo(() => {
    if (!data) {
      return {
        totalNGN: 0,
        totalUSD: 0,
        bankTotals: [] as {
          key: string;
          label: string;
          color: string;
          ngnTotal: number;
          usdTotal: number;
        }[],
        pieData: [] as { name: string; value: number; color: string }[],
        barData: [] as Record<string, any>[],
        mdaBankTotals: [] as {
          key: string;
          label: string;
          color: string;
          ngnTotal: number;
          usdTotal: number;
        }[],
        mdaPieData: [] as { name: string; value: number; color: string }[],
        mdaBarData: [] as Record<string, any>[],
        mdaTotalNGN: 0,
        lastSync: null as string | null,
        syncedCount: 0,
        trackedCount: 0,
      };
    }

    const totalNGN = parseFloat(
      data.balancesByCurrency?.NGN?.totalCurrentBalance ?? "0",
    );
    const totalUSD = parseFloat(
      data.balancesByCurrency?.USD?.totalCurrentBalance ?? "0",
    );

    const grouped: Record<string, { ngnTotal: number; usdTotal: number }> = {};
    for (const acc of data?.nonMdaAccounts?.aggregatedAccounts ?? []) {
      const bank = acc.bankName.toUpperCase();
      if (!grouped[bank]) grouped[bank] = { ngnTotal: 0, usdTotal: 0 };
      const bal = parseFloat(acc.currentBalance);
      if (acc.currency === "NGN") grouped[bank].ngnTotal += bal;
      else if (acc.currency === "USD") grouped[bank].usdTotal += bal;
    }

    const bankTotals = Object.entries(grouped).map(([key, vals]) => ({
      key,
      label: BANK_LABELS[key] ?? key,
      color: BANK_COLORS[key] ?? "#a78bfa",
      ...vals,
    }));

    const pieData = bankTotals
      .filter((b) => b.ngnTotal > 0)
      .map((b) => ({ name: b.label, value: b.ngnTotal, color: b.color }));

    const barData = bankTotals.map((b) => ({
      bank: b.label,
      balance: b.ngnTotal,
      color: b.color,
    }));

    const mdaGrouped: Record<string, { ngnTotal: number; usdTotal: number }> = {};
    for (const acc of data?.mdaAccounts?.aggregatedAccounts ?? []) {
      const bank = acc.bankName.toUpperCase();
      if (!mdaGrouped[bank]) mdaGrouped[bank] = { ngnTotal: 0, usdTotal: 0 };
      const bal = parseFloat(acc.currentBalance);
      if (acc.currency === "NGN") mdaGrouped[bank].ngnTotal += bal;
      else if (acc.currency === "USD") mdaGrouped[bank].usdTotal += bal;
    }

    const mdaBankTotals = Object.entries(mdaGrouped).map(([key, vals]) => ({
      key,
      label: BANK_LABELS[key] ?? key,
      color: BANK_COLORS[key] ?? "#a78bfa",
      ...vals,
    }));

    const mdaPieData = mdaBankTotals
      .filter((b) => b.ngnTotal > 0)
      .map((b) => ({ name: b.label, value: b.ngnTotal, color: b.color }));

    const mdaBarData = mdaBankTotals.map((b) => ({
      bank: b.label,
      balance: b.ngnTotal,
      color: b.color,
    }));

    const mdaTotalNGN = mdaBankTotals.reduce((sum, b) => sum + b.ngnTotal, 0);

    return {
      totalNGN,
      totalUSD,
      bankTotals,
      pieData,
      barData,
      mdaBankTotals,
      mdaPieData,
      mdaBarData,
      mdaTotalNGN,
      lastSync: data.lastSuccessfulSyncTime ?? null,
      syncedCount: data.successfullySyncedCount ?? 0,
      trackedCount: data.trackedAccountCount ?? 0,
    };
  }, [data]);

  const hasMdaData = mdaBankTotals.length > 0;

  const activeBankTotals = chartView === "mda" && hasMdaData ? mdaBankTotals : bankTotals;
  const activePieData = chartView === "mda" && hasMdaData ? mdaPieData : pieData;
  const activeBarData = chartView === "mda" && hasMdaData ? mdaBarData : barData;
  const activeTotalNGN = chartView === "mda" && hasMdaData ? mdaTotalNGN : totalNGN;

  useEffect(() => {
    if (!kpiRef.current || isLoading) return;
    const cards = kpiRef.current.querySelectorAll(".kpi-card");
    gsap.fromTo(
      cards,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out",
      },
    );
  }, [isLoading]);

  const lastSyncFormatted = lastSync
    ? new Date(lastSync).toLocaleTimeString("en-NG", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  return (
    <div className="p-8 min-h-screen" style={{ backgroundColor: "#0d1a11" }}>
      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="flex items-start justify-between mb-8"
      >
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Real-time view of all your financial institutions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p
              className="text-xs font-medium"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              Last synced
            </p>
            <p
              className="text-xs font-bold"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              {lastSyncFormatted}
            </p>
          </div>
          <button
            onClick={() => refetch?.()}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-opacity hover:opacity-70"
            style={{
              backgroundColor: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <RefreshCw size={14} color="rgba(255,255,255,0.6)" />
          </button>
        </div>
      </motion.div>

      {/* ── Row 1: Total NGN + Total USD — full width, equal halves ─────── */}
      <div ref={kpiRef} className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
        {/* Total NGN */}
        <div
          className="kpi-card rounded-2xl p-7 relative overflow-hidden"
          style={{
            backgroundColor: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
            style={{
              backgroundColor: "rgba(19,236,91,0.06)",
              filter: "blur(50px)",
              transform: "translate(30%, -30%)",
            }}
          />
          <div className="flex items-center justify-between mb-5">
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Total NGN Balance
            </p>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold"
              style={{
                backgroundColor: "rgba(19,236,91,0.12)",
                color: "#13ec5b",
              }}
            >
              ₦
            </div>
          </div>
          {isLoading ? (
            <div
              className="h-10 w-72 rounded-lg animate-pulse"
              style={{ backgroundColor: "rgba(255,255,255,0.07)" }}
            />
          ) : (
            <p className="text-xl sm:text-2xl lg:text-4xl font-extrabold text-white tracking-tight">
              {formatNGN(totalNGN)}
            </p>
          )}
          <div
            className="flex items-center gap-1.5 mt-4 text-xs font-semibold"
            style={{ color: "#13ec5b" }}
          >
            <TrendingUp size={13} />
            <span>
              {syncedCount} of {trackedCount} accounts synced
            </span>
          </div>
        </div>

        {/* Total USD */}
        <div
          className="kpi-card rounded-2xl p-7 relative overflow-hidden"
          style={{
            backgroundColor: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
            style={{
              backgroundColor: "rgba(96,165,250,0.06)",
              filter: "blur(50px)",
              transform: "translate(30%, -30%)",
            }}
          />
          <div className="flex items-center justify-between mb-5">
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Total USD Balance
            </p>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold"
              style={{
                backgroundColor: "rgba(96,165,250,0.12)",
                color: "#60a5fa",
              }}
            >
              $
            </div>
          </div>
          {isLoading ? (
            <div
              className="h-10 w-48 rounded-lg animate-pulse"
              style={{ backgroundColor: "rgba(255,255,255,0.07)" }}
            />
          ) : (
            <p className="text-xl sm:text-2xl lg:text-4xl font-extrabold text-white tracking-tight">
              {formatUSD(totalUSD)}
            </p>
          )}
          <div
            className="flex items-center gap-1.5 mt-4 text-xs font-semibold"
            style={{ color: "#60a5fa" }}
          >
            <Landmark size={13} />
            <span>Domiciliary account</span>
          </div>
        </div>
      </div>

      {/* ── Row 2: Per-Bank Cards ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {isLoading
          ? [1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl p-6 animate-pulse"
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  minHeight: 200,
                }}
              />
            ))
          : bankTotals.map((bank) => (
              <div
                key={bank.key}
                className="rounded-2xl p-6 relative overflow-hidden"
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div
                  className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none"
                  style={{
                    backgroundColor: `${bank.color}0d`,
                    filter: "blur(40px)",
                    transform: "translate(30%, -30%)",
                  }}
                />

                {/* Bank header */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${bank.color}18` }}
                  >
                    <Building2 size={16} color={bank.color} />
                  </div>
                  <p className="text-base font-bold text-white">{bank.label}</p>
                </div>

                {/* NGN balance */}
                <div className="mb-4">
                  <p
                    className="text-xs font-semibold mb-1.5 uppercase tracking-wider"
                    style={{ color: "rgba(255,255,255,0.38)" }}
                  >
                    NGN Balance
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-extrabold text-white tracking-tight">
                    {formatNGN(bank.ngnTotal)}
                  </p>
                </div>

                {/* USD balance — always shown */}
                <div
                  className="rounded-xl px-4 py-3 mb-5"
                  style={{
                    backgroundColor: "rgba(96,165,250,0.07)",
                    border: "1px solid rgba(96,165,250,0.14)",
                  }}
                >
                  <p
                    className="text-xs font-semibold mb-1 uppercase tracking-wider"
                    style={{ color: "rgba(255,255,255,0.38)" }}
                  >
                    USD Balance
                  </p>
                  <p
                    className="text-sm sm:text-base font-extrabold"
                    style={{ color: "#60a5fa" }}
                  >
                    {formatUSD(bank.usdTotal)}
                  </p>
                </div>

                {/* Share of total */}
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span style={{ color: "rgba(255,255,255,0.35)" }}>
                      Share of total NGN
                    </span>
                    <span className="font-bold" style={{ color: bank.color }}>
                      {totalNGN > 0
                        ? ((bank.ngnTotal / totalNGN) * 100).toFixed(2)
                        : "0.00"}
                      %
                    </span>
                  </div>
                  <div
                    className="h-1.5 rounded-full overflow-hidden"
                    style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: bank.color }}
                      initial={{ width: 0 }}
                      animate={{
                        width:
                          totalNGN > 0
                            ? `${(bank.ngnTotal / totalNGN) * 100}%`
                            : "0%",
                      }}
                      transition={{
                        duration: 0.9,
                        delay: 0.3,
                        ease: "easeOut",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
      </div>

      {/* ── MDA Aggregated Accounts ──────────────────────────────────────── */}
      {mdaBankTotals.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-white tracking-tight mb-4">
            MDA Aggregated Accounts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {mdaBankTotals.map((bank) => (
              <div
                key={bank.key}
                className="rounded-2xl p-6 relative overflow-hidden"
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div
                  className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none"
                  style={{
                    backgroundColor: `${bank.color}0d`,
                    filter: "blur(40px)",
                    transform: "translate(30%, -30%)",
                  }}
                />

                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${bank.color}18` }}
                  >
                    <Building2 size={16} color={bank.color} />
                  </div>
                  <p className="text-base font-bold text-white">{bank.label}</p>
                </div>

                <div className="mb-4">
                  <p
                    className="text-xs font-semibold mb-1.5 uppercase tracking-wider"
                    style={{ color: "rgba(255,255,255,0.38)" }}
                  >
                    NGN Balance
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-extrabold text-white tracking-tight">
                    {formatNGN(bank.ngnTotal)}
                  </p>
                </div>

                <div
                  className="rounded-xl px-4 py-3 mb-5"
                  style={{
                    backgroundColor: "rgba(96,165,250,0.07)",
                    border: "1px solid rgba(96,165,250,0.14)",
                  }}
                >
                  <p
                    className="text-xs font-semibold mb-1 uppercase tracking-wider"
                    style={{ color: "rgba(255,255,255,0.38)" }}
                  >
                    USD Balance
                  </p>
                  <p
                    className="text-sm sm:text-base font-extrabold"
                    style={{ color: "#60a5fa" }}
                  >
                    {formatUSD(bank.usdTotal)}
                  </p>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span style={{ color: "rgba(255,255,255,0.35)" }}>
                      Share of total NGN
                    </span>
                    <span className="font-bold" style={{ color: bank.color }}>
                      {mdaTotalNGN > 0
                        ? ((bank.ngnTotal / mdaTotalNGN) * 100).toFixed(2)
                        : "0.00"}
                      %
                    </span>
                  </div>
                  <div
                    className="h-1.5 rounded-full overflow-hidden"
                    style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: bank.color }}
                      initial={{ width: 0 }}
                      animate={{
                        width:
                          mdaTotalNGN > 0
                            ? `${(bank.ngnTotal / mdaTotalNGN) * 100}%`
                            : "0%",
                      }}
                      transition={{
                        duration: 0.9,
                        delay: 0.3,
                        ease: "easeOut",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Charts Row ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <motion.div
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="lg:col-span-2 rounded-2xl p-6"
          style={{
            backgroundColor: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-white font-bold text-base">
                NGN Balance by Bank
              </h3>
              <p
                className="text-xs mt-0.5"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                {chartView === "mda" && hasMdaData
                  ? "MDA accounts only"
                  : "Non-MDA accounts only"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {hasMdaData && (
                <div
                  className="flex rounded-lg overflow-hidden text-xs font-medium"
                  style={{
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <button
                    onClick={() => setChartView("nonMda")}
                    className="px-3 py-1.5 transition-colors"
                    style={{
                      backgroundColor:
                        chartView === "nonMda"
                          ? "rgba(19,236,91,0.15)"
                          : "transparent",
                      color:
                        chartView === "nonMda" ? "#13ec5b" : "rgba(255,255,255,0.5)",
                    }}
                  >
                    Non-MDA
                  </button>
                  <button
                    onClick={() => setChartView("mda")}
                    className="px-3 py-1.5 transition-colors"
                    style={{
                      backgroundColor:
                        chartView === "mda"
                          ? "rgba(19,236,91,0.15)"
                          : "transparent",
                      color:
                        chartView === "mda" ? "#13ec5b" : "rgba(255,255,255,0.5)",
                    }}
                  >
                    MDA
                  </button>
                </div>
              )}
              <div className="flex items-center gap-4 text-xs">
                {activeBankTotals.map((b) => (
                  <span
                    key={b.key}
                    className="flex items-center gap-1.5 font-medium"
                    style={{ color: "rgba(255,255,255,0.6)" }}
                  >
                    <span
                      className="w-2 h-2 rounded-sm inline-block"
                      style={{ backgroundColor: b.color }}
                    />
                    {b.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={activeBarData} barGap={4} barCategoryGap="35%">
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
              />
              <XAxis
                dataKey="bank"
                tick={{
                  fill: "rgba(255,255,255,0.35)",
                  fontSize: 11,
                  fontWeight: 700,
                }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={shortNGN}
              />
              <Tooltip
                content={<CustomBarTooltip />}
                cursor={{ fill: "rgba(255,255,255,0.03)" }}
              />
              <Bar dataKey="balance" name="NGN Balance" radius={[6, 6, 0, 0]}>
                {activeBarData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="rounded-2xl p-6 flex flex-col"
          style={{
            backgroundColor: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="flex items-start justify-between mb-1">
            <div>
              <h3 className="text-white font-bold text-base">
                Portfolio Distribution
              </h3>
              <p
                className="text-xs"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                {chartView === "mda" && hasMdaData
                  ? "MDA NGN balance share"
                  : "Non-MDA NGN balance share"}
              </p>
            </div>
            {hasMdaData && (
              <div
                className="flex rounded-lg overflow-hidden text-xs font-medium"
                style={{
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <button
                  onClick={() => setChartView("nonMda")}
                  className="px-3 py-1.5 transition-colors"
                  style={{
                    backgroundColor:
                      chartView === "nonMda"
                        ? "rgba(19,236,91,0.15)"
                        : "transparent",
                    color:
                      chartView === "nonMda" ? "#13ec5b" : "rgba(255,255,255,0.5)",
                  }}
                >
                  Non-MDA
                </button>
                <button
                  onClick={() => setChartView("mda")}
                  className="px-3 py-1.5 transition-colors"
                  style={{
                    backgroundColor:
                      chartView === "mda"
                        ? "rgba(19,236,91,0.15)"
                        : "transparent",
                    color:
                      chartView === "mda" ? "#13ec5b" : "rgba(255,255,255,0.5)",
                  }}
                >
                  MDA
                </button>
              </div>
            )}
          </div>

          <ResponsiveContainer width="100%" height={190}>
            <PieChart>
              <Pie
                data={activePieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={82}
                paddingAngle={3}
                dataKey="value"
              >
                {activePieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          <div className="space-y-3 mt-auto">
            {activePieData.map((entry) => (
              <div key={entry.name}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span style={{ color: "rgba(255,255,255,0.6)" }}>
                      {entry.name}
                    </span>
                  </div>
                  <span className="font-bold text-white ml-2 text-right whitespace-nowrap">
                    {formatNGN(entry.value)}
                  </span>
                </div>
                <div
                  className="h-1 rounded-full overflow-hidden"
                  style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: entry.color }}
                    initial={{ width: 0 }}
                    animate={{
                      width:
                        activeTotalNGN > 0
                          ? `${(entry.value / activeTotalNGN) * 100}%`
                          : "0%",
                    }}
                    transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
