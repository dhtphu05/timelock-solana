import React, { ReactNode, useMemo } from 'react'
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare'
import { BackpackWalletAdapter } from '@solana/wallet-adapter-backpack'
import { clusterApiUrl } from '@solana/web3.js'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'

import '@solana/wallet-adapter-react-ui/styles.css'

interface WalletProviderProps {
  children: ReactNode
}

export function WalletProvider({ children }: WalletProviderProps) {
  console.log('WalletProvider rendering...') // Debug log
  
  const network = WalletAdapterNetwork.Devnet
  const endpoint = useMemo(() => clusterApiUrl(network), [network])
  
  const wallets = useMemo(
    () => [
      // Phantom với cấu hình tốt hơn
      new PhantomWalletAdapter({
        network,
        options: {
          appMetadata: {
            name: 'TimeVault',
            url: window.location.origin,
          },
        },
      }),
      // Solflare
      new SolflareWalletAdapter({ network }),
      // Backpack
      new BackpackWalletAdapter(),
    ],
    [network]
  )

  try {
    return (
      <ConnectionProvider 
        endpoint={endpoint}
        config={{
          commitment: 'processed',
          wsEndpoint: endpoint.replace('https://', 'wss://').replace('http://', 'ws://'),
        }}
      >
        <SolanaWalletProvider 
          wallets={wallets} 
          autoConnect={false}
          localStorageKey="timelock-wallet"
          onError={(error) => {
            console.error('Wallet error:', error)
          }}
        >
          <WalletModalProvider>
            {children}
          </WalletModalProvider>
        </SolanaWalletProvider>
      </ConnectionProvider>
    )
  } catch (error) {
    console.error('WalletProvider error:', error)
    return <div className="text-white p-4">Wallet Provider Error: {String(error)}</div>
  }
}