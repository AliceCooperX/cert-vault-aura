import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Eye, 
  Download,
  ExternalLink,
  Lock,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { useCertVaultAura } from '@/hooks/useCertVaultAura';
import { useAccount } from 'wagmi';
import { getIPFSImageUrl } from '@/utils/ipfs';

const VerifyCertificate = () => {
  const [certificateId, setCertificateId] = useState('');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();
  const { verifyCertificate, getCertificateDetails } = useCertVaultAura();
  const { address, isConnected } = useAccount();

  const handleVerify = async () => {
    if (!certificateId.trim()) {
      toast({
        title: "Certificate ID required",
        description: "Please enter a certificate ID to verify.",
        variant: "destructive"
      });
      return;
    }

    if (!isConnected || !address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to verify certificates.",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    try {
      // Verify certificate on blockchain
      const isValid = await verifyCertificate(certificateId);
      
      if (isValid) {
        // Get certificate details
        const details = await getCertificateDetails(certificateId);
        setVerificationResult({
          valid: true,
          details: details,
          verifiedAt: new Date().toISOString()
        });
        
        toast({
          title: "Certificate Verified",
          description: "This certificate is valid and authentic.",
        });
      } else {
        setVerificationResult({
          valid: false,
          error: "Certificate not found or invalid",
          verifiedAt: new Date().toISOString()
        });
        
        toast({
          title: "Verification Failed",
          description: "This certificate is not valid or does not exist.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationResult({
        valid: false,
        error: error instanceof Error ? error.message : 'Verification failed',
        verifiedAt: new Date().toISOString()
      });
      
      toast({
        title: "Verification Error",
        description: "An error occurred during verification.",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Active</Badge>;
      case 'expired':
        return <Badge className="bg-red-500/10 text-red-400 border-red-500/20">Expired</Badge>;
      case 'revoked':
        return <Badge className="bg-gray-500/10 text-gray-400 border-gray-500/20">Revoked</Badge>;
      default:
        return <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-playfair text-4xl font-bold text-white mb-4">
              Verify Certificate
            </h1>
            <p className="text-xl text-gray-300">
              Verify the authenticity and validity of certificates using blockchain technology
            </p>
          </div>

          <Card className="academic-card p-8 mb-8">
            <div className="space-y-6">
              <div className="text-center">
                <Shield className="w-16 h-16 text-secure-emerald mx-auto mb-4" />
                <h2 className="font-playfair text-2xl font-semibold mb-2">Certificate Verification</h2>
                <p className="text-muted-foreground">
                  Enter a certificate ID to verify its authenticity and view details
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="certificate-id">Certificate ID</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="certificate-id"
                      placeholder="Enter certificate ID (e.g., 0x1234...)"
                      value={certificateId}
                      onChange={(e) => setCertificateId(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleVerify}
                      disabled={isVerifying || !certificateId.trim()}
                      className="bg-gradient-secure hover:shadow-secure text-white"
                    >
                      {isVerifying ? (
                        <>
                          <Lock className="w-4 h-4 mr-2 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4 mr-2" />
                          Verify
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Verification Results */}
          {verificationResult && (
            <Card className="academic-card p-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  {verificationResult.valid ? (
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  ) : (
                    <AlertCircle className="w-8 h-8 text-red-400" />
                  )}
                  <div>
                    <h3 className="text-xl font-semibold">
                      {verificationResult.valid ? 'Certificate Verified' : 'Verification Failed'}
                    </h3>
                    <p className="text-muted-foreground">
                      Verified on {new Date(verificationResult.verifiedAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {verificationResult.valid && verificationResult.details ? (
                  <div className="space-y-6">
                    {/* Certificate Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Certificate ID</Label>
                          <p className="font-mono text-sm break-all">{certificateId}</p>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Issuer</Label>
                          <p className="font-medium">{verificationResult.details.issuer || 'Unknown'}</p>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Certificate Type</Label>
                          <p className="font-medium">{verificationResult.details.type || 'Unknown'}</p>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                          <div className="mt-1">
                            {getStatusBadge(verificationResult.details.status || 'active')}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Issue Date</Label>
                          <p className="font-medium">
                            {verificationResult.details.issueDate 
                              ? new Date(verificationResult.details.issueDate * 1000).toLocaleDateString()
                              : 'Unknown'
                            }
                          </p>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Expiry Date</Label>
                          <p className="font-medium">
                            {verificationResult.details.expiryDate 
                              ? new Date(verificationResult.details.expiryDate * 1000).toLocaleDateString()
                              : 'No expiry'
                            }
                          </p>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Blockchain</Label>
                          <p className="font-medium">Sepolia Testnet</p>
                        </div>
                      </div>
                    </div>

                    {/* IPFS File Link */}
                    {verificationResult.details.metadataHash && (
                      <div className="border-t pt-6">
                        <h4 className="font-semibold mb-4">Certificate Document</h4>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <FileText className="w-5 h-5 text-blue-400" />
                            <span className="text-sm">IPFS Hash: {verificationResult.details.metadataHash}</span>
                          </div>
                          <a
                            href={getIPFSImageUrl(verificationResult.details.metadataHash)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>View Document</span>
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Security Features */}
                    <div className="border-t pt-6">
                      <h4 className="font-semibold mb-4">Security Features</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3 p-3 bg-green-500/10 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <div>
                            <p className="font-medium text-sm">Blockchain Verified</p>
                            <p className="text-xs text-muted-foreground">Certificate exists on blockchain</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 p-3 bg-blue-500/10 rounded-lg">
                          <Shield className="w-5 h-5 text-blue-400" />
                          <div>
                            <p className="font-medium text-sm">FHE Encrypted</p>
                            <p className="text-xs text-muted-foreground">Sensitive data encrypted</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 p-3 bg-purple-500/10 rounded-lg">
                          <Lock className="w-5 h-5 text-purple-400" />
                          <div>
                            <p className="font-medium text-sm">Immutable Record</p>
                            <p className="text-xs text-muted-foreground">Cannot be tampered with</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 p-3 bg-orange-500/10 rounded-lg">
                          <Eye className="w-5 h-5 text-orange-400" />
                          <div>
                            <p className="font-medium text-sm">Public Verification</p>
                            <p className="text-xs text-muted-foreground">Anyone can verify</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Verification Failed</h3>
                    <p className="text-muted-foreground mb-4">
                      {verificationResult.error || 'This certificate could not be verified.'}
                    </p>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• Check that the certificate ID is correct</p>
                      <p>• Ensure the certificate exists on the blockchain</p>
                      <p>• Verify you're connected to the correct network</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <div className="flex justify-center space-x-4 mt-8">
            <Link to="/vault">
              <Button variant="outline" className="flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>View My Certificates</span>
              </Button>
            </Link>
            <Link to="/add-certificate">
              <Button className="bg-gradient-secure hover:shadow-secure text-white flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Add Certificate</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default VerifyCertificate;
