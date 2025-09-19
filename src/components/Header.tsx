import { Button } from "@/components/ui/button";
import { FileText, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

const Header = () => {
  const { isConnected } = useAccount();

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-academic-gold/20">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-academic rounded-lg flex items-center justify-center circuit-glow">
              <FileText className="w-6 h-6 text-academic-gold" />
            </div>
            <span className="font-playfair font-bold text-xl text-academic-navy">CertVault Aura</span>
          </div>
          
          {isConnected && (
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/vault" className="text-foreground hover:text-academic-gold transition-colors">
                My Vault
              </Link>
              <Link to="/add-certificate" className="text-foreground hover:text-academic-gold transition-colors">
                Add Certificate
              </Link>
              <Link to="/security" className="text-foreground hover:text-academic-gold transition-colors">
                Security
              </Link>
            </nav>
          )}

          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              authenticationStatus,
              mounted,
            }) => {
              const ready = mounted && authenticationStatus !== 'loading';
              const connected =
                ready &&
                account &&
                chain &&
                (!authenticationStatus ||
                  authenticationStatus === 'authenticated');

              return (
                <div
                  {...(!ready && {
                    'aria-hidden': true,
                    style: {
                      opacity: 0,
                      pointerEvents: 'none',
                      userSelect: 'none',
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <Button
                          onClick={openConnectModal}
                          className="bg-gradient-gold hover:shadow-gold transition-all duration-300"
                        >
                          <Wallet className="w-4 h-4 mr-2" />
                          Connect Wallet
                        </Button>
                      );
                    }

                    if (chain.unsupported) {
                      return (
                        <Button
                          onClick={openChainModal}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Wrong Network
                        </Button>
                      );
                    }

                    return (
                      <Button
                        onClick={openAccountModal}
                        className="bg-gradient-gold hover:shadow-gold transition-all duration-300"
                      >
                        {account.displayName}
                        {account.displayBalance
                          ? ` (${account.displayBalance})`
                          : ''}
                      </Button>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>
      </div>
    </header>
  );
};

export default Header;