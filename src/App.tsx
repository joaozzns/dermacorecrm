import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "next-themes";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Landing from "./pages/Landing";
import Agenda from "./pages/Agenda";
import Leads from "./pages/Leads";
import Followup from "./pages/Followup";
import WhatsApp from "./pages/WhatsApp";
import Relatorios from "./pages/Relatorios";
import Financeiro from "./pages/Financeiro";
import PosProcedimento from "./pages/PosProcedimento";
import Equipe from "./pages/Equipe";
import Automacoes from "./pages/Automacoes";
import Onboarding from "./pages/Onboarding";
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";
import Planos from "./pages/Planos";
import Procedimentos from "./pages/Procedimentos";
import Orcamentos from "./pages/Orcamentos";
import Convite from "./pages/Convite";
import TermosDeUso from "./pages/TermosDeUso";
import PoliticaPrivacidade from "./pages/PoliticaPrivacidade";
import CentralAjuda from "./pages/CentralAjuda";
import Documentacao from "./pages/Documentacao";
import StatusPage from "./pages/StatusPage";
import SobreNos from "./pages/SobreNos";
import Blog from "./pages/Blog";
import Atualizacoes from "./pages/Atualizacoes";
import Integracoes from "./pages/Integracoes";
import Recursos from "./pages/Recursos";
import Download from "./pages/Download";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/landing" element={<Landing />} />
              <Route path="/planos" element={<Planos />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/convite/:code" element={<Convite />} />
              <Route path="/termos" element={<TermosDeUso />} />
              <Route path="/privacidade" element={<PoliticaPrivacidade />} />
              <Route path="/ajuda" element={<CentralAjuda />} />
              <Route path="/documentacao" element={<Documentacao />} />
              <Route path="/status" element={<StatusPage />} />
              <Route path="/sobre" element={<SobreNos />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/atualizacoes" element={<Atualizacoes />} />
              <Route path="/integracoes" element={<Integracoes />} />
              <Route path="/recursos" element={<Recursos />} />
              <Route path="/download" element={<Download />} />
              
              {/* Protected routes */}
              <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/agenda" element={<ProtectedRoute><Agenda /></ProtectedRoute>} />
              <Route path="/leads" element={<ProtectedRoute><Leads /></ProtectedRoute>} />
              <Route path="/followup" element={<ProtectedRoute><Followup /></ProtectedRoute>} />
              <Route path="/whatsapp" element={<ProtectedRoute><WhatsApp /></ProtectedRoute>} />
              <Route path="/relatorios" element={<ProtectedRoute><Relatorios /></ProtectedRoute>} />
              <Route path="/financeiro" element={<ProtectedRoute><Financeiro /></ProtectedRoute>} />
              <Route path="/pos-procedimento" element={<ProtectedRoute><PosProcedimento /></ProtectedRoute>} />
              <Route path="/procedimentos" element={<ProtectedRoute><Procedimentos /></ProtectedRoute>} />
              <Route path="/orcamentos" element={<ProtectedRoute><Orcamentos /></ProtectedRoute>} />
              <Route path="/equipe" element={<ProtectedRoute><Equipe /></ProtectedRoute>} />
              <Route path="/automacoes" element={<ProtectedRoute><Automacoes /></ProtectedRoute>} />
              <Route path="/configuracoes" element={<ProtectedRoute><Configuracoes /></ProtectedRoute>} />
              
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
