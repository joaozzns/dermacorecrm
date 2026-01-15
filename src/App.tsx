import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Agenda from "./pages/Agenda";
import Leads from "./pages/Leads";
import Followup from "./pages/Followup";
import WhatsApp from "./pages/WhatsApp";
import Relatorios from "./pages/Relatorios";
import Financeiro from "./pages/Financeiro";
import PosProcedimento from "./pages/PosProcedimento";
import Equipe from "./pages/Equipe";
import Automacoes from "./pages/Automacoes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/followup" element={<Followup />} />
          <Route path="/whatsapp" element={<WhatsApp />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/financeiro" element={<Financeiro />} />
          <Route path="/pos-procedimento" element={<PosProcedimento />} />
          <Route path="/equipe" element={<Equipe />} />
          <Route path="/automacoes" element={<Automacoes />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
