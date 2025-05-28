import OpenAI from 'openai';
import { ethers } from 'ethers';
import Constants from 'expo-constants';
import { sendToken, swapTokens, bridgeToken, mintVBTC, redeemVBTC } from './transactions';

const openai = new OpenAI({
  apiKey: Constants.expoConfig?.extra?.EXPO_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

interface TransactionContext {
  signer: ethers.Signer;
  tokens: any[];
  address: string;
}

export async function processAICommand(
  command: string,
  context: TransactionContext
) {
  try {
    const { signer, tokens, address } = context;
    const parts = command.toLowerCase().split(' ');
    const action = parts[0];

    switch (action) {
      case '/send':
        const [_, tokenSymbol, toAddress, amount] = parts;
        const token = tokens.find(t => t.symbol.toLowerCase() === tokenSymbol);
        if (!token) throw new Error('Token not found');
        return await sendToken(token.address, toAddress, amount, signer);

      case '/swap':
        const [__, fromSymbol, toSymbol, swapAmount] = parts;
        const fromToken = tokens.find(t => t.symbol.toLowerCase() === fromSymbol);
        const toToken = tokens.find(t => t.symbol.toLowerCase() === toSymbol);
        if (!fromToken || !toToken) throw new Error('Token not found');
        return await swapTokens(fromToken.address, toToken.address, swapAmount, signer);

      case '/bridge':
        const [___, bridgeAmount, destChain, destAddress] = parts;
        return await bridgeToken(bridgeAmount, destChain, destAddress, signer);

      case '/mint':
        const [____, mintAmount] = parts;
        return await mintVBTC(mintAmount, signer);

      case '/redeem':
        const [_____, redeemAmount] = parts;
        return await redeemVBTC(redeemAmount, signer);

      default:
        // Process natural language with GPT-4
        const completion = await openai.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful crypto wallet assistant. Help users understand and execute transactions safely.',
            },
            {
              role: 'user',
              content: command,
            },
          ],
        });
        return completion.choices[0].message.content;
    }
  } catch (error) {
    console.error('AI command processing error:', error);
    throw error;
  }
}