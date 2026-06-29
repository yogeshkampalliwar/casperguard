import { ethers } from "ethers";

export async function fetchWithX402(url, options = {}) {
    const response = await fetch(url, options);
    if (response.status === 402) {
        const { amount, contractAddress, abi } = await response.json();
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        const tx = await contract.payService({ value: ethers.parseEther(amount.toString()) });
        await tx.wait();
        return await fetch(url, { ...options, headers: { ...options.headers, 'X-Payment-Tx': tx.hash } });
    }
    return response;
}
