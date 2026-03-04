import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Upload, Trash2, Loader2, Building2 } from "lucide-react";
import { toast } from "sonner";

interface ClinicLogoUploadProps {
  currentLogoUrl: string;
  onLogoChange: (url: string) => void;
}

export function ClinicLogoUpload({ currentLogoUrl, onLogoChange }: ClinicLogoUploadProps) {
  const { profile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate
    if (!file.type.startsWith("image/")) {
      toast.error("Selecione um arquivo de imagem (PNG, JPG, WEBP)");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 2MB");
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    // Upload
    setUploading(true);
    try {
      const clinicId = profile?.clinic_id;
      if (!clinicId) throw new Error("Clínica não encontrada");

      const ext = file.name.split(".").pop()?.toLowerCase() || "png";
      const filePath = `clinic-logos/${clinicId}.${ext}`;

      // Remove old file if exists
      await supabase.storage.from("avatars").remove([filePath]);

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true, contentType: file.type });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;
      onLogoChange(publicUrl);
      toast.success("Logo atualizada com sucesso!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao fazer upload";
      toast.error(msg);
      setPreview(null);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onLogoChange("");
    toast.info("Logo removida. Clique em 'Salvar Alterações' para confirmar.");
  };

  const displayUrl = preview || currentLogoUrl;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-32 h-32 rounded-2xl overflow-hidden bg-muted border-2 border-dashed border-border flex items-center justify-center">
        {displayUrl ? (
          <img
            src={displayUrl}
            alt="Logo da clínica"
            className="w-full h-full object-contain"
          />
        ) : (
          <Building2 className="w-16 h-16 text-muted-foreground" />
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleFileSelect}
      />

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          {uploading ? "Enviando..." : "Alterar Logo"}
        </Button>

        {displayUrl && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-destructive hover:text-destructive"
            onClick={handleRemove}
            disabled={uploading}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        PNG, JPG ou WEBP. Máx 2MB.
      </p>
    </div>
  );
}
