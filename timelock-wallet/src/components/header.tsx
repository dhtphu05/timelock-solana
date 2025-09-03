import React from 'react'
import { Link } from 'react-router-dom'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Lock } from 'lucide-react'

export function Header() {
  return (
    <header className="glass border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-2xl font-bold text-white hover:text-accent transition-colors"
          >
            <Lock className="w-8 h-8" />
            <span>TimeVault</span>
          </Link>
          <nav className="hidden md:flex space-x-4">
            <Link 
              to="/" 
              className="text-white/80 hover:text-white transition-colors px-3 py-2 rounded-md hover:bg-white/10"
            >
              Home
            </Link>
            <Link 
              to="/locks" 
              className="text-white/80 hover:text-white transition-colors px-3 py-2 rounded-md hover:bg-white/10"
            >
              My Locks
            </Link>
          </nav>
        </div>
        <WalletMultiButton className="!bg-primary hover:!bg-primary/90 !rounded-lg" />
      </div>
    </header>
  )
}