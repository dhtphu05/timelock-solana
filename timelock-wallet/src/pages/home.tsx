import React from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { CustomWalletButton } from '../components/custom-wallet-button'
import { Lock, Shield, Timer, Wallet } from 'lucide-react'

export function HomePage() {
  const { connected } = useWallet()

  const features = [
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Time-Locked Security",
      description: "Funds are securely locked until your specified unlock time"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "On-Chain Enforcement", 
      description: "Smart contract ensures funds cannot be accessed early"
    },
    {
      icon: <Timer className="w-6 h-6" />,
      title: "Flexible Timing",
      description: "Set any future unlock time for your locked funds"
    }
  ]

  if (!connected) {
    return (
      <div className="text-center py-16">
        <div className="glass rounded-2xl p-8 mb-8 max-w-2xl mx-auto">
          <Wallet className="w-16 h-16 mx-auto mb-4 text-white" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Connect Your Wallet to Get Started
          </h2>
          <p className="text-white/80 mb-6">
            Create time-locked vaults to secure your SOL until a future date.
            Perfect for savings, grants, or scheduled payments.
          </p>
          
          {/* Custom wallet buttons */}
          <div className="mb-4">
            <CustomWalletButton />
          </div>
          
          {/* Fallback to standard button */}
          <div className="text-white/60 text-sm mb-4">or</div>
          <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-700" />
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="glass rounded-lg p-6 text-center">
              <div className="text-white mb-4 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
              <p className="text-white/70 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="glass rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <Lock className="w-6 h-6" />
          Create Time Lock
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-white/80 text-sm mb-2">Amount (SOL)</label>
            <input 
              type="number" 
              step="0.001"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
              placeholder="0.1"
            />
          </div>
          <div>
            <label className="block text-white/80 text-sm mb-2">Unlock Date</label>
            <input 
              type="datetime-local" 
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
            />
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
            Create Time Lock
          </button>
        </div>
      </div>
      
      <div className="glass rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <Timer className="w-6 h-6" />
          Your Vaults (0)
        </h2>
        <div className="text-center py-8 text-white/60">
          <Timer className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No locked vaults yet.</p>
          <p className="text-sm">Create your first time lock!</p>
        </div>
      </div>
    </div>
  )
}