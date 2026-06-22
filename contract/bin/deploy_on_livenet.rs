use odra::host::{Deployer, NoArgs};
use odra::prelude::Addressable;
use casperguard::CasperGuard;

const DEPLOY_GAS: u64 = 400_000_000_000;

fn main() {
    let env = odra_casper_livenet_env::env();
    println!("Deploying as: {}", env.caller().to_string());
    env.set_gas(DEPLOY_GAS);
    let contract = CasperGuard::deploy(&env, NoArgs);
    println!("CasperGuard deployed at: {}", contract.address().to_string());
}
