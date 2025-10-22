import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WalletProvider } from "@/components/WalletProvider";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AddCertificate from "./pages/AddCertificate";
import Vault from "./pages/Vault";
import Security from "./pages/Security";
import VerifyCertificate from "./pages/VerifyCertificate";

const App = () => (
  <WalletProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/add-certificate" element={<AddCertificate />} />
          <Route path="/vault" element={<Vault />} />
          <Route path="/verify" element={<VerifyCertificate />} />
          <Route path="/security" element={<Security />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </WalletProvider>
);

export default App;
