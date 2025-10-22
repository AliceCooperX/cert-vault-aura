import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Shield, Eye, Share2, Download, Search, Filter, ArrowLeft, CheckCircle, Calendar, Building, Lock, Unlock } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCertVaultAura } from "@/hooks/useCertVaultAura";
import { useAccount } from "wagmi";
import scrollBackground from "@/assets/scroll-background.png";

const Vault = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCert, setSelectedCert] = useState<any | null>(null);
  const [decryptedData, setDecryptedData] = useState<{[key: string]: any}>({});
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { decryptCertificateData, instance, listCertificatesForHolder } = useCertVaultAura() as any;
  const { address, isConnected } = useAccount();

  useEffect(() => {
    const load = async () => {
      if (!isConnected || !address) {
        setItems([]);
        return;
      }
      setLoading(true);
      setLoadError(null);
      try {
        const list = await listCertificatesForHolder(address);
        // map to UI schema
        const mapped = list.map((it: any) => ({
          id: `CERT-${String(it.certId).padStart(4, '0')}`,
          certId: it.certId,
          title: it.title || it.certType || 'Unknown',
          institution: it.institution || (it.issuer || '').slice(0, 10) + '…',
          date: it.issueDate ? new Date(Number(it.issueDate) * 1000).toLocaleDateString() : '',
          type: it.certType || 'Unknown',
          verified: Boolean(it.isVerified),
          encrypted: true,
          views: 0,
          description: it.description || `IPFS: ${it.metadataHash || 'N/A'}`,
          ipfsHash: it.metadataHash,
        }));
        setItems(mapped);
      } catch (e: any) {
        setLoadError(e?.message || 'Failed to load certificates');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isConnected, address, listCertificatesForHolder]);

  const filteredCertificates = useMemo(() => {
    return items.filter(cert =>
      (cert.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cert.institution || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  const handleDecrypt = async (certIdUi: string, certId?: number) => {
    if (!isConnected || !address || !instance) {
      alert('Please connect your wallet and ensure FHE service is ready');
      return;
    }

    setIsDecrypting(true);
    try {
      const cid = typeof certId === 'number' ? certId : parseInt((certIdUi.split('-')[1] || '0'));
      const decrypted = await decryptCertificateData(cid);
      setDecryptedData(prev => ({...prev, [certIdUi]: decrypted}));
    } catch (error) {
      console.error('Decryption failed:', error);
      alert('Failed to decrypt certificate data');
    } finally {
      setIsDecrypting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-inter">
      <Header />
      <main className="py-20 bg-gradient-to-br from-parchment to-background">
        <div className="container mx-auto px-6">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-academic-navy hover:text-secure-emerald transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>

          <div className="text-center mb-12">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-6 academic-heading">My Certificate Vault</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Secure access to your encrypted academic achievements and professional certifications.</p>
          </div>

          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Search certificates by title or institution..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button asChild className="bg-gradient-secure hover:shadow-secure text-white">
              <Link to="/add-certificate">Add New Certificate</Link>
            </Button>
          </div>

          {loadError && (
            <Card className="academic-card p-6 mb-6 text-red-500">{loadError}</Card>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredCertificates.map((cert, index) => (
              <Card 
                key={cert.id} 
                className="academic-card hover:shadow-gold transition-all duration-300 overflow-hidden group relative"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute inset-0 opacity-5 bg-cover bg-center" style={{ backgroundImage: `url(${scrollBackground})` }}></div>
                
                <div className="p-6 relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-academic-navy" />
                      <span className="text-sm text-muted-foreground">{cert.date || '-'}</span>
                    </div>
                    <div className="flex space-x-1">
                      {cert.verified && (
                        <Badge className="secure-badge">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      {cert.encrypted && (
                        <div className="w-6 h-6 bg-secure-emerald rounded-full flex items-center justify-center animate-seal-pulse">
                          <Shield className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <Button size="sm" variant="outline" onClick={() => handleDecrypt(cert.id, cert.certId)} disabled={isDecrypting} className="ml-2">
                        {isDecrypting ? (<Lock className="w-3 h-3 animate-spin" />) : decryptedData[cert.id] ? (<Unlock className="w-3 h-3" />) : (<Lock className="w-3 h-3" />)}
                      </Button>
                    </div>
                  </div>

                  <h3 className="font-playfair text-xl font-semibold mb-2 text-academic-navy group-hover:text-secure-emerald transition-colors">{cert.title}</h3>
                  <div className="flex items-center mb-2 text-muted-foreground">
                    <Building className="w-4 h-4 mr-2" />
                    <span className="text-sm">{cert.institution}</span>
                  </div>
                  <Badge variant="outline" className="mb-4">{cert.type}</Badge>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Eye className="w-4 h-4" />
                      <span>{cert.views} verified views</span>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="hover:bg-secure-emerald hover:text-white transition-all" onClick={() => setSelectedCert(cert)}>
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl" aria-describedby="vault-dialog-desc">
                        <DialogHeader>
                          <DialogTitle className="font-playfair text-2xl">Certificate Details</DialogTitle>
                        </DialogHeader>
                        {selectedCert && (
                          <div className="space-y-6">
                            <p id="vault-dialog-desc" className="sr-only">Certificate details and FHE decryption actions.</p>
                            <div className="flex items-center justify-between">
                              <Badge className="secure-badge">ID: {selectedCert.id}</Badge>
                              <div className="flex space-x-2">
                                {selectedCert.verified && (
                                  <Badge className="secure-badge">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Verified
                                  </Badge>
                                )}
                                <Badge variant="outline">Encrypted</Badge>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold mb-1">Certificate Title</h4>
                                <p className="text-muted-foreground">{selectedCert.title}</p>
                              </div>
                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold mb-1">Institution</h4>
                                  <p className="text-muted-foreground">{selectedCert.institution}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-1">Completion Date</h4>
                                  <p className="text-muted-foreground">{selectedCert.date || '-'}</p>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-1">Type</h4>
                                <p className="text-muted-foreground">{selectedCert.type}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-1">Document</h4>
                                <p className="text-muted-foreground">{selectedCert.description}</p>
                                {selectedCert.ipfsHash && (
                                  <div className="mt-2">
                                    <a
                                      href={`https://gateway.pinata.cloud/ipfs/${selectedCert.ipfsHash}`}
                                      target="_blank"
                                      rel="noreferrer noopener"
                                      className="text-blue-500 hover:underline"
                                    >
                                      Open document in new tab
                                    </a>
                                  </div>
                                )}
                              </div>
                              {decryptedData[selectedCert.id] && (
                                <div className="border-t pt-4">
                                  <h4 className="font-semibold mb-2 text-secure-emerald">Decrypted Data (FHE)</h4>
                                  <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm text-muted-foreground">Score</p>
                                      <p className="font-medium">{decryptedData[selectedCert.id].score || 'N/A'}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Grade</p>
                                      <p className="font-medium">{decryptedData[selectedCert.id].grade || 'N/A'}</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                              {!decryptedData[selectedCert.id] && (
                                <div className="border-t pt-4">
                                  <Button onClick={() => handleDecrypt(selectedCert.id, selectedCert.certId)} disabled={isDecrypting} className="bg-gradient-secure hover:shadow-secure text-white">
                                    {isDecrypting ? (<><Lock className="w-4 h-4 mr-2 animate-spin" />Decrypting...</>) : (<>Decrypt Sensitive Data</>)}
                                  </Button>
                                </div>
                              )}
                            </div>
                            <div className="flex space-x-4">
                              <Button className="flex-1 bg-gradient-secure hover:shadow-secure text-white"><Share2 className="w-4 h-4 mr-2" />Share with Employer</Button>
                              <Button variant="outline" className="flex-1"><Download className="w-4 h-4 mr-2" />Download Copy</Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {!loading && filteredCertificates.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-playfair text-xl font-semibold mb-2">No certificates found</h3>
              <p className="text-muted-foreground mb-6">{searchTerm ? "Try adjusting your search terms" : "Start by adding your first certificate"}</p>
              <Button asChild className="bg-gradient-secure hover:shadow-secure text-white"><Link to="/add-certificate">Add Your First Certificate</Link></Button>
            </div>
          )}

          <Card className="academic-card p-8 text-center">
            <h3 className="font-playfair text-2xl font-semibold mb-4">Vault Security Status</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="text-2xl font-bold text-secure-emerald mb-2">256-bit</div>
                <div className="text-muted-foreground">AES Encryption</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secure-emerald mb-2">{items.length}</div>
                <div className="text-muted-foreground">Certificates Secured</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secure-emerald mb-2">100%</div>
                <div className="text-muted-foreground">Blockchain Verified</div>
              </div>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Vault;