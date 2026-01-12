import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Paperclip, Upload, Loader2, X, Trash2, Image, ZoomIn, Sparkles, ScanSearch, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Attachment {
  id: string;
  url: string;
  name: string;
  description?: string;
  uploaded_at: string;
  uploaded_by: string;
  scanned?: boolean;
}

interface CandidateAttachmentsProps {
  candidateId: string;
  attachments: Attachment[];
  onUpdate: () => void;
}

export function CandidateAttachments({ candidateId, attachments, onUpdate }: CandidateAttachmentsProps) {
  const [uploading, setUploading] = useState(false);
  const [scanning, setScanning] = useState<string | null>(null);
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
      const uploadedUrls: { id: string; url: string }[] = [];

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
        const { error: uploadError } = await supabase.storage
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

        const attachmentId = crypto.randomUUID();
        
        // Add to attachments array
        newAttachments.push({
          id: attachmentId,
          url: publicUrl,
          name: file.name,
          uploaded_at: new Date().toISOString(),
          uploaded_by: user.id,
          scanned: false,
        });

        uploadedUrls.push({ id: attachmentId, url: publicUrl });
      }

      // Update candidate with new attachments
      const { error: updateError } = await supabase
        .from("hiring_candidates")
        .update({ attachments: JSON.parse(JSON.stringify(newAttachments)) as Json })
        .eq("id", candidateId);

      if (updateError) throw updateError;

      toast.success("Anexos salvos! Escaneando para extrair dados...");
      onUpdate();

      // Auto-scan uploaded images
      for (const { id, url } of uploadedUrls) {
        await handleScanAttachment(id, url, newAttachments);
      }

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

  const handleScanAttachment = async (attachmentId: string, imageUrl: string, currentAttachments?: Attachment[]) => {
    setScanning(attachmentId);
    try {
      const response = await supabase.functions.invoke("business-scan-attachment", {
        body: {
          image_url: imageUrl,
          candidate_id: candidateId,
        },
      });

      if (response.error) {
        throw new Error(response.error.message || "Erro ao escanear");
      }

      const result = response.data;
      
      if (result.updates?.disc || result.updates?.temperament) {
        toast.success(result.message || "Dados extraídos com sucesso!");
        
        // Mark attachment as scanned
        const attachmentsToUpdate = currentAttachments || attachments;
        const updatedAttachments = attachmentsToUpdate.map(a => 
          a.id === attachmentId ? { ...a, scanned: true } : a
        );
        
        await supabase
          .from("hiring_candidates")
          .update({ attachments: JSON.parse(JSON.stringify(updatedAttachments)) as Json })
          .eq("id", candidateId);
        
        onUpdate();
      } else {
        toast.info("Nenhum dado de DISC ou Temperamentos encontrado na imagem.");
      }

    } catch (error: unknown) {
      console.error("Error scanning:", error);
      const errorMessage = error instanceof Error ? error.message : "Erro ao escanear imagem";
      toast.error(errorMessage);
    } finally {
      setScanning(null);
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
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Paperclip className="h-5 w-5" />
            Anexos e Documentos
            {attachments.length > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ({attachments.length})
              </span>
            )}
          </CardTitle>
          <Badge variant="secondary" className="gap-1">
            <Sparkles className="h-3 w-3" />
            IA extrai dados automaticamente
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Button */}
        <div className="flex items-center gap-3 flex-wrap">
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
            PNG, JPG até 5MB • Prints de resultados serão escaneados automaticamente
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
                
                {/* Scanning indicator */}
                {scanning === attachment.id && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center flex-col gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                    <span className="text-white text-xs">Escaneando...</span>
                  </div>
                )}
                
                {/* Scanned badge */}
                {attachment.scanned && (
                  <div className="absolute top-2 left-2">
                    <Badge className="gap-1 bg-green-500/90 hover:bg-green-500/90">
                      <CheckCircle2 className="h-3 w-3" />
                      Escaneado
                    </Badge>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8"
                    onClick={() => setSelectedImage(attachment.url)}
                    title="Ver imagem"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8"
                    onClick={() => handleScanAttachment(attachment.id, attachment.url)}
                    disabled={scanning === attachment.id}
                    title="Escanear novamente"
                  >
                    <ScanSearch className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-8 w-8"
                    onClick={() => setDeleteConfirm(attachment.id)}
                    title="Remover"
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
              Adicione prints de resultados para extrair dados automaticamente com IA
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
