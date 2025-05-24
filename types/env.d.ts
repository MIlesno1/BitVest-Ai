declare module '@env' {
  export const EXPO_PUBLIC_BSC_RPC_URL: string;
  export const EXPO_PUBLIC_BSC_CHAIN_ID: string;
  export const EXPO_PUBLIC_BSC_EXPLORER: string;
  export const EXPO_PUBLIC_VNST_CONTRACT: string;
  export const EXPO_PUBLIC_VBTC_CONTRACT: string;
  export const EXPO_PUBLIC_OPENAI_API_KEY: string;
  export const EXPO_PUBLIC_COINGECKO_API_KEY: string;
  export const EXPO_PUBLIC_BSCSCAN_API_KEY: string;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_BSC_RPC_URL: string;
      EXPO_PUBLIC_BSC_CHAIN_ID: string;
      EXPO_PUBLIC_BSC_EXPLORER: string;
      EXPO_PUBLIC_VNST_CONTRACT: string;
      EXPO_PUBLIC_VBTC_CONTRACT: string;
      EXPO_PUBLIC_OPENAI_API_KEY: string;
      EXPO_PUBLIC_COINGECKO_API_KEY: string;
      EXPO_PUBLIC_BSCSCAN_API_KEY: string;
    }
  }
}

export {};