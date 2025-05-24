import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useWallet } from '@/context/WalletContext';
import { sendTokens } from '@/utils/web3';
import { ethers } from 'ethers';

export function useTokenTransfer() {
  const { wallet } = useWallet();
  const [transferState, setTransferState] = useState({
    isLoading: false,
    error: null as string | null,
  });

  const transfer = async ({
    tokenAddress,
    recipientAddress,
    amount,
  }: {
    tokenAddress: string;
    recipientAddress: string;
    amount: string;
  }) => {
    if (!wallet) throw new Error('Wallet not connected');
    if (!ethers.isAddress(recipientAddress)) {
      throw new Error('Invalid recipient address');
    }

    setTransferState({ isLoading: true, error: null });
    try {
      const receipt = await sendTokens(
        tokenAddress,
        recipientAddress,
        amount,
        wallet
      );
      return receipt;
    } catch (error: any) {
      setTransferState({
        isLoading: false,
        error: error.message || 'Transfer failed',
      });
      throw error;
    } finally {
      setTransferState({ isLoading: false, error: null });
    }
  };

  return {
    transfer,
    ...transferState,
  };
}