import React, { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Lock, Shield, Timer, Wallet, RefreshCw } from 'lucide-react'
import { TimelockForm } from '../components/TimelockForm'
import { VaultCard } from '../components/VaultCard'
import { useTimelockProgram, VaultInfo } from '../hooks/useTimelockProgram'

export function HomePage() {
  const { connected } = useWallet()
  const { fetchAllVaults } = useTimelockProgram()
  const [vaults, setVaults] = useState<VaultInfo[]>([])
  const [loading, setLoading] = useState(false)

  const loadVaults = async () => {
    if (!connected) return
    
    setLoading(true)
    try {
      const userVaults = await fetchAllVaults()
      setVaults(userVaults)
    } catch (error) {
      console.error('Error loading vaults:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadVaults()
  }, [connected])

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
          <WalletMultiButton className="!bg-gradient-to-r !from-blue-600 !to-purple-600 hover:!from-blue-700 hover:!to-purple-700" />
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
      {/* Create Timelock Form */}
      <div className="glass rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <Lock className="w-6 h-6" />
          Create Time Lock
        </h2>
        <TimelockForm onSuccess={loadVaults} />
      </div>
      
      {/* Vault List */}
      <div className="glass rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Timer className="w-6 h-6" />
            Your Vaults ({vaults.length})
          </h2>
          <button
            onClick={loadVaults}
            disabled={loading}
            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors disabled:opacity-50"
            title="Refresh vaults"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="text-center py-8 text-white/60">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent mx-auto mb-4" />
              <p>Loading your vaults...</p>
            </div>
          ) : vaults.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              <Timer className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No locked vaults yet.</p>
              <p className="text-sm">Create your first time lock!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {vaults.map((vault, index) => (
                <VaultCard
                  key={vault.address.toString()}
                  vault={vault}
                  onWithdraw={loadVaults}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}