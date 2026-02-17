import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Link2, Plus, Copy, Trash2, Share2, Loader2, Users } from 'lucide-react';
import { useClinicInvites } from '@/hooks/useClinicInvites';
import { toast } from 'sonner';

export function InviteManagement() {
  const { invites, isLoading, createInvite, deactivateInvite } = useClinicInvites();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newRole, setNewRole] = useState<'admin' | 'staff'>('staff');
  const [newExpiry, setNewExpiry] = useState<string>('never');

  const getInviteUrl = (code: string) => {
    return `${window.location.origin}/convite/${code}`;
  };

  const handleCopyLink = (code: string) => {
    navigator.clipboard.writeText(getInviteUrl(code));
    toast.success('Link copiado!');
  };

  const handleShare = async (code: string) => {
    const url = getInviteUrl(code);
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Convite para Clínica', text: 'Entre na nossa clínica!', url });
      } catch {
        handleCopyLink(code);
      }
    } else {
      handleCopyLink(code);
    }
  };

  const handleCreate = () => {
    const params: { role: 'admin' | 'staff'; expires_in_days?: number } = { role: newRole };
    if (newExpiry !== 'never') params.expires_in_days = parseInt(newExpiry);
    createInvite.mutate(params, { onSuccess: () => setShowCreateDialog(false) });
  };

  const activeInvites = invites.filter(i => i.is_active);

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Links de Convite
            </CardTitle>
            <CardDescription>Convide colaboradores para sua clínica</CardDescription>
          </div>
          <Button className="gap-2" onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4" />
            Gerar Link
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : activeInvites.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Link2 className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Nenhum link de convite ativo</p>
            <p className="text-xs mt-1">Gere um link para convidar colaboradores</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeInvites.map((invite) => (
              <div key={invite.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={invite.role === 'admin' ? 'default' : 'secondary'} className="text-xs capitalize">
                      {invite.role}
                    </Badge>
                    {invite.expires_at && (
                      <Badge variant="outline" className="text-xs">
                        Expira: {new Date(invite.expires_at).toLocaleDateString('pt-BR')}
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {invite.used_count} uso{invite.used_count !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <code className="text-xs text-muted-foreground font-mono truncate block">
                    {getInviteUrl(invite.invite_code)}
                  </code>
                </div>
                <div className="flex items-center gap-1 ml-3">
                  <Button variant="ghost" size="icon" onClick={() => handleCopyLink(invite.invite_code)} title="Copiar link">
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleShare(invite.invite_code)} title="Compartilhar">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deactivateInvite.mutate(invite.id)} title="Desativar">
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Create Invite Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Gerar Link de Convite</DialogTitle>
            <DialogDescription>Configure as opções do convite</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Função do Convidado</Label>
              <Select value={newRole} onValueChange={(v) => setNewRole(v as 'admin' | 'staff')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="staff">Colaborador (Staff)</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Validade do Link</Label>
              <Select value={newExpiry} onValueChange={setNewExpiry}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Sem expiração</SelectItem>
                  <SelectItem value="1">1 dia</SelectItem>
                  <SelectItem value="7">7 dias</SelectItem>
                  <SelectItem value="30">30 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleCreate} disabled={createInvite.isPending} className="w-full gap-2">
              {createInvite.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}
              {createInvite.isPending ? 'Gerando...' : 'Gerar Link'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
