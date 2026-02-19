'use client'

import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Lock, User, ArrowRight, Shield } from 'lucide-react'
import { gsap } from 'gsap'
import logo from '../../assets/logo.png'
import Image from 'next/image'

interface LoginForm {
  username: string
  password: string
  remember: boolean
}

export default function LoginPage() {
  const [showPw, setShowPw] = useState(false)
  const router = useRouter()
  const glowRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>()

  useEffect(() => {
    if (!glowRef.current) return
    gsap.to(glowRef.current, {
      scale: 1.15,
      opacity: 0.08,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
  }, [])

  const onSubmit = async () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, { scale: 0.98, duration: 0.1, yoyo: true, repeat: 1 })
    }
    await new Promise((r) => setTimeout(r, 900))
    router.push('/dashboard')
  }

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'radial-gradient(circle at top right, #1a3c26, #102216 40%, #080f0a 100%)' }}
    >
      {/* Animated glow orbs */}
      <div
        ref={glowRef}
        className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ backgroundColor: 'rgba(19,236,91,0.06)', filter: 'blur(120px)' }}
      />
      <div
        className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ backgroundColor: 'rgba(19,236,91,0.04)', filter: 'blur(100px)' }}
      />

      {/* Top bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute top-0 w-full px-8 py-6 flex justify-between items-center z-10"
      >
        <div className="flex items-center gap-3">
          <Image
            src={logo}
            alt="FinancePro Logo"
            width={35}
            height={35}
          />
          <span className="text-white font-bold tracking-tight text-lg">Kaduna Banks Monitoring Platform</span>
        </div>
        {/* <div className="flex items-center gap-6">
          <a href="#" className="text-sm font-medium transition-colors" style={{ color: 'rgba(255,255,255,0.6)' }}>
            System Status
          </a>
          <button
            className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-all hover:opacity-80"
            style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            Contact Support
          </button>
        </div> */}
      </motion.div>

      {/* Card */}
      <motion.main
        ref={cardRef}
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="relative z-10 w-full max-w-[540px] px-6"
      >
        <div
          className="rounded-xl p-8 shadow-2xl"
          style={{
            background: 'rgba(16,34,22,0.65)',
            backdropFilter: 'blur(14px)',
            border: '1px solid rgba(19,236,91,0.12)',
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
              style={{ backgroundColor: 'rgba(19,236,91,0.1)' }}
              animate={{ boxShadow: ['0 0 0px rgba(19,236,91,0)', '0 0 24px rgba(19,236,91,0.35)', '0 0 0px rgba(19,236,91,0)'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Lock size={22} style={{ color: '#13ec5b' }} />
            </motion.div>
            <h1 className="text-white text-2xl font-bold tracking-tight">Authorized Personnel</h1>
            <p className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Secure Gateway • Kaduna Monitoring Platform
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Username */}
            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2 ml-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
                Username
              </label>
              <div className="relative">
                <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }} />
                <input
                  {...register('username', { required: true })}
                  placeholder="Enter your ID"
                  className="w-full rounded-lg py-3.5 pl-11 pr-4 text-white text-sm placeholder:text-white/20 focus:outline-none transition-all"
                  style={{
                    backgroundColor: 'rgba(16,34,22,0.5)',
                    border: errors.username ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#13ec5b')}
                  onBlur={(e) => (e.target.style.borderColor = errors.username ? '#ef4444' : 'rgba(255,255,255,0.1)')}
                />
              </div>
              {errors.username && <p className="text-red-400 text-xs mt-1 ml-1">Username is required</p>}
            </motion.div>

            {/* Password */}
            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.32 }}>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  Password
                </label>
                <a href="#" className="text-xs font-medium" style={{ color: 'rgba(19,236,91,0.8)' }}>
                  Reset Access
                </a>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }} />
                <input
                  {...register('password', { required: true })}
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full rounded-lg py-3.5 pl-11 pr-12 text-white text-sm placeholder:text-white/20 focus:outline-none transition-all"
                  style={{
                    backgroundColor: 'rgba(16,34,22,0.5)',
                    border: errors.password ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#13ec5b')}
                  onBlur={(e) => (e.target.style.borderColor = errors.password ? '#ef4444' : 'rgba(255,255,255,0.1)')}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors hover:opacity-80"
                  style={{ color: 'rgba(255,255,255,0.3)' }}
                >
                  {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1 ml-1">Password is required</p>}
            </motion.div>

            {/* Remember */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.38 }}
              className="flex items-center gap-2 pt-1"
            >
              <input
                {...register('remember')}
                id="remember"
                type="checkbox"
                className="w-4 h-4 rounded cursor-pointer"
                style={{ accentColor: '#13ec5b' }}
              />
              <label htmlFor="remember" className="text-sm cursor-pointer select-none" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Remember this workstation for 24 hours
              </label>
            </motion.div>

            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="w-full font-bold py-4 rounded-lg flex items-center justify-center gap-2 mt-2 transition-all"
              style={{
                backgroundColor: '#13ec5b',
                color: '#102216',
                boxShadow: '0 4px 20px rgba(19,236,91,0.28)',
                opacity: isSubmitting ? 0.7 : 1,
              }}
              whileHover={{ scale: 1.01, boxShadow: '0 4px 32px rgba(19,236,91,0.45)' }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.44 }}
            >
              <AnimatePresence mode="wait">
                {isSubmitting ? (
                  <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    Authenticating...
                  </motion.span>
                ) : (
                  <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    LOGIN TO DASHBOARD
                    <ArrowRight size={18} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </form>

          <div className="mt-8 pt-6 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <p className="text-xs leading-relaxed italic" style={{ color: 'rgba(255,255,255,0.35)' }}>
              By logging in, you acknowledge that all sessions are monitored and recorded. Multi-factor authentication required for external access.
            </p>
          </div>
        </div>

      
      </motion.main>

      <div
        className="fixed bottom-0 left-0 w-full h-px pointer-events-none"
        style={{ background: 'linear-gradient(to right, transparent, rgba(19,236,91,0.25), transparent)' }}
      />
    </div>
  )
}
