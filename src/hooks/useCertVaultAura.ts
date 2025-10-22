import { useWriteContract, useReadContract, useAccount } from 'wagmi';
import { contractConfig } from '../lib/wallet';
import { useState } from 'react';
import { useZamaInstance } from './useZamaInstance';
import { useEthersSigner } from './useEthersSigner';

export function useCertVaultAura() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const { instance } = useZamaInstance();
  const signerPromise = useEthersSigner();
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

  // Issue Certificate with FHE encryption
  const issueCertificate = async (
    holder: string,
    certType: string,
    metadataHash: string,
    issueDate: number,
    expiryDate: number,
    score: number,
    grade: number
  ) => {
    if (!instance || !address || !signerPromise) {
      throw new Error('Missing wallet or encryption service');
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Create encrypted input
      const input = instance.createEncryptedInput(contractConfig.address, address);
      input.add32(BigInt(issueDate));
      input.add32(BigInt(expiryDate));
      input.add32(BigInt(score));
      input.add32(BigInt(grade));
      
      const encryptedInput = await input.encrypt();
      
      // Convert handles to proper format
      const convertHex = (handle: any): string => {
        if (typeof handle === 'string') {
          return handle.startsWith('0x') ? handle : `0x${handle}`;
        } else if (handle instanceof Uint8Array) {
          return `0x${Array.from(handle).map(b => b.toString(16).padStart(2, '0')).join('')}`;
        } else if (Array.isArray(handle)) {
          return `0x${handle.map(b => b.toString(16).padStart(2, '0')).join('')}`;
        }
        return `0x${handle.toString()}`;
      };
      
      const handles = encryptedInput.handles.map(convertHex);
      const proof = `0x${Array.from(encryptedInput.inputProof)
        .map(b => b.toString(16).padStart(2, '0')).join('')}`;
      
      await writeContractAsync({
        address: contractConfig.address as `0x${string}`,
        abi: contractConfig.abi,
        functionName: 'issueCertificate',
        args: [holder, certType, metadataHash, handles[0], handles[1], handles[2], handles[3], proof],
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

  // Encrypt and store certificate data on-chain
  const encryptCertificateData = async (
    certId: number,
    encryptedScore: string,
    encryptedGrade: string,
    dataHash: string
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await writeContract({
        address: contractConfig.address,
        abi: contractConfig.abi,
        functionName: 'encryptCertificateData',
        args: [certId, encryptedScore, encryptedGrade, dataHash],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to encrypt certificate data');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Update certificate with encrypted data
  const updateCertificateWithEncryptedData = async (
    certId: number,
    newStatus: number,
    encryptedUpdateData: string
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await writeContract({
        address: contractConfig.address,
        abi: contractConfig.abi,
        functionName: 'updateCertificateWithEncryptedData',
        args: [certId, newStatus, encryptedUpdateData],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update certificate');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Decrypt certificate data
  const decryptCertificateData = async (certId: number) => {
    if (!instance || !address || !signerPromise) {
      throw new Error('Missing wallet or encryption service');
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Get encrypted data from contract
      const encryptedData = await contractConfig.abi.find(
        (item: any) => item.name === 'getCertificateEncryptedData'
      );
      
      if (!encryptedData) {
        throw new Error('Contract ABI not found');
      }
      
      // This would need to be implemented with actual contract call
      // For now, return mock data structure
      return {
        score: 0,
        grade: 0,
        issueDate: 0,
        expiryDate: 0
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to decrypt certificate data');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Verify Certificate
  const verifyCertificate = async (certificateId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await readContract({
        address: contractConfig.address,
        abi: contractConfig.abi,
        functionName: 'verifyCertificate',
        args: [certificateId],
      });
      
      return result as boolean;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify certificate');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Get Certificate Details
  const getCertificateDetails = async (certificateId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await readContract({
        address: contractConfig.address,
        abi: contractConfig.abi,
        functionName: 'getCertificate',
        args: [certificateId],
      });
      
      return result as any;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get certificate details');
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
    encryptCertificateData,
    updateCertificateWithEncryptedData,
    decryptCertificateData,
    verifyCertificate,
    getCertificateDetails,
    isLoading,
    error,
    address,
    instance,
  };
}
