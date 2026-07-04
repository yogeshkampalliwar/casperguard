import { ethers } from "ethers";

const X402_CONTRACT = "0x6E7454907D72bd5eff1e93b4f37CD57Dc527D809";
const X402_ABI = [
  "function payService(string calldata serviceId) external payable",
  "function getBalance(address user) external view returns (uint256)",
  "function withdraw() external",
  "event PaymentReceived(address indexed payer, string serviceId, uint256 amount)"
];

export async function connectWallet() {
  if (!window.ethereum) throw new Error("MetaMask not found");
  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  return { provider, signer };
}

export async function payForScan(serviceId = "casperguard-scan") {
  const { signer } = await connectWallet();
  const contract = new ethers.Contract(X402_CONTRACT, X402_ABI, signer);
  const amount = ethers.parseEther("0.001");
  const tx = await contract.payService(serviceId, { value: amount });
  await tx.wait();
  return tx.hash;
}

export async function fetchWithX402(url, options = {}) {
  const response = await fetch(url, options);
  if (response.status === 402) {
    const { amount, contractAddress, serviceId } = await response.json();
    const { signer } = await connectWallet();
    const contract = new ethers.Contract(
      contractAddress || X402_CONTRACT,
      X402_ABI,
      signer
    );
    const tx = await contract.payService(serviceId || "casperguard-scan", {
      value: ethers.parseEther((amount || 0.001).toString())
    });
    await tx.wait();
    return await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        "X-Payment-Tx": tx.hash,
        "X-Payment-Amount": amount || "0.001",
        "X-Payment-Network": "base-sepolia"
      }
    });
  }
  return response;
}

export async function getPaymentBalance(address) {
  if (!address) return "0";
  const { provider } = await connectWallet();
  const contract = new ethers.Contract(X402_CONTRACT, X402_ABI, provider);
  const balance = await contract.getBalance(address);
  return ethers.formatEther(balance);
}

export async function withdrawPayments() {
  const { signer } = await connectWallet();
  const contract = new ethers.Contract(X402_CONTRACT, X402_ABI, signer);
  const tx = await contract.withdraw();
  await tx.wait();
  return tx.hash;
}
