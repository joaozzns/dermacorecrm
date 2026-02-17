import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useClinicInvites } from '@/hooks/useClinicInvites';
import { Button } from '@/components/ui/button';
import { Loader2, Link2, CheckCircle2, XCircle } from 'lucide-react';

export default function Convite() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading, profile } = useAuth();
  const { acceptInvite } = useClinicInvites();
  const [status, setStatus] = useState<'loading' | 'ready' | 'success' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      // Redirect to auth with return URL
      navigate(`/auth?redirect=/convite/${code}`);
      return;
    }
    if (profile?.clinic_id) {
      setStatus('error');
      setErrorMsg('Você já está vinculado a uma clínica.');
      return;
    }
    setStatus('ready');
  }, [authLoading, user, profile, code, navigate]);

  const handleAccept = () => {
    if (!code) return;
    acceptInvite.mutate(code, {
      onSuccess: () => setStatus('success'),
      onError: (err) => {
        setStatus('error');
        setErrorMsg(err.message);
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center">
        {status === 'loading' && (
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
        )}

        {status === 'ready' && (
          <>
            <Link2 className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Convite para Clínica</h1>
            <p className="text-muted-foreground mb-6">
              Você foi convidado para participar de uma clínica. Clique abaixo para aceitar.
            </p>
            <Button onClick={handleAccept} disabled={acceptInvite.isPending} className="gap-2">
              {acceptInvite.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}
              {acceptInvite.isPending ? 'Processando...' : 'Aceitar Convite'}
            </Button>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Convite Aceito!</h1>
            <p className="text-muted-foreground mb-6">Você foi vinculado à clínica com sucesso.</p>
            <Button onClick={() => navigate('/dashboard')}>Ir para o Dashboard</Button>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Erro no Convite</h1>
            <p className="text-muted-foreground mb-6">{errorMsg}</p>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>Voltar ao Dashboard</Button>
          </>
        )}
      </div>
    </div>
  );
}
