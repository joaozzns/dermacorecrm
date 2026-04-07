import { NavbarLanding } from "@/components/landing/NavbarLanding";
import { FooterSection } from "@/components/landing/FooterSection";
import { Heart, Target, Users, Award, TrendingUp, Shield } from "lucide-react";

const values = [
  { icon: Heart, title: "Paixão pelo cliente", description: "Cada funcionalidade nasce de uma necessidade real de clínicas estéticas." },
  { icon: Shield, title: "Segurança & Privacidade", description: "Dados dos pacientes protegidos com criptografia e conformidade LGPD." },
  { icon: TrendingUp, title: "Inovação contínua", description: "Atualizações semanais com inteligência artificial e automações inteligentes." },
  { icon: Users, title: "Comunidade", description: "Construímos junto com nossos clientes para criar a melhor plataforma." },
];

const stats = [
  { value: "500+", label: "Clínicas ativas" },
  { value: "50K+", label: "Pacientes gerenciados" },
  { value: "99.9%", label: "Uptime" },
  { value: "4.9★", label: "Avaliação média" },
];

const team = [
  { name: "Dr. Rafael Mendes", role: "CEO & Co-fundador", bio: "Dermatologista com 15 anos de experiência, apaixonado por tecnologia." },
  { name: "Ana Clara Santos", role: "CTO & Co-fundadora", bio: "Engenheira de software com passagem por grandes healthtechs." },
  { name: "Pedro Oliveira", role: "Head de Produto", bio: "Designer de produto especializado em SaaS para saúde." },
  { name: "Julia Costa", role: "Head de Sucesso do Cliente", bio: "10 anos de experiência em gestão de clínicas estéticas." },
];

export default function SobreNos() {
  return (
    <div className="min-h-screen bg-background">
      <NavbarLanding />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Sobre o DermaCore</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Nascemos com uma missão: transformar a gestão de clínicas estéticas com tecnologia inteligente, simples e acessível.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 text-primary mb-4">
              <Target className="w-5 h-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">Nossa Missão</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Empoderar clínicas estéticas a crescerem com inteligência
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Acreditamos que profissionais de estética devem focar no que fazem de melhor — cuidar de seus pacientes. 
              A tecnologia deve trabalhar silenciosamente nos bastidores, automatizando processos, 
              organizando dados e gerando insights que impulsionam o crescimento do negócio.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((s, i) => (
              <div key={i} className="p-6 rounded-xl border border-border bg-card text-center">
                <div className="text-3xl font-bold text-primary mb-1">{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Nossos Valores</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div key={i} className="p-6 rounded-xl bg-card border border-border text-center">
                <v.icon className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Nossa Equipe</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((t, i) => (
              <div key={i} className="p-6 rounded-xl border border-border bg-card text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{t.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</span>
                </div>
                <h3 className="font-semibold text-foreground">{t.name}</h3>
                <p className="text-xs text-primary mb-2">{t.role}</p>
                <p className="text-sm text-muted-foreground">{t.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
