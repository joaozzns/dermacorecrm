import { useAuth } from "@/hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Routes that don't require an active subscription
const SUBSCRIPTION_EXEMPT_ROUTES = ["/configuracoes"];

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();
  const { subscribed, isTrial, isLoading: subLoading, status } = useSubscription();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If user has no clinic yet, let them through to set one up
  if (!profile?.clinic_id) {
    return <>{children}</>;
  }

  // Wait for subscription check
  if (subLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Verificando assinatura...</p>
        </div>
      </div>
    );
  }

  // Check if route is exempt from subscription check
  const isExempt = SUBSCRIPTION_EXEMPT_ROUTES.some(r => location.pathname.startsWith(r));

  // Block access if no active/trial subscription
  if (!isExempt && !subscribed) {
    return <Navigate to="/planos" replace />;
  }

  return <>{children}</>;
};
