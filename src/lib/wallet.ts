import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

// Wallet Connect Configuration
export const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || '2ec9743d0d0cd7fb94dee1a7e6d33475';

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
  abi: [
    // Contract ABI will be added here
  ],
};

// RPC Configuration
export const rpcConfig = {
  chainId: parseInt(import.meta.env.VITE_CHAIN_ID || '11155111'),
  rpcUrl: import.meta.env.VITE_RPC_URL || 'https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990',
};
