import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/lib/Providers'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Kaduna Finance — Bank Account Mornitoring Dashboard',
  description: 'Secure multi-bank financial oversight platform',
   manifest: "/manifest.json", // Point to the static file
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Kaduna ERP",
  },
  icons: {
    icon: "/logo.png",
    apple: "/kd-180.png",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Providers>
          {children}
         </Providers>
      </body>
    </html>
  )
}
