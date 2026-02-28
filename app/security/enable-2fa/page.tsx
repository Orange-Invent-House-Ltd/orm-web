"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Shield, ChevronRight, Copy, Check, ArrowRight, Clock, AlertTriangle } from "lucide-react";
import { useTimerStore } from "../../../store/timerStore";

const FIFTEEN_MINUTES = 15 * 60 * 1000;
const TEN_MINUTES     = 10 * 60 * 1000;
const TWO_MINUTES     =  2 * 60 * 1000;

const formatTime = (ms: number) => {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export default function TwoFASetupPage() {
  const [copied, setCopied]           = useState(false);
  const [qrCode, setQrCode]           = useState("");
  const [secret, setSecret]           = useState("");
  const [countdownMs, setCountdownMs] = useState(TEN_MINUTES);
  const [sessionMs,   setSessionMs]   = useState(FIFTEEN_MINUTES);

  const router = useRouter();
  const { startTime, countdownStartTime, setStartTime, setCountdownStartTime } = useTimerStore();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setQrCode(localStorage.getItem("qrCode") ?? "");
      setSecret(localStorage.getItem("2faSecret") ?? "");
    }

    const now = Date.now();

    // Start 15-min session clock once
    if (!startTime) setStartTime(now);

    // Start 10-min countdown clock once — persists across pages
    if (!countdownStartTime) setCountdownStartTime(now);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── 10-min countdown: based on store so it survives navigation ──────────
  useEffect(() => {
    if (!countdownStartTime) return;
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
      if (left === 0) { clearInterval(id); router.replace("/login"); }
    }, 1000);
    return () => clearInterval(id);
  }, [startTime, router]);

  const isUrgent      = countdownMs <= TWO_MINUTES;
  const displaySecret = secret.match(/.{1,4}/g)?.join(" - ") ?? secret;
  const qrDataUri     = `data:image/png;base64,${qrCode}`;

  const handleCopy = useCallback(async () => {
    try { await navigator.clipboard.writeText(secret); }
    catch {
      const el = document.createElement("textarea");
      el.value = secret; document.body.appendChild(el);
      el.select(); document.execCommand("copy"); document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [secret]);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center overflow-x-hidden bg-[#102216] px-4 py-12 font-[Inter,sans-serif]">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#13ec5b]/10 blur-[120px]" />
      </div>

      <div className="relative z-10 flex w-full max-w-[700px] flex-col items-center text-center">

        {/* ── Timer banner — green, turns red when urgent ── */}
        <div className={`mb-6 flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors duration-500 ${
          isUrgent
            ? "border-red-500/30 bg-red-500/10 text-red-400"
            : "border-[#13ec5b]/30 bg-[#13ec5b]/10 text-[#13ec5b]"
        }`}>
          {isUrgent
            ? <AlertTriangle className="h-4 w-4 shrink-0" />
            : <Clock className="h-4 w-4 shrink-0" />}
          <span>
            Complete setup within{" "}
            <strong className={`tabular-nums ${isUrgent ? "text-red-300" : "text-[#13ec5b]"}`}>
              {formatTime(countdownMs)}
            </strong>
            {/* {" "}— session expires in{" "}
            <strong className={`tabular-nums ${isUrgent ? "text-red-300" : "text-[#13ec5b]"}`}>
              {formatTime(sessionMs)}
            </strong>. */}
          </span>
        </div>

        {/* Breadcrumbs */}
        <div className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-400">
          <a href="#" className="transition-colors hover:text-[#13ec5b]">Security</a>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-100">2FA Setup</span>
        </div>

        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#13ec5b]/10 text-[#13ec5b]">
          <Shield className="h-8 w-8" />
        </div>

        <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight text-white">
          Enable Two-Factor Authentication
        </h1>
        <p className="mb-10 max-w-md text-lg leading-relaxed text-slate-400">
          Scan the QR code below with your preferred authenticator app to secure your account.
        </p>

        {/* QR Card */}
        <div className="relative mb-8 w-full overflow-hidden rounded-3xl border border-[#13ec5b]/10 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-sm">
          <div className="pointer-events-none absolute inset-0 opacity-20"
            style={{ background: "linear-gradient(135deg, rgba(19,236,91,0.1) 0%, rgba(16,34,22,1) 100%)" }} />
          <div className="relative z-10 flex flex-col items-center">
            <div className="shadow-[0_0_30px_rgba(19,236,91,0.2)]">
              <img src={qrDataUri} alt="2FA QR Code" width={250} height={250} className="block" />
            </div>
            <div className="my-8 flex w-full items-center gap-4">
              <div className="h-px grow bg-slate-800" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Or enter manually</span>
              <div className="h-px grow bg-slate-800" />
            </div>
            <div className="w-full">
              <p className="mb-3 pl-1 text-left text-sm text-slate-400">Secret Key</p>
              <div className="group flex items-center justify-between rounded-xl border border-slate-700 bg-[#102216] px-4 py-3.5 transition-all hover:border-[#13ec5b]/50">
                <code className="break-all font-mono text-base tracking-wider text-[#13ec5b]">{displaySecret}</code>
                <button onClick={handleCopy}
                  className="ml-4 flex shrink-0 items-center gap-2 text-slate-400 transition-colors hover:text-[#13ec5b]"
                  title="Copy secret key">
                  {copied ? <Check className="h-5 w-5 text-[#13ec5b]" /> : <Copy className="h-5 w-5" />}
                  <span className="text-sm">{copied ? "Copied!" : "Copy"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-4 sm:flex-row">
          <button onClick={() => router.back()}
            className="flex-1 rounded-xl border border-slate-700 px-8 py-4 font-bold text-slate-300 transition-all hover:bg-slate-800">
            Cancel
          </button>
          <button onClick={() => router.push("/security/verify")}
            className="flex-[2] flex items-center justify-center gap-2 rounded-xl bg-[#13ec5b] px-8 py-4 font-bold text-[#102216] shadow-lg shadow-[#13ec5b]/20 transition-all hover:bg-[#13ec5b]/90 active:scale-[0.98]">
            Continue <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}