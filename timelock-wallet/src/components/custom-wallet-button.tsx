import React, { useCallback } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletReadyState } from '@solana/wallet-adapter-base'

export function CustomWalletButton() {
  const { wallets, select, wallet, connected, connecting, disconnect } = useWallet()

  const handlePhantomConnect = useCallback(async () => {
    // Check if Phantom is installed
    if ('phantom' in window) {
      const phantom = (window as any).phantom?.solana
      if (phantom?.isPhantom) {
        try {
          // Direct connection to Phantom
          const response = await phantom.connect({ onlyIfTrusted: false })
          console.log('Connected to Phantom:', response.publicKey.toString())
        } catch (error) {
          console.error('Phantom connection error:', error)
        }
      }
    } else {
      // Redirect to Phantom installation
      window.open('https://phantom.app/', '_blank')
    }
  }, [])

  const handleWalletSelect = useCallback((walletName: string) => {
    if (walletName === 'Phantom') {
      handlePhantomConnect()
    } else {
      const selectedWallet = wallets.find(w => w.adapter.name === walletName)
      if (selectedWallet) {
        select(selectedWallet.adapter.name)
      }
    }
  }, [wallets, select, handlePhantomConnect])

  if (connected) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-white text-sm">
          {wallet?.adapter.name} Connected
        </span>
        <button
          onClick={disconnect}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      {wallets
        .filter(wallet => wallet.readyState === WalletReadyState.Installed)
        .map((wallet) => (
          <button
            key={wallet.adapter.name}
            onClick={() => handleWalletSelect(wallet.adapter.name)}
            disabled={connecting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            {wallet.adapter.icon && (
              <img src={wallet.adapter.icon} alt={wallet.adapter.name} className="w-5 h-5" />
            )}
            {connecting ? 'Connecting...' : `Connect ${wallet.adapter.name}`}
          </button>
        ))}
      
      {/* Fallback for Phantom if not detected */}
      {!wallets.some(w => w.adapter.name === 'Phantom') && (
        <button
          onClick={handlePhantomConnect}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
        >
          Connect Phantom
        </button>
      )}
    </div>
  )
}