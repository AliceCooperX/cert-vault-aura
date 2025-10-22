// IPFS上传工具函数
export interface IPFSUploadResult {
  hash: string;
  url: string;
  gateway: string;
}

// 使用Pinata IPFS服务（需要API密钥）
export async function uploadToIPFS(file: File): Promise<IPFSUploadResult> {
  try {
    console.log('Starting IPFS upload for file:', file.name, 'Size:', file.size, 'bytes');
    
    // 检查环境变量
    const pinataJWT = import.meta.env.VITE_PINATA_JWT;
    if (!pinataJWT || pinataJWT === 'your-pinata-jwt-token') {
      throw new Error('Pinata JWT token not configured. Please check your .env file.');
    }
    
    console.log('Pinata JWT token found, length:', pinataJWT.length);
    
    // 创建FormData
    const formData = new FormData();
    formData.append('file', file);
    
    // 添加元数据
    const metadata = {
      name: file.name,
      description: `Certificate file uploaded via CertVaultAura platform`,
      keyvalues: {
        platform: 'CertVaultAura',
        type: 'certificate',
        timestamp: new Date().toISOString()
      }
    };
    formData.append('pinataMetadata', JSON.stringify(metadata));

    console.log('Sending request to Pinata...');
    
    // 使用Pinata API上传
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${pinataJWT}`
      },
      body: formData
    });

    console.log('Pinata response status:', response.status);
    console.log('Pinata response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Pinata API error response:', errorText);
      throw new Error(`IPFS upload failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Pinata upload successful:', result);
    
    const uploadResult = {
      hash: result.IpfsHash,
      url: `ipfs://${result.IpfsHash}`,
      gateway: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`
    };
    
    console.log('Upload result:', uploadResult);
    return uploadResult;
    
  } catch (error) {
    console.error('IPFS upload error:', error);
    
    // 不要返回模拟数据，而是抛出错误
    throw new Error(`IPFS upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// 上传证书元数据到IPFS
export async function uploadCertificateMetadataToIPFS(metadata: any): Promise<IPFSUploadResult> {
  try {
    const metadataBlob = new Blob([JSON.stringify(metadata, null, 2)], {
      type: 'application/json'
    });
    
    const metadataFile = new File([metadataBlob], 'certificate-metadata.json', {
      type: 'application/json'
    });

    return await uploadToIPFS(metadataFile);
  } catch (error) {
    console.error('Certificate metadata upload error:', error);
    throw error;
  }
}

// 从IPFS获取图片URL
export function getIPFSImageUrl(ipfsHash: string, gateway: string = 'https://gateway.pinata.cloud'): string {
  if (!ipfsHash) return '';
  
  // 如果已经是完整URL，直接返回
  if (ipfsHash.startsWith('http')) {
    return ipfsHash;
  }
  
  // 如果是IPFS协议格式，转换为HTTP URL
  if (ipfsHash.startsWith('ipfs://')) {
    const hash = ipfsHash.replace('ipfs://', '');
    return `${gateway}/ipfs/${hash}`;
  }
  
  // 如果只是哈希值，直接拼接
  return `${gateway}/ipfs/${ipfsHash}`;
}

// 验证IPFS哈希格式
export function isValidIPFSHash(hash: string): boolean {
  if (!hash) return false;
  
  // 移除ipfs://前缀
  const cleanHash = hash.replace('ipfs://', '');
  
  // 检查是否是有效的IPFS哈希格式（Qm开头，58个字符）
  return /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/.test(cleanHash) || 
         /^bafybei[a-z2-7]{52}$/.test(cleanHash); // 支持新的CID格式
}

// 获取文件类型
export function getFileType(file: File): string {
  if (file.type.startsWith('image/')) {
    return 'image';
  } else if (file.type === 'application/pdf') {
    return 'pdf';
  } else if (file.type.startsWith('text/')) {
    return 'text';
  } else {
    return 'other';
  }
}

// 验证文件类型（仅允许证书相关文件）
export function isValidCertificateFile(file: File): boolean {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'application/pdf',
    'text/plain'
  ];
  
  return allowedTypes.includes(file.type);
}

// 获取文件大小（MB）
export function getFileSizeMB(file: File): number {
  return file.size / (1024 * 1024);
}

// 验证文件大小（最大10MB）
export function isValidFileSize(file: File, maxSizeMB: number = 10): boolean {
  return getFileSizeMB(file) <= maxSizeMB;
}
