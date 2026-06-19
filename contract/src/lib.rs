#![cfg_attr(not(test), no_std)]
#![cfg_attr(not(test), no_main)]
extern crate alloc;

// CasperGuard v1.0
// AI Agent Security + Settlement Layer for Casper Network

use odra::prelude::*;
use odra::casper_types::U512;

#[odra::event]
pub struct AgentRegistered {
    pub agent_id: String,
    pub owner: Address,
    pub daily_budget_cspr: u64,
    pub max_per_call_cspr: u64,
    pub timestamp: u64,
}

#[odra::event]
pub struct TransactionApproved {
    pub agent_id: String,
    pub amount: U512,
    pub service_id: String,
    pub proof_hash: String,
    pub timestamp: u64,
}

#[odra::event]
pub struct TransactionBlocked {
    pub agent_id: String,
    pub amount: U512,
    pub reason: String,
    pub timestamp: u64,
}

#[odra::event]
pub struct SettlementRecorded {
    pub agent_id: String,
    pub consumer: Address,
    pub amount: U512,
    pub service_id: String,
    pub proof_hash: String,
    pub timestamp: u64,
}

#[odra::odra_error]
pub enum Error {
    Unauthorized = 1,
    DuplicateTransaction = 2,
    ExceedsMaxPerCall = 3,
    ExceedsDailyBudget = 4,
    AgentNotFound = 5,
    AgentAlreadyExists = 6,
}

#[odra::module(events = [
    AgentRegistered,
    TransactionApproved,
    TransactionBlocked,
    SettlementRecorded
], errors = Error)]
pub struct CasperGuard {
    owner: Var<Address>,
    total_settlements: Var<u64>,
    total_blocked: Var<u64>,
    // Agent settings
    agent_owner: Mapping<String, Address>,
    agent_daily_budget: Mapping<String, u64>,
    agent_max_per_call: Mapping<String, u64>,
    agent_spent_today: Mapping<String, u64>,
    agent_last_reset: Mapping<String, u64>,
    agent_reputation: Mapping<String, u64>,
    agent_total_blocked: Mapping<String, u64>,
    // Settlement tracking
    processed_txs: Mapping<String, bool>,
    consumer_reputation: Mapping<Address, u64>,
}

#[odra::module]
impl CasperGuard {
    pub fn init(&mut self) {
        self.owner.set(self.env().caller());
        self.total_settlements.set(0);
        self.total_blocked.set(0);
    }

    // Register AI agent with security limits
    pub fn register_agent(
        &mut self,
        agent_id: String,
        daily_budget_cspr: u64,
        max_per_call_cspr: u64,
    ) {
        let caller = self.env().caller();
        
        if self.agent_owner.get(&agent_id).is_some() {
            self.env().revert(Error::AgentAlreadyExists);
        }

        self.agent_owner.set(&agent_id, caller);
        self.agent_daily_budget.set(&agent_id, daily_budget_cspr);
        self.agent_max_per_call.set(&agent_id, max_per_call_cspr);
        self.agent_spent_today.set(&agent_id, 0);
        self.agent_reputation.set(&agent_id, 0);
        self.agent_total_blocked.set(&agent_id, 0);
        self.agent_last_reset.set(&agent_id, self.env().get_block_time());

        self.env().emit_event(AgentRegistered {
            agent_id,
            owner: caller,
            daily_budget_cspr,
            max_per_call_cspr,
            timestamp: self.env().get_block_time(),
        });
    }

    // Validate and record transaction with security checks
    pub fn secure_transaction(
        &mut self,
        agent_id: String,
        amount: U512,
        service_id: String,
        proof_hash: String,
    ) {
        let caller = self.env().caller();
        
        // Check agent exists and caller is owner
        let agent_owner = self.agent_owner.get(&agent_id)
            .unwrap_or_else(|| self.env().revert(Error::AgentNotFound));
        
        if caller != agent_owner {
            self.env().revert(Error::Unauthorized);
        }

        // Duplicate check
        if self.processed_txs.get(&proof_hash).unwrap_or(false) {
            self.env().revert(Error::DuplicateTransaction);
        }

        let amount_cspr = amount.as_u64();
        let max_per_call = self.agent_max_per_call.get(&agent_id).unwrap_or(0);
        let daily_budget = self.agent_daily_budget.get(&agent_id).unwrap_or(0);
        let spent_today = self.agent_spent_today.get(&agent_id).unwrap_or(0);

        // Security check 1: Max per call
        if amount_cspr > max_per_call {
            let blocked = self.total_blocked.get().unwrap_or(0);
            self.total_blocked.set(blocked + 1);
            let agent_blocked = self.agent_total_blocked.get(&agent_id).unwrap_or(0);
            self.agent_total_blocked.set(&agent_id, agent_blocked + 1);
            
            self.env().emit_event(TransactionBlocked {
                agent_id,
                amount,
                reason: String::from("ExceedsMaxPerCall"),
                timestamp: self.env().get_block_time(),
            });
            self.env().revert(Error::ExceedsMaxPerCall);
        }

        // Security check 2: Daily budget
        if spent_today + amount_cspr > daily_budget {
            let blocked = self.total_blocked.get().unwrap_or(0);
            self.total_blocked.set(blocked + 1);
            
            self.env().emit_event(TransactionBlocked {
                agent_id,
                amount,
                reason: String::from("ExceedsDailyBudget"),
                timestamp: self.env().get_block_time(),
            });
            self.env().revert(Error::ExceedsDailyBudget);
        }

        // All checks passed - approve transaction
        self.processed_txs.set(&proof_hash, true);
        self.agent_spent_today.set(&agent_id, spent_today + amount_cspr);
        
        let rep = self.agent_reputation.get(&agent_id).unwrap_or(0);
        self.agent_reputation.set(&agent_id, rep + 1);

        let total = self.total_settlements.get().unwrap_or(0);
        self.total_settlements.set(total + 1);

        self.env().emit_event(TransactionApproved {
            agent_id: agent_id.clone(),
            amount,
            service_id: service_id.clone(),
            proof_hash: proof_hash.clone(),
            timestamp: self.env().get_block_time(),
        });

        self.env().emit_event(SettlementRecorded {
            agent_id,
            consumer: caller,
            amount,
            service_id,
            proof_hash,
            timestamp: self.env().get_block_time(),
        });
    }

    // Reset daily spending (called by owner)
    pub fn reset_daily_budget(&mut self, agent_id: String) {
        let owner = self.owner.get().expect("Owner not set");
        if self.env().caller() != owner {
            self.env().revert(Error::Unauthorized);
        }
        self.agent_spent_today.set(&agent_id, 0);
        self.agent_last_reset.set(&agent_id, self.env().get_block_time());
    }

    // View functions
    pub fn get_agent_reputation(&self, agent_id: String) -> u64 {
        self.agent_reputation.get(&agent_id).unwrap_or(0)
    }

    pub fn get_agent_spent_today(&self, agent_id: String) -> u64 {
        self.agent_spent_today.get(&agent_id).unwrap_or(0)
    }

    pub fn get_agent_daily_budget(&self, agent_id: String) -> u64 {
        self.agent_daily_budget.get(&agent_id).unwrap_or(0)
    }

    pub fn get_total_settlements(&self) -> u64 {
        self.total_settlements.get().unwrap_or(0)
    }

    pub fn get_total_blocked(&self) -> u64 {
        self.total_blocked.get().unwrap_or(0)
    }

    pub fn get_agent_blocked_count(&self, agent_id: String) -> u64 {
        self.agent_total_blocked.get(&agent_id).unwrap_or(0)
    }
}
