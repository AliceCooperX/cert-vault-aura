import { useWriteContract, useAccount, usePublicClient } from 'wagmi';
import { contractConfig, rpcConfig } from '../lib/wallet';
import { useState } from 'react';
import { useZamaInstance } from './useZamaInstance';
import { useEthersSigner } from './useEthersSigner';
import { createPublicClient, http } from 'viem';
import { sepolia as viemSepolia } from 'viem/chains';

export function useCertVaultAura() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();
  const fallbackClient = createPublicClient({ chain: viemSepolia, transport: http(rpcConfig.rpcUrl) });
  const getClient = () => publicClient ?? fallbackClient;
  const { instance } = useZamaInstance();
  const signerPromise = useEthersSigner();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isIssuerAuthorized = async (issuer: string) => {
    try {
      const info = await getClient().readContract({
        address: contractConfig.address as `0x${string}`,
        abi: contractConfig.abi,
        functionName: 'getIssuerInfo',
        args: [issuer],
      });
      // getIssuerInfo returns (name, description, isAuthorized)
      return Array.isArray(info) ? Boolean(info[2]) : false;
    } catch (e) {
      console.warn('[useCertVaultAura] isIssuerAuthorized read failed, default false', e);
      return false;
    }
  };

  // Register Issuer
  const registerIssuer = async (name: string, description: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const hash = await writeContractAsync({
        address: contractConfig.address as `0x${string}`,
        abi: contractConfig.abi,
        functionName: 'registerIssuer',
        args: [name, description],
      });
      // wait for tx confirmation
      await getClient().waitForTransactionReceipt({ hash });
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
    title: string,
    institution: string,
    description: string,
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
      
      console.log('[useCertVaultAura] issueCertificate:start', { holder, certType, metadataHash, issueDate, expiryDate, score, grade });
      console.time('[useCertVaultAura] issueCertificate.total');
      // Create encrypted input
      console.time('[useCertVaultAura] createEncryptedInput');
      const input = instance.createEncryptedInput(contractConfig.address, address);
      console.timeEnd('[useCertVaultAura] createEncryptedInput');
      console.log('[useCertVaultAura] add32:start');
      input.add32(BigInt(issueDate));
      input.add32(BigInt(expiryDate));
      input.add32(BigInt(score));
      input.add32(BigInt(grade));
      console.log('[useCertVaultAura] add32:done');
      
      console.time('[useCertVaultAura] input.encrypt');
      const encryptedInput = await input.encrypt();
      console.timeEnd('[useCertVaultAura] input.encrypt');
      console.log('[useCertVaultAura] encryptedInput', {
        handlesLen: encryptedInput.handles?.length,
        proofLen: encryptedInput.inputProof?.length,
        handlesPreview: Array.isArray(encryptedInput.handles) ? encryptedInput.handles.slice(0, 2) : null
      });
      
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
      console.log('[useCertVaultAura] formatted', { handlesCount: handles.length, handles: handles.slice(0, 4), proofLen: proof.length });
      
      console.time('[useCertVaultAura] write.issueCertificate');
      const tx = await writeContractAsync({
        address: contractConfig.address as `0x${string}`,
        abi: contractConfig.abi,
        functionName: 'issueCertificate',
        args: [holder, certType, title, institution, description, metadataHash, handles[0], handles[1], handles[2], handles[3], proof],
      });
      console.timeEnd('[useCertVaultAura] write.issueCertificate');
      console.log('[useCertVaultAura] tx sent', tx);
    } catch (err) {
      console.error('[useCertVaultAura] issueCertificate:error', err);
      setError(err instanceof Error ? err.message : 'Failed to issue certificate');
      throw err;
    } finally {
      console.timeEnd('[useCertVaultAura] issueCertificate.total');
      setIsLoading(false);
    }
  };

  // Request Verification
  const requestVerification = async (certId: number, verificationHash: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await writeContractAsync({
        address: contractConfig.address as `0x${string}`,
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
      
      await writeContractAsync({
        address: contractConfig.address as `0x${string}`,
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
      
      await writeContractAsync({
        address: contractConfig.address as `0x${string}`,
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
      
      await writeContractAsync({
        address: contractConfig.address as `0x${string}`,
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
      if (!publicClient) throw new Error('No public client');
      const data = await publicClient.readContract({
        address: contractConfig.address as `0x${string}`,
        abi: contractConfig.abi,
        functionName: 'getCertificateEncryptedData',
        args: [BigInt(certId)],
      });
      const [encryptedScore, encryptedGrade, issueDate, expiryDate] = data as any[];
      console.log('[useCertVaultAura] decryptCertificateData:encrypted', { encryptedScore, encryptedGrade, issueDate, expiryDate });

      // Create keypair for decryption
      const keypair = instance.generateKeypair();
      
      // Prepare handle-contract pairs
      const handleContractPairs = [
        { 
          handle: encryptedScore, 
          contractAddress: contractConfig.address 
        },
        { 
          handle: encryptedGrade, 
          contractAddress: contractConfig.address 
        }
      ];
      
      console.log('[useCertVaultAura] handle-contract pairs:', handleContractPairs);

      // Create EIP712 signature
      const startTimeStamp = Math.floor(Date.now() / 1000).toString();
      const durationDays = '10';
      const contractAddresses = [contractConfig.address];

      const eip712 = instance.createEIP712(
        keypair.publicKey,
        contractAddresses,
        startTimeStamp,
        durationDays
      );

      const signer = await signerPromise;
      const signature = await signer.signTypedData(
        eip712.domain,
        { UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification },
        eip712.message
      );

      // Decrypt the data
      const result = await instance.userDecrypt(
        handleContractPairs,
        keypair.privateKey,
        keypair.publicKey,
        signature.replace('0x', ''),
        contractAddresses,
        address,
        startTimeStamp,
        durationDays
      );

      console.log('[useCertVaultAura] decryption result:', result);
      console.log('[useCertVaultAura] score handle:', encryptedScore);
      console.log('[useCertVaultAura] grade handle:', encryptedGrade);
      console.log('[useCertVaultAura] decrypted score:', result[encryptedScore]);
      console.log('[useCertVaultAura] decrypted grade:', result[encryptedGrade]);

      return {
        score: result[encryptedScore]?.toString() || '0',
        grade: result[encryptedGrade]?.toString() || '0',
        issueDate: Number(issueDate),
        expiryDate: Number(expiryDate),
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
      
      if (!publicClient) throw new Error('No public client');
      // parse certificate id: support 'CERT-0001', numeric, or hex 0x..
      const parseId = (id: string): bigint => {
        const m = id.match(/(\d+)/g);
        if (m && m.length) {
          return BigInt(m[m.length - 1]);
        }
        if (id.startsWith('0x')) {
          return BigInt(id);
        }
        return BigInt(Number(id || '0'));
      };
      const certId = parseId(certificateId);
      console.log('[useCertVaultAura] verifyCertificate:start', { certificateId, certId: certId.toString() });
      const info = await publicClient.readContract({
        address: contractConfig.address as `0x${string}`,
        abi: contractConfig.abi,
        functionName: 'getCertificateInfo',
        args: [certId],
      });
      const [certType, metadataHash, isVerified, issuer, holder] = info as any[];
      const exists = issuer && issuer !== '0x0000000000000000000000000000000000000000';
      const result = Boolean(exists);
      console.log('[useCertVaultAura] verifyCertificate:info', { certType, metadataHash, isVerified, issuer, holder, result });
      return result;
    } catch (err) {
      console.error('[useCertVaultAura] verifyCertificate:error', err);
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
      
      if (!publicClient) throw new Error('No public client');
      const parseId = (id: string): bigint => {
        const m = id.match(/(\d+)/g);
        if (m && m.length) {
          return BigInt(m[m.length - 1]);
        }
        if (id.startsWith('0x')) {
          return BigInt(id);
        }
        return BigInt(Number(id || '0'));
      };
      const certId = parseId(certificateId);
      console.log('[useCertVaultAura] getCertificateDetails:start', { certificateId, certId: certId.toString() });
      const result = await publicClient.readContract({
        address: contractConfig.address as `0x${string}`,
        abi: contractConfig.abi,
        functionName: 'getCertificateInfo',
        args: [certId],
      });
      console.log('[useCertVaultAura] getCertificateDetails:result', result);
      
      const [certType, metadataHash, isVerified, issuer, holder] = result as any[];
      return { certType, metadataHash, isVerified, issuer, holder } as any;
    } catch (err) {
      console.error('[useCertVaultAura] getCertificateDetails:error', err);
      setError(err instanceof Error ? err.message : 'Failed to get certificate details');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getCertCounter = async (): Promise<number> => {
    const client = publicClient;
    if (!client) throw new Error('No public client');
    const count = await client.readContract({
      address: contractConfig.address as `0x${string}`,
      abi: contractConfig.abi,
      functionName: 'certCounter',
      args: [],
    });
    return Number(count as bigint | number);
  };

  const getCertificateInfoById = async (certId: number) => {
    const client = publicClient;
    if (!client) throw new Error('No public client');
    const info = await client.readContract({
      address: contractConfig.address as `0x${string}`,
      abi: contractConfig.abi,
      functionName: 'getCertificateInfo',
      args: [certId],
    });
    // (certType, metadataHash, isVerified, issuer, holder)
    const [certType, metadataHash, isVerified, issuer, holder] = info as any[];
    return { certId, certType, metadataHash, isVerified, issuer, holder };
  };

  const listCertificatesForHolder = async (holderAddr: string) => {
    const total = await getCertCounter();
    const results: any[] = [];
    for (let i = 0; i < total; i++) {
      try {
        const info = await getCertificateInfoById(i);
        if (info.holder?.toLowerCase() === holderAddr.toLowerCase()) {
          results.push(info);
        }
      } catch (e) {
        console.warn('[useCertVaultAura] getCertificateInfoById failed', i, e);
      }
    }
    return results;
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
    getCertCounter,
    getCertificateInfoById,
    listCertificatesForHolder,
    isIssuerAuthorized,
    isLoading,
    error,
    address,
    instance,
  };
}
