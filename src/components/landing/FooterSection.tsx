import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import logoDermacore from "@/assets/logo_dermacore.png";

export const FooterSection = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-sidebar-background text-sidebar-foreground overflow-hidden">
      {/* Gradient transition from content */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      {/* Mini CTA */}
      <div className="border-b border-sidebar-border">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sidebar-foreground/80 font-medium">
            Pronto para crescer? Comece agora mesmo.
          </p>
          <Link
            to="/auth?plan=essencial"
            className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300"
            style={{ background: 'var(--gradient-gold)' }}
          >
            <span className="text-white">Começar Agora</span>
            <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <img src={logoDermacore} alt="DermaCore" className="h-10 w-auto object-contain drop-shadow-md" />
            </Link>
            <p className="text-sidebar-foreground/70 text-sm leading-relaxed">
              A plataforma completa para clínicas estéticas que querem crescer de forma inteligente.
            </p>
          </div>

          {/* Produto */}
          <div>
            <h4 className="font-semibold text-white mb-4">Produto</h4>
            <ul className="space-y-2 text-sm text-sidebar-foreground/70">
              <li><Link to="/recursos" className="hover:text-primary transition-colors">Recursos</Link></li>
              <li><Link to="/planos" className="hover:text-primary transition-colors">Planos</Link></li>
              <li><Link to="/integracoes" className="hover:text-primary transition-colors">Integrações</Link></li>
              <li><Link to="/atualizacoes" className="hover:text-primary transition-colors">Atualizações</Link></li>
              <li><Link to="/download" className="hover:text-primary transition-colors">Download</Link></li>
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h4 className="font-semibold text-white mb-4">Empresa</h4>
            <ul className="space-y-2 text-sm text-sidebar-foreground/70">
              <li><Link to="/sobre" className="hover:text-primary transition-colors">Sobre nós</Link></li>
              <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><a href="mailto:carreiras@dermacore.com" className="hover:text-primary transition-colors">Carreiras</a></li>
              <li><a href="mailto:contato@dermacore.com" className="hover:text-primary transition-colors">Contato</a></li>
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h4 className="font-semibold text-white mb-4">Suporte</h4>
            <ul className="space-y-2 text-sm text-sidebar-foreground/70">
              <li><Link to="/ajuda" className="hover:text-primary transition-colors">Central de Ajuda</Link></li>
              <li><Link to="/documentacao" className="hover:text-primary transition-colors">Documentação</Link></li>
              <li><Link to="/status" className="hover:text-primary transition-colors">Status</Link></li>
              <li><Link to="/termos" className="hover:text-primary transition-colors">Termos de Uso</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-sidebar-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-sidebar-foreground/50">
            © {currentYear} DermaCore. Todos os direitos reservados.
          </p>
          <div className="flex gap-6 text-sm text-sidebar-foreground/50">
            <Link to="/privacidade" className="hover:text-primary transition-colors">Privacidade</Link>
            <Link to="/termos" className="hover:text-primary transition-colors">Termos</Link>
            <button
              onClick={() => localStorage.setItem('cookieConsent', 'acknowledged')}
              className="hover:text-primary transition-colors"
            >
              Cookies
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
