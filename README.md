an object


Option 1: Add properties directly in the reduce function
typescript
const aggregatedBalance = Object.keys(balancesByCurrency).reduce((acc, currency) => {
  // Define currency-specific colors and icons
  const currencyConfig = {
    NGN: { color: '#10b981', icon: '₦' },  // Green
    USD: { color: '#60a5fa', icon: '$' },  // Blue
    EUR: { color: '#f59e0b', icon: '€' },  // Orange
    GBP: { color: '#8b5cf6', icon: '£' },  // Purple
    // Add more currencies as needed
  };

  const config = currencyConfig[currency as keyof typeof currencyConfig] || {
    color: '#6b7280',  // Default gray
    icon: currency.charAt(0)  // Default to first character
  };

  acc[currency] = {
    total_currency_balance: parseFloat(
      balancesByCurrency[currency].totalCurrentBalance
    ),
    total_available_balance: parseFloat(
      balancesByCurrency[currency].totalAvailableBalance
    ),
    accountCount: balancesByCurrency[currency].accountCount,
    lastSuccessfulSyncTime:
      balancesByCurrency[currency].lastSuccessfulSyncTime,
    banks: balancesByCurrency[currency].banks || {},
    color: config.color,  // Add color property
    icon: config.icon,    // Add icon property
    label: `${config.icon}${currency}`,  // Optional: add a label
  };
  return acc;
}, {} as Record<string, {
  total_currency_balance: number;
  total_available_balance: number;
  accountCount: number;
  lastSuccessfulSyncTime: string;
  banks: Record<string, number>;
  color: string;  // Add to type
  icon: string;   // Add to type
  label?: string; // Optional label
}>);
<!--  -->
<!--  -->
Option 2: Create a separate mapping function
typescript
// Define currency configuration
const CURRENCY_CONFIG = {
  NGN: { color: '#10b981', icon: '₦', bg: '#10b98115' },
  USD: { color: '#60a5fa', icon: '$', bg: '#60a5fa15' },
  EUR: { color: '#f59e0b', icon: '€', bg: '#f59e0b15' },
  GBP: { color: '#8b5cf6', icon: '£', bg: '#8b5cf615' },
} as const;

// Create aggregated balance
const aggregatedBalance = Object.keys(balancesByCurrency).reduce((acc, currency) => {
  const config = CURRENCY_CONFIG[currency as keyof typeof CURRENCY_CONFIG] || {
    color: '#6b7280',
    icon: currency.charAt(0),
    bg: '#6b728015'
  };

  acc[currency] = {
    total_currency_balance: parseFloat(
      balancesByCurrency[currency].totalCurrentBalance
    ),
    total_available_balance: parseFloat(
      balancesByCurrency[currency].totalAvailableBalance
    ),
    accountCount: balancesByCurrency[currency].accountCount,
    lastSuccessfulSyncTime: balancesByCurrency[currency].lastSuccessfulSyncTime,
    banks: balancesByCurrency[currency].banks || {},
    ...config, // Spread the config to add color, icon, and bg
  };
  return acc;
}, {} as Record<string, {
  total_currency_balance: number;
  total_available_balance: number;
  accountCount: number;
  lastSuccessfulSyncTime: string;
  banks: Record<string, number>;
  color: string;
  icon: string;
  bg: string;
}>);

// Then in your display logic, you can use:
const displayItems = Object.keys(aggregatedBalance).map(currency => {
  const data = aggregatedBalance[currency];
  return {
    label: `Total ${currency}`,
    value: currency === 'NGN' 
      ? `₦${(data.total_currency_balance / 1000000).toFixed(2)}M`
      : `${data.icon}${data.total_currency_balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
    icon: data.icon,
    color: data.color,
    bg: data.bg,
  };
});


underStanding Object.keys Object.entries and all object methods in js and how to use them to manipulate the data and get the desired output and use






....................
const { data: ptb } = useFetchPtbAggregatedBalance();

// This is an array of accounts
const accounts = ptb?.data || [];

const CURRENCY_CONFIG = {
  NGN: { color: '#10b981', icon: '₦', bg: '#10b98115' },
  USD: { color: '#60a5fa', icon: '$', bg: '#60a5fa15' },
  EUR: { color: '#f59e0b', icon: '€', bg: '#f59e0b15' },
  GBP: { color: '#8b5cf6', icon: '£', bg: '#8b5cf615' },
} as const;

// First, group accounts by currency
const balancesByCurrency = accounts.reduce((acc, account) => {
  const currency = account.currency;
  
  if (!acc[currency]) {
    acc[currency] = {
      totalCurrentBalance: 0,
      totalAvailableBalance: 0,
      accountCount: 0,
      lastUpdateStatus: account.lastUpdateStatus,
      banks: {}
    };
  }
  
  // Aggregate the balances
  acc[currency].totalCurrentBalance += parseFloat(account.currentBalance);
  acc[currency].totalAvailableBalance += parseFloat(account.availableBalance);
  acc[currency].accountCount += 1;
  
  // Track banks if needed
  const bankKey = account.bankName;
  if (!acc[currency].banks[bankKey]) {
    acc[currency].banks[bankKey] = 0;
  }
  acc[currency].banks[bankKey] += parseFloat(account.currentBalance);
  
  return acc;
}, {} as Record<string, {
  totalCurrentBalance: number;
  totalAvailableBalance: number;
  accountCount: number;
  lastUpdateStatus: string;
  banks: Record<string, number>;
}>);

// Now create the aggregated balance with colors and icons
const aggregatedBalance = Object.keys(balancesByCurrency).reduce((acc, currency) => {
  const config = CURRENCY_CONFIG[currency as keyof typeof CURRENCY_CONFIG] || {
    color: '#6b7280',
    icon: currency.charAt(0),
    bg: '#6b728015'
  };

  acc[currency] = {
    total_currency_balance: balancesByCurrency[currency].totalCurrentBalance,
    total_available_balance: balancesByCurrency[currency].totalAvailableBalance,
    accountCount: balancesByCurrency[currency].accountCount,
    lastUpdateStatus: balancesByCurrency[currency].lastUpdateStatus,
    banks: balancesByCurrency[currency].banks,
    ...config,
  };
  return acc;
}, {} as Record<string, {
  total_currency_balance: number;
  total_available_balance: number;
  accountCount: number;
  lastUpdateStatus: string;
  banks: Record<string, number>;
  color: string;
  icon: string;
  bg: string;
}>);

console.log(aggregatedBalance);


<!-- more example -->

const { data: ptb } = useFetchPtbAggregatedBalance();
const accounts = ptb?.data || [];

const CURRENCY_CONFIG = {
  NGN: { color: '#10b981', icon: '₦', bg: '#10b98115' },
  USD: { color: '#60a5fa', icon: '$', bg: '#60a5fa15' },
  EUR: { color: '#f59e0b', icon: '€', bg: '#f59e0b15' },
  GBP: { color: '#8b5cf6', icon: '£', bg: '#8b5cf615' },
} as const;

// Group and aggregate in one step
const aggregatedBalance = accounts.reduce((acc, account) => {
  const currency = account.currency;
  const config = CURRENCY_CONFIG[currency as keyof typeof CURRENCY_CONFIG] || {
    color: '#6b7280',
    icon: currency.charAt(0),
    bg: '#6b728015'
  };

  if (!acc[currency]) {
    acc[currency] = {
      total_currency_balance: 0,
      total_available_balance: 0,
      accountCount: 0,
      lastUpdateStatus: account.lastUpdateStatus,
      banks: {},
      ...config
    };
  }

  acc[currency].total_currency_balance += parseFloat(account.currentBalance);
  acc[currency].total_available_balance += parseFloat(account.availableBalance);
  acc[currency].accountCount += 1;
  
  // Track per-bank balances
  const bankKey = account.bankName;
  if (!acc[currency].banks[bankKey]) {
    acc[currency].banks[bankKey] = 0;
  }
  acc[currency].banks[bankKey] += parseFloat(account.currentBalance);

  return acc;
}, {} as Record<string, {
  total_currency_balance: number;
  total_available_balance: number;
  accountCount: number;
  lastUpdateStatus: string;
  banks: Record<string, number>;
  color: string;
  icon: string;
  bg: string;
}>);

console.log(aggregatedBalance);

///function formatBalance(amount: string | number, currency: string): string {
  const num = parseFloat(String(amount))
  const cfg = CURRENCY_CONFIG[currency as keyof typeof CURRENCY_CONFIG]
  const icon = cfg?.icon ?? (currency === 'NGN' ? '₦' : currency.charAt(0))
  
  // Check if it's a whole number (no decimal places)
  if (num % 1 === 0) {
    return `${icon}${num.toLocaleString('en-US')}`
  } else {
    return `${icon}${num.toLocaleString('en-US', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    })}`
  }
}

// Examples:
// formatBalance(4860897891.31, 'NGN')  => "₦4,860,897,891.31"
// formatBalance(45678900, 'NGN')       => "₦45,678,900"
// formatBalance(4567890, 'NGN')        => "₦4,567,890"
// formatBalance(456789, 'NGN')         => "₦456,789"
// formatBalance(45678, 'NGN')          => "₦45,678"
// formatBalance(8000, 'NGN')           => "₦8,000"
// formatBalance(100, 'NGN')            => "₦100"
// formatBalance(100.50, 'NGN')         => "₦100.50"
// formatBalance(100.56789, 'NGN')      => "₦100.57" (rounded to 2 decimals)
....
...
 <!-- {/* ── Export CSV ── */}
            <CSVLink
              data={data}
              headers={CSV_HEADERS}
              filename={csvFilename}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 700,
                textDecoration: 'none',
                transition: 'opacity 0.2s',
                backgroundColor: data.length === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: data.length === 0 ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.85)',
                pointerEvents: data.length === 0 ? 'none' : 'auto',
                cursor: data.length === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              <Download size={15} />
              Export CSV
              {/* Live row count badge so the user knows what they're exporting */}
              {data.length > 0 && (
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '6px',
                    backgroundColor: '#13ec5b20',
                    color: '#13ec5b',
                  }}
                >
                  {data.length} rows
                </span>
              )}
            </CSVLink> -->


            // ─── CSV column definitions ───────────────────────────────────────────────────
const CSV_HEADERS = [
  { label: 'Transaction ID',         key: 'id'                       },
  { label: 'PTID',                   key: 'ptid'                     },
  { label: 'Account Number',         key: 'AcctNo'                   },
  { label: 'Account Name',           key: 'AcctName'                 },
  { label: 'Transaction Date',       key: 'TransDate'                },
  { label: 'Value Date',             key: 'ValueDate'                },
  { label: 'Tran Code',              key: 'TranCode'                 },
  { label: 'Description',            key: 'Description'              },
  { label: 'Mode',                   key: 'Mode'                     },
  { label: 'Debit Amount',           key: 'DebitAmt'                 },
  { label: 'Debit Amount (Formatted)', key: 'DebitAmtFormatted'      },
  { label: 'Credit Amount',          key: 'CreditAmt'                },
  { label: 'Credit Amount (Formatted)', key: 'CreditAmtFormatted'   },
  { label: 'Running Balance',        key: 'RunningBalance'           },
  { label: 'Running Balance (Formatted)', key: 'RunningBalanceFormatted' },
  { label: 'Currency',               key: 'Currency'                 },
]
