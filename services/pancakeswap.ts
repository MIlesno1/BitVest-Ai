import { ethers } from 'ethers';
import { Token, CurrencyAmount, Percent } from '@uniswap/sdk-core';
import { Pair, Route, Trade } from '@uniswap/v2-sdk';
import Constants from 'expo-constants';

// PancakeSwap Router ABI (simplified for common operations)
const PANCAKESWAP_ROUTER_ABI = [
  'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
  'function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)',
];

// PancakeSwap Router address on BSC Testnet
const PANCAKESWAP_ROUTER_ADDRESS = '0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3';

export class PancakeSwapService {
  private provider: ethers.Provider;
  private router: ethers.Contract;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(Constants.expoConfig?.extra?.EXPO_PUBLIC_BSC_RPC_URL);
    this.router = new ethers.Contract(
      PANCAKESWAP_ROUTER_ADDRESS,
      PANCAKESWAP_ROUTER_ABI,
      this.provider
    );
  }

  async getSwapQuote(
    tokenIn: Token,
    tokenOut: Token,
    amountIn: CurrencyAmount<Token>
  ) {
    try {
      const amounts = await this.router.getAmountsOut(
        amountIn.quotient.toString(),
        [tokenIn.address, tokenOut.address]
      );

      const amountOut = amounts[1];
      const slippageTolerance = new Percent('50', '10000'); // 0.5%

      return {
        amountIn: amountIn.quotient.toString(),
        amountOut: amountOut.toString(),
        minimumAmountOut: amountOut.mul(1000 - slippageTolerance.numerator)
          .div(1000)
          .toString(),
        path: [tokenIn.address, tokenOut.address],
        deadline: Math.floor(Date.now() / 1000) + 20 * 60, // 20 minutes
      };
    } catch (error) {
      console.error('Error getting swap quote:', error);
      throw new Error('Failed to get swap quote');
    }
  }

  async executeSwap(
    signer: ethers.Signer,
    quote: {
      amountIn: string;
      minimumAmountOut: string;
      path: string[];
      deadline: number;
    }
  ) {
    try {
      const routerWithSigner = this.router.connect(signer);
      const tx = await routerWithSigner.swapExactTokensForTokens(
        quote.amountIn,
        quote.minimumAmountOut,
        quote.path,
        await signer.getAddress(),
        quote.deadline
      );
      return tx.wait();
    } catch (error) {
      console.error('Error executing swap:', error);
      throw new Error('Failed to execute swap');
    }
  }
}

export const pancakeSwapService = new PancakeSwapService();