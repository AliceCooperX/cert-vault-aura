import { Shield, Lock, GraduationCap, Github, Twitter, Linkedin } from "lucide-react";
import encryptedBooks from "@/assets/encrypted-books.png";

const Footer = () => {
  return (
    <footer className="bg-gradient-academic text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-gold rounded-lg flex items-center justify-center circuit-glow">
                <Shield className="w-6 h-6 text-academic-navy" />
              </div>
              <span className="font-playfair font-bold text-xl">CertVault</span>
            </div>
            <p className="text-white/80 leading-relaxed">
              Your achievements, your privacy. The most secure way to store and share educational certificates.
            </p>
            <div className="flex space-x-4">
              <Github className="w-5 h-5 text-white/60 hover:text-academic-gold cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 text-white/60 hover:text-academic-gold cursor-pointer transition-colors" />
              <Linkedin className="w-5 h-5 text-white/60 hover:text-academic-gold cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="font-playfair text-lg font-semibold">Product</h3>
            <ul className="space-y-2 text-white/80">
              <li><a href="#" className="hover:text-academic-gold transition-colors">Certificate Vault</a></li>
              <li><a href="#" className="hover:text-academic-gold transition-colors">Employer Verification</a></li>
              <li><a href="#" className="hover:text-academic-gold transition-colors">Security Features</a></li>
              <li><a href="#" className="hover:text-academic-gold transition-colors">API Access</a></li>
            </ul>
          </div>

          {/* Security */}
          <div className="space-y-4">
            <h3 className="font-playfair text-lg font-semibold">Security</h3>
            <ul className="space-y-2 text-white/80">
              <li><a href="#" className="hover:text-academic-gold transition-colors">Encryption Standards</a></li>
              <li><a href="#" className="hover:text-academic-gold transition-colors">Blockchain Technology</a></li>
              <li><a href="#" className="hover:text-academic-gold transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-academic-gold transition-colors">Security Audit</a></li>
            </ul>
          </div>

          {/* Animated Books */}
          <div className="space-y-4">
            <h3 className="font-playfair text-lg font-semibold">Knowledge Base</h3>
            <div className="relative">
              <img 
                src={encryptedBooks} 
                alt="Encrypted Knowledge Books" 
                className="w-32 h-32 object-contain mx-auto animate-book-flip opacity-80"
              />
              <div className="absolute top-0 right-0 w-4 h-4 bg-secure-emerald rounded-full flex items-center justify-center animate-seal-pulse">
                <Lock className="w-2 h-2 text-white" />
              </div>
            </div>
            <ul className="space-y-2 text-white/80 text-sm">
              <li className="flex items-center space-x-2">
                <GraduationCap className="w-4 h-4" />
                <span>Getting Started Guide</span>
              </li>
              <li className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Security Best Practices</span>
              </li>
              <li className="flex items-center space-x-2">
                <Lock className="w-4 h-4" />
                <span>Encryption Explained</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-white/60 text-sm">
              © 2024 CertVault. All rights reserved. Your certificates are protected by military-grade encryption.
            </p>
            <div className="flex space-x-6 text-sm text-white/60">
              <a href="#" className="hover:text-academic-gold transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-academic-gold transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-academic-gold transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;