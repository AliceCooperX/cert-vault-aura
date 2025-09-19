# Vercel Deployment Guide for Cert Vault Aura

This guide provides step-by-step instructions for deploying the Cert Vault Aura application to Vercel.

## Prerequisites

- GitHub account with access to the repository
- Vercel account (free tier available)
- Deployed smart contract address (for production)

## Step-by-Step Deployment

### 1. Access Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "New Project" or "Import Project"

### 2. Import GitHub Repository

1. In the "Import Git Repository" section:
   - Select "GitHub" as the Git provider
   - Find and select `AliceCooperX/cert-vault-aura`
   - Click "Import"

### 3. Configure Project Settings

1. **Project Name**: `cert-vault-aura` (or your preferred name)
2. **Framework Preset**: Select "Vite"
3. **Root Directory**: Leave as default (`.`)
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. **Install Command**: `npm install`

### 4. Environment Variables Configuration

Click "Environment Variables" and add the following:

```env
# Chain Configuration
VITE_CHAIN_ID=11155111
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID

# Wallet Connect Configuration
VITE_WALLET_CONNECT_PROJECT_ID=YOUR_WALLET_CONNECT_PROJECT_ID

# Infura Configuration (Optional)
VITE_INFURA_API_KEY=YOUR_INFURA_API_KEY

# Contract Configuration (Update with your deployed contract address)
VITE_CONTRACT_ADDRESS=YOUR_DEPLOYED_CONTRACT_ADDRESS
```

**Important**: Replace `YOUR_DEPLOYED_CONTRACT_ADDRESS` with the actual deployed contract address.

### 5. Deploy the Application

1. Click "Deploy" button
2. Wait for the build process to complete (usually 2-3 minutes)
3. Once deployed, you'll receive a production URL (e.g., `https://cert-vault-aura.vercel.app`)

### 6. Verify Deployment

1. Visit your deployed URL
2. Test wallet connection functionality
3. Verify all features are working correctly
4. Check that the application loads without errors

## Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `VITE_CHAIN_ID` | Ethereum chain ID | Yes | `11155111` (Sepolia) |
| `VITE_RPC_URL` | RPC endpoint URL | Yes | `https://sepolia.infura.io/v3/YOUR_PROJECT_ID` |
| `VITE_WALLET_CONNECT_PROJECT_ID` | WalletConnect project ID | Yes | `YOUR_WALLET_CONNECT_PROJECT_ID` |
| `VITE_INFURA_API_KEY` | Infura API key | Optional | `YOUR_INFURA_API_KEY` |
| `VITE_CONTRACT_ADDRESS` | Deployed contract address | Yes | `0x...` |

## Smart Contract Deployment

Before deploying the frontend, you need to deploy the smart contract:

### 1. Deploy to Sepolia Testnet

```bash
# Install dependencies
npm install -g @fhevm/solidity

# Compile contract
npx fhevm compile contracts/CertVaultAura.sol

# Deploy contract
npx fhevm deploy --network sepolia contracts/CertVaultAura.sol
```

### 2. Update Environment Variables

After deployment, update the `VITE_CONTRACT_ADDRESS` in Vercel with your deployed contract address.

## Custom Domain (Optional)

To use a custom domain:

1. Go to Project Settings > Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate provisioning

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check that all environment variables are set
   - Verify Node.js version compatibility
   - Check for TypeScript errors

2. **Wallet Connection Issues**
   - Verify WalletConnect project ID
   - Check RPC URL configuration
   - Ensure contract address is correct

3. **Runtime Errors**
   - Check browser console for errors
   - Verify all environment variables
   - Test with different wallets

### Debug Steps

1. Check Vercel build logs for errors
2. Test locally with `npm run dev`
3. Verify environment variables in Vercel dashboard
4. Check browser console for client-side errors

## Performance Optimization

1. **Enable Vercel Analytics** (optional)
2. **Configure CDN settings** for better global performance
3. **Set up monitoring** for production issues

## Security Considerations

1. **Environment Variables**: Never commit sensitive keys to repository
2. **Contract Security**: Ensure smart contract is audited before mainnet
3. **Access Control**: Implement proper access controls in production

## Support

- **Repository**: https://github.com/AliceCooperX/cert-vault-aura
- **Documentation**: See README.md for detailed project information
- **Issues**: Use GitHub issues for bug reports and feature requests

---

**Deployment Status**: ✅ Ready for Production  
**Last Updated**: January 2025  
**Maintainer**: AliceCooperX
