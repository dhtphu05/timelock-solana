import { useMemo } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'
import * as anchor from '@coral-xyz/anchor'
import { BN } from 'bn.js'
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Buffer } from 'buffer'

// Ensure Buffer is available globally
if (typeof window !== 'undefined') {
  window.Buffer = Buffer
}

// Update Program ID to match deployed program
const PROGRAM_ID = new PublicKey('HFamjVWTqbLba9TL3Yr2cx19y38RHHsFHRRBXk53wAVy')

// Use the actual IDL from target/idl/timelock.json
import idlJson from '../../../target/idl/timelock.json'

export interface VaultInfo {
  address: PublicKey
  owner: PublicKey
  recipient: PublicKey
  amount: BN
  unlockTs: BN
  isInitialized: boolean
}

export function useTimelockProgram() {
  const { connection } = useConnection()
  const { publicKey, signTransaction, signAllTransactions } = useWallet()

  const program = useMemo(() => {
    if (!publicKey || !signTransaction || !signAllTransactions) {
      console.log('❌ Wallet not connected properly')
      return null
    }

    try {
      console.log('🔗 Connecting to program:', PROGRAM_ID.toString())
      console.log('🔗 RPC endpoint:', connection.rpcEndpoint)

      const provider = new anchor.AnchorProvider(
        connection,
        {
          publicKey,
          signTransaction,
          signAllTransactions,
        },
        { 
          commitment: 'processed',
          preflightCommitment: 'processed'
        }
      )

      const program = new Program(idlJson as any, provider)
      
      console.log('✅ Program initialized successfully')
      console.log('📋 Available methods:', Object.keys(program.methods))
      
      return program
    } catch (error) {
      console.error('❌ Program initialization error:', error)
      return null
    }
  }, [connection, publicKey, signTransaction, signAllTransactions])

  const getVaultPda = (owner: PublicKey, recipient: PublicKey, unlockTimestamp: number) => {
    try {
      const [pda, bump] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('vault'),
          owner.toBuffer(),
          recipient.toBuffer(),
          Buffer.from(new BN(unlockTimestamp).toArray('le', 8)),
        ],
        PROGRAM_ID
      )
      console.log('🔐 Generated PDA:', pda.toString(), 'bump:', bump)
      return [pda, bump]
    } catch (error) {
      console.error('❌ PDA generation error:', error)
      throw error
    }
  }

  const createTimelock = async (amount: number, unlockTimestamp: number, recipient?: PublicKey) => {
    if (!program || !publicKey) {
      throw new Error('Program not initialized or wallet not connected')
    }

    console.log('🚀 Creating timelock:', {
      amount,
      unlockTimestamp: new Date(unlockTimestamp * 1000).toISOString(),
      recipient: recipient?.toString() || 'self'
    })

    const actualRecipient = recipient || publicKey
    const amountLamports = Math.floor(amount * LAMPORTS_PER_SOL)
    
    const [vaultPda] = getVaultPda(publicKey, actualRecipient, unlockTimestamp)
    console.log('🔐 Vault PDA:', vaultPda.toString())

    try {
      // Use camelCase method name that Anchor generates
      const tx = await program.methods
        .initializeLock(new BN(amountLamports), new BN(unlockTimestamp))
        .accounts({
          owner: publicKey,
          recipient: actualRecipient,
          vault: vaultPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc()

      console.log('✅ Transaction signature:', tx)
      return { signature: tx, vaultPda }
    } catch (error) {
      console.error('❌ Transaction failed:', error)
      throw error
    }
  }

  const withdraw = async (vault: VaultInfo) => {
    if (!program || !publicKey) {
      throw new Error('Program not initialized or wallet not connected')
    }

    console.log('🏦 Withdrawing from vault:', vault.address.toString())

    try {
      const tx = await program.methods
        .withdraw()
        .accounts({
          caller: publicKey,
          to: vault.recipient,
          vault: vault.address,
          systemProgram: SystemProgram.programId,
        })
        .rpc()

      console.log('✅ Withdrawal signature:', tx)
      return tx
    } catch (error) {
      console.error('❌ Withdrawal failed:', error)
      throw error
    }
  }

  const fetchAllVaults = async (): Promise<VaultInfo[]> => {
    if (!program || !publicKey) {
      console.log('❌ Cannot fetch vaults: program not initialized')
      return []
    }

    try {
      console.log('📡 Fetching vaults for:', publicKey.toString())
      
      const vaults = await program.account.vault.all([
        {
          memcmp: {
            offset: 8, // Skip discriminator
            bytes: publicKey.toBase58(),
          },
        },
      ])

      console.log('📦 Found vaults:', vaults.length)

      return vaults.map((vault) => ({
        address: vault.publicKey,
        owner: vault.account.owner,
        recipient: vault.account.recipient,
        amount: vault.account.amount,
        unlockTs: vault.account.unlockTs,
        isInitialized: vault.account.isInitialized,
      }))
    } catch (error) {
      console.error('❌ Error fetching vaults:', error)
      return []
    }
  }

  return {
    program,
    createTimelock,
    withdraw,
    fetchAllVaults,
    getVaultPda,
    connected: !!program,
  }
}