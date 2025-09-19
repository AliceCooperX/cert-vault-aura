import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Key, Eye, Server, Fingerprint, CheckCircle, ArrowLeft, Zap, Globe, Users } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const securityFeatures = [
  {
    icon: Shield,
    title: "End-to-End Encryption",
    description: "AES-256 encryption ensures your certificates are completely secure during storage and transmission.",
    details: "Military-grade encryption protects your data at rest and in transit. Each certificate is encrypted with a unique key that only you control."
  },
  {
    icon: Lock,
    title: "Blockchain Verification",
    description: "Every certificate is anchored to the blockchain, providing immutable proof of authenticity.",
    details: "Smart contracts on Ethereum network create tamper-proof records. Each certificate gets a unique blockchain hash for verification."
  },
  {
    icon: Key,
    title: "Zero-Knowledge Access",
    description: "We can't see your certificates. Only you control access through your private keys.",
    details: "Your private keys never leave your device. We use zero-knowledge protocols to verify without exposing sensitive data."
  },
  {
    icon: Eye,
    title: "Granular Permissions",
    description: "Control exactly what information employers can see and for how long.",
    details: "Set specific permissions for each employer: view duration, accessible fields, and automatic expiration dates."
  },
  {
    icon: Server,
    title: "Decentralized Storage",
    description: "Your data is distributed across multiple secure nodes, eliminating single points of failure.",
    details: "IPFS network ensures your certificates are always accessible. Data is replicated across multiple geographic locations."
  },
  {
    icon: Fingerprint,
    title: "Biometric Security",
    description: "Advanced biometric verification adds an extra layer of protection to your vault.",
    details: "Support for fingerprint, face recognition, and hardware security keys. Multi-factor authentication is required."
  }
];

const certifications = [
  { name: "SOC 2 Type II", description: "Security and availability controls" },
  { name: "ISO 27001", description: "Information security management" },
  { name: "GDPR Compliant", description: "European data protection regulation" },
  { name: "CCPA Compliant", description: "California consumer privacy act" },
  { name: "HIPAA Ready", description: "Healthcare information protection" },
  { name: "FedRAMP", description: "Federal risk and authorization program" }
];

const techSpecs = [
  { label: "Encryption Algorithm", value: "AES-256-GCM" },
  { label: "Key Management", value: "Hardware Security Modules (HSM)" },
  { label: "Blockchain Network", value: "Ethereum + Polygon" },
  { label: "Storage Protocol", value: "IPFS + Filecoin" },
  { label: "Authentication", value: "Multi-Factor (MFA)" },
  { label: "Network Security", value: "TLS 1.3 + WAF" }
];

const Security = () => {
  return (
    <div className="min-h-screen bg-background font-inter">
      <Header />
      
      <main className="py-20">
        <div className="container mx-auto px-6">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-academic-navy hover:text-secure-emerald transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-gradient-secure rounded-full flex items-center justify-center mx-auto mb-6 circuit-glow">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="font-playfair text-4xl md:text-6xl font-bold mb-6 academic-heading">
              Military-Grade Security
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Your academic achievements deserve the highest level of protection. Our security infrastructure 
              is designed to exceed government standards and protect your most valuable credentials.
            </p>
          </div>

          {/* Security Features Grid */}
          <section className="mb-20">
            <h2 className="font-playfair text-3xl font-bold text-center mb-12 academic-heading">
              Comprehensive Security Features
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {securityFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <Card 
                    key={index}
                    className="academic-card hover:shadow-gold transition-all duration-300 group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="p-6">
                      <div className="mb-4">
                        <div className="w-12 h-12 bg-gradient-secure rounded-lg flex items-center justify-center circuit-glow group-hover:scale-110 transition-transform">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      
                      <h3 className="font-playfair text-xl font-semibold mb-3 text-academic-navy group-hover:text-secure-emerald transition-colors">
                        {feature.title}
                      </h3>
                      
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        {feature.description}
                      </p>
                      
                      <p className="text-sm text-muted-foreground">
                        {feature.details}
                      </p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Technical Specifications */}
          <section className="mb-20">
            <div className="grid lg:grid-cols-2 gap-12">
              <Card className="academic-card p-8">
                <h3 className="font-playfair text-2xl font-semibold mb-6 academic-heading">
                  Technical Specifications
                </h3>
                <div className="space-y-4">
                  {techSpecs.map((spec, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-muted">
                      <span className="font-medium">{spec.label}</span>
                      <Badge variant="outline" className="font-mono">{spec.value}</Badge>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="academic-card p-8">
                <h3 className="font-playfair text-2xl font-semibold mb-6 academic-heading">
                  Security Certifications
                </h3>
                <div className="space-y-4">
                  {certifications.map((cert, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-secure-emerald mt-0.5" />
                      <div>
                        <div className="font-medium">{cert.name}</div>
                        <div className="text-sm text-muted-foreground">{cert.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </section>

          {/* Security Stats */}
          <section className="mb-20">
            <Card className="academic-card p-8 bg-gradient-to-br from-academic-navy via-academic-navy/95 to-secure-emerald/20 text-white">
              <h3 className="font-playfair text-3xl font-semibold text-center mb-8">
                Security by the Numbers
              </h3>
              <div className="grid md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-academic-gold mb-2">256-bit</div>
                  <div className="text-white/80">AES Encryption</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-academic-gold mb-2">99.99%</div>
                  <div className="text-white/80">Uptime Guarantee</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-academic-gold mb-2">0</div>
                  <div className="text-white/80">Security Breaches</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-academic-gold mb-2">24/7</div>
                  <div className="text-white/80">Security Monitoring</div>
                </div>
              </div>
            </Card>
          </section>

          {/* Security Architecture */}
          <section className="mb-20">
            <h2 className="font-playfair text-3xl font-bold text-center mb-12 academic-heading">
              Multi-Layer Security Architecture
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="academic-card p-6 text-center">
                <Globe className="w-12 h-12 text-secure-emerald mx-auto mb-4" />
                <h4 className="font-playfair text-xl font-semibold mb-3">Network Layer</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• DDoS Protection</li>
                  <li>• Web Application Firewall</li>
                  <li>• TLS 1.3 Encryption</li>
                  <li>• CDN Security</li>
                </ul>
              </Card>
              
              <Card className="academic-card p-6 text-center">
                <Server className="w-12 h-12 text-secure-emerald mx-auto mb-4" />
                <h4 className="font-playfair text-xl font-semibold mb-3">Application Layer</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Zero-Trust Architecture</li>
                  <li>• API Rate Limiting</li>
                  <li>• Input Validation</li>
                  <li>• Secure Coding Practices</li>
                </ul>
              </Card>
              
              <Card className="academic-card p-6 text-center">
                <Lock className="w-12 h-12 text-secure-emerald mx-auto mb-4" />
                <h4 className="font-playfair text-xl font-semibold mb-3">Data Layer</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• End-to-End Encryption</li>
                  <li>• Key Rotation</li>
                  <li>• Data Anonymization</li>
                  <li>• Secure Backups</li>
                </ul>
              </Card>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center">
            <Card className="academic-card p-12 max-w-3xl mx-auto">
              <Zap className="w-16 h-16 text-secure-emerald mx-auto mb-6" />
              <h3 className="font-playfair text-3xl font-semibold mb-4">
                Ready to Secure Your Certificates?
              </h3>
              <p className="text-muted-foreground mb-8 text-lg">
                Join thousands of professionals who trust their academic achievements to our 
                military-grade security infrastructure.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-gradient-secure hover:shadow-secure text-white">
                  <Link to="/add-certificate">Start Securing Now</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/vault">View Your Vault</Link>
                </Button>
              </div>
            </Card>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Security;