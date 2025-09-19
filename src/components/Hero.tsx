import { Button } from "@/components/ui/button";
import { Shield, Lock, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import heroLogo from "@/assets/hero-logo.png";

const Hero = () => {
  return (
    <section className="min-h-screen bg-gradient-hero flex items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 border border-academic-gold rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 border border-secure-emerald rounded-full animate-pulse delay-300"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 border border-academic-gold rounded-full animate-pulse delay-700"></div>
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="scroll-reveal">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <img 
                src={heroLogo} 
                alt="CertVault Logo" 
                className="w-32 h-16 object-contain circuit-glow"
              />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-secure-emerald rounded-full flex items-center justify-center animate-seal-pulse">
                <Lock className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>

          <h1 className="font-playfair text-5xl md:text-7xl font-bold mb-6 text-white">
            Your Achievements,
            <br />
            <span className="bg-gradient-to-r from-academic-gold to-academic-gold-light bg-clip-text text-transparent">
              Your Privacy
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Store your educational certificates in an encrypted blockchain vault. 
            Share with verified employers while maintaining complete control over your academic privacy.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              asChild
              className="bg-gradient-gold hover:shadow-gold text-academic-navy font-semibold px-8 py-4 text-lg transition-all duration-300 hover:scale-105"
            >
              <Link to="/vault">
                <GraduationCap className="w-5 h-5 mr-2" />
                Access My Vault
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              asChild
              className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-4 text-lg transition-all duration-300"
            >
              <Link to="/security">
                <Shield className="w-5 h-5 mr-2" />
                Learn About Security
              </Link>
            </Button>
          </div>

          <div className="flex justify-center space-x-8 text-white/70">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-secure-emerald rounded-full animate-pulse"></div>
              <span>End-to-End Encrypted</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-academic-gold rounded-full animate-pulse delay-300"></div>
              <span>Blockchain Verified</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-secure-emerald rounded-full animate-pulse delay-700"></div>
              <span>Employer Verified</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;