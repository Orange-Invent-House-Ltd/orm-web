import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface BankSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectBank: (bank: { label: string; icon: string; value: string }) => void
}

export default function BankSelectionModal({ isOpen, onClose, onSelectBank }: BankSelectionModalProps) {
  const banks = [
    {
      label: 'Zenith Bank',
      icon: '🏦',
      value: 'zenith'
    },
    {
      label: 'UBA',
      icon: '🏛️',
      value: 'uba'
    },
    {
      label: 'Premium Trust Bank',
      icon: '🏦',
      value: 'ptb'
    },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="fixed top-1/4 md:left-1/3 l-0 md:-translate-x-1/3 w-full max-w-md z-50"
            style={{
              backgroundColor: '#0d1a11',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '1.5rem',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
              <h2 className="text-xl font-bold text-white">Select Bank</h2>
              {/* <button
                onClick={onClose}
                className="p-2 rounded-lg transition-colors hover:bg-white/5"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                <X size={20} />
              </button> */}
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Select a bank to view transactions
              </p>

              {/* Bank List */}
              <div className="space-y-2">
                {banks.map((bank) => (
                  <motion.button
                    key={bank.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onSelectBank(bank)
                      onClose()
                    }}
                    className="w-full flex items-center gap-4 p-4 rounded-xl transition-all"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.07)',
                    }}
                  >
                    <span className="text-2xl">{bank.icon}</span>
                    <div className="flex-1 text-left">
                      <p className="text-white font-medium">{bank.label}</p>
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        Click to view transactions
                      </p>
                    </div>
                    <span className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      →
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}