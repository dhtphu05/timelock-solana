import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { WalletProvider } from './components/wallet-provider'
import { Toaster } from './components/ui/toaster'
import { Header } from './components/header'
import { HomePage } from './pages/home'
import { LocksPage } from './pages/locks'
import './index.css'

function App() {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/locks" element={<LocksPage />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </WalletProvider>
  )
}

export default App