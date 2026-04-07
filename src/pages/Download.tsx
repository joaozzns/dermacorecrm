import { useState } from "react";
import { NavbarLanding } from "@/components/landing/NavbarLanding";
import { FooterSection } from "@/components/landing/FooterSection";
import { Monitor, Apple, Smartphone, Download as DownloadIcon, CheckCircle, Shield, Globe, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const platforms = [
  {
    icon: Monitor,
    name: "Windows",
    version: "v2.4.0",
    size: "~85 MB",
    requirements: "Windows 10 ou superior",
    format: ".exe",
    available: true,
    instruction: "Para instalar no Windows, adicione o DermaCore como um Web App:\n\n1. Abra o DermaCore no Chrome\n2. Clique nos 3 pontos (⋮) no canto superior direito\n3. Selecione 'Instalar DermaCore'\n4. Pronto! O app aparecerá na sua área de trabalho",
  },
  {
    icon: Apple,
    name: "macOS",
    version: "v2.4.0",
    size: "~90 MB",
    requirements: "macOS 11 Big Sur ou superior",
    format: ".dmg",
    available: true,
    instruction: "Para instalar no macOS, adicione o DermaCore como um Web App:\n\n1. Abra o DermaCore no Chrome ou Safari\n2. No Chrome: clique nos 3 pontos → 'Instalar DermaCore'\n3. No Safari: clique em Arquivo → 'Adicionar ao Dock'\n4. Pronto! O app aparecerá no seu Dock",
  },
  {
    icon: Smartphone,
    name: "Android",
    version: "v2.4.0",
    size: "~5 MB",
    requirements: "Android 10 ou superior",
    format: "PWA",
    available: true,
    instruction: "Para instalar no Android:\n\n1. Abra o DermaCore no Chrome\n2. Toque nos 3 pontos (⋮) no canto superior direito\n3. Selecione 'Adicionar à tela inicial'\n4. Toque em 'Adicionar'\n5. O app aparecerá na sua tela inicial",
  },
  {
    icon: Smartphone,
    name: "iOS",
    version: "v2.4.0",
    size: "~5 MB",
    requirements: "iOS 15 ou superior",
    format: "PWA",
    available: true,
    instruction: "Para instalar no iOS:\n\n1. Abra o DermaCore no Safari\n2. Toque no botão de compartilhar (□↑)\n3. Role para baixo e toque em 'Adicionar à Tela de Início'\n4. Toque em 'Adicionar'\n5. O app aparecerá na sua tela inicial",
  },
];

const desktopFeatures = [
  "Acesso rápido pela área de trabalho",
  "Notificações nativas do sistema",
  "Funciona como app nativo",
  "Sem necessidade de abrir o navegador",
  "Atualizações automáticas",
  "Disponível em todas as plataformas",
];

export default function Download() {
  const [selectedPlatform, setSelectedPlatform] = useState<number | null>(null);

  const handleInstall = (index: number) => {
    setSelectedPlatform(index);
  };

  return (
    <div className="min-h-screen bg-background">
      <NavbarLanding />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <DownloadIcon className="w-4 h-4" />
            Disponível em todas as plataformas
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Instale o DermaCore</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Instale o DermaCore no seu computador ou celular para ter acesso rápido direto da sua tela inicial.
          </p>
        </div>
      </section>

      {/* Download Cards */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {platforms.map((p, i) => (
            <div key={i} className="p-6 rounded-xl border bg-card flex flex-col border-border hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10">
                  <p.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{p.name}</h3>
                  <span className="text-xs text-muted-foreground">{p.version}</span>
                </div>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground mb-6 flex-1">
                <p>Formato: {p.format}</p>
                <p>{p.requirements}</p>
              </div>

              <Button
                className="w-full btn-premium text-white"
                onClick={() => handleInstall(i)}
              >
                <DownloadIcon className="w-4 h-4 mr-2" />
                Instalar no {p.name}
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Installation Instructions Modal */}
      {selectedPlatform !== null && (
        <section className="pb-16 px-6">
          <div className="max-w-2xl mx-auto p-8 rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
            <div className="flex items-center gap-3 mb-6">
              {(() => { const Icon = platforms[selectedPlatform].icon; return <Icon className="w-8 h-8 text-primary" />; })()}
              <h2 className="text-xl font-bold text-foreground">
                Como instalar no {platforms[selectedPlatform].name}
              </h2>
            </div>
            <div className="whitespace-pre-line text-foreground leading-relaxed text-sm">
              {platforms[selectedPlatform].instruction}
            </div>
            <div className="mt-6 flex gap-3">
              <Button
                className="btn-premium text-white"
                onClick={() => {
                  window.open("/auth", "_blank");
                  toast.success("Abra o DermaCore no navegador e siga os passos acima!");
                }}
              >
                <Globe className="w-4 h-4 mr-2" />
                Abrir DermaCore
              </Button>
              <Button variant="outline" onClick={() => setSelectedPlatform(null)}>
                Fechar
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Vantagens do App Instalado</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {desktopFeatures.map((f, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span className="text-foreground">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security note */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Shield className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Seguro e Confiável</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            O DermaCore usa tecnologia PWA (Progressive Web App) para oferecer uma experiência nativa 
            sem necessidade de lojas de apps. Seus dados são protegidos com criptografia ponta a ponta.
          </p>
        </div>
      </section>

      {/* Web alternative */}
      <section className="py-12 px-6 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-xl font-bold mb-2">Prefere usar no navegador?</h2>
          <p className="text-muted-foreground mb-4">O DermaCore funciona perfeitamente em qualquer navegador moderno.</p>
          <Button variant="outline" asChild>
            <a href="/auth">Acessar pelo Navegador</a>
          </Button>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
