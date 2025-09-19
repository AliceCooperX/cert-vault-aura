import { useWriteContract, useReadContract, useAccount } from 'wagmi';
import { contractConfig } from '../lib/wallet';
import { useState } from 'react';

export function useCertVaultAura() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Register Issuer
  const registerIssuer = async (name: string, description: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await writeContract({
        address: contractConfig.address,
        abi: contractConfig.abi,
        functionName: 'registerIssuer',
        args: [name, description],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register issuer');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Issue Certificate
  const issueCertificate = async (
    holder: string,
    certType: string,
    metadataHash: string,
    issueDate: string,
    expiryDate: string
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await writeContract({
        address: contractConfig.address,
        abi: contractConfig.abi,
        functionName: 'issueCertificate',
        args: [holder, certType, metadataHash, issueDate, expiryDate],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to issue certificate');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Request Verification
  const requestVerification = async (certId: number, verificationHash: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await writeContract({
        address: contractConfig.address,
        abi: contractConfig.abi,
        functionName: 'requestVerification',
        args: [certId, verificationHash],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to request verification');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Revoke Certificate
  const revokeCertificate = async (certId: number) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await writeContract({
        address: contractConfig.address,
        abi: contractConfig.abi,
        functionName: 'revokeCertificate',
        args: [certId],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to revoke certificate');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    registerIssuer,
    issueCertificate,
    requestVerification,
    revokeCertificate,
    isLoading,
    error,
    address,
  };
}
