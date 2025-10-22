import { useAccount, useWalletClient } from 'wagmi';
import { useMemo } from 'react';
import { ethers } from 'ethers';

export function useEthersSigner() {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();

  const signerPromise = useMemo(() => {
    if (!walletClient || !address) return null;
    
    return new Promise<ethers.Signer>((resolve, reject) => {
      try {
        const provider = new ethers.BrowserProvider(walletClient);
        const signer = provider.getSigner();
        resolve(signer);
      } catch (error) {
        reject(error);
      }
    });
  }, [walletClient, address]);

  return signerPromise;
}
