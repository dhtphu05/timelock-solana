import React, { useState, useEffect } from 'react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Clock, Lock, Unlock, DollarSign, User, Calendar } from 'lucide-react'
import { useTimelockProgram, VaultInfo } from '../hooks/useTimelockProgram'
import { useToast } from './ui/toaster'

interface VaultCardProps {
  vault: VaultInfo
  onWithdraw: () => void
}

export function VaultCard({ vault, onWithdraw }: VaultCardProps) {
  const { withdraw } = useTimelockProgram()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState('')
  const [canWithdraw, setCanWithdraw] = useState(false)

  useEffect(() => {
    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000)
      const unlockTime = vault.unlockTs.toNumber()
      const diff = unlockTime - now

      if (diff <= 0) {
        setTimeLeft('🔓 Unlocked!')
        setCanWithdraw(true)
      } else {
        const days = Math.floor(diff / 86400)
        const hours = Math.floor((diff % 86400) / 3600)
        const minutes = Math.floor((diff % 3600) / 60)
        const seconds = diff % 60

        if (days > 0) {
          setTimeLeft(`⏳ ${days}d ${hours}h ${minutes}m`)
        } else if (hours > 0) {
          setTimeLeft(`⏳ ${hours}h ${minutes}m ${seconds}s`)
        } else {
          setTimeLeft(`⏳ ${minutes}m ${seconds}s`)
        }
        setCanWithdraw(false)
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [vault.unlockTs])

  const handleWithdraw = async () => {
    if (!canWithdraw) {
      toast('Timelock has not expired yet', 'error')
      return
    }

    setLoading(true)
    try {
      const signature = await withdraw(vault)
      toast(`Withdrawal successful! Signature: ${signature.slice(0, 8)}...`, 'success')
      onWithdraw()
    } catch (error) {
      console.error('Withdrawal error:', error)
      toast(`Withdrawal failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  const formatSOL = (lamports: number) => {
    return (lamports / LAMPORTS_PER_SOL).toFixed(4)
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString()
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast('Address copied to clipboard!', 'success')
    } catch (error) {
      toast('Failed to copy address', 'error')
    }
  }

  return (
    <div className="glass rounded-lg p-6 hover:bg-white/15 transition-all duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          {canWithdraw ? (
            <Unlock className="w-5 h-5 text-green-400" />
          ) : (
            <Lock className="w-5 h-5 text-yellow-400" />
          )}
          <h3 className="text-white font-semibold">
            {formatSOL(vault.amount.toNumber())} SOL
          </h3>
        </div>
        <div className="text-right">
          <p className={`text-sm ${canWithdraw ? 'text-green-400' : 'text-yellow-400'}`}>
            {timeLeft}
          </p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-white/70 text-sm">
          <DollarSign className="w-4 h-4" />
          <span>Amount: {formatSOL(vault.amount.toNumber())} SOL</span>
        </div>
        
        <div className="flex items-center gap-2 text-white/70 text-sm">
          <Calendar className="w-4 h-4" />
          <span>Unlock: {formatDate(vault.unlockTs.toNumber())}</span>
        </div>
        
        <div className="flex items-center gap-2 text-white/70 text-sm">
          <User className="w-4 h-4" />
          <span>Recipient: {vault.recipient.toBase58().slice(0, 8)}...</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleWithdraw}
          disabled={!canWithdraw || loading}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            canWithdraw
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-gray-600 text-gray-300 cursor-not-allowed'
          }`}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              Withdrawing...
            </>
          ) : (
            <>
              {canWithdraw ? <Unlock className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
              {canWithdraw ? 'Withdraw' : 'Locked'}
            </>
          )}
        </button>
        
        <button
          onClick={() => copyToClipboard(vault.address.toBase58())}
          className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          title="Copy vault address"
        >
          📋
        </button>
      </div>
    </div>
  )
}