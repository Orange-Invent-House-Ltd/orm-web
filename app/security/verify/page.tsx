"use client";

import {
  useRef, useState, useEffect, useCallback,
  FormEvent, KeyboardEvent, ClipboardEvent, ChangeEvent,
} from "react";
import { useRouter } from "next/navigation";
import {
  LockOpen, ShieldCheck, CheckCircle2,
  AlertCircle, Loader2, Clock, AlertTriangle,
} from "lucide-react";
import { useTimerStore } from "../../../store/timerStore";
import { useVerify2fa } from "@/api/mutation";

type Status = null | "loading" | "error" | "success";
const CODE_LENGTH     = 6;
const FIFTEEN_MINUTES = 15 * 60 * 1000;
const TEN_MINUTES     = 10 * 60 * 1000;
const TWO_MINUTES     =  2 * 60 * 1000;

const formatTime = (ms: number) => {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export default function TwoFAVerifyPage() {
  const [digits, setDigits]           = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [status, setStatus]           = useState<Status>(null);
  const [countdownMs, setCountdownMs] = useState(TEN_MINUTES);
  const [sessionMs,   setSessionMs]   = useState(FIFTEEN_MINUTES);
  const inputsRef                     = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const [sessionId, setSessionId] = useState("");
  const {mutate, isPending} = useVerify2fa();
  

   useEffect(() => {
    if (typeof window !== "undefined") {
      setSessionId(localStorage.getItem("sessionId") ?? "");
    }
   }, []); 
  // 
  const {
    startTime, countdownStartTime,
    setStartTime, setCountdownStartTime, clearTimer,
  } = useTimerStore();

  useEffect(() => { inputsRef.current[0]?.focus(); }, []);

  useEffect(() => {
    const now = Date.now();
    // If navigated directly (no prior store values), seed both clocks
    if (!startTime)          setStartTime(now);
    if (!countdownStartTime) setCountdownStartTime(now);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── 10-min countdown: continues from where it left off ──────────────────
  useEffect(() => {
    if (!countdownStartTime) return;
    // Initialise immediately so there's no flicker on mount
    setCountdownMs(Math.max(0, TEN_MINUTES - (Date.now() - countdownStartTime)));

    const id = setInterval(() => {
      setCountdownMs(Math.max(0, TEN_MINUTES - (Date.now() - countdownStartTime)));
    }, 1000);
    return () => clearInterval(id);
  }, [countdownStartTime]);

  // ── 15-min session: redirect to login at 0 ──────────────────────────────
  useEffect(() => {
    if (!startTime) return;
    const id = setInterval(() => {
      const left = Math.max(0, FIFTEEN_MINUTES - (Date.now() - startTime));
      setSessionMs(left);
      if (left === 0) { clearInterval(id); clearTimer(); router.replace("/login"); }
    }, 1000);
    return () => clearInterval(id);
  }, [startTime, router, clearTimer]);

  const isUrgent = countdownMs <= TWO_MINUTES;

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value.replace(/\D/g, "").slice(-1);
    const updated = [...digits]; updated[index] = val; setDigits(updated);
    if (val && index < CODE_LENGTH - 1) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !digits[index] && index > 0)
      inputsRef.current[index - 1]?.focus();
  };

  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
    if (!pasted) return;
    const updated = Array(CODE_LENGTH).fill("");
    pasted.split("").forEach((char, i) => (updated[i] = char));
    setDigits(updated);
    inputsRef.current[Math.min(pasted.length, CODE_LENGTH - 1)]?.focus();
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    const code = digits.join("");
    if (code.length < CODE_LENGTH) return;
    mutate({ otp:code, sessionId },
      {
        onSuccess: () => {
          localStorage.removeItem("sessionId");
      clearTimer();
          router.push("/dashboard");
        },
        onError: () => {
        },
      });
    
    
  }


  const inputBase = "w-10 h-14 sm:w-14 sm:h-20 text-center text-2xl font-bold rounded-xl border-2 bg-transparent transition-all outline-none caret-transparent";
  const inputClass = (i: number): string => {
    if (status === "error")   return `${inputBase} border-red-500/70 text-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/20`;
    if (status === "success") return `${inputBase} border-[#13ec92] text-[#13ec92]`;
    return `${inputBase} border-slate-200 dark:border-[#13ec92]/20 text-slate-900 dark:text-slate-100 focus:border-[#13ec92] focus:ring-4 focus:ring-[#13ec92]/20`;
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#f6f8f7] dark:bg-[#10221a] font-[Inter,sans-serif] text-slate-900 dark:text-slate-100 antialiased">
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#13ec92]/10 blur-[120px]" />
      </div>

      <main className="relative z-10 flex flex-1 min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl space-y-4">

          {/* ── Timer banner — green, turns red when urgent ── */}
          <div className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors duration-500 ${
            isUrgent
              ? "border-red-500/30 bg-red-500/10 text-red-400"
              : "border-[#13ec92]/30 bg-[#13ec92]/10 text-[#13ec92]"
          }`}>
            {isUrgent
              ? <AlertTriangle className="h-4 w-4 shrink-0" />
              : <Clock className="h-4 w-4 shrink-0" />}
            <span>
              Enter your code within{" "}
              <strong className={`tabular-nums ${isUrgent ? "text-red-300" : "text-[#13ec92]"}`}>
                {formatTime(countdownMs)}
              </strong>
              {/* {" "}— session expires in{" "}
              <strong className={`tabular-nums ${isUrgent ? "text-red-300" : "text-[#13ec92]"}`}>
                {formatTime(sessionMs)}
              </strong>. */}
            </span>
          </div>

          {/* ── Main card ── */}
          <div className="rounded-2xl border border-slate-200 dark:border-[#13ec92]/10 bg-white dark:bg-[#13ec92]/5 p-8 shadow-2xl lg:p-12">
            <div className="mb-10 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#13ec92]/10 text-[#13ec92]">
                {status === "success" ? <ShieldCheck className="h-8 w-8" /> : <LockOpen className="h-8 w-8" />}
              </div>
              <h1 className="mb-3 text-3xl font-bold">Enter 6-Digit Code</h1>
              <p className="mx-auto max-w-sm text-slate-500 dark:text-slate-400">
                Please enter the 6-digit security code generated by your mobile authenticator app.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-3 sm:gap-4" onPaste={handlePaste}>
                  <div className="flex gap-2 sm:gap-3">
                    {[0, 1, 2].map((i) => (
                      <input key={i} ref={(el) => { inputsRef.current[i] = el; }}
                        type="text" inputMode="numeric" maxLength={1}
                        value={digits[i]} placeholder="0"
                        disabled={status === "loading" || status === "success"}
                        className={inputClass(i)}
                        onChange={(e) => handleChange(e, i)}
                        onKeyDown={(e) => handleKeyDown(e, i)} />
                    ))}
                  </div>
                  <div className="h-[2px] w-4 rounded-full bg-slate-300 dark:bg-[#13ec92]/40" />
                  <div className="flex gap-2 sm:gap-3">
                    {[3, 4, 5].map((i) => (
                      <input key={i} ref={(el) => { inputsRef.current[i] = el; }}
                        type="text" inputMode="numeric" maxLength={1}
                        value={digits[i]} placeholder="0"
                        disabled={status === "loading" || status === "success"}
                        className={inputClass(i)}
                        onChange={(e) => handleChange(e, i)}
                        onKeyDown={(e) => handleKeyDown(e, i)} />
                    ))}
                  </div>
                </div>

                {status === "error" && (
                  <p className="flex items-center gap-1.5 text-sm font-medium text-red-400">
                    <AlertCircle className="h-4 w-4" /> Incorrect code. Please try again.
                  </p>
                )}
                {status === "success" && (
                  <p className="flex items-center gap-1.5 text-sm font-medium text-[#13ec92]">
                    <CheckCircle2 className="h-4 w-4" /> Verified! Redirecting…
                  </p>
                )}
              </div>

              <button type="submit"
                disabled={ isPending}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#13ec92] text-lg font-bold text-[#10221a] shadow-lg shadow-[#13ec92]/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50">
                {isPending ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> Verifying…</>
                ) : (
                  <><span>Verify</span><ShieldCheck className="h-5 w-5" /></>
                )}
              </button>
            </form>
            <div className="flex justify-center items-center mt-3 font-serif">
            <button onClick={() => router.push("/login")} className="underline">
              Back to login
              </button>
              </div>
          </div>
        </div>
      </main>
    </div>
  );
}