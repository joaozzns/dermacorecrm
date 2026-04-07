import { useState, useEffect } from "react";
import { NavbarLanding } from "@/components/landing/NavbarLanding";
import { FooterSection } from "@/components/landing/FooterSection";
import { Sparkles, Bug, Zap, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type ChangeType = "feature" | "improvement" | "fix" | "security";

const typeConfig: Record<ChangeType, { icon: typeof Sparkles; label: string; color: string }> = {
  feature: { icon: Sparkles, label: "Novo", color: "bg-emerald-500/10 text-emerald-500" },
  improvement: { icon: Zap, label: "Melhoria", color: "bg-blue-500/10 text-blue-500" },
  fix: { icon: Bug, label: "Correção", color: "bg-orange-500/10 text-orange-500" },
  security: { icon: Shield, label: "Segurança", color: "bg-red-500/10 text-red-500" },
};

const defaultReleases = [
  {
    version: "2.4.0", date: "2026-04-05",
    changes: [
      { type: "feature" as ChangeType, text: "Download do app para desktop (Windows e Mac)" },
      { type: "feature" as ChangeType, text: "Central de Ajuda e Documentação completa" },
      { type: "improvement" as ChangeType, text: "Novo sistema de CMS para blog e conteúdo" },
      { type: "fix" as ChangeType, text: "Correção do fluxo de login para assinantes manuais" },
    ]
  },
  {
    version: "2.3.0", date: "2026-03-28",
    changes: [
      { type: "feature" as ChangeType, text: "Integração com Google Calendar" },
      { type: "feature" as ChangeType, text: "Página de automações funcional com templates" },
      { type: "improvement" as ChangeType, text: "Melhorias na tela de agenda" },
    ]
  },
  {
    version: "2.2.0", date: "2026-03-20",
    changes: [
      { type: "feature" as ChangeType, text: "Upload funcional de logo da clínica com crop" },
      { type: "feature" as ChangeType, text: "Wizard de onboarding pós-cadastro em 3 passos" },
      { type: "improvement" as ChangeType, text: "Termos de uso e política de privacidade" },
      { type: "security" as ChangeType, text: "Bloqueio de acesso por assinatura no ProtectedRoute" },
    ]
  },
  {
    version: "2.1.0", date: "2026-03-10",
    changes: [
      { type: "feature" as ChangeType, text: "Sistema de orçamentos com geração de PDF" },
      { type: "feature" as ChangeType, text: "Catálogo de procedimentos com categorias" },
      { type: "improvement" as ChangeType, text: "Dashboard com métricas de receita em tempo real" },
    ]
  },
];

export default function Atualizacoes() {
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from("content_articles")
      .select("*")
      .eq("category", "updates")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .then(({ data }) => { if (data) setArticles(data); });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <NavbarLanding />

      <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Atualizações</h1>
          <p className="text-lg text-muted-foreground">Acompanhe tudo que há de novo no DermaCore</p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-6 top-0 bottom-0 w-px bg-border" />

            <div className="space-y-12">
              {defaultReleases.map((release, ri) => (
                <div key={ri} className="relative pl-12 md:pl-16">
                  {/* Dot */}
                  <div className="absolute left-2.5 md:left-4.5 top-1 w-3 h-3 rounded-full bg-primary border-2 border-background" />

                  <div className="mb-4">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-bold text-foreground">v{release.version}</h2>
                      <span className="text-sm text-muted-foreground">{release.date}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {release.changes.map((change, ci) => {
                      const config = typeConfig[change.type];
                      const Icon = config.icon;
                      return (
                        <div key={ci} className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border">
                          <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full flex-shrink-0 ${config.color}`}>
                            <Icon className="w-3 h-3" />
                            {config.label}
                          </span>
                          <span className="text-sm text-foreground">{change.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
