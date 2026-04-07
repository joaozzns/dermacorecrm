import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { NavbarLanding } from "@/components/landing/NavbarLanding";
import { FooterSection } from "@/components/landing/FooterSection";
import { Search, BookOpen, MessageCircle, FileText, Video, ChevronRight, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

const defaultCategories = [
  { icon: BookOpen, title: "Primeiros Passos", description: "Aprenda a configurar sua clínica", slug: "primeiros-passos", count: 5 },
  { icon: MessageCircle, title: "WhatsApp & Comunicação", description: "Configure suas mensagens automáticas", slug: "whatsapp", count: 3 },
  { icon: FileText, title: "Orçamentos & Financeiro", description: "Gerencie seus orçamentos e receita", slug: "financeiro", count: 4 },
  { icon: Video, title: "Tutoriais em Vídeo", description: "Assista guias passo a passo", slug: "tutoriais", count: 2 },
  { icon: HelpCircle, title: "FAQ", description: "Perguntas frequentes", slug: "faq", count: 8 },
];

const defaultFAQ = [
  { q: "Como adicionar um novo profissional à equipe?", a: "Acesse Equipe no menu lateral, clique em 'Convidar Membro' e envie o link de convite." },
  { q: "Como configurar lembretes automáticos?", a: "Vá em Automações e ative o fluxo de 'Lembrete de Agendamento'. Você pode personalizar o timing e a mensagem." },
  { q: "Posso exportar meus relatórios?", a: "Sim! Na página de Relatórios, clique no botão de exportar para gerar um arquivo PDF ou CSV." },
  { q: "Como funciona o pipeline de leads?", a: "O pipeline organiza seus leads em etapas: Novo → Contatado → Qualificado → Agendado → Convertido." },
];

export default function CentralAjuda() {
  const [search, setSearch] = useState("");
  const [articles, setArticles] = useState<any[]>([]);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  useEffect(() => {
    supabase
      .from("content_articles")
      .select("*")
      .eq("category", "help")
      .eq("is_published", true)
      .order("sort_order")
      .then(({ data }) => { if (data) setArticles(data); });
  }, []);

  const filteredFAQ = defaultFAQ.filter(f =>
    f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <NavbarLanding />
      
      {/* Hero */}
      <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Central de Ajuda</h1>
          <p className="text-lg text-muted-foreground mb-8">Como podemos te ajudar hoje?</p>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar artigos, tutoriais..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-12 py-6 text-lg rounded-xl"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {defaultCategories.map((cat) => (
            <div key={cat.slug} className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors cursor-pointer group">
              <cat.icon className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-1">{cat.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{cat.description}</p>
              <span className="text-xs text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                {cat.count} artigos <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Dynamic Articles */}
      {articles.length > 0 && (
        <section className="py-8 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Artigos Recentes</h2>
            <div className="space-y-3">
              {articles.map(a => (
                <div key={a.id} className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <h3 className="font-medium text-foreground">{a.title}</h3>
                  {a.excerpt && <p className="text-sm text-muted-foreground mt-1">{a.excerpt}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-8">Perguntas Frequentes</h2>
          <div className="space-y-3">
            {filteredFAQ.map((faq, i) => (
              <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === i ? null : i)}
                  className="w-full p-5 text-left flex items-center justify-between"
                >
                  <span className="font-medium text-foreground">{faq.q}</span>
                  <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${expandedFAQ === i ? "rotate-90" : ""}`} />
                </button>
                {expandedFAQ === i && (
                  <div className="px-5 pb-5 text-sm text-muted-foreground">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Não encontrou o que procurava?</h2>
          <p className="text-muted-foreground mb-6">Nossa equipe está pronta para te ajudar.</p>
          <a href="mailto:suporte@dermacore.com" className="btn-premium text-white px-8 py-3 rounded-lg inline-block">
            Falar com Suporte
          </a>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
