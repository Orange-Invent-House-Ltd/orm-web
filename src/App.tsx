import React from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './protect'
import { useTheme } from './custom-hooks/useTheme'

const HomePage = React.lazy(() => import('../src/pages/index'))
const TransactionList = React.lazy(() => import('../src/pages/transaction_list'))
const BankAccountList = React.lazy(() => import('../src/pages/bank'))
const LoginPage = React.lazy(() => import('../src/auth/login'))

function App() {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`flex justify-center min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'} p-2`}>
      <div className='xl:w-[70%] lg:w-[75%] md:w-[90%] sm:w-full w-full'>
        <Routes>
          {/* Remove "orm/" prefix from routes since basename handles it */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          
          <Route 
            path="/:bankName" 
            element={
              <ProtectedRoute>
                <BankAccountList />
              </ProtectedRoute>
            }
          />
          
          <Route 
            path="/transactions" 
            element={
              <ProtectedRoute>
                <TransactionList />
              </ProtectedRoute>
            }
          />
          
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </div>
  )
}

export default App