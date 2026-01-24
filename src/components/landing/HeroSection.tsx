import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { ContactForm } from "./ContactForm";
import dashboardPreview from "@/assets/dashboard-preview.png";

export const HeroSection = () => {
  const isMobile = useIsMobile();

  const ContactButton = () => {
    if (isMobile) {
      return (
        <Drawer>
          <DrawerTrigger asChild>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 border-2 hover:bg-secondary/50"
            >
              <MessageSquare className="mr-2 w-5 h-5" />
              Fale com Especialista
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[90vh]">
            <ContactForm />
          </DrawerContent>
        </Drawer>
      );
    }

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="lg" 
            className="text-lg px-8 py-6 border-2 hover:bg-secondary/50"
          >
            <MessageSquare className="mr-2 w-5 h-5" />
            Fale com Especialista
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
          <ContactForm />
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden bg-gradient-to-br from-background via-background to-secondary/30 pt-24">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 2 }}
          className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 2, delay: 1 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl"
        />
      </div>

      {/* Floating Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-primary/40 rounded-full"
          animate={{ 
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{ 
            duration: 3 + i, 
            repeat: Infinity, 
            delay: i * 0.5 
          }}
          style={{
            left: `${10 + i * 15}%`,
            top: `${20 + i * 10}%`
          }}
        />
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">
            Plataforma #1 para Clínicas Estéticas
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
        >
          <span className="text-foreground">Transforme sua</span>
          <br />
          <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
            Clínica Estética
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10"
        >
          Gerencie agendamentos, pacientes e finanças em uma única plataforma. 
          <span className="text-foreground font-medium"> Aumente sua receita em até 40%</span> com nossa IA integrada.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link to="/auth">
            <Button 
              size="lg" 
              className="btn-premium text-lg px-8 py-6 group"
            >
              Testar 7 dias Grátis
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <ContactButton />
        </motion.div>

        {/* Dashboard Preview Image */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="relative mx-auto max-w-6xl"
        >
          {/* Glow effect behind the image */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-2xl blur-3xl transform scale-95" />
          
          {/* Image container with border and shadow */}
          <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-2xl shadow-primary/10">
            <img 
              src={dashboardPreview} 
              alt="Dashboard DermaCore - Gestão completa para clínicas estéticas"
              className="w-full h-auto"
            />
            
            {/* Overlay gradient at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
          </div>
          
          {/* Floating badges around the image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="absolute -left-4 top-1/4 hidden lg:block"
          >
            <div className="px-4 py-2 rounded-lg bg-card border border-border shadow-lg">
              <div className="text-sm font-medium text-primary">+40%</div>
              <div className="text-xs text-muted-foreground">Receita</div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="absolute -right-4 top-1/3 hidden lg:block"
          >
            <div className="px-4 py-2 rounded-lg bg-card border border-border shadow-lg">
              <div className="text-sm font-medium text-green-500">-75%</div>
              <div className="text-xs text-muted-foreground">No-shows</div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.6 }}
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 hidden lg:block"
          >
            <div className="px-4 py-2 rounded-lg bg-card border border-border shadow-lg flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <div className="text-xs text-muted-foreground">500+ clínicas ativas</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 1.8 }}
          className="mt-16 flex flex-col items-center"
        >
          <p className="text-sm text-muted-foreground mb-4">
            Mais de 500+ clínicas já confiam na nossa plataforma
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
            {["Clínica Beleza Pura", "Estética Premium", "Beauty Center", "Spa Vida"].map((name, i) => (
              <motion.span
                key={name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 + i * 0.1 }}
                className="text-lg font-semibold text-muted-foreground"
              >
                {name}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};