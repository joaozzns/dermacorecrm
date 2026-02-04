import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import logoDermacore from "@/assets/logo_dermacore.png";

export const NavbarLanding = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Recursos", href: "#recursos" },
    { label: "Planos", href: "/planos", isRoute: true },
    { label: "Depoimentos", href: "#depoimentos" },
    { label: "Contato", href: "#contato" }
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/80 backdrop-blur-xl border-b border-border shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/landing" className="flex items-center gap-2">
            <img src={logoDermacore} alt="DermaCore" className="h-16 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.isRoute ? (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  {link.label}
                </a>
              )
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/auth">
              <Button variant="ghost" className="font-medium">
                Entrar
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="btn-premium">
                <ArrowRight className="w-4 h-4 mr-2" />
                Testar 7 dias Grátis
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-border"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                link.isRoute ? (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                )
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <Link to="/auth">
                  <Button variant="outline" className="w-full">
                    Entrar
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button className="btn-premium w-full">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Testar 7 dias Grátis
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};
