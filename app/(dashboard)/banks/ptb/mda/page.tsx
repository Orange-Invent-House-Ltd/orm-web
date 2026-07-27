"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFetchPtbAggregatedBalance } from "@/api/query";
import { useFinanceStore } from "@/store/financeStore";

const CURRENCY_CONFIG = {
  NGN: { color: "#10b981", icon: "₦", bg: "#10b98115" },
  USD: { color: "#60a5fa", icon: "$", bg: "#60a5fa15" },
  EUR: { color: "#f59e0b", icon: "€", bg: "#f59e0b15" },
  GBP: { color: "#8b5cf6", icon: "£", bg: "#8b5cf615" },
} as const;

function formatBalance(amount: string | number, currency: string): string {
  const num = parseFloat(String(amount));
  const cfg = CURRENCY_CONFIG[currency as keyof typeof CURRENCY_CONFIG];
  const icon = cfg?.icon ?? (currency === "NGN" ? "₦" : currency.charAt(0));
  return `${icon}${num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function PtbMdaPage() {
  const router = useRouter();
  const { setActiveBank } = useFinanceStore();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [seeAll, setSeeAll] = useState(false);
  const { data: ptb, isLoading, refetch } = useFetchPtbAggregatedBalance({ page, size, is_mda_account: true });
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const accounts = ptb?.data ?? [];
  const bankName = accounts[0]?.bankName ?? "Premium Trust Bank";
  const totalResults = ptb?.meta?.totalResults ?? 0;

  const currencyTotals = accounts.reduce((acc: Record<string, { current: number; available: number }>, acct: any) => {
    const cur = acct.currency || "NGN";
    if (!acc[cur]) acc[cur] = { current: 0, available: 0 };
    acc[cur].current += parseFloat(String(acct.currentBalance || 0));
    acc[cur].available += parseFloat(String(acct.availableBalance || 0));
    return acc;
  }, {});

  const handleSeeAll = () => {
    if (totalResults > 0) {
      setSize(totalResults);
      setSeeAll(true);
    }
  };

  return (
    <div className="p-4 sm:p-8 min-h-screen" style={{ backgroundColor: "#0d1a11" }}>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 text-xs mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>
          <span>Institutions</span>
          <span>/</span>
          <Link href="/banks/ptb" className="hover:opacity-70" style={{ color: "#13ec5b" }}>{bankName}</Link>
          <span>/</span>
          <span style={{ color: "#f59e0b" }}>MDA Accounts</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/banks/ptb"
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-opacity hover:opacity-70"
              style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <ArrowLeft size={16} color="rgba(255,255,255,0.6)" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                MDA Accounts — {bankName}
              </h1>
              <p className="text-xs sm:text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                {totalResults > 0
                  ? `${accounts.length} of ${totalResults} Ministry, Department & Agency accounts`
                  : "Ministry, Department & Agency accounts"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {totalResults > 0 && !seeAll && totalResults > accounts.length && (
              <button
                onClick={handleSeeAll}
                className="px-4 py-2 rounded-xl text-sm font-bold transition-all hover:opacity-80"
                style={{ backgroundColor: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                See All ({totalResults})
              </button>
            )}
            <button
              onClick={() => refetch()}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:opacity-80 w-fit"
              style={{ backgroundColor: "#13ec5b15", color: "#13ec5b", border: "1px solid #13ec5b33" }}
            >
              <RefreshCw size={15} /> Refresh
            </button>
          </div>
        </div>
      </motion.div>

      {isLoading || !mounted ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="h-16 rounded-2xl animate-pulse" style={{ backgroundColor: "rgba(255,255,255,0.04)" }} />
          ))}
        </div>
      ) : accounts.length === 0 ? (
        <div className="rounded-2xl p-12 text-center" style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <p className="text-white font-bold text-lg mb-1">No MDA Accounts Found</p>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>There are no MDA accounts linked to this bank.</p>
        </div>
      ) : (
        <>

          <div className="rounded-2xl overflow-x-auto" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                  <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>Account Name</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>Account No</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>Currency</th>
                  <th className="text-right px-4 py-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>Current Balance</th>
                  <th className="text-right px-4 py-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>Available Balance</th>
                  <th className="text-center px-4 py-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((acc: any, i: number) => {
                  const currencyCfg = CURRENCY_CONFIG[acc.currency as keyof typeof CURRENCY_CONFIG];
                  const accentColor = currencyCfg?.color ?? "#13ec5b";
                  const isActive = acc.isActive;
                  return (
                    <tr
                      key={acc.accountNumber ?? i}
                      className="cursor-pointer transition-colors hover:opacity-80"
                      style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
                      onClick={() => {
                        localStorage.setItem("bankName", "ptb");
                        setActiveBank(acc.accountNumber);
                        const params = new URLSearchParams();
                        params.set("totalAccounts", String(totalResults));
                        Object.entries(currencyTotals).forEach(([cur, { current, available }]) => {
                          params.set(`${cur}_cur`, String(current));
                          params.set(`${cur}_avail`, String(available));
                        });
                        router.push(`/transactions?${params}`);
                      }}
                    >
                      <td className="px-4 py-3">
                        <p className="font-bold text-white text-xs">{acc.accountName}</p>
                        {acc.lastUpdateMessage && (
                          <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,100,100,0.65)" }}>
                            {acc.lastUpdateMessage}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
                          {acc.accountNumber}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded"
                          style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
                        >
                          {acc.currency}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-bold text-white text-xs">
                          {formatBalance(acc.currentBalance, acc.currency)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-bold text-xs" style={{ color: accentColor }}>
                          {formatBalance(acc.availableBalance, acc.currency)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: isActive ? "#13ec5b" : "#94a3b8", display: "inline-block" }}
                          />
                          <span className="text-[10px] font-bold" style={{ color: isActive ? "#13ec5b" : "#94a3b8" }}>
                            {isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!seeAll && totalResults > accounts.length && (
        <motion.button
          className="mt-6 w-fit flex items-center justify-center mx-auto p-4 bg-white/10 rounded-lg text-white font-bold text-sm"
          whileTap={{ scale: 0.98 }}
          onClick={() => setSize((prev) => prev + 20)}
          whileHover={{ scale: 1.02, boxShadow: "0 0 30px #13ec5b" }}
        >
          Load More
        </motion.button>
      )}
    </div>
  );
}
