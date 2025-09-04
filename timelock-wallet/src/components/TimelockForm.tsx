import React, { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { Lock, Calendar, DollarSign } from 'lucide-react'
import { useTimelockProgram } from '../hooks/useTimelockProgram'
import { useToast } from './ui/toaster'

interface TimelockFormProps {
  onSuccess: () => void
}

export function TimelockForm({ onSuccess }: TimelockFormProps) {
  const { publicKey } = useWallet()
  const { createTimelock } = useTimelockProgram()
  const { toast } = useToast()
  
  const [amount, setAmount] = useState('')
  const [unlockDate, setUnlockDate] = useState('')
  const [recipient, setRecipient] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!publicKey || !amount || !unlockDate) return

    setLoading(true)
    try {
      const unlockTimestamp = Math.floor(new Date(unlockDate).getTime() / 1000)
      const now = Math.floor(Date.now() / 1000)

      if (unlockTimestamp <= now) {
        toast('Unlock time must be in the future', 'error')
        return
      }

      let recipientKey: PublicKey | undefined
      if (recipient) {
        try {
          recipientKey = new PublicKey(recipient)
        } catch (error) {
          toast('Invalid recipient address', 'error')
          return
        }
      }

      const result = await createTimelock(parseFloat(amount), unlockTimestamp, recipientKey)

      toast(`Timelock created! Signature: ${result.signature.slice(0, 8)}...`, 'success')
      
      // Reset form
      setAmount('')
      setUnlockDate('')
      setRecipient('')
      onSuccess()
    } catch (error) {
      console.error('Error creating timelock:', error)
      toast(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  // Set default unlock time to 1 hour from now
  React.useEffect(() => {
    const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000)
    const isoString = oneHourFromNow.toISOString().slice(0, 16)
    setUnlockDate(isoString)
  }, [])

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="flex items-center gap-2 text-white/80 text-sm mb-2">
          <DollarSign className="w-4 h-4" />
          Amount (SOL)
        </label>
        <input
          type="number"
          step="0.001"
          min="0.001"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="0.1"
          required
        />
        <p className="text-white/50 text-xs mt-1">Minimum: 0.001 SOL</p>
      </div>

      <div>
        <label className="flex items-center gap-2 text-white/80 text-sm mb-2">
          <Calendar className="w-4 h-4" />
          Unlock Date & Time
        </label>
        <input
          type="datetime-local"
          value={unlockDate}
          onChange={(e) => setUnlockDate(e.target.value)}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="flex items-center gap-2 text-white/80 text-sm mb-2">
          <Lock className="w-4 h-4" />
          Recipient (Optional)
        </label>
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Leave empty to use your wallet"
        />
        <p className="text-white/50 text-xs mt-1">
          {recipient ? 'Custom recipient address' : 'Will default to your wallet address'}
        </p>
      </div>

      <button
        type="submit"
        disabled={loading || !amount || !unlockDate}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            Creating...
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            Create Time Lock
          </>
        )}
      </button>
    </form>
  )
}