import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Search, Verified, Clock, Star } from "lucide-react";

const verifiedEmployers = [
  {
    id: 1,
    name: "Google",
    logo: "🔍",
    verified: true,
    rating: 4.9,
    employees: "150,000+",
    lastVerified: "2 hours ago"
  },
  {
    id: 2,
    name: "Microsoft",
    logo: "🪟",
    verified: true,
    rating: 4.8,
    employees: "220,000+",
    lastVerified: "5 hours ago"
  },
  {
    id: 3,
    name: "Apple",
    logo: "🍎",
    verified: true,
    rating: 4.9,
    employees: "164,000+",
    lastVerified: "1 day ago"
  },
  {
    id: 4,
    name: "Tesla",
    logo: "⚡",
    verified: true,
    rating: 4.7,
    employees: "127,000+",
    lastVerified: "3 hours ago"
  }
];

const EmployerVerification = () => {
  return (
    <section id="verify" className="py-20 bg-gradient-to-br from-background to-parchment">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6 academic-heading">
            Verified Employer Network
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Only pre-verified companies can access your certificates. Every employer goes through our rigorous verification process.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-6">
            <h3 className="font-playfair text-2xl font-semibold text-academic-navy mb-4">
              How Employer Verification Works
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-secure rounded-full flex items-center justify-center text-white font-semibold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-academic-navy">Company Registration</h4>
                  <p className="text-muted-foreground">Employers submit legal documentation and business verification.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-secure rounded-full flex items-center justify-center text-white font-semibold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-academic-navy">Identity Verification</h4>
                  <p className="text-muted-foreground">Multi-layer verification including blockchain identity confirmation.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-secure rounded-full flex items-center justify-center text-white font-semibold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-academic-navy">Continuous Monitoring</h4>
                  <p className="text-muted-foreground">Ongoing verification and reputation tracking for all certified employers.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-playfair text-2xl font-semibold text-academic-navy mb-4">
              Currently Verified Employers
            </h3>
            
            {verifiedEmployers.map((employer, index) => (
              <Card 
                key={employer.id} 
                className="academic-card hover:shadow-gold transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{employer.logo}</div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-academic-navy">{employer.name}</h4>
                          <Badge className="secure-badge">
                            <Verified className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center space-x-1">
                            <Building2 className="w-3 h-3" />
                            <span>{employer.employees}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-academic-gold" />
                            <span>{employer.rating}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{employer.lastVerified}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            
            <Button className="w-full bg-gradient-academic hover:shadow-academic text-white font-semibold py-3 transition-all duration-300">
              <Search className="w-4 h-4 mr-2" />
              View All Verified Employers
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmployerVerification;