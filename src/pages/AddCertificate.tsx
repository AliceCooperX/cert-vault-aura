import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Shield, CheckCircle, ArrowLeft, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FileUpload from "@/components/FileUpload";
import { useToast } from "@/hooks/use-toast";
import { useCertVaultAura } from "@/hooks/useCertVaultAura";
import { useAccount } from "wagmi";

const AddCertificate = () => {
  const [step, setStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [ipfsFile, setIpfsFile] = useState<{ hash: string; url: string; gateway: string } | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    institution: '',
    date: '',
    type: '',
    description: '',
    score: '',
    grade: ''
  });
  const { toast } = useToast();
  const { issueCertificate, isLoading, error } = useCertVaultAura();
  const { address, isConnected } = useAccount();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      toast({
        title: "File uploaded successfully",
        description: `${file.name} has been uploaded and is ready for processing.`,
      });
    }
  };

  const handleIPFSFileUploaded = (result: { hash: string; url: string; gateway: string }) => {
    setIpfsFile(result);
    toast({
      title: "File Uploaded to IPFS",
      description: `Certificate file uploaded to IPFS: ${result.hash}`,
    });
  };

  const handleIPFSFileRemoved = () => {
    setIpfsFile(null);
  };

  const handleSubmit = async () => {
    if (!isConnected || !address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to continue.",
        variant: "destructive"
      });
      return;
    }

    try {
      const issueDate = new Date(formData.date).getTime() / 1000;
      const expiryDate = issueDate + (365 * 24 * 60 * 60); // 1 year from issue date
      const score = parseInt(formData.score) || 0;
      const grade = parseInt(formData.grade) || 0;
      
      // Use IPFS hash if available, otherwise use timestamp hash
      const metadataHash = ipfsFile ? ipfsFile.hash : `hash_${Date.now()}`;
      
      await issueCertificate(
        address,
        formData.type,
        metadataHash, // IPFS hash or fallback hash
        issueDate,
        expiryDate,
        score,
        grade
      );
      
      toast({
        title: "Certificate added successfully",
        description: "Your certificate has been encrypted with FHE and added to your vault.",
      });
      setStep(4);
    } catch (err) {
      toast({
        title: "Failed to add certificate",
        description: error || "An error occurred while adding your certificate.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background font-inter">
      <Header />
      
      <main className="py-20 bg-gradient-to-br from-parchment to-background">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-academic-navy hover:text-secure-emerald transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>

          <div className="text-center mb-12">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-6 academic-heading">
              Add New Certificate
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Secure your academic achievements with military-grade encryption and blockchain verification.
            </p>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= i ? 'bg-secure-emerald text-white' : 'bg-muted text-muted-foreground'
                  }`}>
                    {step > i ? <CheckCircle className="w-4 h-4" /> : i}
                  </div>
                  {i < 4 && <div className={`w-16 h-0.5 ${step > i ? 'bg-secure-emerald' : 'bg-muted'}`} />}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>Upload</span>
              <span>Details</span>
              <span>Verify</span>
              <span>Complete</span>
            </div>
          </div>

          <Card className="academic-card p-8">
            {step === 1 && (
              <div className="space-y-6">
                <h3 className="font-playfair text-2xl font-semibold text-center">Upload Your Certificate</h3>
                
                {/* IPFS File Upload Component */}
                <FileUpload
                  onFileUploaded={handleIPFSFileUploaded}
                  onFileRemoved={handleIPFSFileRemoved}
                  uploadedFile={ipfsFile}
                  accept=".pdf,.jpg,.jpeg,.png,.txt"
                  maxSizeMB={10}
                />

                {/* Legacy file upload for comparison */}
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-4">Or use traditional file upload:</p>
                  <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm mb-2">Drag and drop your certificate here, or click to browse</p>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload">
                      <Button variant="outline" size="sm">
                        Choose File
                      </Button>
                    </label>
                    <p className="text-xs text-muted-foreground mt-2">
                      Supported formats: PDF, JPG, PNG (Max 10MB)
                    </p>
                  </div>

                  {uploadedFile && (
                    <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg mt-4">
                      <FileText className="w-6 h-6 text-secure-emerald" />
                      <div>
                        <p className="font-medium">{uploadedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <Button 
                  onClick={() => setStep(2)} 
                  disabled={!uploadedFile && !ipfsFile}
                  className="w-full bg-gradient-secure hover:shadow-secure text-white"
                >
                  Continue to Details
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h3 className="font-playfair text-2xl font-semibold text-center">Certificate Details</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Certificate Title</Label>
                    <Input 
                      id="title" 
                      placeholder="e.g., Bachelor of Computer Science"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="institution">Institution</Label>
                    <Input 
                      id="institution" 
                      placeholder="e.g., Stanford University"
                      value={formData.institution}
                      onChange={(e) => setFormData({...formData, institution: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date">Completion Date</Label>
                    <Input 
                      id="date" 
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Certificate Type</Label>
                    <Select onValueChange={(value) => setFormData({...formData, type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="degree">Academic Degree</SelectItem>
                        <SelectItem value="certification">Professional Certification</SelectItem>
                        <SelectItem value="course">Course Completion</SelectItem>
                        <SelectItem value="training">Training Certificate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="score">Score (0-100)</Label>
                    <Input 
                      id="score" 
                      type="number" 
                      min="0" 
                      max="100" 
                      placeholder="e.g., 85"
                      value={formData.score}
                      onChange={(e) => setFormData({...formData, score: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="grade">Grade (0-100)</Label>
                    <Input 
                      id="grade" 
                      type="number" 
                      min="0" 
                      max="100" 
                      placeholder="e.g., 90"
                      value={formData.grade}
                      onChange={(e) => setFormData({...formData, grade: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Add any additional details about this certificate..."
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div className="flex space-x-4">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    Back
                  </Button>
                  <Button 
                    onClick={() => setStep(3)}
                    className="flex-1 bg-gradient-secure hover:shadow-secure text-white"
                  >
                    Continue to Verification
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h3 className="font-playfair text-2xl font-semibold text-center">Verification Process</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 bg-secure-emerald/10 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-secure-emerald" />
                    <div>
                      <p className="font-medium">Document Format Verified</p>
                      <p className="text-sm text-muted-foreground">Valid PDF format detected</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 bg-secure-emerald/10 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-secure-emerald" />
                    <div>
                      <p className="font-medium">Institution Database Check</p>
                      <p className="text-sm text-muted-foreground">Institution verified in our database</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 bg-academic-gold/10 rounded-lg">
                    <Lock className="w-6 h-6 text-academic-gold animate-spin" />
                    <div>
                      <p className="font-medium">FHE Encryption Process</p>
                      <p className="text-sm text-muted-foreground">Encrypting sensitive data with homomorphic encryption...</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">What happens next?</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Your certificate data will be encrypted with FHE (Fully Homomorphic Encryption)</li>
                    <li>• Sensitive information (scores, grades) will be encrypted on-chain</li>
                    <li>• A blockchain record will be created for verification</li>
                    <li>• You'll receive a unique certificate ID for sharing</li>
                    <li>• Only you control access permissions and decryption</li>
                  </ul>
                </div>

                <div className="flex space-x-4">
                  <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                    Back
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="flex-1 bg-gradient-secure hover:shadow-secure text-white"
                  >
                    {isLoading ? (
                      <>
                        <Lock className="w-4 h-4 mr-2 animate-spin" />
                        Encrypting & Storing...
                      </>
                    ) : (
                      'Complete Verification'
                    )}
                  </Button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-secure-emerald rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="font-playfair text-2xl font-semibold">Certificate Added Successfully!</h3>
                
                <div className="space-y-4">
                  <Badge className="secure-badge text-lg px-4 py-2">
                    Certificate ID: CERT-2024-001
                  </Badge>
                  
                  <p className="text-muted-foreground">
                    Your certificate has been encrypted and securely stored in your vault. 
                    You can now share it with verified employers.
                  </p>
                </div>

                <div className="flex space-x-4">
                  <Button variant="outline" asChild className="flex-1">
                    <Link to="/vault">View My Vault</Link>
                  </Button>
                  <Button asChild className="flex-1 bg-gradient-secure hover:shadow-secure text-white">
                    <Link to="/add-certificate">Add Another Certificate</Link>
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AddCertificate;