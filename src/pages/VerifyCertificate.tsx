import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, Shield, CheckCircle, AlertCircle, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { useCertVaultAura } from '@/hooks/useCertVaultAura';
import { useAccount } from 'wagmi';

const VerifyCertificate = () => {
  const [certificateId, setCertificateId] = useState('');
  const [queryResult, setQueryResult] = useState<any>(null);
  const [isQuerying, setIsQuerying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { verifyCertificate, getCertificateDetails, processVerification } = useCertVaultAura();
  const { address, isConnected } = useAccount();

  const handleQuery = async () => {
    if (!certificateId.trim()) {
      toast({
        title: "Certificate ID required",
        description: "Please enter a certificate ID to query.",
        variant: "destructive"
      });
      return;
    }

    if (!isConnected || !address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to query certificates.",
        variant: "destructive"
      });
      return;
    }

    setIsQuerying(true);
    try {
      console.log('[VerifyCertificate] handleQuery:start', { certificateId });
      
      // Parse certificate ID (handle both CERT-XXXX and numeric formats)
      let certId: number;
      if (certificateId.startsWith('CERT-')) {
        const numericPart = certificateId.replace('CERT-', '');
        certId = parseInt(numericPart) - 1; // Convert to 0-based index
      } else {
        certId = parseInt(certificateId);
      }
      
      console.log('[VerifyCertificate] parsed certId', { certId });
      
      const details = await getCertificateDetails(certId.toString());
      console.log('[VerifyCertificate] query result', { details });
      
      setQueryResult({
        valid: true,
        details: details,
        certId: certId,
        queriedAt: new Date().toISOString()
      });
      
      toast({
        title: "Certificate Found",
        description: "Certificate details retrieved successfully.",
      });
    } catch (error) {
      console.error('Query error:', error);
      setQueryResult({
        valid: false,
        error: error instanceof Error ? error.message : 'Query failed',
        queriedAt: new Date().toISOString()
      });
      
      toast({
        title: "Query Error",
        description: "An error occurred while querying the certificate.",
        variant: "destructive"
      });
    } finally {
      setIsQuerying(false);
    }
  };

  const handleProcessVerification = async (isApproved: boolean) => {
    if (!queryResult || !queryResult.details) {
      toast({
        title: "No certificate data",
        description: "Please query a certificate first.",
        variant: "destructive"
      });
      return;
    }

    if (!isConnected || !address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to process verification.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      console.log('[VerifyCertificate] handleProcessVerification:start', { 
        certId: queryResult.certId, 
        isApproved,
        currentAddress: address,
        verifierAddress: queryResult.details.verifier
      });

      // Check if current user is the designated verifier
      if (address.toLowerCase() !== queryResult.details.verifier?.toLowerCase()) {
        toast({
          title: "Not Authorized",
          description: "Only the designated verifier can process this verification.",
          variant: "destructive"
        });
        return;
      }

      // For now, we'll use a mock requestId since we don't have the actual verification request system
      // In a real implementation, you'd need to track verification requests
      const requestId = 1; // This should come from the verification request system
      
      const tx = await processVerification(requestId, isApproved);
      console.log('[VerifyCertificate] processVerification tx', tx);
      
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log('[VerifyCertificate] processVerification receipt', receipt);
      
      // Refresh the certificate details to get updated status
      const updatedDetails = await getCertificateDetails(queryResult.certId);
      setQueryResult(prev => ({
        ...prev,
        details: updatedDetails
      }));
      
      toast({
        title: isApproved ? "Verification Approved" : "Verification Rejected",
        description: `Certificate verification has been ${isApproved ? 'approved' : 'rejected'}.`,
      });
    } catch (error) {
      console.error('Process verification error:', error);
      toast({
        title: "Processing Error",
        description: "An error occurred while processing verification.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
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
                      onClick={handleQuery}
                      disabled={isQuerying || !certificateId.trim()}
                      className="bg-gradient-secure hover:shadow-secure text-white"
                    >
                      {isQuerying ? 'Querying...' : 'Query'}
                    </Button>
                  </div>
                  </div>
                </div>
              </div>
            </Card>

          {queryResult && (
            <Card className="academic-card p-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  {queryResult.valid ? (
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  ) : (
                    <AlertCircle className="w-8 h-8 text-red-400" />
                  )}
                  <div>
                    <h3 className="text-xl font-semibold">
                      {queryResult.valid ? 'Certificate Found' : 'Query Failed'}
                    </h3>
                    <p className="text-muted-foreground">
                      Queried on {new Date(queryResult.queriedAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {queryResult.valid && queryResult.details ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Certificate ID</Label>
                          <p className="font-mono text-sm break-all">CERT-{String(Number(queryResult.certId) + 1).padStart(4, '0')}</p>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Issuer</Label>
                          <p className="font-medium">{queryResult.details.issuer || 'Unknown'}</p>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Certificate Type</Label>
                          <p className="font-medium">{queryResult.details.certType || 'Unknown'}</p>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Title</Label>
                          <p className="font-medium">{queryResult.details.title || 'Unknown'}</p>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Institution</Label>
                          <p className="font-medium">{queryResult.details.institution || 'Unknown'}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Issue Date</Label>
                          <p className="font-medium">
                            {queryResult.details.issueDate 
                              ? new Date(Number(queryResult.details.issueDate) * 1000).toLocaleDateString()
                              : 'Unknown'
                            }
                          </p>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Expiry Date</Label>
                          <p className="font-medium">
                            {queryResult.details.expiryDate 
                              ? new Date(Number(queryResult.details.expiryDate) * 1000).toLocaleDateString()
                              : 'No expiry'
                            }
                          </p>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Verification Status</Label>
                          <div className="flex items-center space-x-2">
                            {queryResult.details.isVerified ? (
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-orange-600 border-orange-600">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Unverified
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Blockchain</Label>
                          <p className="font-medium">Sepolia Testnet</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Verification Actions */}
                    {!queryResult.details.isVerified && (
                      <div className="border-t pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold mb-2">Verification Actions</h4>
                            <p className="text-sm text-muted-foreground">
                              {address?.toLowerCase() === queryResult.details.verifier?.toLowerCase() 
                                ? "You are the designated verifier for this certificate."
                                : `Designated verifier: ${queryResult.details.verifier || 'Not set'}`
                              }
                            </p>
                          </div>
                          {address?.toLowerCase() === queryResult.details.verifier?.toLowerCase() && (
                            <div className="flex space-x-2">
                              <Button
                                onClick={() => handleProcessVerification(false)}
                                disabled={isProcessing}
                                variant="outline"
                                className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                              >
                                {isProcessing ? 'Processing...' : 'Reject'}
                              </Button>
                              <Button
                                onClick={() => handleProcessVerification(true)}
                                disabled={isProcessing}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                {isProcessing ? 'Processing...' : 'Approve'}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Query Failed</h3>
                    <p className="text-muted-foreground mb-4">
                      {queryResult.error || 'This certificate could not be found.'}
                    </p>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• Check that the certificate ID is correct</p>
                      <p>• Ensure the certificate exists on the blockchain</p>
                      <p>• Verify you're connected to the correct network</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

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
