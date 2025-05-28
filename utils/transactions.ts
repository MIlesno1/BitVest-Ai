import { ethers } from 'ethers';
import { provider } from './web3';
import Constants from 'expo-constants';

// Contract ABIs
const PANCAKESWAP_ROUTER_ABI = [
  'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
  'function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)',
];

const BRIDGE_ABI = [
  'function bridge(uint256 amount, string memory destinationChain, string memory destinationAddress) external',
  'function claim(bytes32 txHash) external',
];

const VBTC_MINT_ABI = [
  'function mint(uint256 amount) external',
  'function redeem(uint256 amount) external',
];

// Contract addresses
const PANCAKESWAP_ROUTER = '0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3';
const BRIDGE_CONTRACT = '0x...' // Add your bridge contract address
const VBTC_CONTRACT = Constants.expoConfig?.extra?.EXPO_PUBLIC_VBTC_CONTRACT;

export async function sendToken(
  tokenAddress: string,
  recipientAddress: string,
  amount: string,
  signer: ethers.Signer
) {
  try {
    const contract = new ethers.Contract(tokenAddress, ['function transfer(address to, uint256 amount)'], signer);
    const tx = await contract.transfer(recipientAddress, ethers.parseEther(amount));
    return await tx.wait();
  } catch (error) {
    console.error('Send token error:', error);
    throw new Error('Failed to send token');
  }
}

export async function swapTokens(
  tokenInAddress: string,
  tokenOutAddress: string,
  amountIn: string,
  signer: ethers.Signer
) {
  try {
    const router = new ethers.Contract(PANCAKESWAP_ROUTER, PANCAKESWAP_ROUTER_ABI, signer);
    const amountInWei = ethers.parseEther(amountIn);
    
    // Get amounts out
    const amounts = await router.getAmountsOut(amountInWei, [tokenInAddress, tokenOutAddress]);
    const amountOutMin = amounts[1].mul(95).div(100); // 5% slippage
    
    // Execute swap
    const deadline = Math.floor(Date.now() / 1000) + 20 * 60; // 20 minutes
    const tx = await router.swapExactTokensForTokens(
      amountInWei,
      amountOutMin,
      [tokenInAddress, tokenOutAddress],
      await signer.getAddress(),
      deadline
    );
    
    return await tx.wait();
  } catch (error) {
    console.error('Swap error:', error);
    throw new Error('Failed to swap tokens');
  }
}

export async function bridgeToken(
  amount: string,
  destinationChain: string,
  destinationAddress: string,
  signer: ethers.Signer
) {
  try {
    const bridge = new ethers.Contract(BRIDGE_CONTRACT, BRIDGE_ABI, signer);
    const tx = await bridge.bridge(
      ethers.parseEther(amount),
      destinationChain,
      destinationAddress
    );
    return await tx.wait();
  } catch (error) {
    console.error('Bridge error:', error);
    throw new Error('Failed to bridge tokens');
  }
}

export async function mintVBTC(amount: string, signer: ethers.Signer) {
  try {
    const vbtc = new ethers.Contract(VBTC_CONTRACT, VBTC_MINT_ABI, signer);
    const tx = await vbtc.mint(ethers.parseEther(amount));
    return await tx.wait();
  } catch (error) {
    console.error('Mint error:', error);
    throw new Error('Failed to mint vBTC');
  }
}

export async function redeemVBTC(amount: string, signer: ethers.Signer) {
  try {
    const vbtc = new ethers.Contract(VBTC_CONTRACT, VBTC_MINT_ABI, signer);
    const tx = await vbtc.redeem(ethers.parseEther(amount));
    return await tx.wait();
  } catch (error) {
    console.error('Redeem error:', error);
    throw new Error('Failed to redeem vBTC');
  }
}