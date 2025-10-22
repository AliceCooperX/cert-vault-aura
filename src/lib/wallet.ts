import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';
// @ts-ignore: import compiled artifact JSON for ABI only
import CertVaultAuraArtifact from '../../artifacts/contracts/CertVaultAura.sol/CertVaultAura.json';

// Wallet Connect Configuration
export const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || 'YOUR_WALLET_CONNECT_PROJECT_ID';

// RainbowKit Configuration
export const config = getDefaultConfig({
  appName: 'Cert Vault Aura',
  projectId,
  chains: [sepolia],
  ssr: false, // If your dApp uses server side rendering (SSR)
});

// Contract Configuration
export const contractConfig = {
  address: import.meta.env.VITE_CONTRACT_ADDRESS as `0x${string}`,
  abi: (CertVaultAuraArtifact as any)?.abi ?? [],
} as const;

if (!contractConfig.address) {
  // eslint-disable-next-line no-console
  console.warn('[wallet] VITE_CONTRACT_ADDRESS is not set');
}

// RPC Configuration
export const rpcConfig = {
  chainId: parseInt(import.meta.env.VITE_CHAIN_ID || '11155111'),
  rpcUrl: import.meta.env.VITE_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID',
};
