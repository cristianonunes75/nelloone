import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Paperclip, Upload, Loader2, X, Trash2, Image, ZoomIn } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Attachment {
  id: string;
  url: string;
  name: string;
  description?: string;
  uploaded_at: string;
  uploaded_by: string;
}

interface CandidateAttachmentsProps {
  candidateId: string;
  attachments: Attachment[];
  onUpdate: () => void;
}

export function CandidateAttachments({ candidateId, attachments, onUpdate }: CandidateAttachmentsProps) {
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const newAttachments: Attachment[] = [...attachments];

      for (const file of Array.from(files)) {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} não é uma imagem válida`);
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} excede o limite de 5MB`);
          continue;
        }

        // Generate unique filename
        const fileExt = file.name.split(".").pop();
        const fileName = `${candidateId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        // Upload to storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("candidate-attachments")
          .upload(fileName, file);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          toast.error(`Erro ao enviar ${file.name}`);
          continue;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from("candidate-attachments")
          .getPublicUrl(fileName);

        // Add to attachments array
        newAttachments.push({
          id: crypto.randomUUID(),
          url: publicUrl,
          name: file.name,
          uploaded_at: new Date().toISOString(),
          uploaded_by: user.id,
        });
      }

      // Update candidate with new attachments
      const { error: updateError } = await supabase
        .from("hiring_candidates")
        .update({ attachments: JSON.parse(JSON.stringify(newAttachments)) as Json })
        .eq("id", candidateId);

      if (updateError) throw updateError;

      toast.success("Anexos salvos com sucesso!");
      onUpdate();
    } catch (error) {
      console.error("Error uploading:", error);
      toast.error("Erro ao fazer upload dos anexos");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async (attachmentId: string) => {
    setDeleting(true);
    try {
      const attachment = attachments.find(a => a.id === attachmentId);
      if (!attachment) return;

      // Extract file path from URL
      const urlParts = attachment.url.split("/candidate-attachments/");
      if (urlParts.length > 1) {
        const filePath = decodeURIComponent(urlParts[1]);
        await supabase.storage
          .from("candidate-attachments")
          .remove([filePath]);
      }

      // Update attachments array
      const newAttachments = attachments.filter(a => a.id !== attachmentId);
      const { error } = await supabase
        .from("hiring_candidates")
        .update({ attachments: JSON.parse(JSON.stringify(newAttachments)) as Json })
        .eq("id", candidateId);

      if (error) throw error;

      toast.success("Anexo removido");
      setDeleteConfirm(null);
      onUpdate();
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("Erro ao remover anexo");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Paperclip className="h-5 w-5" />
          Anexos e Documentos
          {attachments.length > 0 && (
            <span className="text-sm font-normal text-muted-foreground">
              ({attachments.length})
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Button */}
        <div className="flex items-center gap-3">
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="attachment-upload"
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="gap-2"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Adicionar Anexo
              </>
            )}
          </Button>
          <span className="text-xs text-muted-foreground">
            PNG, JPG até 5MB
          </span>
        </div>

        {/* Attachments Grid */}
        {attachments.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="group relative aspect-square rounded-lg overflow-hidden border bg-muted/50 hover:border-primary/50 transition-colors"
              >
                <img
                  src={attachment.url}
                  alt={attachment.name}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setSelectedImage(attachment.url)}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8"
                    onClick={() => setSelectedImage(attachment.url)}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-8 w-8"
                    onClick={() => setDeleteConfirm(attachment.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                  <p className="text-xs text-white truncate">{attachment.name}</p>
                  <p className="text-[10px] text-white/70">
                    {format(new Date(attachment.uploaded_at), "dd/MM/yy HH:mm", { locale: ptBR })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            <Image className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">
              Nenhum anexo adicionado
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Adicione prints ou documentos do candidato
            </p>
          </div>
        )}

        {/* Image Viewer Dialog */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl p-0">
            <div className="relative">
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-2 top-2 z-10 bg-black/50 hover:bg-black/70 text-white"
                onClick={() => setSelectedImage(null)}
              >
                <X className="h-4 w-4" />
              </Button>
              {selectedImage && (
                <img
                  src={selectedImage}
                  alt="Anexo"
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Remover anexo?</DialogTitle>
              <DialogDescription>
                Esta ação não pode ser desfeita. O arquivo será removido permanentemente.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                disabled={deleting}
              >
                {deleting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Remover
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
