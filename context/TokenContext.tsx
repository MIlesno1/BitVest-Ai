import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { useWallet } from './WalletContext';

// Token interface
interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  balance: string;
  price: number;
  change24h: number;
  logoUrl: string;
}

// Context interface
interface TokenContextType {
  tokens: Token[];
  isLoading: boolean;
  totalBalanceUSD: number;
  refreshTokens: () => Promise<void>;
  getTokenBySymbol: (symbol: string) => Token | undefined;
}

// Default tokens
const DEFAULT_TOKENS: Token[] = [
  {
    address: '0x3b26fb89eab263cc6cb1e91f611bae8793f927ef',
    symbol: 'VNST',
    name: 'VNST',
    decimals: 18,
    balance: '0',
    price: 0,
    change24h: 0,
    logoUrl: 'https://assets.coingecko.com/coins/images/30246/small/vnst.png',
  },
  {
    address: '0x882c173bc7ff3b7786ca16dfed3dfffb9ee7847b',
    symbol: 'vBTC',
    name: 'Venus BTC',
    decimals: 8,
    balance: '0',
    price: 0,
    change24h: 0,
    logoUrl: 'https://assets.coingecko.com/coins/images/14362/small/vbtc.png',
  },
  {
    address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    symbol: 'BNB',
    name: 'Binance Coin',
    decimals: 18,
    balance: '0',
    price: 0,
    change24h: 0,
    logoUrl: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
  },
  {
    address: '0x55d398326f99059fF775485246999027B3197955',
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 18,
    balance: '0',
    price: 0,
    change24h: 0,
    logoUrl: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
  },
  {
    address: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
    symbol: 'BTCB',
    name: 'BTCB Token',
    decimals: 18,
    balance: '0',
    price: 0,
    change24h: 0,
    logoUrl: 'https://assets.coingecko.com/coins/images/14108/small/BTCB.png',
  },
];

// Create context
const TokenContext = createContext<TokenContextType | undefined>(undefined);

// ERC20 ABI for token interactions
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',
];

export const TokenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { wallet, address, hasWallet } = useWallet();
  const [tokens, setTokens] = useState<Token[]>(DEFAULT_TOKENS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalBalanceUSD, setTotalBalanceUSD] = useState<number>(0);

  // Fetch token balances and prices
  const fetchTokenData = async () => {
    if (!wallet || !hasWallet) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const provider = wallet.provider;
      const updatedTokens = [...tokens];
      let totalUSD = 0;

      // Fetch balances
      for (let i = 0; i < updatedTokens.length; i++) {
        const token = updatedTokens[i];
        try {
          if (token.address === '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c') {
            // Native BNB
            const balance = await provider.getBalance(address);
            updatedTokens[i] = {
              ...token,
              balance: ethers.formatUnits(balance, token.decimals),
            };
          } else {
            // ERC20 tokens
            const contract = new ethers.Contract(token.address, ERC20_ABI, provider);
            const balance = await contract.balanceOf(address);
            updatedTokens[i] = {
              ...token,
              balance: ethers.formatUnits(balance, token.decimals),
            };
          }
        } catch (error) {
          console.error(`Error fetching balance for ${token.symbol}:`, error);
        }
      }

      // Fetch prices from CoinGecko
      try {
        const tokenIds = 'binancecoin,bitcoin,tether'; // Add more as needed
        const priceResponse = await axios.get(
          `https://api.coingecko.com/api/v3/simple/price?ids=${tokenIds}&vs_currencies=usd&include_24hr_change=true`
        );
        
        // Map CoinGecko IDs to our tokens
        const priceMap = {
          'BNB': priceResponse.data.binancecoin,
          'BTCB': priceResponse.data.bitcoin,
          'USDT': priceResponse.data.tether,
          'vBTC': priceResponse.data.bitcoin, // Use BTC price for vBTC
          'VNST': { usd: 1, usd_24h_change: 0 }, // Stable coin, assumed $1
        };
        
        // Update token prices
        for (let i = 0; i < updatedTokens.length; i++) {
          const token = updatedTokens[i];
          const priceData = priceMap[token.symbol as keyof typeof priceMap];
          
          if (priceData) {
            updatedTokens[i] = {
              ...token,
              price: priceData.usd || 0,
              change24h: priceData.usd_24h_change || 0,
            };
            
            // Calculate USD value and add to total
            const tokenBalanceUSD = parseFloat(token.balance) * (priceData.usd || 0);
            totalUSD += tokenBalanceUSD;
          }
        }
      } catch (error) {
        console.error('Error fetching token prices:', error);
      }

      setTokens(updatedTokens);
      setTotalBalanceUSD(totalUSD);
    } catch (error) {
      console.error('Error in fetchTokenData:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load and wallet changes
  useEffect(() => {
    if (hasWallet) {
      fetchTokenData();
    }
  }, [wallet, hasWallet, address]);

  // Get token by symbol
  const getTokenBySymbol = (symbol: string): Token | undefined => {
    return tokens.find(token => token.symbol.toLowerCase() === symbol.toLowerCase());
  };

  // Refresh tokens data
  const refreshTokens = async () => {
    await fetchTokenData();
  };

  return (
    <TokenContext.Provider
      value={{
        tokens,
        isLoading,
        totalBalanceUSD,
        refreshTokens,
        getTokenBySymbol,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};

export const useTokens = () => {
  const context = useContext(TokenContext);
  if (context === undefined) {
    throw new Error('useTokens must be used within a TokenProvider');
  }
  return context;
};