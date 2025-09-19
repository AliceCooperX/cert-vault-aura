import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Shield, Eye, Share2, Download, Search, Filter, ArrowLeft, CheckCircle, Calendar, Building } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import scrollBackground from "@/assets/scroll-background.png";

const certificates = [
  {
    id: "CERT-2024-001",
    title: "Bachelor of Computer Science",
    institution: "Stanford University",
    date: "May 2023",
    type: "Academic Degree",
    verified: true,
    encrypted: true,
    views: 3,
    description: "4-year undergraduate program focusing on software engineering, algorithms, and data structures."
  },
  {
    id: "CERT-2024-002",
    title: "AWS Cloud Architect Certification",
    institution: "Amazon Web Services",
    date: "March 2023",
    type: "Professional Certification",
    verified: true,
    encrypted: true,
    views: 7,
    description: "Professional certification for designing distributed applications on AWS platform."
  },
  {
    id: "CERT-2024-003",
    title: "Master of Business Administration",
    institution: "Harvard Business School",
    date: "June 2022",
    type: "Academic Degree",
    verified: true,
    encrypted: true,
    views: 2,
    description: "Graduate business degree with focus on strategic management and leadership."
  },
  {
    id: "CERT-2024-004",
    title: "Google Analytics Certified",
    institution: "Google",
    date: "January 2023",
    type: "Professional Certification",
    verified: true,
    encrypted: true,
    views: 5,
    description: "Professional certification for digital analytics and marketing measurement."
  }
];

const Vault = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCert, setSelectedCert] = useState<typeof certificates[0] | null>(null);

  const filteredCertificates = certificates.filter(cert =>
    cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.institution.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-6 academic-heading">
              My Certificate Vault
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Secure access to your encrypted academic achievements and professional certifications.
            </p>
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredCertificates.map((cert, index) => (
              <Card 
                key={cert.id} 
                className="academic-card hover:shadow-gold transition-all duration-300 overflow-hidden group relative"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div 
                  className="absolute inset-0 opacity-5 bg-cover bg-center"
                  style={{ backgroundImage: `url(${scrollBackground})` }}
                ></div>
                
                <div className="p-6 relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-academic-navy" />
                      <span className="text-sm text-muted-foreground">{cert.date}</span>
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
                    </div>
                  </div>

                  <h3 className="font-playfair text-xl font-semibold mb-2 text-academic-navy group-hover:text-secure-emerald transition-colors">
                    {cert.title}
                  </h3>
                  
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
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="hover:bg-secure-emerald hover:text-white transition-all"
                          onClick={() => setSelectedCert(cert)}
                        >
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="font-playfair text-2xl">Certificate Details</DialogTitle>
                        </DialogHeader>
                        {selectedCert && (
                          <div className="space-y-6">
                            <div className="flex items-center justify-between">
                              <Badge className="secure-badge">ID: {selectedCert.id}</Badge>
                              <div className="flex space-x-2">
                                <Badge className="secure-badge">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Verified
                                </Badge>
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
                                  <p className="text-muted-foreground">{selectedCert.date}</p>
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold mb-1">Type</h4>
                                <p className="text-muted-foreground">{selectedCert.type}</p>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold mb-1">Description</h4>
                                <p className="text-muted-foreground">{selectedCert.description}</p>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold mb-1">Verification Statistics</h4>
                                <p className="text-muted-foreground">{selectedCert.views} verified employer views</p>
                              </div>
                            </div>
                            
                            <div className="flex space-x-4">
                              <Button className="flex-1 bg-gradient-secure hover:shadow-secure text-white">
                                <Share2 className="w-4 h-4 mr-2" />
                                Share with Employer
                              </Button>
                              <Button variant="outline" className="flex-1">
                                <Download className="w-4 h-4 mr-2" />
                                Download Copy
                              </Button>
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

          {filteredCertificates.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-playfair text-xl font-semibold mb-2">No certificates found</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm ? "Try adjusting your search terms" : "Start by adding your first certificate"}
              </p>
              <Button asChild className="bg-gradient-secure hover:shadow-secure text-white">
                <Link to="/add-certificate">Add Your First Certificate</Link>
              </Button>
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
                <div className="text-2xl font-bold text-secure-emerald mb-2">{certificates.length}</div>
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