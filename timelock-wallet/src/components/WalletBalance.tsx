import React, { useEffect, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'

export function WalletBalance() {
  const { connection } = useConnection()
  const { publicKey, connected } = useWallet()
  const [solBalance, setSolBalance] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [airdropping, setAirdropping] = useState(false)

  const fetchBalances = async () => {
    if (!publicKey || !connection || !connected) return

    try {
      setLoading(true)
      const solBalanceLamports = await connection.getBalance(publicKey)
      setSolBalance(solBalanceLamports / LAMPORTS_PER_SOL)
    } catch (error) {
      console.error('Error fetching balances:', error)
    } finally {
      setLoading(false)
    }
  }

  const requestSolAirdrop = async () => {
    if (!publicKey || !connection || !connected) return

    try {
      setAirdropping(true)
      console.log('💧 Requesting SOL airdrop...')
      
      const signature = await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL)
      await connection.confirmTransaction(signature)
      
      alert('Success! Airdropped 1 SOL to your wallet')
      await fetchBalances()
    } catch (error) {
      console.error('❌ SOL airdrop failed:', error)
      alert('Airdrop failed. Please try again.')
    } finally {
      setAirdropping(false)
    }
  }

  const requestLargeAirdrop = async () => {
    if (!publicKey || !connection || !connected) return

    try {
      setAirdropping(true)
      console.log('💧 Requesting large SOL airdrop...')
      
      const signature = await connection.requestAirdrop(publicKey, 5 * LAMPORTS_PER_SOL)
      await connection.confirmTransaction(signature)
      
      alert('Success! Airdropped 5 SOL to your wallet')
      await fetchBalances()
    } catch (error) {
      console.error('❌ Large airdrop failed:', error)
      alert('Large airdrop failed. Try the 1 SOL option.')
    } finally {
      setAirdropping(false)
    }
  }

  const copyAddress = async () => {
    if (!publicKey) return
    
    try {
      await navigator.clipboard.writeText(publicKey.toString())
      alert('Address copied to clipboard!')
    } catch (error) {
      alert('Failed to copy address')
    }
  }

  useEffect(() => {
    if (connected && publicKey) {
      fetchBalances()
      const interval = setInterval(fetchBalances, 10000)
      return () => clearInterval(interval)
    }
  }, [publicKey, connected, connection])

  if (!connected || !publicKey) {
    return (
      <div className="mb-6 p-6 bg-slate-800/50 border border-slate-700 rounded-lg">
        <div className="flex items-center justify-center text-slate-400">
          <span className="mr-2">👛</span>
          Connect wallet to view balance
        </div>
      </div>
    )
  }

  return (
    <div className="mb-6 space-y-4">
      {/* Balance Display */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg">
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white flex items-center">
              <span className="mr-2">👛</span>
              Wallet Balance
            </h3>
            <button
              onClick={fetchBalances}
              disabled={loading}
              className="text-slate-400 hover:text-white disabled:opacity-50 p-2 rounded-md hover:bg-slate-700"
            >
              {loading ? '⏳' : '🔄'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* SOL Balance */}
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">SOL</p>
                  <p className="text-2xl font-bold text-white">
                    {loading ? '...' : solBalance.toFixed(4)}
                  </p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">◎</span>
                </div>
              </div>
            </div>

            {/* Network Info */}
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Network</p>
                  <p className="text-lg font-bold text-white">Localhost</p>
                </div>
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">🔗</span>
                </div>
              </div>
            </div>
          </div>

          {/* Wallet Address */}
          <div className="mb-4 p-3 bg-slate-700/30 rounded-lg">
            <p className="text-slate-400 text-sm mb-1">Wallet Address:</p>
            <div className="flex items-center gap-2">
              <code className="text-white text-sm font-mono flex-1">
                {publicKey.toString().slice(0, 8)}...{publicKey.toString().slice(-8)}
              </code>
              <button
                onClick={copyAddress}
                className="text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-slate-600"
              >
                📋
              </button>
            </div>
          </div>

          {/* Airdrop Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={requestSolAirdrop}
              disabled={airdropping || loading}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-medium transition-colors"
            >
              {airdropping ? '⏳ Airdropping...' : '💧 Airdrop 1 SOL'}
            </button>
            
            <button
              onClick={requestLargeAirdrop}
              disabled={airdropping || loading}
              className="border border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed px-4 py-3 rounded-lg font-medium transition-colors"
            >
              {airdropping ? '⏳ Airdropping...' : '🚀 Airdrop 5 SOL'}
            </button>
          </div>
        </div>
      </div>

      {/* Development Tools */}
      <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
        <h4 className="text-yellow-400 text-sm font-semibold mb-3 flex items-center">
          ⚙️ Development Tools (Localhost)
        </h4>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => window.open(`http://localhost:8899`, '_blank')}
            className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded text-xs transition-colors"
          >
            RPC Endpoint
          </button>
          <button
            onClick={() => console.log('Current connection:', connection.rpcEndpoint)}
            className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded text-xs transition-colors"
          >
            Check Connection
          </button>
          <button
            onClick={() => window.open(`https://explorer.solana.com/address/${publicKey.toString()}?cluster=custom&customUrl=http://localhost:8899`, '_blank')}
            className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded text-xs transition-colors"
          >
            View on Explorer
          </button>
        </div>
      </div>
    </div>
  )
}