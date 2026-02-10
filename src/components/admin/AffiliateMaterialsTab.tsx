import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  Plus, Trash2, Edit, Loader2, Upload, ArrowUp, ArrowDown,
  MessageCircle, Instagram, Linkedin, Image, FileText, Megaphone,
  Eye, EyeOff,
} from "lucide-react";

interface Material {
  id: string;
  title: string;
  description: string | null;
  type: string;
  category: string;
  content: string;
  file_name: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

const categoryOptions = [
  { value: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { value: "instagram", label: "Instagram", icon: Instagram },
  { value: "linkedin", label: "LinkedIn", icon: Linkedin },
  { value: "banner", label: "Banner", icon: Image },
  { value: "general", label: "Geral", icon: Megaphone },
];

const typeOptions = [
  { value: "copy", label: "Texto (Copy)" },
  { value: "image", label: "Imagem" },
  { value: "file", label: "Arquivo" },
];

export const AffiliateMaterialsTab = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [deletingMaterial, setDeletingMaterial] = useState<Material | null>(null);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formType, setFormType] = useState("copy");
  const [formCategory, setFormCategory] = useState("whatsapp");
  const [formContent, setFormContent] = useState("");
  const [formFileName, setFormFileName] = useState("");

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from("affiliate_marketing_materials")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMaterials(data || []);
    } catch (error) {
      console.error("Error fetching materials:", error);
      toast.error("Erro ao carregar materiais");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormTitle("");
    setFormDescription("");
    setFormType("copy");
    setFormCategory("whatsapp");
    setFormContent("");
    setFormFileName("");
    setEditingMaterial(null);
  };

  const openAddDialog = () => {
    resetForm();
    setShowDialog(true);
  };

  const openEditDialog = (material: Material) => {
    setEditingMaterial(material);
    setFormTitle(material.title);
    setFormDescription(material.description || "");
    setFormType(material.type);
    setFormCategory(material.category);
    setFormContent(material.content);
    setFormFileName(material.file_name || "");
    setShowDialog(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("affiliate-assets")
        .upload(path, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("affiliate-assets")
        .getPublicUrl(path);

      setFormContent(urlData.publicUrl);
      setFormFileName(file.name);
      toast.success("Arquivo enviado com sucesso!");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error("Erro ao enviar arquivo");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formTitle.trim() || !formContent.trim()) {
      toast.error("Preencha o título e o conteúdo");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: formTitle.trim(),
        description: formDescription.trim() || null,
        type: formType,
        category: formCategory,
        content: formContent,
        file_name: formType !== "copy" ? formFileName || null : null,
      };

      if (editingMaterial) {
        const { error } = await supabase
          .from("affiliate_marketing_materials")
          .update(payload)
          .eq("id", editingMaterial.id);
        if (error) throw error;
        toast.success("Material atualizado!");
      } else {
        const maxOrder = materials.length > 0 ? Math.max(...materials.map(m => m.sort_order)) + 1 : 0;
        const { error } = await supabase
          .from("affiliate_marketing_materials")
          .insert({ ...payload, sort_order: maxOrder });
        if (error) throw error;
        toast.success("Material criado!");
      }

      setShowDialog(false);
      resetForm();
      fetchMaterials();
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error("Erro ao salvar material");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingMaterial) return;

    try {
      // If it's a file/image, try to delete from storage
      if (deletingMaterial.type !== "copy" && deletingMaterial.content.includes("affiliate-assets")) {
        const path = deletingMaterial.content.split("affiliate-assets/").pop();
        if (path) {
          await supabase.storage.from("affiliate-assets").remove([path]);
        }
      }

      const { error } = await supabase
        .from("affiliate_marketing_materials")
        .delete()
        .eq("id", deletingMaterial.id);

      if (error) throw error;
      toast.success("Material removido!");
      setShowDeleteDialog(false);
      setDeletingMaterial(null);
      fetchMaterials();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Erro ao remover material");
    }
  };

  const toggleActive = async (material: Material) => {
    try {
      const { error } = await supabase
        .from("affiliate_marketing_materials")
        .update({ is_active: !material.is_active })
        .eq("id", material.id);

      if (error) throw error;
      toast.success(material.is_active ? "Material desativado" : "Material ativado");
      fetchMaterials();
    } catch (error) {
      toast.error("Erro ao alterar status");
    }
  };

  const moveOrder = async (material: Material, direction: "up" | "down") => {
    const idx = materials.findIndex(m => m.id === material.id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= materials.length) return;

    const other = materials[swapIdx];
    try {
      await Promise.all([
        supabase.from("affiliate_marketing_materials").update({ sort_order: other.sort_order }).eq("id", material.id),
        supabase.from("affiliate_marketing_materials").update({ sort_order: material.sort_order }).eq("id", other.id),
      ]);
      fetchMaterials();
    } catch {
      toast.error("Erro ao reordenar");
    }
  };

  const getCategoryIcon = (category: string) => {
    const opt = categoryOptions.find(c => c.value === category);
    return opt ? opt.icon : Megaphone;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Cadastre textos prontos e imagens para os afiliados divulgarem. Use <code className="bg-muted px-1 rounded text-xs">{"{LINK}"}</code> nos textos para inserir o link personalizado do afiliado.
          </p>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Material
        </Button>
      </div>

      {materials.length === 0 ? (
        <Card className="p-8 text-center">
          <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Nenhum material cadastrado ainda.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Adicione textos e imagens para seus afiliados usarem na divulgação.
          </p>
        </Card>
      ) : (
        <div className="space-y-2">
          {materials.map((material, idx) => {
            const Icon = getCategoryIcon(material.category);
            return (
              <Card key={material.id} className={`p-4 border-border/50 ${!material.is_active ? 'opacity-50' : ''}`}>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-muted shrink-0">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-sm">{material.title}</p>
                      <Badge variant="outline" className="text-xs">
                        {typeOptions.find(t => t.value === material.type)?.label}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {categoryOptions.find(c => c.value === material.category)?.label}
                      </Badge>
                      {!material.is_active && (
                        <Badge variant="destructive" className="text-xs">Inativo</Badge>
                      )}
                    </div>
                    {material.description && (
                      <p className="text-xs text-muted-foreground mt-1">{material.description}</p>
                    )}
                    {material.type === "copy" && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{material.content}</p>
                    )}
                    {material.type === "image" && (
                      <img src={material.content} alt={material.title} className="mt-2 max-h-20 rounded object-contain" />
                    )}
                    {material.type === "file" && material.file_name && (
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <FileText className="h-3 w-3" /> {material.file_name}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveOrder(material, "up")} disabled={idx === 0}>
                      <ArrowUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveOrder(material, "down")} disabled={idx === materials.length - 1}>
                      <ArrowDown className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleActive(material)}>
                      {material.is_active ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(material)}>
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { setDeletingMaterial(material); setShowDeleteDialog(true); }}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingMaterial ? "Editar Material" : "Novo Material"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Título</Label>
              <Input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="Ex: Copy para WhatsApp - Promoção" />
            </div>

            <div>
              <Label>Descrição (opcional)</Label>
              <Input value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="Breve descrição do material" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Tipo</Label>
                <Select value={formType} onValueChange={setFormType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {typeOptions.map(t => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Categoria</Label>
                <Select value={formCategory} onValueChange={setFormCategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map(c => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formType === "copy" ? (
              <div>
                <Label>Texto da copy</Label>
                <Textarea
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder={`Use {LINK} onde o link do afiliado deve aparecer.\n\nExemplo:\n🔥 Descubra seu perfil comportamental com o NELLO ONE!\n\nAcesse: {LINK}`}
                  className="min-h-[150px]"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use <code className="bg-muted px-1 rounded">{"{LINK}"}</code> para inserir automaticamente o link do afiliado.
                </p>
              </div>
            ) : (
              <div>
                <Label>Arquivo</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      type="file"
                      accept={formType === "image" ? "image/*" : "*"}
                      onChange={handleFileUpload}
                      disabled={uploading}
                    />
                  </div>
                  {uploading && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" /> Enviando...
                    </div>
                  )}
                  {formContent && formType === "image" && (
                    <img src={formContent} alt="Preview" className="max-h-32 rounded object-contain" />
                  )}
                  {formContent && formType === "file" && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <FileText className="h-3 w-3" /> {formFileName || "Arquivo enviado"}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowDialog(false)}>Cancelar</Button>
              <Button onClick={handleSave} disabled={saving || uploading}>
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                {editingMaterial ? "Salvar" : "Criar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover material?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover "{deletingMaterial?.title}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
