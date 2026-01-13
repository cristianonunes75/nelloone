import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Upload, FileText, X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BulkResumeUploadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: string;
  companyId: string;
  onComplete: () => void;
}

interface FileUploadStatus {
  file: File;
  status: "pending" | "uploading" | "scanning" | "completed" | "error";
  error?: string;
  applicationId?: string;
}

export function BulkResumeUpload({ open, onOpenChange, jobId, companyId, onComplete }: BulkResumeUploadProps) {
  const [files, setFiles] = useState<FileUploadStatus[]>([]);
  const [source, setSource] = useState("internal_upload");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type === "application/pdf" || 
              file.name.endsWith(".doc") || 
              file.name.endsWith(".docx") ||
              file.type.startsWith("image/")
    );
    
    if (droppedFiles.length === 0) {
      toast.error("Por favor, selecione arquivos PDF, DOC/DOCX ou imagens (JPG, PNG)");
      return;
    }

    addFiles(droppedFiles);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    addFiles(selectedFiles);
    e.target.value = ""; // Reset input
  }, []);

  const addFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(
      file => file.type === "application/pdf" || 
              file.name.endsWith(".doc") || 
              file.name.endsWith(".docx") ||
              file.type.startsWith("image/")
    );

    // Avoid duplicates
    const existingNames = new Set(files.map(f => f.file.name));
    const uniqueFiles = validFiles.filter(f => !existingNames.has(f.name));

    if (uniqueFiles.length < newFiles.length) {
      toast.warning("Alguns arquivos foram ignorados (duplicados ou formato inválido)");
    }

    setFiles(prev => [
      ...prev,
      ...uniqueFiles.map(file => ({ file, status: "pending" as const }))
    ]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadAll = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < files.length; i++) {
      const fileStatus = files[i];
      
      try {
        // Update status to uploading
        setFiles(prev => prev.map((f, idx) => 
          idx === i ? { ...f, status: "uploading" } : f
        ));

        // Upload file to storage
        const fileExt = fileStatus.file.name.split('.').pop();
        const storageName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `${companyId}/${jobId}/${storageName}`;

        const { error: uploadError } = await supabase.storage
          .from("resumes")
          .upload(filePath, fileStatus.file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("resumes")
          .getPublicUrl(filePath);

        const resumeUrl = urlData.publicUrl;

        // Create job application record
        const { data: appData, error: appError } = await supabase
          .from("job_applications")
          .insert({
            job_id: jobId,
            company_id: companyId,
            status: "pre_candidate",
            source: source,
            resume_url: resumeUrl,
            resume_filename: fileStatus.file.name,
            extraction_status: "pending",
          })
          .select()
          .single();

        if (appError) throw appError;

        // Update status to scanning
        setFiles(prev => prev.map((f, idx) => 
          idx === i ? { ...f, status: "scanning", applicationId: appData.id } : f
        ));

        // Trigger resume scanning for PDFs and images
        const fileName = fileStatus.file.name.toLowerCase();
        const isScannableFile = fileName.endsWith('.pdf') || 
                                fileName.endsWith('.jpg') || 
                                fileName.endsWith('.jpeg') || 
                                fileName.endsWith('.png') || 
                                fileName.endsWith('.gif') || 
                                fileName.endsWith('.webp');
        if (isScannableFile) {
          supabase.functions.invoke("scan-resume", {
            body: {
              application_id: appData.id,
              file_path: filePath,
              resume_url: resumeUrl,
            },
          }).catch(err => {
            console.error("Resume scan failed:", err);
          });
        }

        // Update status to completed
        setFiles(prev => prev.map((f, idx) => 
          idx === i ? { ...f, status: "completed" } : f
        ));
        successCount++;

      } catch (error: any) {
        console.error(`Error uploading ${fileStatus.file.name}:`, error);
        setFiles(prev => prev.map((f, idx) => 
          idx === i ? { ...f, status: "error", error: error.message } : f
        ));
        errorCount++;
      }
    }

    setIsProcessing(false);

    if (successCount > 0) {
      toast.success(`${successCount} currículo(s) enviado(s) com sucesso!`);
      onComplete();
    }
    if (errorCount > 0) {
      toast.error(`${errorCount} arquivo(s) falharam no upload`);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      setFiles([]);
      setSource("internal_upload");
      onOpenChange(false);
    }
  };

  const completedCount = files.filter(f => f.status === "completed").length;
  const progress = files.length > 0 ? (completedCount / files.length) * 100 : 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload de Múltiplos Currículos</DialogTitle>
          <DialogDescription>
            Arraste e solte ou selecione vários arquivos PDF/DOC. Todos serão escaneados automaticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Source selection */}
          <div className="space-y-2">
            <Label>Origem dos currículos</Label>
            <Select value={source} onValueChange={setSource} disabled={isProcessing}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="internal_upload">Upload interno</SelectItem>
                <SelectItem value="email">Recebido por email</SelectItem>
                <SelectItem value="referral">Indicação</SelectItem>
                <SelectItem value="job_fair">Feira de emprego</SelectItem>
                <SelectItem value="other">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Drop zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "relative border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25",
              isProcessing && "pointer-events-none opacity-50"
            )}
          >
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp,image/*"
              onChange={handleFileSelect}
              disabled={isProcessing}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">
              Arraste arquivos aqui ou clique para selecionar
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PDF, DOC, DOCX, JPG, PNG • Múltiplos arquivos
            </p>
          </div>

          {/* File list */}
          {files.length > 0 && (
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {files.map((fileStatus, index) => (
                <div
                  key={`${fileStatus.file.name}-${index}`}
                  className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
                >
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-sm truncate flex-1">{fileStatus.file.name}</span>
                  
                  {fileStatus.status === "pending" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0"
                      onClick={() => removeFile(index)}
                      disabled={isProcessing}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {fileStatus.status === "uploading" && (
                    <Loader2 className="h-4 w-4 animate-spin text-blue-500 shrink-0" />
                  )}
                  
                  {fileStatus.status === "scanning" && (
                    <span className="text-xs text-blue-500 shrink-0">Escaneando...</span>
                  )}
                  
                  {fileStatus.status === "completed" && (
                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                  )}
                  
                  {fileStatus.status === "error" && (
                    <span title={fileStatus.error}>
                      <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Progress */}
          {isProcessing && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground text-center">
                {completedCount} de {files.length} concluído(s)
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isProcessing}>
            {isProcessing ? "Aguarde..." : "Cancelar"}
          </Button>
          <Button 
            onClick={handleUploadAll} 
            disabled={files.length === 0 || isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Enviando...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Enviar {files.length > 0 ? `(${files.length})` : ""}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
