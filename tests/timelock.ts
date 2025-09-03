import * as anchor from "@coral-xyz/anchor";
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import assert from "assert";
import {BN} from "bn.js";

describe("timelock", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Timelock as anchor.Program<any>;

  it("Creates timelock and prevents early withdrawal", async () => {
    const owner = provider.wallet.publicKey;
    const recipient = owner;

    // Set unlock time 2 seconds in future for faster testing
    const unlockTimestamp = Math.floor(Date.now() / 1000) + 2;
    const amount = 0.1 * LAMPORTS_PER_SOL; // 0.1 SOL

    // Derive vault PDA
    const [vaultPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("vault"),
        owner.toBuffer(),
        recipient.toBuffer(),
        Buffer.from(new BN(unlockTimestamp).toArray("le", 8))
      ],
      program.programId
    );

    console.log("🔐 Creating timelock vault...");
    
    // Initialize lock - FIX: Use BN instead of anchor.BN
    await program.methods
      .initializeLock(new BN(amount), new BN(unlockTimestamp))
      .accounts({
        owner,
        recipient,
        vault: vaultPda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    // Verify vault state
    const vaultAccount = await program.account.vault.fetch(vaultPda);
    assert.equal(vaultAccount.amount.toString(), amount.toString());
    assert.equal(vaultAccount.unlockTs.toString(), unlockTimestamp.toString());

    console.log("✅ Vault created successfully");

    // Test early withdrawal (should fail)
    console.log("🚫 Testing early withdrawal...");
    try {
      await program.methods
        .withdraw()
        .accounts({
          caller: owner,
          to: recipient,
          vault: vaultPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      
      assert.fail("Expected withdrawal to fail");
    } catch (error) {
      assert.ok(error.message.includes("Too early") || error.message.includes("6001"));
      console.log("✅ Early withdrawal correctly blocked");
    }

    // Wait for unlock time
    console.log("⏳ Waiting for unlock time...");
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Test successful withdrawal
    console.log("💰 Testing withdrawal after unlock...");
    const initialBalance = await provider.connection.getBalance(recipient);
    
    await program.methods
      .withdraw()
      .accounts({
        caller: owner,
        to: recipient,
        vault: vaultPda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const finalBalance = await provider.connection.getBalance(recipient);
    assert.ok(finalBalance > initialBalance, "Balance should increase after withdrawal");
    
    console.log("✅ Withdrawal successful after unlock");
  });
});