const { ethers } = require('ethers')
const fs = require('fs')

const PRIVATE_KEY = "ea4523b935f5650cc2940bc87a09241421df040d820161699b8ae374a37c3b67"
const RPC_URL = "https://sepolia.base.org"

const ABI = [
  "function createBounty(string memory issueUrl) external payable",
  "function payDeveloper(uint256 bountyId, address developer) external",
  "function bounties(uint256) external view returns (address owner, uint256 amount, bool paid, string issueUrl)",
  "function bountyCount() external view returns (uint256)"
]

const BYTECODE = fs.readFileSync('./contracts/GitPaid.bin', 'utf8')

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL)
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider)
  const factory = new ethers.ContractFactory(ABI, BYTECODE, wallet)
  const contract = await factory.deploy()
  await contract.waitForDeployment()
  console.log("Contract deployed:", await contract.getAddress())
}

main()
