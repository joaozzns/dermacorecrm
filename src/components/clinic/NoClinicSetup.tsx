import { useState } from 'react';
import { Building2, Link2, Plus, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useClinicInvites } from '@/hooks/useClinicInvites';
import { toast } from 'sonner';

export function NoClinicSetup() {
  const { user } = useAuth();
  const { acceptInvite } = useClinicInvites();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [clinicName, setClinicName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateClinic = async () => {
    if (!clinicName.trim()) {
      toast.error('Nome da clínica é obrigatório');
      return;
    }
    if (!user) return;

    setIsCreating(true);
    try {
      const { data, error } = await supabase.rpc('create_clinic_for_user', {
        p_clinic_name: clinicName.trim(),
      });
      if (error) throw error;
      const result = data as unknown as { success: boolean; error?: string; clinic_id?: string };
      if (!result.success) throw new Error(result.error || 'Erro ao criar clínica');

      toast.success('Clínica criada com sucesso!');
      window.location.reload();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error('Erro ao criar clínica: ' + msg);
    } finally {
      setIsCreating(false);
    }
  };

  const handleAcceptInvite = () => {
    // Extract invite code from URL or raw code
    let code = inviteCode.trim();
    const match = code.match(/convite\/([a-f0-9]+)/);
    if (match) code = match[1];
    if (!code) {
      toast.error('Insira um código de convite válido');
      return;
    }
    acceptInvite.mutate(code);
  };

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Configure sua clínica</h2>
        <p className="text-muted-foreground mb-8">
          Crie uma nova clínica ou entre em uma existente através de um link de convite.
        </p>
        <div className="flex flex-col gap-3">
          <Button onClick={() => setShowCreateDialog(true)} className="gap-2 w-full">
            <Plus className="w-4 h-4" />
            Criar Nova Clínica
          </Button>
          <Button variant="outline" onClick={() => setShowInviteDialog(true)} className="gap-2 w-full">
            <Link2 className="w-4 h-4" />
            Entrar com Convite
          </Button>
        </div>

        {/* Create Clinic Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                Criar Nova Clínica
              </DialogTitle>
              <DialogDescription>
                Você será o administrador desta clínica.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="clinic-name">Nome da Clínica *</Label>
                <Input
                  id="clinic-name"
                  placeholder="Ex: Clínica Estética Premium"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  maxLength={100}
                />
              </div>
              <Button onClick={handleCreateClinic} disabled={isCreating} className="w-full gap-2">
                {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                {isCreating ? 'Criando...' : 'Criar Clínica'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Accept Invite Dialog */}
        <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Link2 className="w-5 h-5 text-primary" />
                Entrar com Convite
              </DialogTitle>
              <DialogDescription>
                Cole o link ou código de convite que você recebeu.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="invite-code">Link ou Código de Convite</Label>
                <Input
                  id="invite-code"
                  placeholder="Cole o link ou código aqui"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                />
              </div>
              <Button onClick={handleAcceptInvite} disabled={acceptInvite.isPending} className="w-full gap-2">
                {acceptInvite.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}
                {acceptInvite.isPending ? 'Processando...' : 'Aceitar Convite'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
