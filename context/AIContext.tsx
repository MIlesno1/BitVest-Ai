import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { useWallet } from './WalletContext';
import { useTokens } from './TokenContext';

// Message interface
interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isCommand?: boolean;
  commandType?: string;
}

// Context interface
interface AIContextType {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (content: string, isCommand?: boolean) => Promise<void>;
  clearMessages: () => void;
  commandHistory: string[];
}

// Command mapping
const COMMANDS = {
  '/send': 'Send tokens to an address',
  '/receive': 'Show your receiving address/QR',
  '/swap': 'Swap between tokens',
  '/bridge': 'Bridge assets to/from another chain',
  '/createwallet': 'Create a new local wallet',
  '/importwallet': 'Import wallet using seed phrase',
  '/exportwallet': 'Show backup or private key',
  '/balance': 'Show current token balances',
  '/transactions': 'List past transactions',
  '/portfolio': 'Show total wallet value in USD',
  '/price': 'Show price of a token',
  '/chart': 'View token chart',
  '/gas': 'Show BSC gas price and estimated fees',
  '/learn': 'Start a structured lesson',
  '/ask': 'Ask anything about crypto',
  '/tip': 'Random crypto or security tip',
};

const AIContext = createContext<AIContextType | undefined>(undefined);

// Mock AI response function (replace with actual OpenAI integration)
const getAIResponse = async (
  prompt: string, 
  isCommand: boolean, 
  wallet: any, 
  tokens: any
): Promise<string> => {
  // In production, this would call the OpenAI API
  // For now, we'll simulate responses based on commands
  
  if (isCommand) {
    const command = prompt.split(' ')[0].toLowerCase();
    
    switch (command) {
      case '/balance':
        return `Here's your current balance:\n\n${tokens.tokens.map((token: any) => 
          `${token.symbol}: ${parseFloat(token.balance).toFixed(6)} (${token.price ? '$' + (parseFloat(token.balance) * token.price).toFixed(2) : 'Price unavailable'})`
        ).join('\n')}`;
        
      case '/receive':
        return `Your wallet address is:\n\n${wallet.address}\n\nYou can share this address to receive any BSC tokens. Make sure to verify it's the correct chain before sending.`;
        
      case '/portfolio':
        return `Your portfolio value: $${tokens.totalBalanceUSD.toFixed(2)}\n\n${tokens.tokens.map((token: any) => 
          `${token.symbol}: ${parseFloat(token.balance).toFixed(6)} (${token.price ? '$' + (parseFloat(token.balance) * token.price).toFixed(2) : 'Price unavailable'})`
        ).join('\n')}`;
        
      case '/price':
        const tokenSymbol = prompt.split(' ')[1]?.toUpperCase() || 'BTC';
        const token = tokens.tokens.find((t: any) => t.symbol.toUpperCase() === tokenSymbol);
        if (token) {
          return `Current ${token.name} (${token.symbol}) price: $${token.price.toFixed(2)}\n24h change: ${token.change24h.toFixed(2)}%`;
        } else {
          return `I couldn't find price information for ${tokenSymbol}. Try one of: BNB, VNST, vBTC, USDT, BTCB.`;
        }
        
      case '/createwallet':
        return "To create a new wallet, please go to the wallet section and tap 'Create New Wallet'. This will generate a new wallet and backup phrase. Make sure to securely save your backup phrase!";
        
      case '/learn':
        const topic = prompt.substring(7).trim() || 'crypto basics';
        return `Let's learn about ${topic}. What specific aspect would you like to understand better?`;
        
      case '/tip':
        const tips = [
          "Never share your private keys or seed phrase with anyone.",
          "Always double-check addresses before sending crypto.",
          "Consider using hardware wallets for large holdings.",
          "Backup your wallet recovery phrase in multiple secure locations.",
          "Be wary of phishing attempts and fake websites.",
          "Use different wallets for different purposes: trading, holding, DeFi."
        ];
        return `Tip: ${tips[Math.floor(Math.random() * tips.length)]}`;
        
      default:
        return `I understand you want to ${COMMANDS[command as keyof typeof COMMANDS] || command}. How can I help you with this?`;
    }
  } else {
    // Handle regular questions
    if (prompt.toLowerCase().includes('what is vbtc')) {
      return "vBTC (Venus BTC) is a tokenized version of Bitcoin on the Binance Smart Chain. It allows you to utilize Bitcoin in BSC's DeFi ecosystem, enabling yield generation, lending, and borrowing.";
    } else if (prompt.toLowerCase().includes('what is vnst')) {
      return "VNST is a stablecoin on the Binance Smart Chain designed to maintain a value pegged to 1 USD. It's used for trading, payments, and DeFi applications in the BSC ecosystem.";
    } else if (prompt.toLowerCase().includes('how to swap')) {
      return "To swap tokens:\n1. Use the /swap command\n2. Select the token you want to swap from\n3. Select the token you want to swap to\n4. Enter the amount\n5. Review the rate and fees\n6. Confirm the swap";
    } else {
      return "I'm your AI assistant for VerBit Wallet. I can help with wallet operations, token information, and crypto education. Try commands like /balance, /price vbtc, or /tip for useful features!";
    }
  }
};

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Welcome to VerBit Wallet! I'm your AI assistant. I can help you manage your crypto, learn about blockchain, and execute wallet commands. Try typing /help to see what I can do!",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const { wallet, address } = useWallet();
  const tokens = useTokens();

  // Send message
  const sendMessage = async (content: string, isCommand: boolean = false) => {
    try {
      // Determine if it's a command
      const isCmd = isCommand || content.startsWith('/');
      const commandType = isCmd ? content.split(' ')[0].toLowerCase() : undefined;
      
      // Create user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content,
        timestamp: new Date(),
        isCommand: isCmd,
        commandType,
      };
      
      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);
      
      // Add to command history if it's a command
      if (isCmd) {
        setCommandHistory(prev => [content, ...prev.slice(0, 9)]);
      }
      
      // Get AI response
      const aiResponse = await getAIResponse(content, isCmd, { address }, tokens);
      
      // Create AI message
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear messages
  const clearMessages = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: "Welcome to VerBit Wallet! I'm your AI assistant. I can help you manage your crypto, learn about blockchain, and execute wallet commands. Try typing /help to see what I can do!",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <AIContext.Provider
      value={{
        messages,
        isLoading,
        sendMessage,
        clearMessages,
        commandHistory,
      }}
    >
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};