import { useEffect, useMemo, useState } from "react";
import { NavbarLanding } from "@/components/landing/NavbarLanding";
import { FooterSection } from "@/components/landing/FooterSection";
import { Monitor, Apple, Smartphone, Download as DownloadIcon, CheckCircle, Shield, Globe, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type PlatformId = "windows" | "macos" | "android" | "ios";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const platforms: Array<{
  id: PlatformId;
  icon: typeof Monitor;
  name: string;
  version: string;
  size: string;
  requirements: string;
  format: string;
  available: boolean;
  instruction: string;
}> = [
  {
    id: "windows",
    icon: Monitor,
    name: "Windows",
    version: "v2.4.0",
    size: "~85 MB",
    requirements: "Windows 10 ou superior",
    format: "Web App",
    available: true,
    instruction: "Para instalar no Windows:\n\n1. Abra esta página no Chrome ou Edge\n2. Clique no botão 'Instalar agora' se ele aparecer\n3. Se o navegador não abrir o instalador automaticamente, use o ícone de instalar na barra de endereço ou os 3 pontos (⋮)\n4. Confirme a instalação\n5. O DermaCore ficará disponível na área de trabalho e no menu iniciar",
  },
  {
    id: "macos",
    icon: Apple,
    name: "macOS",
    version: "v2.4.0",
    size: "~90 MB",
    requirements: "macOS 11 Big Sur ou superior",
    format: "Web App",
    available: true,
    instruction: "Para instalar no macOS:\n\n1. Abra esta página no Chrome ou Safari\n2. No Chrome, clique em 'Instalar agora' ou use o ícone de instalar na barra de endereço\n3. No Safari, use Arquivo → 'Adicionar ao Dock'\n4. Confirme a instalação\n5. O DermaCore ficará disponível no Dock como app",
  },
  {
    id: "android",
    icon: Smartphone,
    name: "Android",
    version: "v2.4.0",
    size: "~5 MB",
    requirements: "Android 10 ou superior",
    format: "Web App",
    available: true,
    instruction: "Para instalar no Android:\n\n1. Abra esta página no Chrome\n2. Toque em 'Instalar agora' se o navegador mostrar o instalador\n3. Se não aparecer, toque nos 3 pontos (⋮)\n4. Selecione 'Instalar app' ou 'Adicionar à tela inicial'\n5. Toque em 'Instalar' para concluir",
  },
  {
    id: "ios",
    icon: Smartphone,
    name: "iOS",
    version: "v2.4.0",
    size: "~5 MB",
    requirements: "iOS 15 ou superior",
    format: "Web App",
    available: true,
    instruction: "Para instalar no iPhone ou iPad:\n\n1. Abra esta página no Safari\n2. Toque no botão Compartilhar (□↑)\n3. Role a lista e toque em 'Adicionar à Tela de Início'\n4. Toque em 'Adicionar'\n5. O DermaCore aparecerá na tela inicial",
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

const detectCurrentPlatform = (): PlatformId | "other" => {
  if (typeof navigator === "undefined") return "other";

  const userAgent = navigator.userAgent.toLowerCase();
  const isIpadLike = /macintosh/.test(userAgent) && navigator.maxTouchPoints > 1;

  if (/android/.test(userAgent)) return "android";
  if (/iphone|ipad|ipod/.test(userAgent) || isIpadLike) return "ios";
  if (/windows/.test(userAgent)) return "windows";
  if (/mac os x|macintosh/.test(userAgent)) return "macos";

  return "other";
};

const isStandalone = () => {
  if (typeof window === "undefined") return false;

  return window.matchMedia("(display-mode: standalone)").matches || Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);
};

const isInsidePreview = () => {
  if (typeof window === "undefined") return false;

  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
};

export default function Download() {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId | null>(null);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  const currentPlatform = useMemo(() => detectCurrentPlatform(), []);
  const previewMode = useMemo(() => isInsidePreview(), []);

  useEffect(() => {
    setIsInstalled(isStandalone());

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setInstallPrompt(null);
      setIsInstalled(true);
      toast.success("Instalação concluída com sucesso.");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const openInstallPage = () => {
    const installUrl = new URL("/download", window.location.origin).toString();
    window.open(installUrl, "_blank", "noopener,noreferrer");
  };

  const handleInstall = async (platformId: PlatformId) => {
    const platform = platforms.find((item) => item.id === platformId);

    if (!platform) return;

    setSelectedPlatform(platformId);

    if (isInstalled && currentPlatform === platformId) {
      toast.success("O DermaCore já está instalado neste dispositivo.");
      return;
    }

    if (currentPlatform !== platformId) {
      toast.info(`Para instalar no ${platform.name}, abra esta página nesse dispositivo.`);
      return;
    }

    if (previewMode) {
      openInstallPage();
      toast.info("Abri a página em nova aba, porque o preview não permite instalar o app direto daqui.");
      return;
    }

    if (platformId === "ios") {
      toast.info("No iPhone/iPad, a instalação é feita pelo botão Compartilhar do Safari.");
      return;
    }

    if (installPrompt) {
      try {
        await installPrompt.prompt();
        const choice = await installPrompt.userChoice;

        setInstallPrompt(null);

        if (choice.outcome === "accepted") {
          toast.success("Confirme a instalação no navegador para finalizar.");
        } else {
          toast.info("Instalação cancelada.");
        }

        return;
      } catch {
        toast.error("Não consegui abrir o instalador automaticamente.");
      }
    }

    toast.info("Seu navegador não liberou o instalador automático; siga as instruções abaixo.");
  };

  const selectedPlatformData = selectedPlatform
    ? platforms.find((platform) => platform.id === selectedPlatform) ?? null
    : null;

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
            Instale o DermaCore no seu computador ou celular para abrir o sistema como app, sem depender da loja de aplicativos.
          </p>
        </div>
      </section>

      {/* Download Cards */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {platforms.map((p) => {
            const isCurrentDevice = currentPlatform === p.id;
            const isDirectInstallAvailable = isCurrentDevice && p.id !== "ios" && !previewMode && Boolean(installPrompt) && !isInstalled;

            return (
            <div key={p.id} className="p-6 rounded-xl border bg-card flex flex-col border-border hover:border-primary/50 transition-colors">
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
                <p>Tamanho: {p.size}</p>
                <p>
                  {isCurrentDevice
                    ? previewMode
                      ? "Você está neste dispositivo — abra fora do preview para instalar"
                      : p.id === "ios"
                        ? "Você está neste dispositivo — instalação via Safari"
                        : isInstalled
                          ? "Já instalado neste dispositivo"
                          : isDirectInstallAvailable
                            ? "Você está neste dispositivo — instalador disponível"
                            : "Você está neste dispositivo — siga as instruções"
                    : "Abra esta página no dispositivo correspondente para instalar"}
                </p>
              </div>

              <Button
                className="w-full btn-premium text-white"
                onClick={() => handleInstall(p.id)}
              >
                <DownloadIcon className="w-4 h-4 mr-2" />
                {isCurrentDevice
                  ? previewMode
                    ? `Abrir para instalar no ${p.name}`
                    : p.id === "ios"
                      ? `Ver como instalar no ${p.name}`
                      : isDirectInstallAvailable
                        ? `Instalar agora no ${p.name}`
                        : `Instalar no ${p.name}`
                  : `Ver instruções para ${p.name}`}
              </Button>
            </div>
          )})}
        </div>
      </section>

      {/* Installation Instructions Modal */}
      {selectedPlatformData && (
        <section className="pb-16 px-6">
          <div className="max-w-2xl mx-auto p-8 rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
            <div className="flex items-center gap-3 mb-6">
              {(() => { const Icon = selectedPlatformData.icon; return <Icon className="w-8 h-8 text-primary" />; })()}
              <h2 className="text-xl font-bold text-foreground">
                Como instalar no {selectedPlatformData.name}
              </h2>
            </div>
            <div className="whitespace-pre-line text-foreground leading-relaxed text-sm">
              {selectedPlatformData.instruction}
            </div>
            <div className="mt-6 flex gap-3">
              {previewMode ? (
                <Button
                  className="btn-premium text-white"
                  onClick={() => {
                    openInstallPage();
                    toast.success("Abri a página fora do preview para você instalar.");
                  }}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Abrir em nova aba
                </Button>
              ) : (
                <Button
                  className="btn-premium text-white"
                  onClick={() => {
                    window.open("/auth", "_blank", "noopener,noreferrer");
                    toast.success("DermaCore aberto em nova aba.");
                  }}
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Abrir DermaCore
                </Button>
              )}
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
            O DermaCore usa tecnologia de app instalável para oferecer uma experiência nativa 
            sem necessidade de lojas de apps. Seus dados continuam protegidos no ambiente seguro da plataforma.
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
