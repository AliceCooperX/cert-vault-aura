# Cert Vault Aura

A decentralized certificate vault platform with FHE (Fully Homomorphic Encryption) for secure credential management and verification.

## Features

- **FHE-Encrypted Storage**: All certificates and credentials are encrypted using Fully Homomorphic Encryption
- **Real Wallet Integration**: Connect with MetaMask, Rainbow, and other popular wallets
- **Decentralized Verification**: Verify certificates without revealing sensitive data
- **Privacy-First Design**: User data never leaves their control
- **On-Chain Security**: All operations verified on blockchain

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS
- **Wallet Integration**: RainbowKit, Wagmi, Viem
- **Blockchain**: Ethereum (Sepolia Testnet)
- **Encryption**: FHE (Fully Homomorphic Encryption)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MetaMask or compatible wallet

### Installation

```bash
# Clone the repository
git clone https://github.com/AliceCooperX/cert-vault-aura.git

# Navigate to project directory
cd cert-vault-aura

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=2ec9743d0d0cd7fb94dee1a7e6d33475
NEXT_PUBLIC_INFURA_API_KEY=b18fb7e6ca7045ac83c41157ab93f990
VITE_CONTRACT_ADDRESS=YOUR_DEPLOYED_CONTRACT_ADDRESS
```

## Smart Contract

The platform uses a custom FHE-enabled smart contract for secure certificate management:

- **Encrypted Storage**: All certificate data is encrypted on-chain
- **Zero-Knowledge Verification**: Verify credentials without revealing data
- **Access Control**: Role-based permissions for different user types
- **Privacy-Preserving Operations**: Perform computations on encrypted data

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set the framework to "Vite"
3. Add environment variables in Vercel dashboard
4. Deploy

### Smart Contract Deployment

1. Deploy the FHE contract to Sepolia testnet
2. Update the contract address in environment variables
3. Verify contract functionality

## Security Features

- **FHE Encryption**: All sensitive data encrypted on-chain
- **Zero-Knowledge Proofs**: Verify data without revealing it
- **Access Control**: Role-based permissions
- **Privacy-First**: User data never leaves their control
- **On-Chain Verification**: All operations verified on blockchain

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

- Repository: https://github.com/AliceCooperX/cert-vault-aura
- Issues: Use GitHub issues for bug reports and feature requests
- Documentation: See project documentation for detailed guides

---

**Project Status**: ✅ Active Development  
**Last Updated**: January 2025  
**Maintainer**: AliceCooperX