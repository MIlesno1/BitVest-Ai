import { ethers } from 'ethers';
import Constants from 'expo-constants';

// ABI for ERC20 tokens
export const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',
  'function transfer(address to, uint amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'event Transfer(address indexed from, address indexed to, uint amount)',
];

// Initialize provider
export const provider = new ethers.JsonRpcProvider(
  Constants.expoConfig?.extra?.EXPO_PUBLIC_BSC_RPC_URL
);

// Create contract instances
export const getTokenContract = (address: string, signerOrProvider = provider) => {
  return new ethers.Contract(address, ERC20_ABI, signerOrProvider);
};

// Get token balance
export const getTokenBalance = async (tokenAddress: string, walletAddress: string) => {
  const contract = getTokenContract(tokenAddress);
  const balance = await contract.balanceOf(walletAddress);
  const decimals = await contract.decimals();
  return ethers.formatUnits(balance, decimals);
};

// Send tokens
export const sendTokens = async (
  tokenAddress: string,
  recipientAddress: string,
  amount: string,
  signer: ethers.Signer
) => {
  const contract = getTokenContract(tokenAddress, signer);
  const decimals = await contract.decimals();
  const parsedAmount = ethers.parseUnits(amount, decimals);
  const tx = await contract.transfer(recipientAddress, parsedAmount);
  return tx.wait();
};

// Approve tokens for swap
export const approveTokens = async (
  tokenAddress: string,
  spenderAddress: string,
  amount: string,
  signer: ethers.Signer
) => {
  const contract = getTokenContract(tokenAddress, signer);
  const decimals = await contract.decimals();
  const parsedAmount = ethers.parseUnits(amount, decimals);
  const tx = await contract.approve(spenderAddress, parsedAmount);
  return tx.wait();
};