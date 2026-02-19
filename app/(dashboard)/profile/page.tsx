'use client'

import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import Link from 'next/link'
import { User, Mail, Phone, Building2, KeyRound, Camera, CheckCircle2 } from 'lucide-react'

interface ProfileForm {
  fullName: string
  email: string
  phone: string
  organization: string
  role: string
}

export default function ProfilePage() {
  const [saved, setSaved] = useState(false)
  const { register, handleSubmit, formState: { isDirty } } = useForm<ProfileForm>({
    defaultValues: {
      fullName: 'Alexander Chen',
      email: 'alex.chen@financepro.com',
      phone: '+234 801 234 5678',
      organization: 'FinancePro Ltd.',
      role: 'Admin',
    },
  })

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 700))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const inputClass = "w-full rounded-xl py-3 px-4 text-white text-sm focus:outline-none transition-all placeholder:text-white/20"
  const inputStyle = { backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }

  return (
    <div className="p-8 min-h-screen" style={{ backgroundColor: '#0d1a11' }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">Profile Settings</h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Manage your account information and preferences</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl p-6 flex flex-col items-center text-center"
          style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="relative mb-4">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-black"
              style={{ backgroundColor: 'rgba(19,236,91,0.15)', color: '#13ec5b', border: '2px solid rgba(19,236,91,0.25)' }}
            >
              AC
            </div>
            <button
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#13ec5b', color: '#0b1a0f' }}
            >
              <Camera size={14} />
            </button>
          </div>
          <h3 className="text-white font-bold text-lg">Alexander Chen</h3>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>alex.chen@financepro.com</p>
          <span
            className="mt-3 px-3 py-1 rounded-full text-xs font-bold uppercase"
            style={{ backgroundColor: 'rgba(19,236,91,0.12)', color: '#13ec5b' }}
          >
            Admin
          </span>

          <div className="mt-6 w-full space-y-2">
            {[
              { label: 'Member Since', value: 'Jan 2022' },
              { label: 'Last Login', value: 'Today, 9:14 AM' },
              { label: 'Sessions', value: '3 Active' },
            ].map((item) => (
              <div
                key={item.label}
                className="flex justify-between text-xs py-2 px-3 rounded-lg"
                style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
              >
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>{item.label}</span>
                <span className="font-semibold text-white">{item.value}</span>
              </div>
            ))}
          </div>

          <Link
            href="/profile/change-password"
            className="w-full mt-5 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-80"
            style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <KeyRound size={14} /> Change Password
          </Link>
        </motion.div>

        {/* Profile form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-2 rounded-2xl p-6"
          style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <h3 className="text-white font-bold text-base mb-6">Personal Information</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 ml-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Full Name
                </label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }} />
                  <input
                    {...register('fullName')}
                    className={inputClass}
                    style={{ ...inputStyle, paddingLeft: '2.25rem' }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 ml-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Role
                </label>
                <input {...register('role')} className={inputClass} style={inputStyle} readOnly />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 ml-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Email Address
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }} />
                <input
                  {...register('email')}
                  type="email"
                  className={inputClass}
                  style={{ ...inputStyle, paddingLeft: '2.25rem' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 ml-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Phone Number
              </label>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }} />
                <input
                  {...register('phone')}
                  className={inputClass}
                  style={{ ...inputStyle, paddingLeft: '2.25rem' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 ml-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Organization
              </label>
              <div className="relative">
                <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }} />
                <input
                  {...register('organization')}
                  className={inputClass}
                  style={{ ...inputStyle, paddingLeft: '2.25rem' }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              {saved && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 text-sm font-semibold"
                  style={{ color: '#13ec5b' }}
                >
                  <CheckCircle2 size={15} /> Changes saved successfully!
                </motion.div>
              )}
              <div className="ml-auto">
                <motion.button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-sm font-bold transition-all"
                  style={{ backgroundColor: '#13ec5b', color: '#0b1a0f' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Save Changes
                </motion.button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Preferences */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mt-6 rounded-2xl p-6"
        style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <h3 className="text-white font-bold text-base mb-5">Notification Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Transaction Alerts', desc: 'Get notified for every transaction', enabled: true },
            { label: 'Security Alerts', desc: 'Unusual activity notifications', enabled: true },
            { label: 'Monthly Reports', desc: 'Automated monthly summaries', enabled: false },
          ].map((pref) => (
            <div
              key={pref.label}
              className="flex items-center justify-between rounded-xl p-4"
              style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div>
                <p className="text-sm font-semibold text-white">{pref.label}</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{pref.desc}</p>
              </div>
              <div
                className="w-10 h-6 rounded-full flex items-center p-1 cursor-pointer transition-all"
                style={{ backgroundColor: pref.enabled ? '#13ec5b' : 'rgba(255,255,255,0.1)', justifyContent: pref.enabled ? 'flex-end' : 'flex-start' }}
              >
                <div className="w-4 h-4 rounded-full bg-white" />
              </div>
            </div>
          ))}
        </div>
      </motion.div> */}
    </div>
  )
}
