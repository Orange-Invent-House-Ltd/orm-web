'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Shield, ArrowRight, LogIn, RefreshCw } from 'lucide-react'
import { gsap } from 'gsap'

export default function OTPPage() {
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(48)
  const refs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ringRef.current) {
      gsap.to(ringRef.current, {
        rotation: 360,
        duration: 12,
        repeat: -1,
        ease: 'none',
      })
    }
    const timer = setInterval(() => setCountdown((c) => (c > 0 ? c - 1 : 0)), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return
    const next = [...digits]
    next[i] = val
    setDigits(next)
    if (val && i < 5) refs.current[i + 1]?.focus()
  }

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1]?.focus()
  }

  const handleVerify = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1100))
    router.push('/dashboard')
  }

  const allFilled = digits.every((d) => d !== '')

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: '#102216',
        backgroundImage:
          'radial-gradient(at 5% 5%, rgba(19,236,91,0.07) 0px, transparent 50%), radial-gradient(at 95% 95%, rgba(19,236,91,0.05) 0px, transparent 50%)',
      }}
    >
      <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        {/* bg glow */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ zIndex: 0 }}
        >
          <div
            className="w-[700px] h-[700px] rounded-full"
            style={{ backgroundColor: 'rgba(19,236,91,0.04)', filter: 'blur(120px)' }}
          />
        </div>

        {/* Spinning decorative ring */}
        <div
          ref={ringRef}
          className="absolute pointer-events-none"
          style={{
            width: 600,
            height: 600,
            border: '1px solid rgba(19,236,91,0.06)',
            borderRadius: '50%',
            borderTopColor: 'rgba(19,236,91,0.15)',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[480px] z-10"
        >
          <div
            className="rounded-3xl p-10 relative overflow-hidden"
            style={{
              background: 'rgba(13,22,16,0.55)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: '0 0 40px rgba(19,236,91,0.1)',
            }}
          >
            {/* top accent line */}
            <div
              className="absolute top-0 left-0 w-full h-[2px]"
              style={{ background: 'linear-gradient(to right, transparent, rgba(19,236,91,0.5), transparent)' }}
            />

            {/* Icon */}
            <div className="text-center mb-10">
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 relative"
                style={{ backgroundColor: 'rgba(19,236,91,0.1)', border: '1px solid rgba(19,236,91,0.2)' }}
                animate={{
                  boxShadow: [
                    '0 0 0px rgba(19,236,91,0)',
                    '0 0 28px rgba(19,236,91,0.35)',
                    '0 0 0px rgba(19,236,91,0)',
                  ],
                }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Shield size={30} style={{ color: '#13ec5b' }} />
                <div
                  className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 animate-pulse"
                  style={{ backgroundColor: '#13ec5b', borderColor: '#0d1610' }}
                />
              </motion.div>
              <h1 className="text-white text-3xl font-bold tracking-tight mb-3">Enter Verification Code</h1>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(148,163,184,1)' }}>
                Secure your financial portal access. Enter the 6-digit code sent to
                <br />
                <span className="font-semibold" style={{ color: '#13ec5b' }}>
                  user@example.com
                </span>
              </p>
            </div>

            {/* OTP boxes */}
            <div className="flex justify-between gap-2 mb-10">
              {digits.map((d, i) => (
                <motion.input
                  key={i}
                  ref={(el) => { refs.current[i] = el }}
                  value={d}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  maxLength={1}
                  className="w-full h-14 rounded-2xl text-center text-2xl font-bold text-white focus:outline-none transition-all"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: d ? '2px solid #13ec5b' : '2px solid rgba(255,255,255,0.1)',
                    boxShadow: d ? '0 0 16px rgba(19,236,91,0.35)' : 'none',
                  }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.07, duration: 0.35 }}
                />
              ))}
            </div>

            {/* Verify button */}
            <motion.button
              onClick={handleVerify}
              disabled={loading || !allFilled}
              className="w-full font-bold text-lg h-14 rounded-xl flex items-center justify-center gap-2 transition-all"
              style={{
                backgroundColor: allFilled ? '#13ec5b' : 'rgba(19,236,91,0.25)',
                color: allFilled ? '#102216' : 'rgba(255,255,255,0.4)',
                boxShadow: allFilled ? '0 0 28px rgba(19,236,91,0.35)' : 'none',
                cursor: !allFilled ? 'not-allowed' : 'pointer',
              }}
              whileHover={allFilled ? { scale: 1.01 } : {}}
              whileTap={allFilled ? { scale: 0.98 } : {}}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <RefreshCw size={18} className="animate-spin" /> Verifying...
                </span>
              ) : (
                <>
                  Verify Identity <ArrowRight size={20} />
                </>
              )}
            </motion.button>

            <div className="mt-6 flex flex-col items-center gap-4">
              <p className="text-sm" style={{ color: 'rgba(148,163,184,0.8)' }}>
                Didn't receive a code?{' '}
                {countdown > 0 ? (
                  <span style={{ color: 'rgba(19,236,91,0.6)' }}>Resend in 0:{String(countdown).padStart(2, '0')}</span>
                ) : (
                  <button className="font-semibold underline" style={{ color: '#13ec5b' }}>
                    Resend Code
                  </button>
                )}
              </p>

              <div className="flex items-center gap-4 w-full">
                <div className="h-px flex-1" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} />
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(100,116,139,0.8)' }}>
                  Options
                </span>
                <div className="h-px flex-1" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} />
              </div>

              <button
                onClick={() => router.push('/login')}
                className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
                style={{ color: 'rgba(148,163,184,0.7)' }}
              >
                <LogIn size={15} /> Back to Login
              </button>
            </div>
          </div>

        
        </motion.div>
      </main>

      {/* Footer bar */}
      <footer
        className="w-full py-4 px-8 flex justify-between items-center"
        style={{ borderTop: '1px solid rgba(19,236,91,0.05)', backgroundColor: 'rgba(16,34,22,0.8)' }}
      >
        <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-wider" style={{ color: 'rgba(100,116,139,0.8)' }}>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#13ec5b' }} />
            System Operational
          </div>
          <span style={{ color: 'rgba(255,255,255,0.1)' }}>|</span>
          <span>Node: NG-LAG-01</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-wider" style={{ color: 'rgba(100,116,139,0.8)' }}>
          <span>Lat: 18ms</span>
          <span style={{ color: 'rgba(255,255,255,0.1)' }}>|</span>
          <span>ID: VER-8842-XKB</span>
        </div>
      </footer>
    </div>
  )
}
