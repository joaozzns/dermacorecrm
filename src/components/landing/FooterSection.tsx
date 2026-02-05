import { Link } from "react-router-dom";
import logoDermacore from "@/assets/logo_dermacore.png";

export const FooterSection = () => {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="py-12 px-6 bg-sidebar-background text-sidebar-foreground">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <img src={logoDermacore} alt="DermaCore" className="h-24 w-auto object-contain drop-shadow-md" />
            </Link>
            <p className="text-sidebar-foreground/70 text-sm leading-relaxed">
              A plataforma completa para clínicas estéticas que querem crescer de forma inteligente.
            </p>
          </div>

          {/* Links - Produto */}
          <div>
            <h4 className="font-semibold text-white mb-4">Produto</h4>
            <ul className="space-y-2 text-sm text-sidebar-foreground/70">
              <li>
                <button 
                  onClick={() => scrollToSection('features')} 
                  className="hover:text-primary transition-colors"
                >
                  Recursos
                </button>
              </li>
              <li>
                <Link to="/planos" className="hover:text-primary transition-colors">
                  Planos
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('features')} 
                  className="hover:text-primary transition-colors"
                >
                  Integrações
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('features')} 
                  className="hover:text-primary transition-colors"
                >
                  Atualizações
                </button>
              </li>
            </ul>
          </div>

          {/* Links - Empresa */}
          <div>
            <h4 className="font-semibold text-white mb-4">Empresa</h4>
            <ul className="space-y-2 text-sm text-sidebar-foreground/70">
              <li>
                <button 
                  onClick={() => scrollToSection('testimonials')} 
                  className="hover:text-primary transition-colors"
                >
                  Sobre nós
                </button>
              </li>
              <li>
                <a 
                  href="https://blog.dermacore.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a 
                  href="mailto:carreiras@dermacore.com" 
                  className="hover:text-primary transition-colors"
                >
                  Carreiras
                </a>
              </li>
              <li>
                <a 
                  href="mailto:contato@dermacore.com" 
                  className="hover:text-primary transition-colors"
                >
                  Contato
                </a>
              </li>
            </ul>
          </div>

          {/* Links - Suporte */}
          <div>
            <h4 className="font-semibold text-white mb-4">Suporte</h4>
            <ul className="space-y-2 text-sm text-sidebar-foreground/70">
              <li>
                <a 
                  href="mailto:suporte@dermacore.com" 
                  className="hover:text-primary transition-colors"
                >
                  Central de Ajuda
                </a>
              </li>
              <li>
                <a 
                  href="https://docs.dermacore.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Documentação
                </a>
              </li>
              <li>
                <a 
                  href="https://status.dermacore.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Status
                </a>
              </li>
              <li>
                <Link to="/termos" className="hover:text-primary transition-colors">
                  Termos de Uso
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-sidebar-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-sidebar-foreground/50">
            © {currentYear} DermaCore. Todos os direitos reservados.
          </p>
          <div className="flex gap-6 text-sm text-sidebar-foreground/50">
            <Link to="/privacidade" className="hover:text-primary transition-colors">
              Privacidade
            </Link>
            <Link to="/termos" className="hover:text-primary transition-colors">
              Termos
            </Link>
            <button 
              onClick={() => {
                // Simple cookie consent acknowledgment
                localStorage.setItem('cookieConsent', 'acknowledged');
              }}
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
