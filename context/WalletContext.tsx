import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { ethers } from 'ethers';
import { Platform } from 'react-native';

interface WalletContextType {
  wallet: ethers.Wallet | null;
  address: string;
  balance: string;
  isLoading: boolean;
  createWallet: () => Promise<void>;
  importWallet: (mnemonic: string) => Promise<boolean>;
  exportWallet: () => Promise<string>;
  disconnectWallet: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  hasWallet: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Mock secure storage for web platform
const secureStorage = {
  setItemAsync: async (key: string, value: string) => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    return SecureStore.setItemAsync(key, value);
  },
  getItemAsync: async (key: string) => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
  },
  deleteItemAsync: async (key: string) => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return;
    }
    return SecureStore.deleteItemAsync(key);
  }
};

// BSC RPC URL
const BSC_RPC_URL = 'https://bsc-dataseed.binance.org/';

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<ethers.Wallet | null>(null);
  const [address, setAddress] = useState<string>('');
  const [balance, setBalance] = useState<string>('0');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasWallet, setHasWallet] = useState<boolean>(false);

  // Initialize wallet from storage
  useEffect(() => {
    const initWallet = async () => {
      try {
        const storedMnemonic = await secureStorage.getItemAsync('wallet_mnemonic');
        if (storedMnemonic) {
          const provider = new ethers.JsonRpcProvider(BSC_RPC_URL);
          const walletInstance = ethers.Wallet.fromPhrase(storedMnemonic).connect(provider);
          setWallet(walletInstance);
          setAddress(walletInstance.address);
          setHasWallet(true);
          await fetchBalance(walletInstance);
        }
      } catch (error) {
        console.error('Failed to initialize wallet:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initWallet();
  }, []);

  // Fetch native token (BNB) balance
  const fetchBalance = async (walletInstance: ethers.Wallet) => {
    try {
      const balance = await walletInstance.provider.getBalance(walletInstance.address);
      setBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    }
  };

  // Create a new wallet
  const createWallet = async () => {
    try {
      setIsLoading(true);
      const provider = new ethers.JsonRpcProvider(BSC_RPC_URL);
      const walletInstance = ethers.Wallet.createRandom().connect(provider);
      
      await secureStorage.setItemAsync('wallet_mnemonic', walletInstance.mnemonic?.phrase || '');
      
      setWallet(walletInstance);
      setAddress(walletInstance.address);
      setHasWallet(true);
      await fetchBalance(walletInstance);
    } catch (error) {
      console.error('Failed to create wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Import an existing wallet
  const importWallet = async (mnemonic: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Validate mnemonic
      if (!ethers.Mnemonic.isValidMnemonic(mnemonic)) {
        return false;
      }
      
      const provider = new ethers.JsonRpcProvider(BSC_RPC_URL);
      const walletInstance = ethers.Wallet.fromPhrase(mnemonic).connect(provider);
      
      await secureStorage.setItemAsync('wallet_mnemonic', mnemonic);
      
      setWallet(walletInstance);
      setAddress(walletInstance.address);
      setHasWallet(true);
      await fetchBalance(walletInstance);
      return true;
    } catch (error) {
      console.error('Failed to import wallet:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Export wallet (reveal mnemonic)
  const exportWallet = async (): Promise<string> => {
    try {
      const mnemonic = await secureStorage.getItemAsync('wallet_mnemonic');
      return mnemonic || '';
    } catch (error) {
      console.error('Failed to export wallet:', error);
      return '';
    }
  };

  // Disconnect wallet
  const disconnectWallet = async () => {
    try {
      await secureStorage.deleteItemAsync('wallet_mnemonic');
      setWallet(null);
      setAddress('');
      setBalance('0');
      setHasWallet(false);
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  // Refresh wallet balance
  const refreshBalance = async () => {
    if (wallet) {
      await fetchBalance(wallet);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        address,
        balance,
        isLoading,
        createWallet,
        importWallet,
        exportWallet,
        disconnectWallet,
        refreshBalance,
        hasWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};