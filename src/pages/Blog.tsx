import { useState, useEffect } from "react";
import { NavbarLanding } from "@/components/landing/NavbarLanding";
import { FooterSection } from "@/components/landing/FooterSection";
import { Calendar, Clock, Tag, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const defaultPosts = [
  {
    title: "5 Estratégias para Aumentar a Conversão de Leads em Clínicas Estéticas",
    excerpt: "Descubra como transformar potenciais pacientes em clientes fiéis usando técnicas comprovadas de follow-up e nutrição de leads.",
    date: "2026-04-01",
    readTime: "5 min",
    tags: ["Marketing", "Leads"],
    featured: true,
  },
  {
    title: "Como a Automação Pode Reduzir em 70% o No-Show da Sua Clínica",
    excerpt: "Lembretes automáticos por WhatsApp são a chave para manter sua agenda cheia e reduzir faltas.",
    date: "2026-03-25",
    readTime: "4 min",
    tags: ["Automação", "Agenda"],
  },
  {
    title: "LGPD na Estética: O Que Você Precisa Saber",
    excerpt: "Guia completo sobre proteção de dados de pacientes e como manter sua clínica em conformidade.",
    date: "2026-03-18",
    readTime: "7 min",
    tags: ["Compliance", "LGPD"],
  },
  {
    title: "Métricas Essenciais Para Clínicas Estéticas em 2026",
    excerpt: "Conheça os KPIs que toda clínica deve acompanhar para tomar decisões baseadas em dados.",
    date: "2026-03-10",
    readTime: "6 min",
    tags: ["Relatórios", "Gestão"],
  },
  {
    title: "Pós-Procedimento: A Chave Para Fidelização de Pacientes",
    excerpt: "Orientações de cuidados pós-procedimento enviadas automaticamente aumentam a satisfação e o retorno.",
    date: "2026-03-03",
    readTime: "4 min",
    tags: ["Pós-Procedimento", "Fidelização"],
  },
];

export default function Blog() {
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from("content_articles")
      .select("*")
      .eq("category", "blog")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .then(({ data }) => { if (data) setArticles(data); });
  }, []);

  const allPosts = [
    ...articles.map(a => ({
      title: a.title,
      excerpt: a.excerpt || "",
      date: a.published_at?.slice(0, 10) || a.created_at.slice(0, 10),
      readTime: "5 min",
      tags: a.tags || [],
      featured: false,
    })),
    ...defaultPosts,
  ];

  const featured = allPosts.find(p => p.featured) || allPosts[0];
  const rest = allPosts.filter(p => p !== featured);

  return (
    <div className="min-h-screen bg-background">
      <NavbarLanding />

      <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Blog</h1>
          <p className="text-lg text-muted-foreground">Insights, dicas e tendências para clínicas estéticas</p>
        </div>
      </section>

      {/* Featured */}
      {featured && (
        <section className="pb-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="p-8 rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-accent/5">
              <div className="flex flex-wrap gap-2 mb-4">
                {featured.tags?.map((t: string) => (
                  <span key={t} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{t}</span>
                ))}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">{featured.title}</h2>
              <p className="text-muted-foreground mb-4 max-w-2xl">{featured.excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{featured.date}</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{featured.readTime}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Posts Grid */}
      <section className="pb-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((post, i) => (
            <article key={i} className="rounded-xl border border-border bg-card overflow-hidden hover:border-primary/50 transition-colors group cursor-pointer">
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags?.map((t: string) => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{t}</span>
                  ))}
                </div>
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.date}</span>
                  <span className="flex items-center gap-1 text-primary group-hover:gap-2 transition-all">Ler mais <ArrowRight className="w-3 h-3" /></span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
