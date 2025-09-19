import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Shield, Eye, Upload, CheckCircle } from "lucide-react";
import scrollBackground from "@/assets/scroll-background.png";

const certificates = [
  {
    id: 1,
    title: "Bachelor of Computer Science",
    institution: "Stanford University",
    date: "May 2023",
    verified: true,
    encrypted: true,
    views: 3
  },
  {
    id: 2,
    title: "AWS Cloud Architect Certification",
    institution: "Amazon Web Services",
    date: "March 2023",
    verified: true,
    encrypted: true,
    views: 7
  },
  {
    id: 3,
    title: "Master of Business Administration",
    institution: "Harvard Business School",
    date: "June 2022",
    verified: true,
    encrypted: true,
    views: 2
  }
];

const VaultDashboard = () => {
  return (
    <section id="vault" className="py-20 bg-gradient-to-br from-parchment to-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6 academic-heading">
            Your Certificate Vault
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your academic achievements, secured with military-grade encryption and blockchain verification.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {certificates.map((cert, index) => (
            <Card 
              key={cert.id} 
              className="academic-card hover:shadow-gold transition-all duration-300 overflow-hidden group relative"
              style={{ animationDelay: `${index * 0.2}s` }}
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
                
                <p className="text-muted-foreground mb-4">{cert.institution}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Eye className="w-4 h-4" />
                    <span>{cert.views} verified views</span>
                  </div>
                  
                  <Button size="sm" variant="outline" className="hover:bg-secure-emerald hover:text-white transition-all">
                    Share
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button className="bg-gradient-secure hover:shadow-secure text-white font-semibold px-8 py-3 transition-all duration-300 hover:scale-105">
            <Upload className="w-5 h-5 mr-2" />
            Add New Certificate
          </Button>
        </div>
      </div>
    </section>
  );
};

export default VaultDashboard;