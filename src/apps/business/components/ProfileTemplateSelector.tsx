import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  BookTemplate, 
  Save, 
  Star, 
  Trash2, 
  ChevronRight,
  Plus,
  Check
} from "lucide-react";
import { useProfileTemplates, ProfileTemplate } from "../hooks/useProfileTemplates";
import { IdealProfile, IDEAL_PROFILE_OPTIONS } from "../lib/salesMatchEngine";
import { cn } from "@/lib/utils";

interface ProfileTemplateSelectorProps {
  onSelect: (profile: IdealProfile) => void;
  currentProfile?: IdealProfile | null;
  onSaveAsTemplate?: (profile: IdealProfile) => void;
}

export function ProfileTemplateSelector({
  onSelect,
  currentProfile,
  onSaveAsTemplate,
}: ProfileTemplateSelectorProps) {
  const { templates, isLoading, createTemplate, updateTemplate, deleteTemplate } = useProfileTemplates();
  const [open, setOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateDescription, setNewTemplateDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const getProfileSummary = (profile: IdealProfile) => {
    const segments = profile.business_segment
      .map((s) => IDEAL_PROFILE_OPTIONS.business_segment.find((o) => o.value === s)?.label)
      .filter(Boolean)
      .slice(0, 2);
    
    return segments.join(", ") || "Perfil personalizado";
  };

  const handleSelectTemplate = (template: ProfileTemplate) => {
    onSelect(template.profile);
    setOpen(false);
  };

  const handleSaveCurrentAsTemplate = async () => {
    if (!currentProfile || !newTemplateName.trim()) return;

    setSaving(true);
    const result = await createTemplate(
      newTemplateName.trim(),
      currentProfile,
      newTemplateDescription.trim() || undefined
    );
    setSaving(false);

    if (result) {
      setSaveDialogOpen(false);
      setNewTemplateName("");
      setNewTemplateDescription("");
    }
  };

  const handleSetDefault = async (template: ProfileTemplate) => {
    await updateTemplate(template.id, { is_default: !template.is_default });
  };

  const handleDelete = async (template: ProfileTemplate) => {
    if (confirm(`Excluir template "${template.name}"?`)) {
      await deleteTemplate(template.id);
    }
  };

  return (
    <div className="flex gap-2">
      {/* Select from templates */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <BookTemplate className="h-4 w-4" />
            Usar Template
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookTemplate className="h-5 w-5 text-primary" />
              Templates de Perfil
            </DialogTitle>
            <DialogDescription>
              Selecione um template salvo para aplicar rapidamente
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Carregando templates...
              </div>
            ) : templates.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BookTemplate className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>Nenhum template salvo ainda.</p>
                <p className="text-sm mt-1">
                  Configure um perfil ideal e salve como template.
                </p>
              </div>
            ) : (
              templates.map((template) => (
                <div
                  key={template.id}
                  className={cn(
                    "p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group",
                    template.is_default && "border-primary/50 bg-primary/5"
                  )}
                  onClick={() => handleSelectTemplate(template)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{template.name}</span>
                        {template.is_default && (
                          <Badge variant="secondary" className="text-xs">
                            <Star className="h-3 w-3 mr-1 fill-current" />
                            Padrão
                          </Badge>
                        )}
                      </div>
                      {template.description && (
                        <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
                          {template.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {getProfileSummary(template.profile)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetDefault(template);
                        }}
                        title={template.is_default ? "Remover padrão" : "Definir como padrão"}
                      >
                        <Star className={cn("h-4 w-4", template.is_default && "fill-current text-amber-500")} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(template);
                        }}
                        title="Excluir template"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Save current as template */}
      {currentProfile && (
        <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Save className="h-4 w-4" />
              Salvar Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Salvar como Template
              </DialogTitle>
              <DialogDescription>
                Salve este perfil para reutilizar em outras vagas
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="template-name">Nome do Template *</Label>
                <Input
                  id="template-name"
                  placeholder="Ex: Vendedor B2B SaaS"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="template-description">Descrição (opcional)</Label>
                <Textarea
                  id="template-description"
                  placeholder="Ex: Perfil ideal para vendas consultivas de alto ticket"
                  value={newTemplateDescription}
                  onChange={(e) => setNewTemplateDescription(e.target.value)}
                  rows={2}
                />
              </div>

              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium mb-1">Perfil que será salvo:</p>
                <p className="text-sm text-muted-foreground">
                  {getProfileSummary(currentProfile)}
                </p>
              </div>

              <Button
                className="w-full gap-2"
                onClick={handleSaveCurrentAsTemplate}
                disabled={!newTemplateName.trim() || saving}
              >
                {saving ? (
                  "Salvando..."
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Salvar Template
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
