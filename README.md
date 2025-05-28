# BitVest Wallet

A secure and feature-rich BSC wallet with AI assistance, powered by Expo and React Native.

## Features

- 🔐 Secure wallet creation and management
- 💱 Token swaps via PancakeSwap
- 🤖 AI-powered chat assistant
- 🌉 Cross-chain bridge support
- 🏦 vBTC minting and redemption
- 📱 Multi-wallet support
- 🔑 Biometric authentication
- 🔄 Real-time price updates

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/bitvest-wallet.git
cd bitvest-wallet
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Add your environment variables to `.env`:
```
EXPO_PUBLIC_BSC_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545
EXPO_PUBLIC_BSC_CHAIN_ID=97
EXPO_PUBLIC_BSC_EXPLORER=https://testnet.bscscan.com
EXPO_PUBLIC_VNST_CONTRACT=0x3b26fb89eab263cc6cb1e91f611bae8793f927ef
EXPO_PUBLIC_VBTC_CONTRACT=0x882c173bc7ff3b7786ca16dfed3dfffb9ee7847b
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key
EXPO_PUBLIC_COINGECKO_API_KEY=your_coingecko_api_key
EXPO_PUBLIC_BSCSCAN_API_KEY=your_bscscan_api_key
```

5. Start the development server:
```bash
npm run dev
```

### Building for Production

```bash
npm run build:web
```

## Architecture

- **Frontend**: React Native + Expo
- **Smart Contracts**: Solidity (BSC)
- **State Management**: React Context
- **AI Integration**: OpenAI GPT-4
- **Styling**: React Native StyleSheet

## Security Features

- Secure key storage
- Transaction signing
- Biometric authentication
- PIN protection
- Auto-lock timeout

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.