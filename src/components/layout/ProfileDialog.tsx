import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProfileDialog = ({ open, onOpenChange }: ProfileDialogProps) => {
  const { user, profile } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials = profile?.full_name?.substring(0, 2).toUpperCase() || "US";

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Selecione um arquivo de imagem");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5MB");
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(path);

      const url = `${publicUrl}?t=${Date.now()}`;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: url })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setAvatarUrl(url);
      toast.success("Foto atualizada com sucesso!");
    } catch (err: any) {
      toast.error("Erro ao enviar foto: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Meu Perfil</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <Avatar className="w-24 h-24">
              <AvatarImage src={avatarUrl || undefined} alt={profile?.full_name} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-teal-400 text-white text-2xl font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              {uploading ? (
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              ) : (
                <Camera className="w-6 h-6 text-white" />
              )}
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />

          <div className="text-center">
            <p className="font-semibold text-foreground">{profile?.full_name || "Usuário"}</p>
            <p className="text-sm text-muted-foreground capitalize">{profile?.role || "staff"}</p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Camera className="w-4 h-4 mr-2" />}
            Alterar foto
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
