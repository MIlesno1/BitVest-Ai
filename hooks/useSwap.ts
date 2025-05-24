import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Token, CurrencyAmount } from '@uniswap/sdk-core';
import { pancakeSwapService } from '@/services/pancakeswap';
import { useWallet } from '@/context/WalletContext';
import { approveTokens } from '@/utils/web3';

export function useSwap() {
  const { wallet } = useWallet();
  const [swapState, setSwapState] = useState({
    isLoading: false,
    error: null as string | null,
  });

  const getQuote = async (
    tokenIn: Token,
    tokenOut: Token,
    amountIn: string
  ) => {
    const amount = CurrencyAmount.fromRawAmount(
      tokenIn,
      amountIn
    );
    return pancakeSwapService.getSwapQuote(tokenIn, tokenOut, amount);
  };

  const executeSwap = async (
    tokenIn: Token,
    quote: {
      amountIn: string;
      minimumAmountOut: string;
      path: string[];
      deadline: number;
    }
  ) => {
    if (!wallet) throw new Error('Wallet not connected');

    setSwapState({ isLoading: true, error: null });
    try {
      // First approve the router to spend tokens
      await approveTokens(
        tokenIn.address,
        pancakeSwapService.ROUTER_ADDRESS,
        quote.amountIn,
        wallet
      );

      // Execute the swap
      const receipt = await pancakeSwapService.executeSwap(wallet, quote);
      return receipt;
    } catch (error: any) {
      setSwapState({
        isLoading: false,
        error: error.message || 'Swap failed',
      });
      throw error;
    } finally {
      setSwapState({ isLoading: false, error: null });
    }
  };

  return {
    getQuote,
    executeSwap,
    ...swapState,
  };
}