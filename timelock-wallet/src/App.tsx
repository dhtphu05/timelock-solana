import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { WalletProvider } from './components/wallet-provider'
import { Header } from './components/header'
import { HomePage } from './pages/home'
import { LocksPage } from './pages/locks'

console.log('App.tsx loading...') // Debug log

function App() {
  console.log('App component rendering...') // Debug log
  
  return (
    <div className="debug-container">
      <WalletProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/locks" element={<LocksPage />} />
            </Routes>
          </main>
        </div>
      </WalletProvider>
    </div>
  )
}

export default App