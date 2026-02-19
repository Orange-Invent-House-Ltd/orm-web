export type Currency = 'NGN' | 'USD' | 'EUR'

export interface Account {
  id: string
  type: string
  number: string
  currency: Currency
  balance: number
  lastSync: string
  syncStatus: 'live' | 'synced' | 'pending'
  change: number
}

export interface Bank {
  id: string
  name: string
  initial: string
  color: string
  totalNGN: number
  totalUSD: number
  totalEUR: number
  accounts: Account[]
}

export interface Transaction {
  id: string
  bankId: string
  bankName: string
  bankColor: string
  accountNumber: string
  date: string
  time: string
  description: string
  category: string
  reference: string
  amount: number
  currency: Currency
  status: 'completed' | 'pending' | 'failed'
  merchant: string
  location?: string
  flagged?: boolean
}

export const BANKS: Bank[] = [
  {
    id: 'zenith',
    name: 'Zenith Bank',
    initial: 'Z',
    color: '#13ec5b',
    totalNGN: 142500000,
    totalUSD: 170400.50,
    totalEUR: 8200.00,
    accounts: [
      { id: 'z1', type: 'Checking Account', number: '**** 1234', currency: 'NGN', balance: 142500000, lastSync: '2 mins ago', syncStatus: 'live', change: 1.2 },
      { id: 'z2', type: 'Savings Account', number: '**** 5678', currency: 'USD', balance: 45000.50, lastSync: '2 mins ago', syncStatus: 'live', change: 2.1 },
      { id: 'z3', type: 'Business Operating', number: '**** 9012', currency: 'EUR', balance: 8200.00, lastSync: '5 mins ago', syncStatus: 'pending', change: -0.3 },
      { id: 'z4', type: 'Investment Portfolio', number: '**** 3456', currency: 'USD', balance: 125400.00, lastSync: '1 hour ago', syncStatus: 'synced', change: 3.4 },
    ],
  },
  {
    id: 'usna',
    name: 'USNA',
    initial: 'U',
    color: '#60a5fa',
    totalNGN: 54000000,
    totalUSD: 28500.00,
    totalEUR: 18000.00,
    accounts: [
      { id: 'u1', type: 'Current Account', number: '**** 2211', currency: 'USD', balance: 28500.00, lastSync: '3 mins ago', syncStatus: 'live', change: 0.8 },
      { id: 'u2', type: 'Savings Account', number: '**** 3390', currency: 'NGN', balance: 54000000, lastSync: '3 mins ago', syncStatus: 'live', change: 1.5 },
      { id: 'u3', type: 'Fixed Deposit', number: '**** 4410', currency: 'EUR', balance: 18000.00, lastSync: '10 mins ago', syncStatus: 'synced', change: 0.0 },
    ],
  },
  {
    id: 'gtbank',
    name: 'GTBank',
    initial: 'G',
    color: '#f59e0b',
    totalNGN: 32100000,
    totalUSD: 12840.00,
    totalEUR: 16180.00,
    accounts: [
      { id: 'g1', type: 'Personal Account', number: '**** 7788', currency: 'NGN', balance: 32100000, lastSync: '1 min ago', syncStatus: 'live', change: 0.4 },
      { id: 'g2', type: 'Dollar Account', number: '**** 8890', currency: 'USD', balance: 12840.00, lastSync: '1 min ago', syncStatus: 'live', change: -0.1 },
      { id: 'g3', type: 'Euro Account', number: '**** 9921', currency: 'EUR', balance: 16180.00, lastSync: '15 mins ago', syncStatus: 'synced', change: 0.6 },
    ],
  },
]

export const TRANSACTIONS: Transaction[] = [
  { id: 'T001', bankId: 'zenith', bankName: 'Zenith Bank', bankColor: '#13ec5b', accountNumber: '**** 9012', date: 'Oct 24, 2023', time: '09:14 AM', description: 'Cloud Services Subscription', category: 'Technology', reference: '#TRX-9482-B2', amount: -1200.00, currency: 'USD', status: 'completed', merchant: 'Amazon Web Services', location: 'Virginia, USA' },
  { id: 'T002', bankId: 'zenith', bankName: 'Zenith Bank', bankColor: '#13ec5b', accountNumber: '**** 1234', date: 'Oct 23, 2023', time: '04:45 PM', description: 'Merchant Settlement', category: 'Payment', reference: '#TRX-2105-X9', amount: 15400.00, currency: 'USD', status: 'pending', merchant: 'Stripe Payout', location: 'San Francisco, USA' },
  { id: 'T003', bankId: 'usna', bankName: 'USNA', bankColor: '#60a5fa', accountNumber: '**** 2211', date: 'Oct 23, 2023', time: '01:20 PM', description: 'Hardware Purchase', category: 'Equipment', reference: '#TRX-0023-A1', amount: -999.00, currency: 'USD', status: 'completed', merchant: 'Apple Store', location: 'Lagos, Nigeria' },
  { id: 'T004', bankId: 'gtbank', bankName: 'GTBank', bankColor: '#f59e0b', accountNumber: '**** 7788', date: 'Oct 22, 2023', time: '11:05 AM', description: 'Developer Tools Subscription', category: 'Software', reference: '#TRX-7712-C8', amount: -49000, currency: 'NGN', status: 'completed', merchant: 'GitHub Inc.', location: 'Abuja, Nigeria' },
  { id: 'T005', bankId: 'zenith', bankName: 'Zenith Bank', bankColor: '#13ec5b', accountNumber: '**** 9012', date: 'Oct 21, 2023', time: '10:44 AM', description: 'Merchant Reversal', category: 'Refund', reference: '#TRX-REF-552', amount: 250.00, currency: 'USD', status: 'failed', merchant: 'Unknown Merchant', flagged: true, location: 'Reykjavik, Iceland' },
  { id: 'T006', bankId: 'usna', bankName: 'USNA', bankColor: '#60a5fa', accountNumber: '**** 3390', date: 'Oct 20, 2023', time: '08:00 AM', description: 'Office Space Facilities', category: 'Operations', reference: '#TRX-3391-Z4', amount: -4500000, currency: 'NGN', status: 'completed', merchant: 'Workspace Rent', location: 'Lagos, Nigeria' },
  { id: 'T007', bankId: 'gtbank', bankName: 'GTBank', bankColor: '#f59e0b', accountNumber: '**** 8890', date: 'Oct 19, 2023', time: '02:30 PM', description: 'International Wire Transfer', category: 'Transfer', reference: '#TRX-5521-WR', amount: -8000.00, currency: 'USD', status: 'completed', merchant: 'SWIFT Transfer', location: 'London, UK' },
  { id: 'T008', bankId: 'zenith', bankName: 'Zenith Bank', bankColor: '#13ec5b', accountNumber: '**** 5678', date: 'Oct 18, 2023', time: '09:00 AM', description: 'Monthly Salary Credit', category: 'Income', reference: '#TRX-PAY-881', amount: 25000.00, currency: 'USD', status: 'completed', merchant: 'Payroll System', location: 'Lagos, Nigeria' },
  { id: 'T009', bankId: 'usna', bankName: 'USNA', bankColor: '#60a5fa', accountNumber: '**** 4410', date: 'Oct 17, 2023', time: '03:15 PM', description: 'Fixed Deposit Interest', category: 'Income', reference: '#TRX-INT-220', amount: 540.00, currency: 'EUR', status: 'completed', merchant: 'USNA Bank', location: 'Paris, France' },
  { id: 'T010', bankId: 'gtbank', bankName: 'GTBank', bankColor: '#f59e0b', accountNumber: '**** 9921', date: 'Oct 16, 2023', time: '11:45 AM', description: 'EU Supplier Payment', category: 'Vendor', reference: '#TRX-EUR-119', amount: -3200.00, currency: 'EUR', status: 'pending', merchant: 'Eurotech GmbH', location: 'Berlin, Germany' },
]

export const CURRENCY_SYMBOL: Record<Currency, string> = { NGN: '₦', USD: '$', EUR: '€' }

export function formatCurrency(amount: number, currency: Currency): string {
  const sym = CURRENCY_SYMBOL[currency]
  const abs = Math.abs(amount)
  let formatted: string
  if (abs >= 1000000) formatted = `${sym}${(abs / 1000000).toFixed(2)}M`
  else if (abs >= 1000) formatted = `${sym}${abs.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  else formatted = `${sym}${abs.toFixed(2)}`
  return amount < 0 ? `-${formatted}` : `+${formatted}`
}

export const CHART_DATA = [
  { month: 'May', zenith: 162, usna: 72, gtbank: 38 },
  { month: 'Jun', zenith: 185, usna: 82, gtbank: 44 },
  { month: 'Jul', zenith: 210, usna: 91, gtbank: 55 },
  { month: 'Aug', zenith: 195, usna: 105, gtbank: 61 },
  { month: 'Sep', zenith: 230, usna: 98, gtbank: 70 },
  { month: 'Oct', zenith: 248, usna: 115, gtbank: 75 },
  { month: 'Nov', zenith: 280, usna: 128, gtbank: 82 },
]

export const PIE_DATA = [
  { name: 'Zenith Bank', value: 390, color: '#13ec5b' },
  { name: 'USNA', value: 100.5, color: '#60a5fa' },
  { name: 'GTBank', value: 61.1, color: '#f59e0b' },
]
