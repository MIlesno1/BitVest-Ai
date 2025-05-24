import axios from 'axios';
import Constants from 'expo-constants';

const COINGECKO_API_KEY = Constants.expoConfig?.extra?.EXPO_PUBLIC_COINGECKO_API_KEY;
const BSCSCAN_API_KEY = Constants.expoConfig?.extra?.EXPO_PUBLIC_BSCSCAN_API_KEY;

// CoinGecko API
const coingeckoApi = axios.create({
  baseURL: 'https://pro-api.coingecko.com/api/v3',
  params: {
    x_cg_pro_api_key: COINGECKO_API_KEY,
  },
});

// BSCScan API
const bscscanApi = axios.create({
  baseURL: 'https://api-testnet.bscscan.com/api',
  params: {
    apikey: BSCSCAN_API_KEY,
  },
});

export const getTokenPrices = async (tokenIds: string[]) => {
  try {
    const response = await coingeckoApi.get('/simple/price', {
      params: {
        ids: tokenIds.join(','),
        vs_currencies: 'usd',
        include_24hr_change: true,
      },
    });
    return response.data;
  } catch (error) {
    console.error('CoinGecko API Error:', error);
    throw new Error('Failed to fetch token prices');
  }
};

export const getTransactionHistory = async (address: string) => {
  try {
    const response = await bscscanApi.get('', {
      params: {
        module: 'account',
        action: 'txlist',
        address,
        startblock: 0,
        endblock: 99999999,
        sort: 'desc',
      },
    });
    return response.data.result;
  } catch (error) {
    console.error('BSCScan API Error:', error);
    throw new Error('Failed to fetch transaction history');
  }
};