import Header from "@/components/Header";
import Hero from "@/components/Hero";
import EmployerVerification from "@/components/EmployerVerification";
import Footer from "@/components/Footer";
import { WalletConnect } from "@/components/WalletConnect";
import { useAccount } from 'wagmi';

const Index = () => {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-background font-inter">
      <Header />
      {!isConnected ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <WalletConnect />
        </div>
      ) : (
        <>
          <Hero />
          <EmployerVerification />
        </>
      )}
      <Footer />
    </div>
  );
};

export default Index;
