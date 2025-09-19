import { Card } from "@/components/ui/card";
import { Shield, Lock, Key, Eye, Server, Fingerprint } from "lucide-react";

const securityFeatures = [
  {
    icon: Shield,
    title: "End-to-End Encryption",
    description: "AES-256 encryption ensures your certificates are completely secure during storage and transmission."
  },
  {
    icon: Lock,
    title: "Blockchain Verification",
    description: "Every certificate is anchored to the blockchain, providing immutable proof of authenticity."
  },
  {
    icon: Key,
    title: "Zero-Knowledge Access",
    description: "We can't see your certificates. Only you control access through your private keys."
  },
  {
    icon: Eye,
    title: "Granular Permissions",
    description: "Control exactly what information employers can see and for how long."
  },
  {
    icon: Server,
    title: "Decentralized Storage",
    description: "Your data is distributed across multiple secure nodes, eliminating single points of failure."
  },
  {
    icon: Fingerprint,
    title: "Biometric Security",
    description: "Advanced biometric verification adds an extra layer of protection to your vault."
  }
];

const SecuritySection = () => {
  return (
    <section id="security" className="py-20 bg-gradient-to-br from-academic-navy via-academic-navy/95 to-secure-emerald/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6 text-white">
            Military-Grade Security
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Your academic achievements deserve the highest level of protection. Our security infrastructure is designed to exceed government standards.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {securityFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={index}
                className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300 hover:shadow-glow-secure"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="p-6">
                  <div className="mb-4">
                    <div className="w-12 h-12 bg-gradient-secure rounded-lg flex items-center justify-center circuit-glow">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="font-playfair text-xl font-semibold mb-3 text-white">
                    {feature.title}
                  </h3>
                  
                  <p className="text-white/70 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold text-academic-gold mb-2">256-bit</div>
              <div className="text-white/80">AES Encryption</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-academic-gold mb-2">99.99%</div>
              <div className="text-white/80">Uptime Guarantee</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-academic-gold mb-2">ISO 27001</div>
              <div className="text-white/80">Certified Security</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;