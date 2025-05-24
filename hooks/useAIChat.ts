import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { generateResponse } from '@/utils/openai';
import { useWallet } from '@/context/WalletContext';
import { useTokens } from '@/context/TokenContext';

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

export function useAIChat() {
  const { wallet, address } = useWallet();
  const { tokens } = useTokens();
  const [messages, setMessages] = useState<Message[]>([]);

  const handleCommand = useCallback(async (command: string) => {
    const commandParts = command.split(' ');
    const action = commandParts[0].toLowerCase();

    switch (action) {
      case '/balance':
        return `Current balances:\n${tokens
          .map(
            (token) =>
              `${token.symbol}: ${token.balance} (≈$${(
                parseFloat(token.balance) * token.price
              ).toFixed(2)})`
          )
          .join('\n')}`;

      case '/send':
        return 'To send tokens, please provide:\n1. Token symbol\n2. Recipient address\n3. Amount\n\nExample: /send VNST 0x... 100';

      case '/swap':
        return 'To swap tokens, please provide:\n1. From token symbol\n2. To token symbol\n3. Amount\n\nExample: /swap VNST vBTC 100';

      default:
        return null;
    }
  }, [tokens]);

  const sendMessage = async (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);

    try {
      let response;
      if (content.startsWith('/')) {
        response = await handleCommand(content);
      }

      if (!response) {
        response = await generateResponse([
          ...messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          { role: 'user' as const, content },
        ]);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      return assistantMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  return {
    messages,
    sendMessage,
    clearMessages: () => setMessages([]),
  };
}