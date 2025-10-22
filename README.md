# Cert Vault Aura

A next-generation decentralized credential management platform powered by Fully Homomorphic Encryption (FHE) technology, enabling secure certificate storage and verification while maintaining complete data privacy.

## 🎥 Demo Video

[![Cert Vault Aura Demo](https://img.shields.io/badge/📹_Watch_Demo-Video_16MB-blue?style=for-the-badge)](./cert-vault-aura.mov)

**Video Size**: 16MB (compressed from 367MB)  
**Duration**: 3 minutes 43 seconds  
**Features Demonstrated**: Complete FHE encryption flow, certificate creation, verification process, and wallet integration

## 🚀 Core Capabilities

- **Zero-Knowledge Verification**: Verify credentials without exposing sensitive information
- **Multi-Wallet Support**: Seamless integration with MetaMask, Rainbow, Coinbase Wallet, and more
- **Encrypted On-Chain Storage**: All certificate data encrypted using FHE before blockchain storage
- **Decentralized Trust**: Eliminate single points of failure in credential verification
- **Privacy-Preserving Operations**: Perform computations on encrypted data without decryption

## 🏗️ Architecture

- **Frontend**: React 18 with TypeScript and Vite
- **UI Framework**: shadcn/ui components with Tailwind CSS
- **Web3 Integration**: RainbowKit, Wagmi, and Viem for wallet connectivity
- **Blockchain**: Ethereum Sepolia Testnet
- **Encryption Engine**: Zama FHE for privacy-preserving computations
- **File Storage**: IPFS via Pinata for document storage

## 🔐 Smart Contract Details

### Contract Address
```
Sepolia Testnet: 0xe5FFE2e4c1686CE2F8ddcb610D9769323aC87293
```

### Key Functions

#### Certificate Management
```solidity
function issueCertificate(
    address _holder,
    string memory _certType,
    string memory _title,
    string memory _institution,
    string memory _description,
    string memory _metadataHash,
    externalEuint32 _encryptedScore,
    externalEuint32 _encryptedGrade,
    externalEuint32 _encryptedIssueDate,
    externalEuint32 _encryptedExpiryDate,
    bytes calldata inputProof
) public returns (uint256)
```

#### Verification System
```solidity
function requestVerification(
    uint256 _certId,
    string memory _verificationHash
) public returns (uint256)

function processVerification(
    uint256 _requestId,
    bool _isApproved
) public
```

### FHE Data Structure
```solidity
struct Certificate {
    uint256 certId;
    string certType;
    string title;
    string institution;
    string description;
    string metadataHash;
    address issuer;
    address holder;
    bool isVerified;
    uint8 status;
    euint32 encryptedScore;        // FHE encrypted
    euint32 encryptedGrade;        // FHE encrypted
    euint32 encryptedIssueDate;   // FHE encrypted
    euint32 encryptedExpiryDate;   // FHE encrypted
}
```

## 🔒 FHE Encryption/Decryption Logic

### Frontend Encryption Process

1. **Initialize FHE Instance**
```typescript
const { instance } = useZamaInstance();
const { address } = useAccount();
```

2. **Create Encrypted Input**
```typescript
const input = instance.createEncryptedInput(contractAddress, address);
input.add32(score);
input.add32(grade);
input.add32(issueDate);
input.add32(expiryDate);
```

3. **Encrypt and Submit**
```typescript
const encryptedInput = await input.encrypt();
const handles = encryptedInput.handles.map(convertHex);
const proof = `0x${Array.from(encryptedInput.inputProof)
    .map(b => b.toString(16).padStart(2, '0')).join('')}`;
```

### Frontend Decryption Process

1. **Generate Keypair**
```typescript
await instance.generateKeypair();
```

2. **Create EIP712 Signature**
```typescript
const eip712 = instance.createEIP712({
    domain: { name: "FHE", version: "1" },
    types: { Reencrypt: [{ name: "publicKey", type: "bytes" }] },
    primaryType: "Reencrypt"
});
```

3. **Wallet Signature**
```typescript
const signature = await signer.signTypedData(eip712.domain, eip712.types, eip712.message);
```

4. **Decrypt Data**
```typescript
const decryptedData = await instance.userDecrypt(encryptedHandles, signature);
```

### Contract-Side FHE Operations

```solidity
// Convert external FHE types to internal types
euint32 internalScore = FHE.fromExternal(_encryptedScore, inputProof);
euint32 internalGrade = FHE.fromExternal(_encryptedGrade, inputProof);

// Set ACL permissions for decryption
FHE.allowThis(certificates[certId].encryptedScore);
FHE.allow(certificates[certId].encryptedScore, msg.sender);
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MetaMask or compatible wallet
- Sepolia ETH for gas fees

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
# Network Configuration
VITE_CHAIN_ID=11155111
VITE_RPC_URL=https://1rpc.io/sepolia

# API Keys
VITE_ETHERSCAN_API_KEY=J8PU7AX1JX3RGEH1SNGZS4628BAH192Y3N
VITE_WALLET_CONNECT_PROJECT_ID=e08e99d213c331aa0fd00f625de06e66

# IPFS Configuration
VITE_PINATA_JWT=your_pinata_jwt_token
```

### Smart Contract Deployment

```bash
# Compile contracts
npm run compile

# Deploy to Sepolia
npm run deploy
```

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run compile      # Compile smart contracts
npm run deploy       # Deploy to Sepolia testnet
npm run lint         # Run ESLint
```

### Project Structure

```
cert-vault-aura/
├── contracts/           # Smart contracts
│   └── CertVaultAura.sol
├── src/
│   ├── components/      # React components
│   ├── hooks/          # Custom hooks
│   │   ├── useCertVaultAura.ts
│   │   └── useZamaInstance.ts
│   ├── pages/          # Page components
│   │   ├── AddCertificate.tsx
│   │   ├── Vault.tsx
│   │   └── VerifyCertificate.tsx
│   └── lib/            # Utilities
│       └── wallet.ts
├── scripts/            # Deployment scripts
└── artifacts/          # Compiled contracts
```

## 🛡️ Security Features

- **FHE Encryption**: All sensitive data encrypted on-chain using Zama FHE
- **Zero-Knowledge Proofs**: Verify data without revealing it
- **Access Control**: Role-based permissions for issuers and verifiers
- **Privacy-First**: User data never leaves their control
- **On-Chain Verification**: All operations verified on blockchain
- **IPFS Integration**: Decentralized file storage for certificates

## 🌐 Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set the framework to "Vite"
3. Add environment variables in Vercel dashboard
4. Deploy

### Smart Contract Deployment

1. Deploy the FHE contract to Sepolia testnet
2. Update the contract address in environment variables
3. Verify contract functionality

## 📊 Key Features Demonstrated

### 1. Certificate Creation
- FHE encryption of sensitive data (scores, grades, dates)
- IPFS document upload
- On-chain storage with privacy preservation

### 2. Certificate Verification
- Zero-knowledge verification process
- Verifier role-based access control
- On-chain verification status updates

### 3. Data Privacy
- Complete FHE encryption pipeline
- Wallet signature for decryption
- ACL-based access control

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Repository**: https://github.com/AliceCooperX/cert-vault-aura
- **Issues**: Use GitHub issues for bug reports and feature requests
- **Documentation**: See project documentation for detailed guides

---

**Project Status**: ✅ Active Development  
**Last Updated**: October 2025  
**Maintainer**: AliceCooperX  
**Contract Version**: v1.0.0  
**FHE Integration**: Zama FHE SDK v1.0.0