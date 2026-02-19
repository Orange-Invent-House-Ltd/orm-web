'use client'

import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, CheckCircle2, ArrowLeft, Shield } from 'lucide-react'

interface ChangePasswordForm {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export default function ChangePasswordPage() {
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordForm>()

  const newPw = watch('newPassword', '')

  const getStrength = (pw: string) => {
    let score = 0
    if (pw.length >= 8) score++
    if (/[A-Z]/.test(pw)) score++
    if (/[0-9]/.test(pw)) score++
    if (/[^A-Za-z0-9]/.test(pw)) score++
    return score
  }

  const strength = getStrength(newPw)
  const strengthColors = ['#ef4444', '#f59e0b', '#f59e0b', '#13ec5b', '#13ec5b']
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong']

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 900))
    setSuccess(true)
    setTimeout(() => router.push('/profile'), 2500)
  }

  const inputClass = "w-full rounded-xl py-3 pl-11 pr-12 text-white text-sm focus:outline-none transition-all placeholder:text-white/20"
  const baseStyle = { backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }

  return (
    <div className="p-8 min-h-screen flex items-start" style={{ backgroundColor: '#0d1a11' }}>
      <div className="w-full max-w-xl mx-auto">
        {/* Back */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-medium mb-8 transition-opacity hover:opacity-70"
          style={{ color: 'rgba(255,255,255,0.5)' }}
        >
          <ArrowLeft size={15} /> Back to Profile
        </motion.button>

        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl p-10 text-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ backgroundColor: 'rgba(19,236,91,0.15)' }}
            >
              <CheckCircle2 size={32} style={{ color: '#13ec5b' }} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Password Updated!</h2>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Your password has been changed successfully. Redirecting...
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl p-8"
            style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'rgba(19,236,91,0.12)', border: '1px solid rgba(19,236,91,0.2)' }}
              >
                <Shield size={22} style={{ color: '#13ec5b' }} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Change Password</h1>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Keep your account secure</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Current password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 ml-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Current Password
                </label>
                <div className="relative">
                  <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }} />
                  <input
                    {...register('currentPassword', { required: 'Current password is required' })}
                    type={showCurrent ? 'text' : 'password'}
                    placeholder="Enter current password"
                    className={inputClass}
                    style={{ ...baseStyle, borderColor: errors.currentPassword ? '#ef4444' : 'rgba(255,255,255,0.09)' }}
                  />
                  <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.currentPassword && <p className="text-red-400 text-xs mt-1 ml-1">{errors.currentPassword.message}</p>}
              </div>

              {/* New password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 ml-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  New Password
                </label>
                <div className="relative">
                  <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }} />
                  <input
                    {...register('newPassword', { required: 'New password is required', minLength: { value: 8, message: 'Minimum 8 characters' } })}
                    type={showNew ? 'text' : 'password'}
                    placeholder="Enter new password"
                    className={inputClass}
                    style={{ ...baseStyle, borderColor: errors.newPassword ? '#ef4444' : 'rgba(255,255,255,0.09)' }}
                  />
                  <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.newPassword && <p className="text-red-400 text-xs mt-1 ml-1">{errors.newPassword.message}</p>}

                {/* Strength bar */}
                {newPw && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 px-1">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="h-1 flex-1 rounded-full transition-all"
                          style={{ backgroundColor: strength >= i ? strengthColors[strength] : 'rgba(255,255,255,0.1)' }}
                        />
                      ))}
                    </div>
                    <p className="text-xs" style={{ color: strengthColors[strength] }}>
                      {strengthLabels[strength]}
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 ml-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }} />
                  <input
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (val) => val === newPw || 'Passwords do not match',
                    })}
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    className={inputClass}
                    style={{ ...baseStyle, borderColor: errors.confirmPassword ? '#ef4444' : 'rgba(255,255,255,0.09)' }}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-400 text-xs mt-1 ml-1">{errors.confirmPassword.message}</p>}
              </div>

              {/* Requirements */}
              <div
                className="rounded-xl p-4 space-y-2"
                style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Requirements
                </p>
                {[
                  { label: 'Minimum 8 characters', met: newPw.length >= 8 },
                  { label: 'One uppercase letter', met: /[A-Z]/.test(newPw) },
                  { label: 'One number', met: /[0-9]/.test(newPw) },
                  { label: 'One special character', met: /[^A-Za-z0-9]/.test(newPw) },
                ].map((req) => (
                  <div key={req.label} className="flex items-center gap-2 text-xs">
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: req.met ? 'rgba(19,236,91,0.15)' : 'rgba(255,255,255,0.06)' }}
                    >
                      {req.met && <CheckCircle2 size={10} style={{ color: '#13ec5b' }} />}
                    </div>
                    <span style={{ color: req.met ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.35)' }}>{req.label}</span>
                  </div>
                ))}
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl font-bold text-sm transition-all"
                style={{
                  backgroundColor: '#13ec5b',
                  color: '#0b1a0f',
                  opacity: isSubmitting ? 0.7 : 1,
                  boxShadow: '0 4px 20px rgba(19,236,91,0.2)',
                }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? 'Updating Password...' : 'Update Password'}
              </motion.button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  )
}
