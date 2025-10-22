import React, { useState, useRef } from 'react';
import { Upload, X, File, Image, FileText, AlertCircle, CheckCircle, Eye } from 'lucide-react';
import { uploadToIPFS, getIPFSImageUrl, isValidCertificateFile, isValidFileSize, getFileType } from '../utils/ipfs';

interface FileUploadProps {
  onFileUploaded: (result: { hash: string; url: string; gateway: string }) => void;
  onFileRemoved: () => void;
  uploadedFile?: { hash: string; url: string; gateway: string } | null;
  accept?: string;
  maxSizeMB?: number;
  className?: string;
}

export default function FileUpload({
  onFileUploaded,
  onFileRemoved,
  uploadedFile,
  accept = "image/*,.pdf,.txt",
  maxSizeMB = 10,
  className = ""
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setError(null);
      
      // 验证文件类型
      if (!isValidCertificateFile(file)) {
        setError('Invalid file type. Please upload an image, PDF, or text file.');
        return;
      }
      
      // 验证文件大小
      if (!isValidFileSize(file, maxSizeMB)) {
        setError(`File size exceeds ${maxSizeMB}MB limit.`);
        return;
      }
      
      setSelectedFile(file);
      
      // 创建预览URL
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      console.log('Uploading file to IPFS:', selectedFile.name);
      const result = await uploadToIPFS(selectedFile);
      onFileUploaded(result);
      console.log('File uploaded successfully:', result);
    } catch (uploadError) {
      const errorMessage = uploadError instanceof Error ? uploadError.message : 'Unknown error';
      setError(errorMessage);
      console.error('File upload failed:', uploadError);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setError(null);
    setPreviewUrl(null);
    onFileRemoved();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveUploaded = () => {
    onFileRemoved();
  };

  const getFileIcon = (file: File) => {
    const fileType = getFileType(file);
    switch (fileType) {
      case 'image':
        return <Image className="w-8 h-8 text-blue-400" />;
      case 'pdf':
        return <FileText className="w-8 h-8 text-red-400" />;
      default:
        return <File className="w-8 h-8 text-gray-400" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* File Input */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Upload Certificate File
        </label>
        <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center hover:border-slate-500 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            accept={accept}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center space-y-2"
          >
            <Upload className="w-8 h-8 text-gray-400" />
            <span className="text-gray-400">
              {selectedFile ? selectedFile.name : 'Click to select file'}
            </span>
            {selectedFile && (
              <span className="text-sm text-gray-500">
                Size: {formatFileSize(selectedFile.size)}
              </span>
            )}
          </label>
        </div>
      </div>

      {/* Selected File Preview */}
      {selectedFile && (
        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            {getFileIcon(selectedFile)}
            <div className="flex-1">
              <p className="text-white font-medium">{selectedFile.name}</p>
              <p className="text-sm text-gray-400">
                {formatFileSize(selectedFile.size)} • {getFileType(selectedFile)}
              </p>
            </div>
            <button
              onClick={handleRemoveFile}
              className="text-gray-400 hover:text-red-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Image Preview */}
          {previewUrl && (
            <div className="mt-3">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-32 object-cover rounded-lg"
              />
            </div>
          )}
        </div>
      )}

      {/* Upload Button */}
      {selectedFile && !uploadedFile && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2"
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Uploading to IPFS...</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              <span>Upload to IPFS</span>
            </>
          )}
        </button>
      )}

      {/* Uploaded File Display */}
      {uploadedFile && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-green-400 mb-3">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">File Uploaded Successfully!</span>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">IPFS Hash:</span>
              <span className="text-green-300 font-mono text-xs">{uploadedFile.hash}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">IPFS URL:</span>
              <span className="text-green-300 font-mono text-xs">{uploadedFile.url}</span>
            </div>
          </div>

          {/* Preview Link */}
          <div className="mt-4 flex space-x-2">
            <a
              href={uploadedFile.gateway}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>View on IPFS</span>
            </a>
            <button
              onClick={handleRemoveUploaded}
              className="inline-flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-red-400">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Upload Failed</span>
          </div>
          <p className="text-red-300 mt-2 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
