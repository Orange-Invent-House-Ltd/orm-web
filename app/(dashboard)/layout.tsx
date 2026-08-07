'use client'

import Sidebar from '@/components/Sidebar'
import MobileSidebar from '@/components/MobileSidebar'
import NavigationLoader from '@/components/NavigationLoader'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <NavigationLoader />
      <div className="relative">
        <div className="hidden h-full md:flex md:flex-col md:fixed md:inset-y-0 bg-gray-900">
          <Sidebar />
        </div>

        <div className="md:hidden block">
          <MobileSidebar />
        </div>
      </div>

      <main className="md:ml-72">
        {children}
      </main>
    </div>
  )
}