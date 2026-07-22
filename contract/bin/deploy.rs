use odra_casper_livenet_env;
use casperguard::CasperGuardHostRef;
use odra::host::{Deployer, NoArgs};

fn main() {
    let env = odra_casper_livenet_env::env();
    env.set_gas(300_000_000_000u64);
    println!("Deploying CasperGuard...");
    let contract = CasperGuardHostRef::deploy(&env, NoArgs);
    println!("Deployed at: {:?}", contract.address());
}
