import { motion } from "framer-motion";
import { Clock, Sparkles, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/useSubscription";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const TrialBanner = () => {
  const { isTrial, subscriptionEnd, isLoading } = useSubscription();
  const navigate = useNavigate();
  const [isDismissed, setIsDismissed] = useState(false);

  // Calculate days remaining
  const getDaysRemaining = () => {
    if (!subscriptionEnd) return 0;
    const endDate = new Date(subscriptionEnd);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const daysRemaining = getDaysRemaining();

  // Don't show if not in trial, loading, or dismissed
  if (isLoading || !isTrial || isDismissed) return null;

  const isUrgent = daysRemaining <= 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`relative rounded-xl p-4 md:p-5 overflow-hidden ${
        isUrgent 
          ? "bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30" 
          : "bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/30"
      }`}
    >
      {/* Background glow */}
      <div className={`absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl ${
        isUrgent ? "bg-orange-500/20" : "bg-primary/20"
      }`} />

      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left content */}
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
            isUrgent 
              ? "bg-gradient-to-br from-orange-500 to-red-500" 
              : "bg-gradient-to-br from-primary to-accent"
          }`}>
            {isUrgent ? (
              <Clock className="w-6 h-6 text-white" />
            ) : (
              <Sparkles className="w-6 h-6 text-white" />
            )}
          </div>

          <div>
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              {isUrgent ? "Seu trial está acabando!" : "Você está no período de teste"}
              {isUrgent && (
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-orange-500/20 text-orange-500">
                  Urgente
                </span>
              )}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {daysRemaining === 0 ? (
                "Seu período de teste termina hoje. Faça upgrade para continuar usando."
              ) : daysRemaining === 1 ? (
                "Resta apenas 1 dia do seu trial. Garanta seu acesso sem interrupções."
              ) : (
                <>
                  Restam <span className={`font-semibold ${isUrgent ? "text-orange-500" : "text-primary"}`}>{daysRemaining} dias</span> do seu período gratuito. 
                  Aproveite todas as funcionalidades premium!
                </>
              )}
            </p>
          </div>
        </div>

        {/* Right content - CTA */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button
            onClick={() => navigate("/planos")}
            className={`flex-1 md:flex-none ${
              isUrgent 
                ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600" 
                : "btn-premium"
            } text-white group`}
          >
            Fazer Upgrade
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>

          <button
            onClick={() => setIsDismissed(true)}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Fechar banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(0, ((7 - daysRemaining) / 7) * 100)}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full ${
            isUrgent 
              ? "bg-gradient-to-r from-orange-500 to-red-500" 
              : "bg-gradient-to-r from-primary to-accent"
          }`}
        />
      </div>
    </motion.div>
  );
};
