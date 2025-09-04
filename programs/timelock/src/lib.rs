// filepath: /Users/mac/Desktop/Blockchain/Bounty/timelock/programs/timelock/src/lib.rs
use anchor_lang::prelude::*;
use anchor_lang::system_program;

declare_id!("HFamjVWTqbLba9TL3Yr2cx19y38RHHsFHRRBXk53wAVy");

#[program]
pub mod timelock {
    use super::*;

    pub fn initialize_lock(
        ctx: Context<InitializeLock>,
        amount: u64,
        unlock_timestamp: i64,
    ) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        let clock = Clock::get()?;

        require!(
            unlock_timestamp > clock.unix_timestamp,
            TimelockError::InvalidUnlockTime
        );

        // Transfer SOL to vault PDA
        system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                system_program::Transfer {
                    from: ctx.accounts.owner.to_account_info(),
                    to: vault.to_account_info(),
                },
            ),
            amount,
        )?;

        // Initialize vault state
        vault.owner = ctx.accounts.owner.key();
        vault.recipient = ctx.accounts.recipient.key();
        vault.amount = amount;
        vault.unlock_ts = unlock_timestamp;
        vault.is_initialized = true;

        msg!("Lock created: {} lamports until {}", amount, unlock_timestamp);
        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdraw>) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        let clock = Clock::get()?;

        // Check if unlock time has passed
        require!(
            clock.unix_timestamp >= vault.unlock_ts,
            TimelockError::TooEarly
        );

        // Check caller is authorized (owner or recipient)
        let caller = ctx.accounts.caller.key();
        require!(
            caller == vault.owner || caller == vault.recipient,
            TimelockError::Unauthorized
        );

        // Transfer from vault to recipient
        let vault_lamports = vault.to_account_info().lamports();
        let rent_exempt = Rent::get()?.minimum_balance(vault.to_account_info().data_len());
        let withdrawable = vault_lamports.saturating_sub(rent_exempt);

        **vault.to_account_info().try_borrow_mut_lamports()? -= withdrawable;
        **ctx.accounts.to.try_borrow_mut_lamports()? += withdrawable;

        vault.amount = 0;
        msg!("Withdrawn {} lamports", withdrawable);
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(amount: u64, unlock_timestamp: i64)]
pub struct InitializeLock<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    /// CHECK: recipient can be any account
    pub recipient: AccountInfo<'info>,
    
    #[account(
        init,
        seeds = [
            b"vault",
            owner.key().as_ref(),
            recipient.key().as_ref(),
            &unlock_timestamp.to_le_bytes()
        ],
        bump,
        payer = owner,
        space = 8 + 32 + 32 + 8 + 8 + 1
    )]
    pub vault: Account<'info, Vault>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    pub caller: Signer<'info>,
    /// CHECK: recipient of withdrawal
    #[account(mut)]
    pub to: AccountInfo<'info>,
    
    #[account(
        mut,
        seeds = [
            b"vault",
            vault.owner.as_ref(),
            vault.recipient.as_ref(),
            &vault.unlock_ts.to_le_bytes()
        ],
        bump
    )]
    pub vault: Account<'info, Vault>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Vault {
    pub owner: Pubkey,
    pub recipient: Pubkey,  
    pub amount: u64,
    pub unlock_ts: i64,
    pub is_initialized: bool,
}

#[error_code]
pub enum TimelockError {
    #[msg("Unlock timestamp must be in the future")]
    InvalidUnlockTime,
    #[msg("Too early to withdraw")]
    TooEarly,
    #[msg("Unauthorized caller")]
    Unauthorized,
}