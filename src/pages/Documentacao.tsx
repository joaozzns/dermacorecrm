import { useState, useEffect } from "react";
import { NavbarLanding } from "@/components/landing/NavbarLanding";
import { FooterSection } from "@/components/landing/FooterSection";
import { BookOpen, Code, Database, Shield, Zap, Settings, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const sections = [
  { icon: BookOpen, title: "Guia de Início Rápido", items: [
    "Criando sua conta", "Configurando a clínica", "Adicionando sua equipe", "Primeiro agendamento"
  ]},
  { icon: Zap, title: "Automações", items: [
    "Configurando lembretes", "Mensagens de boas-vindas", "Follow-up automático", "Templates personalizados"
  ]},
  { icon: Database, title: "Gestão de Dados", items: [
    "Importando pacientes", "Pipeline de leads", "Orçamentos e propostas", "Relatórios e métricas"
  ]},
  { icon: Shield, title: "Segurança & Privacidade", items: [
    "Proteção de dados (LGPD)", "Controle de acesso", "Backup de dados", "Política de retenção"
  ]},
  { icon: Settings, title: "Configurações Avançadas", items: [
    "Personalização da marca", "Integrações externas", "API e webhooks", "Planos e faturamento"
  ]},
  { icon: Code, title: "API Reference", items: [
    "Autenticação", "Endpoints de pacientes", "Endpoints de leads", "Webhooks"
  ]},
];

export default function Documentacao() {
  const [activeSection, setActiveSection] = useState(0);
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from("content_articles")
      .select("*")
      .eq("category", "docs")
      .eq("is_published", true)
      .order("sort_order")
      .then(({ data }) => { if (data) setArticles(data); });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <NavbarLanding />

      <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Documentação</h1>
          <p className="text-lg text-muted-foreground">Tudo que você precisa para dominar o DermaCore</p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <nav className="md:w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-1">
              {sections.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSection(i)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm transition-colors ${
                    activeSection === i ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <s.icon className="w-4 h-4" />
                  {s.title}
                </button>
              ))}
            </div>
          </nav>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-8">
              {(() => { const Icon = sections[activeSection].icon; return <Icon className="w-8 h-8 text-primary" />; })()}
              <h2 className="text-2xl font-bold text-foreground">{sections[activeSection].title}</h2>
            </div>

            <div className="space-y-3">
              {sections[activeSection].items.map((item, i) => (
                <div key={i} className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors cursor-pointer group flex items-center justify-between">
                  <span className="text-foreground">{item}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              ))}
            </div>

            {/* Dynamic docs articles */}
            {articles.length > 0 && (
              <div className="mt-12">
                <h3 className="text-xl font-semibold mb-4">Artigos da Documentação</h3>
                <div className="space-y-3">
                  {articles.map(a => (
                    <div key={a.id} className="p-4 rounded-lg border border-border">
                      <h4 className="font-medium">{a.title}</h4>
                      {a.excerpt && <p className="text-sm text-muted-foreground mt-1">{a.excerpt}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
