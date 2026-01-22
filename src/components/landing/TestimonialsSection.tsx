import { ScrollReveal } from "./ScrollReveal";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Dra. Marina Santos",
    role: "Dermatologista",
    clinic: "Clínica Derma Premium",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
    content: "Aumentamos nossa receita em 45% em apenas 3 meses. A automação de follow-up recuperou pacientes que tínhamos perdido.",
    rating: 5
  },
  {
    name: "Dr. Ricardo Ferreira",
    role: "Cirurgião Plástico",
    clinic: "Instituto Beleza & Saúde",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
    content: "A gestão financeira me dá visibilidade total. Consigo tomar decisões baseadas em dados reais, não em achismos.",
    rating: 5
  },
  {
    name: "Dra. Camila Oliveira",
    role: "Esteticista",
    clinic: "Studio Estética Avançada",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=150&h=150&fit=crop&crop=face",
    content: "Meus pacientes adoram agendar online. Reduzi 80% das ligações e minha recepcionista agora foca em atendimento.",
    rating: 5
  },
  {
    name: "Dr. André Mendes",
    role: "Biomédico Esteta",
    clinic: "Clínica Renove",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&h=150&fit=crop&crop=face",
    content: "A IA de conversão é incrível. Ela identifica os leads quentes e me avisa quem tem mais chance de fechar.",
    rating: 5
  }
];

export const TestimonialsSection = () => {
  return (
    <section className="py-24 px-6 bg-secondary/20 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            O que nossos clientes
            <br />
            <span className="text-gradient-primary">estão dizendo</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Profissionais de estética de todo o Brasil confiam na nossa plataforma.
          </p>
        </ScrollReveal>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <ScrollReveal 
              key={testimonial.name} 
              delay={index * 0.1}
              direction={index % 2 === 0 ? "left" : "right"}
            >
              <motion.div 
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300"
              >
                {/* Quote Icon */}
                <Quote className="absolute top-6 right-6 w-10 h-10 text-primary/10" />
                
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-lg text-foreground mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-primary/20"
                  />
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} • {testimonial.clinic}
                    </div>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
