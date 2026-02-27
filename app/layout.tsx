import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/lib/Providers'

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
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          {children}
         </Providers>
      </body>
    </html>
  )
}
