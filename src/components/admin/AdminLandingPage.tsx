import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { bundlePrices } from "@/lib/priceConfig";
import { 
  FileEdit, 
  Save, 
  Loader2,
  Info,
  Plus,
  Trash2,
  Eye,
  Image as ImageIcon,
  Home,
  Users,
  MessageSquare,
  HelpCircle,
  Sparkles,
  RefreshCw,
  ExternalLink,
  GripVertical,
  Instagram,
  Share2,
  CreditCard,
  DollarSign,
  Globe,
  Shield,
  Target,
  Map,
  BookOpen,
  Gem
} from "lucide-react";
import { useAdminPermissions } from "@/hooks/useAdminPermissions";
import { AdminLanguageSelector, type AdminLanguage } from "./AdminLanguageSelector";

interface ContentSection {
  id: string;
  section: string;
  title: string | null;
  content: any;
  language: string;
}

const SECTION_CONFIG: Record<string, { 
  label: string; 
  icon: any; 
  description: string;
  color: string;
}> = {
  hero: { 
    label: "Hero", 
    icon: Home, 
    description: "Título principal, subtítulos, CTAs e badges do topo",
    color: "bg-amber-500/10 text-amber-600"
  },
  identification: { 
    label: "Dores + Qualificação", 
    icon: Target, 
    description: "Dores do público, 'É para você se...' e 'Não é para você se...'",
    color: "bg-green-500/10 text-green-600"
  },
  journey: { 
    label: "Jornada + Dimensões", 
    icon: Map, 
    description: "7 etapas da jornada e as 7 dimensões humanas",
    color: "bg-blue-500/10 text-blue-600"
  },
  essence_code: { 
    label: "Código da Essência", 
    icon: Gem, 
    description: "Seção do Nello, PDF mockup e bullets do Código",
    color: "bg-purple-500/10 text-purple-600"
  },
  testimonials: { 
    label: "Depoimentos", 
    icon: MessageSquare, 
    description: "Depoimentos aprovados de clientes",
    color: "bg-rose-500/10 text-rose-600"
  },
  pricing: { 
    label: "Preços", 
    icon: CreditCard, 
    description: "Preços, benefícios, Flash Sale e disclaimers",
    color: "bg-emerald-500/10 text-emerald-600"
  },
  professionals: { 
    label: "Profissionais", 
    icon: BookOpen, 
    description: "Seção para psicólogos, terapeutas e profissionais parceiros",
    color: "bg-indigo-500/10 text-indigo-600"
  },
  final_cta: { 
    label: "CTA Final", 
    icon: Sparkles, 
    description: "Chamada final para ação",
    color: "bg-pink-500/10 text-pink-600"
  },
  faq: { 
    label: "FAQ", 
    icon: HelpCircle, 
    description: "Perguntas frequentes estratégicas",
    color: "bg-orange-500/10 text-orange-600"
  },
  social_media: { 
    label: "Redes Sociais", 
    icon: Share2, 
    description: "Links de redes sociais e contato",
    color: "bg-cyan-500/10 text-cyan-600"
  },
};

const ICON_OPTIONS = [
  "Heart", "Target", "Lightbulb", "Sparkles", "Award", "Users", "Zap", "Star",
  "Crown", "Shield", "Globe", "BookOpen", "Compass", "Flame", "Gem", "Sun"
];

// Component protected by AdminGuard at route level - can_manage_settings
export const AdminLandingPage = () => {
  const { hasPermission, isSuperAdmin, isLoading: permLoading } = useAdminPermissions();
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("hero");
  const [updatingStripe, setUpdatingStripe] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<AdminLanguage>("pt");

  useEffect(() => {
    if (!permLoading && (hasPermission('can_manage_settings') || isSuperAdmin)) {
      fetchContent();
    }
  }, [permLoading, isSuperAdmin, selectedLanguage]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("home_content")
        .select("*")
        .eq("language", selectedLanguage)
        .order("section");

      if (error) throw error;
      setSections(data || []);
    } catch (error) {
      console.error("Error fetching content:", error);
      toast.error("Erro ao carregar conteúdo");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (section: ContentSection) => {
    setSaving(section.id);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from("home_content")
        .update({
          title: section.title,
          content: section.content,
          updated_by: user?.id,
        })
        .eq("id", section.id);

      if (error) throw error;
      toast.success("Conteúdo salvo com sucesso!");
    } catch (error) {
      console.error("Error saving content:", error);
      toast.error("Erro ao salvar conteúdo");
    } finally {
      setSaving(null);
    }
  };

  const updateSection = (id: string, field: string, value: any) => {
    setSections(prev => prev.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  const updateContentField = (id: string, field: string, value: any) => {
    setSections(prev => prev.map(s => 
      s.id === id ? { ...s, content: { ...s.content, [field]: value } } : s
    ));
  };

  const updateArrayItem = (sectionId: string, arrayField: string, index: number, itemField: string, value: any) => {
    setSections(prev => prev.map(s => {
      if (s.id !== sectionId) return s;
      const newArray = [...(s.content[arrayField] || [])];
      newArray[index] = { ...newArray[index], [itemField]: value };
      return { ...s, content: { ...s.content, [arrayField]: newArray } };
    }));
  };

  const addArrayItem = (sectionId: string, arrayField: string, template: any) => {
    setSections(prev => prev.map(s => {
      if (s.id !== sectionId) return s;
      const newArray = [...(s.content[arrayField] || []), template];
      return { ...s, content: { ...s.content, [arrayField]: newArray } };
    }));
  };

  const removeArrayItem = (sectionId: string, arrayField: string, index: number) => {
    setSections(prev => prev.map(s => {
      if (s.id !== sectionId) return s;
      const newArray = (s.content[arrayField] || []).filter((_: any, i: number) => i !== index);
      return { ...s, content: { ...s.content, [arrayField]: newArray } };
    }));
  };

  const updateStringArrayItem = (sectionId: string, arrayField: string, index: number, value: string) => {
    setSections(prev => prev.map(s => {
      if (s.id !== sectionId) return s;
      const newArray = [...(s.content[arrayField] || [])];
      newArray[index] = value;
      return { ...s, content: { ...s.content, [arrayField]: newArray } };
    }));
  };

  const renderSaveButton = (section: ContentSection) => (
    <div className="flex items-center gap-3 pt-6 border-t">
      <Button variant="outline" size="sm" asChild>
        <a href="/" target="_blank" rel="noopener noreferrer">
          <ExternalLink className="w-4 h-4 mr-2" />
          Ver Landing Page
        </a>
      </Button>
      <div className="flex-1" />
      <Button 
        onClick={() => handleSave(section)} 
        disabled={saving === section.id}
        className="bg-nello-gold hover:bg-nello-gold/90 text-nello-graphite"
      >
        {saving === section.id ? (
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
        ) : (
          <Save className="w-4 h-4 mr-2" />
        )}
        Salvar Alterações
      </Button>
    </div>
  );

  // ========== HERO SECTION ==========
  const renderHeroFields = (section: ContentSection) => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Tagline (acima do título)</Label>
        <Input
          value={section.content?.tagline || ""}
          onChange={(e) => updateContentField(section.id, "tagline", e.target.value)}
          placeholder="Arquitetura de Autoconhecimento Integrado"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Título Linha 1</Label>
          <Input
            value={section.content?.hero_title_1 || ""}
            onChange={(e) => updateContentField(section.id, "hero_title_1", e.target.value)}
            placeholder="O Identity não te define."
          />
        </div>
        <div className="space-y-2">
          <Label>Título Linha 2 (dourado)</Label>
          <Input
            value={section.content?.hero_title_2 || ""}
            onChange={(e) => updateContentField(section.id, "hero_title_2", e.target.value)}
            placeholder="Ele te liberta."
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Subtítulo</Label>
        <Textarea
          value={section.content?.hero_subtitle || ""}
          onChange={(e) => updateContentField(section.id, "hero_subtitle", e.target.value)}
          rows={2}
          placeholder="Uma Arquitetura de Autoconhecimento Integrado que revela como você pensa, decide, sente e age."
        />
      </div>

      <div className="space-y-2">
        <Label>Descrição 1</Label>
        <Textarea
          value={section.content?.hero_description_1 || ""}
          onChange={(e) => updateContentField(section.id, "hero_description_1", e.target.value)}
          rows={2}
          placeholder="Para quem vive desafios no trabalho, nas relações..."
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Descrição 2 (antes do destaque)</Label>
          <Input
            value={section.content?.hero_description_2 || ""}
            onChange={(e) => updateContentField(section.id, "hero_description_2", e.target.value)}
            placeholder="Ao final, você recebe o seu"
          />
        </div>
        <div className="space-y-2">
          <Label>Destaque dourado</Label>
          <Input
            value={section.content?.hero_subtitle_highlight || ""}
            onChange={(e) => updateContentField(section.id, "hero_subtitle_highlight", e.target.value)}
            placeholder="Código da Essência"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Descrição 3 (após destaque)</Label>
        <Input
          value={section.content?.hero_description_3 || ""}
          onChange={(e) => updateContentField(section.id, "hero_description_3", e.target.value)}
          placeholder=", uma síntese prática dos 7 mapas da jornada..."
        />
      </div>

      <Separator />

      <div className="space-y-2">
        <Label>Texto do Botão CTA</Label>
        <Input
          value={section.content?.ctaText || ""}
          onChange={(e) => updateContentField(section.id, "ctaText", e.target.value)}
          placeholder="Garantir meu Código com 50% OFF"
        />
      </div>

      <Separator />

      <div className="space-y-4">
        <Label className="text-base font-semibold">Badges de Valor</Label>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-xs">Badge 1</Label>
            <Input
              value={section.content?.value_badge_1 || ""}
              onChange={(e) => updateContentField(section.id, "value_badge_1", e.target.value)}
              placeholder="7 pilares integrados"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Badge 2</Label>
            <Input
              value={section.content?.value_badge_2 || ""}
              onChange={(e) => updateContentField(section.id, "value_badge_2", e.target.value)}
              placeholder="Relatório completo"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Badge 3</Label>
            <Input
              value={section.content?.value_badge_3 || ""}
              onChange={(e) => updateContentField(section.id, "value_badge_3", e.target.value)}
              placeholder="Código da Essência"
            />
          </div>
        </div>
      </div>

      {renderSaveButton(section)}
    </div>
  );

  // ========== IDENTIFICATION (DORES + QUALIFICAÇÃO) ==========
  const renderIdentificationFields = (section: ContentSection) => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Título da Seção</Label>
        <Input
          value={section.title || ""}
          onChange={(e) => updateSection(section.id, "title", e.target.value)}
          placeholder="Se você se reconhece aqui..."
        />
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Dores ({(section.content?.pains || []).length})</Label>
          <Button variant="outline" size="sm" onClick={() => {
            const newPains = [...(section.content?.pains || []), ""];
            updateContentField(section.id, "pains", newPains);
          }}>
            <Plus className="w-4 h-4 mr-2" /> Adicionar
          </Button>
        </div>
        {(section.content?.pains || []).map((pain: string, i: number) => (
          <div key={i} className="flex gap-2">
            <Textarea
              value={pain}
              onChange={(e) => updateStringArrayItem(section.id, "pains", i, e.target.value)}
              rows={2}
              className="flex-1"
              placeholder={`Dor ${i + 1}`}
            />
            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => {
              const newPains = (section.content?.pains || []).filter((_: any, idx: number) => idx !== i);
              updateContentField(section.id, "pains", newPains);
            }}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label>Disclaimer das Dores</Label>
        <Textarea
          value={section.content?.pains_disclaimer || ""}
          onChange={(e) => updateContentField(section.id, "pains_disclaimer", e.target.value)}
          rows={2}
          placeholder="Essa jornada não entrega respostas prontas..."
        />
      </div>

      <Separator />

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold text-green-600">✓ É para você se...</Label>
            <Button variant="outline" size="sm" onClick={() => {
              const arr = [...(section.content?.for_you || []), ""];
              updateContentField(section.id, "for_you", arr);
            }}>
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>
          <Input
            value={section.content?.for_you_title || ""}
            onChange={(e) => updateContentField(section.id, "for_you_title", e.target.value)}
            placeholder="É para você se..."
          />
          {(section.content?.for_you || []).map((item: string, i: number) => (
            <div key={i} className="flex gap-2">
              <Input value={item} onChange={(e) => updateStringArrayItem(section.id, "for_you", i, e.target.value)} className="flex-1" />
              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => {
                const arr = (section.content?.for_you || []).filter((_: any, idx: number) => idx !== i);
                updateContentField(section.id, "for_you", arr);
              }}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold text-red-500">✗ Não é para você se...</Label>
            <Button variant="outline" size="sm" onClick={() => {
              const arr = [...(section.content?.not_for_you || []), ""];
              updateContentField(section.id, "not_for_you", arr);
            }}>
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>
          <Input
            value={section.content?.not_for_you_title || ""}
            onChange={(e) => updateContentField(section.id, "not_for_you_title", e.target.value)}
            placeholder="Pode não ser para você se..."
          />
          {(section.content?.not_for_you || []).map((item: string, i: number) => (
            <div key={i} className="flex gap-2">
              <Input value={item} onChange={(e) => updateStringArrayItem(section.id, "not_for_you", i, e.target.value)} className="flex-1" />
              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => {
                const arr = (section.content?.not_for_you || []).filter((_: any, idx: number) => idx !== i);
                updateContentField(section.id, "not_for_you", arr);
              }}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {renderSaveButton(section)}
    </div>
  );

  // ========== JOURNEY (JORNADA + DIMENSÕES) ==========
  const renderJourneyFields = (section: ContentSection) => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Título da Jornada</Label>
          <Input
            value={section.title || ""}
            onChange={(e) => updateSection(section.id, "title", e.target.value)}
            placeholder="A Jornada Identity em 7 camadas"
          />
        </div>
        <div className="space-y-2">
          <Label>Subtítulo</Label>
          <Textarea
            value={section.content?.subtitle || ""}
            onChange={(e) => updateContentField(section.id, "subtitle", e.target.value)}
            rows={2}
            placeholder="Um processo progressivo de leitura..."
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <Label className="text-base font-semibold">Etapas da Jornada ({(section.content?.steps || []).length})</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {(section.content?.steps || []).map((step: any, i: number) => (
            <Card key={i} className="text-center">
              <CardContent className="pt-3 pb-3 space-y-2">
                <Badge variant="outline" className="text-xs">{step.number}</Badge>
                <Input
                  value={step.title || ""}
                  onChange={(e) => updateArrayItem(section.id, "steps", i, "title", e.target.value)}
                  className="text-center text-sm"
                  placeholder="Etapa"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Título das Dimensões</Label>
            <Input
              value={section.content?.layers_title || ""}
              onChange={(e) => updateContentField(section.id, "layers_title", e.target.value)}
              placeholder="As 7 dimensões humanas que o Identity integra"
            />
          </div>
          <div className="space-y-2">
            <Label>Subtítulo das Dimensões</Label>
            <Textarea
              value={section.content?.layers_subtitle || ""}
              onChange={(e) => updateContentField(section.id, "layers_subtitle", e.target.value)}
              rows={2}
              placeholder="Não são rótulos..."
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Dimensões ({(section.content?.discoveries || []).length})</Label>
          <Button variant="outline" size="sm" onClick={() => addArrayItem(section.id, "discoveries", { mainText: "", testName: "" })}>
            <Plus className="w-4 h-4 mr-2" /> Adicionar
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {(section.content?.discoveries || []).map((disc: any, i: number) => (
            <Card key={i} className="relative">
              <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8 text-destructive" onClick={() => removeArrayItem(section.id, "discoveries", i)}>
                <Trash2 className="w-4 h-4" />
              </Button>
              <CardContent className="pt-4 space-y-3">
                <Badge variant="outline" className="text-xs">Dimensão #{i + 1}</Badge>
                <div className="space-y-2">
                  <Label className="text-xs">Descrição</Label>
                  <Textarea
                    value={disc.mainText || ""}
                    onChange={(e) => updateArrayItem(section.id, "discoveries", i, "mainText", e.target.value)}
                    rows={2}
                    placeholder="Como você tende a agir..."
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Nome da Dimensão</Label>
                  <Input
                    value={disc.testName || ""}
                    onChange={(e) => updateArrayItem(section.id, "discoveries", i, "testName", e.target.value)}
                    placeholder="DISC"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {renderSaveButton(section)}
    </div>
  );

  // ========== ESSENCE CODE ==========
  const renderEssenceCodeFields = (section: ContentSection) => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Título "Nello"</Label>
        <Input
          value={section.content?.nello_title || ""}
          onChange={(e) => updateContentField(section.id, "nello_title", e.target.value)}
          placeholder="Você não caminha sozinho"
        />
      </div>

      <div className="space-y-4">
        <Label>Parágrafos do Nello</Label>
        <Textarea
          value={section.content?.nello_description_1 || ""}
          onChange={(e) => updateContentField(section.id, "nello_description_1", e.target.value)}
          rows={2}
          placeholder="O Identity organiza seus resultados..."
        />
        <Textarea
          value={section.content?.nello_description_2 || ""}
          onChange={(e) => updateContentField(section.id, "nello_description_2", e.target.value)}
          rows={2}
          placeholder="Isso pode ajudar a trazer mais consciência..."
        />
      </div>

      <div className="space-y-4">
        <Label>Tags do Nello</Label>
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Badges exibidas na seção</p>
          <Button variant="outline" size="sm" onClick={() => {
            const arr = [...(section.content?.nello_tags || []), ""];
            updateContentField(section.id, "nello_tags", arr);
          }}>
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>
        {(section.content?.nello_tags || []).map((tag: string, i: number) => (
          <div key={i} className="flex gap-2">
            <Input value={tag} onChange={(e) => updateStringArrayItem(section.id, "nello_tags", i, e.target.value)} className="flex-1" />
            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => {
              const arr = (section.content?.nello_tags || []).filter((_: any, idx: number) => idx !== i);
              updateContentField(section.id, "nello_tags", arr);
            }}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      <Separator />

      <div className="space-y-2">
        <Label>Título do Código da Essência</Label>
        <Input
          value={section.content?.essence_code_title || ""}
          onChange={(e) => updateContentField(section.id, "essence_code_title", e.target.value)}
          placeholder="Veja como é o seu Código da Essência"
        />
      </div>

      <div className="space-y-2">
        <Label>Descrição Completa</Label>
        <Textarea
          value={section.content?.essence_code_full_description || ""}
          onChange={(e) => updateContentField(section.id, "essence_code_full_description", e.target.value)}
          rows={2}
          placeholder="No final da jornada, você recebe o Código da Essência..."
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Bullets do Código</Label>
          <Button variant="outline" size="sm" onClick={() => {
            const arr = [...(section.content?.essence_code_bullets || []), ""];
            updateContentField(section.id, "essence_code_bullets", arr);
          }}>
            <Plus className="w-4 h-4 mr-2" /> Adicionar
          </Button>
        </div>
        {(section.content?.essence_code_bullets || []).map((bullet: string, i: number) => (
          <div key={i} className="flex gap-2">
            <Input value={bullet} onChange={(e) => updateStringArrayItem(section.id, "essence_code_bullets", i, e.target.value)} className="flex-1" />
            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => {
              const arr = (section.content?.essence_code_bullets || []).filter((_: any, idx: number) => idx !== i);
              updateContentField(section.id, "essence_code_bullets", arr);
            }}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label>Frase de Fechamento (itálico dourado)</Label>
        <Input
          value={section.content?.essence_code_closing || ""}
          onChange={(e) => updateContentField(section.id, "essence_code_closing", e.target.value)}
          placeholder="Não é sobre se transformar em outra pessoa..."
        />
      </div>

      <div className="space-y-2">
        <Label>Disclaimer</Label>
        <Textarea
          value={section.content?.essence_code_disclaimer || ""}
          onChange={(e) => updateContentField(section.id, "essence_code_disclaimer", e.target.value)}
          rows={2}
          placeholder="Ferramenta de autoconhecimento e desenvolvimento pessoal..."
        />
      </div>

      {renderSaveButton(section)}
    </div>
  );

  // ========== TESTIMONIALS SECTION ==========
  const renderTestimonialsFields = (section: ContentSection) => (
    <div className="space-y-6">
      <Alert className="bg-muted/50">
        <Info className="h-4 w-4" />
        <AlertDescription>
          Os depoimentos exibidos na landing são gerenciados pelo componente <code className="bg-background px-1 rounded">ApprovedTestimonialsSection</code>. 
          Aqui você pode gerenciar depoimentos adicionais salvos no banco.
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Label>Descrição da Seção</Label>
        <Textarea
          value={section.content?.description || ""}
          onChange={(e) => updateContentField(section.id, "description", e.target.value)}
          rows={2}
          placeholder="Histórias reais de pessoas que descobriram sua verdadeira essência."
        />
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Depoimentos ({(section.content?.items || []).length})</Label>
          <Button variant="outline" size="sm" onClick={() => addArrayItem(section.id, "items", { name: "", role: "", text: "", image: "👤" })}>
            <Plus className="w-4 h-4 mr-2" /> Adicionar
          </Button>
        </div>

        {(section.content?.items || []).map((testimonial: any, i: number) => (
          <Card key={i} className="relative">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8 text-destructive" onClick={() => removeArrayItem(section.id, "items", i)}>
              <Trash2 className="w-4 h-4" />
            </Button>
            <CardContent className="pt-4 space-y-4">
              <Badge variant="outline">#{i + 1}</Badge>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Emoji/Avatar</Label>
                  <Input value={testimonial.image || ""} onChange={(e) => updateArrayItem(section.id, "items", i, "image", e.target.value)} placeholder="👤" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Nome</Label>
                  <Input value={testimonial.name || ""} onChange={(e) => updateArrayItem(section.id, "items", i, "name", e.target.value)} placeholder="Nome" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Cargo/Função</Label>
                  <Input value={testimonial.role || ""} onChange={(e) => updateArrayItem(section.id, "items", i, "role", e.target.value)} placeholder="Empresário" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Depoimento</Label>
                <Textarea value={testimonial.text || ""} onChange={(e) => updateArrayItem(section.id, "items", i, "text", e.target.value)} rows={3} placeholder="O que a pessoa disse..." />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {renderSaveButton(section)}
    </div>
  );

  // ========== FAQ SECTION ==========
  const renderFaqFields = (section: ContentSection) => (
    <div className="space-y-6">
      <Alert className="bg-muted/50">
        <Info className="h-4 w-4" />
        <AlertDescription>
          O FAQ exibido na landing é gerenciado pelo componente <code className="bg-background px-1 rounded">StrategicFAQ</code>.
          Aqui você pode gerenciar as perguntas e respostas salvas no banco.
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Título</Label>
          <Input value={section.title || ""} onChange={(e) => updateSection(section.id, "title", e.target.value)} placeholder="Perguntas" />
        </div>
        <div className="space-y-2">
          <Label>WhatsApp de Contato</Label>
          <Input value={section.content?.whatsapp || ""} onChange={(e) => updateContentField(section.id, "whatsapp", e.target.value)} placeholder="5561992430090" />
          <p className="text-xs text-muted-foreground">Número completo com código do país</p>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Perguntas ({(section.content?.items || []).length})</Label>
          <Button variant="outline" size="sm" onClick={() => addArrayItem(section.id, "items", { question: "", answer: "" })}>
            <Plus className="w-4 h-4 mr-2" /> Adicionar
          </Button>
        </div>

        {(section.content?.items || []).map((item: any, i: number) => (
          <Card key={i} className="relative">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8 text-destructive" onClick={() => removeArrayItem(section.id, "items", i)}>
              <Trash2 className="w-4 h-4" />
            </Button>
            <CardContent className="pt-4 space-y-3">
              <Badge variant="outline" className="text-xs">#{i + 1}</Badge>
              <Input value={item.question || ""} onChange={(e) => updateArrayItem(section.id, "items", i, "question", e.target.value)} placeholder="Pergunta" />
              <Textarea value={item.answer || ""} onChange={(e) => updateArrayItem(section.id, "items", i, "answer", e.target.value)} rows={3} placeholder="Resposta..." />
            </CardContent>
          </Card>
        ))}
      </div>

      {renderSaveButton(section)}
    </div>
  );

  // ========== FINAL CTA SECTION ==========
  const renderFinalCtaFields = (section: ContentSection) => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Título</Label>
        <Input
          value={section.content?.final_cta_title || ""}
          onChange={(e) => updateContentField(section.id, "final_cta_title", e.target.value)}
          placeholder="O Identity não cria uma nova versão de você."
        />
      </div>

      <div className="space-y-2">
        <Label>Descrição 1</Label>
        <Textarea
          value={section.content?.final_cta_description_1 || ""}
          onChange={(e) => updateContentField(section.id, "final_cta_description_1", e.target.value)}
          rows={2}
          placeholder="Ele organiza o que já estava aí, mas precisava de clareza e linguagem."
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Descrição 2 (antes do destaque)</Label>
          <Input
            value={section.content?.final_cta_description_2 || ""}
            onChange={(e) => updateContentField(section.id, "final_cta_description_2", e.target.value)}
            placeholder="Seu"
          />
        </div>
        <div className="space-y-2">
          <Label>Descrição 3 (após destaque)</Label>
          <Input
            value={section.content?.final_cta_description_3 || ""}
            onChange={(e) => updateContentField(section.id, "final_cta_description_3", e.target.value)}
            placeholder="é uma síntese prática da sua jornada..."
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Texto do CTA</Label>
        <Input
          value={section.content?.ctaText || ""}
          onChange={(e) => updateContentField(section.id, "ctaText", e.target.value)}
          placeholder="Garantir meu Código com 50% OFF"
        />
      </div>

      <div className="space-y-2">
        <Label>Microcopy (abaixo do botão)</Label>
        <Input
          value={section.content?.final_cta_microcopy || ""}
          onChange={(e) => updateContentField(section.id, "final_cta_microcopy", e.target.value)}
          placeholder="Acesso vitalício • Jornada reflexiva • Desenvolvimento pessoal"
        />
      </div>

      {renderSaveButton(section)}
    </div>
  );

  // ========== SOCIAL MEDIA SECTION ==========
  const renderSocialMediaFields = (section: ContentSection) => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="flex items-center gap-2"><Instagram className="w-4 h-4" /> Instagram</Label>
          <Input value={section.content?.instagram || ""} onChange={(e) => updateContentField(section.id, "instagram", e.target.value)} placeholder="https://instagram.com/nello.identity" />
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2"><Globe className="w-4 h-4" /> Instagram Username</Label>
          <Input value={section.content?.instagramUsername || ""} onChange={(e) => updateContentField(section.id, "instagramUsername", e.target.value)} placeholder="@nello.identity" />
        </div>
      </div>

      <Separator />

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>WhatsApp</Label>
          <Input value={section.content?.whatsapp || ""} onChange={(e) => updateContentField(section.id, "whatsapp", e.target.value)} placeholder="5561992430090" />
        </div>
        <div className="space-y-2">
          <Label>WhatsApp Display</Label>
          <Input value={section.content?.whatsappDisplay || ""} onChange={(e) => updateContentField(section.id, "whatsappDisplay", e.target.value)} placeholder="(61) 99243-0090" />
        </div>
      </div>

      <Separator />

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Email de Contato</Label>
          <Input type="email" value={section.content?.email || ""} onChange={(e) => updateContentField(section.id, "email", e.target.value)} placeholder="contato@nello.one" />
        </div>
        <div className="space-y-2">
          <Label>LinkedIn (opcional)</Label>
          <Input value={section.content?.linkedin || ""} onChange={(e) => updateContentField(section.id, "linkedin", e.target.value)} placeholder="https://linkedin.com/company/nello-identity" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Texto do Rodapé</Label>
        <Input value={section.content?.footerText || ""} onChange={(e) => updateContentField(section.id, "footerText", e.target.value)} placeholder="NELLO IDENTITY • O caminho começa dentro." />
      </div>

      {renderSaveButton(section)}
    </div>
  );

  // ========== PRICING SECTION ==========
  const handleUpdateStripePrice = async (currency: 'brl' | 'usd' | 'eur', newPrice: number, originalPrice: number) => {
    setUpdatingStripe(true);
    try {
      const productId = "prod_TbYEfQotxBF6yQ";
      const currentPriceId = bundlePrices[currency].priceId;
      
      const { data, error } = await supabase.functions.invoke('update-stripe-price', {
        body: {
          priceId: currentPriceId,
          newAmount: newPrice,
          originalPrice,
          currency: currency.toUpperCase(),
          productId,
          description: `Jornada Identity - ${currency.toUpperCase()}`,
        },
      });

      if (error) throw error;
      toast.success(`Preço ${currency.toUpperCase()} atualizado no Stripe!`, {
        description: `Novo Price ID: ${data.newPriceId}`,
      });
      return data.newPriceId;
    } catch (error: any) {
      console.error("Error updating Stripe price:", error);
      toast.error("Erro ao atualizar preço no Stripe", { description: error.message });
    } finally {
      setUpdatingStripe(false);
    }
  };

  const renderPricingFields = (section: ContentSection) => (
    <div className="space-y-6">
      <Alert className="bg-amber-500/5 border-amber-500/20">
        <CreditCard className="h-4 w-4 text-amber-600" />
        <AlertDescription>
          <strong>Atenção:</strong> Ao alterar preços, o sistema criará novos Price IDs no Stripe.
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Título da Seção</Label>
          <Input value={section.title || ""} onChange={(e) => updateSection(section.id, "title", e.target.value)} placeholder="Inicie a Jornada Identity" />
        </div>
        <div className="space-y-2">
          <Label>Subtítulo</Label>
          <Input value={section.content?.subtitle || ""} onChange={(e) => updateContentField(section.id, "subtitle", e.target.value)} placeholder="Uma jornada feita para ser vivida..." />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <Label className="text-base font-semibold flex items-center gap-2"><DollarSign className="w-4 h-4" /> Preços por Moeda</Label>
        <div className="grid md:grid-cols-3 gap-4">
          {(['brl', 'usd', 'eur'] as const).map((currency) => {
            const labels = { brl: 'BRL - Brasil', usd: 'USD - Internacional', eur: 'EUR - Europa' };
            return (
              <Card key={currency}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Badge variant="outline">{currency.toUpperCase()}</Badge>
                    {labels[currency]}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-xs">Preço Original (De)</Label>
                    <Input type="number" value={section.content?.[currency]?.original || ""} onChange={(e) => updateContentField(section.id, currency, { ...section.content?.[currency], original: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Preço Atual (Por)</Label>
                    <Input type="number" value={section.content?.[currency]?.price || ""} onChange={(e) => updateContentField(section.id, currency, { ...section.content?.[currency], price: Number(e.target.value) })} />
                  </div>
                  <Button size="sm" variant="outline" className="w-full" disabled={updatingStripe} onClick={() => handleUpdateStripePrice(currency, section.content?.[currency]?.price || 0, section.content?.[currency]?.original || 0)}>
                    {updatingStripe ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
                    Atualizar no Stripe
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Benefícios</Label>
          <Button variant="outline" size="sm" onClick={() => {
            const arr = [...(section.content?.benefits || []), ""];
            updateContentField(section.id, "benefits", arr);
          }}>
            <Plus className="w-4 h-4 mr-2" /> Adicionar
          </Button>
        </div>
        {(section.content?.benefits || []).map((benefit: string, i: number) => (
          <div key={i} className="flex gap-2">
            <Input value={benefit} onChange={(e) => updateStringArrayItem(section.id, "benefits", i, e.target.value)} className="flex-1" placeholder={`Benefício ${i + 1}`} />
            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => {
              const arr = (section.content?.benefits || []).filter((_: any, idx: number) => idx !== i);
              updateContentField(section.id, "benefits", arr);
            }}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      <Separator />

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Texto do CTA</Label>
          <Input value={section.content?.ctaText || ""} onChange={(e) => updateContentField(section.id, "ctaText", e.target.value)} placeholder="Garantir meu Código com 50% OFF" />
        </div>
        <div className="space-y-2">
          <Label>Texto Abaixo do CTA</Label>
          <Input value={section.content?.ctaSubtext || ""} onChange={(e) => updateContentField(section.id, "ctaSubtext", e.target.value)} placeholder="Código da Essência + Ativação incluída" />
        </div>
      </div>

      {renderSaveButton(section)}
    </div>
  );

  // ========== PROFESSIONALS SECTION ==========
  const renderProfessionalsFields = (section: ContentSection) => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Título</Label>
        <Input
          value={section.title || ""}
          onChange={(e) => updateSection(section.id, "title", e.target.value)}
          placeholder="Para Profissionais que Acompanham Pessoas"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Intro (antes do destaque)</Label>
          <Textarea value={section.content?.intro_1 || ""} onChange={(e) => updateContentField(section.id, "intro_1", e.target.value)} rows={2} placeholder="Psicólogos, terapeutas..." />
        </div>
        <div className="space-y-2">
          <Label>Destaque (negrito)</Label>
          <Textarea value={section.content?.intro_highlight || ""} onChange={(e) => updateContentField(section.id, "intro_highlight", e.target.value)} rows={2} placeholder="nem sempre a pessoa consegue nomear..." />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Intro 2</Label>
          <Input value={section.content?.intro_2 || ""} onChange={(e) => updateContentField(section.id, "intro_2", e.target.value)} placeholder="O Nello Identity existe como uma" />
        </div>
        <div className="space-y-2">
          <Label>Destaque 2 (dourado)</Label>
          <Input value={section.content?.intro_highlight_2 || ""} onChange={(e) => updateContentField(section.id, "intro_highlight_2", e.target.value)} placeholder="ferramenta complementar de clareza..." />
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label>Título Principal</Label>
        <Input value={section.content?.main_title || ""} onChange={(e) => updateContentField(section.id, "main_title", e.target.value)} placeholder="O Identity não substitui um processo terapêutico." />
      </div>

      <div className="space-y-2">
        <Label>Descrição Principal</Label>
        <Textarea value={section.content?.main_description || ""} onChange={(e) => updateContentField(section.id, "main_description", e.target.value)} rows={2} placeholder="Ele oferece mapas reflexivos..." />
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Casos de Uso ({(section.content?.use_cases || []).length})</Label>
          <Button variant="outline" size="sm" onClick={() => {
            const arr = [...(section.content?.use_cases || []), ""];
            updateContentField(section.id, "use_cases", arr);
          }}>
            <Plus className="w-4 h-4 mr-2" /> Adicionar
          </Button>
        </div>
        {(section.content?.use_cases || []).map((item: string, i: number) => (
          <div key={i} className="flex gap-2">
            <Input value={item} onChange={(e) => updateStringArrayItem(section.id, "use_cases", i, e.target.value)} className="flex-1" />
            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => {
              const arr = (section.content?.use_cases || []).filter((_: any, idx: number) => idx !== i);
              updateContentField(section.id, "use_cases", arr);
            }}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      <Separator />

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Citação Linha 1</Label>
          <Input value={section.content?.quote_1 || ""} onChange={(e) => updateContentField(section.id, "quote_1", e.target.value)} placeholder="É um recurso de reflexão estruturada." />
        </div>
        <div className="space-y-2">
          <Label>Citação Linha 2 (dourado)</Label>
          <Input value={section.content?.quote_2 || ""} onChange={(e) => updateContentField(section.id, "quote_2", e.target.value)} placeholder="A transformação acontece no acompanhamento humano." />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Nota Clínica</Label>
        <Input value={section.content?.clinical_note || ""} onChange={(e) => updateContentField(section.id, "clinical_note", e.target.value)} placeholder="Sempre sem caráter clínico ou diagnóstico." />
      </div>

      <div className="space-y-2">
        <Label>Disclaimer</Label>
        <Textarea value={section.content?.disclaimer || ""} onChange={(e) => updateContentField(section.id, "disclaimer", e.target.value)} rows={2} placeholder="O Nello Identity é uma ferramenta de autoconhecimento..." />
      </div>

      <Separator />

      <div className="space-y-4">
        <Label className="text-base font-semibold">Parceiros Profissionais</Label>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-xs">Título</Label>
            <Input value={section.content?.partners_title || ""} onChange={(e) => updateContentField(section.id, "partners_title", e.target.value)} placeholder="Profissionais Parceiros" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">CTA</Label>
            <Input value={section.content?.partners_cta || ""} onChange={(e) => updateContentField(section.id, "partners_cta", e.target.value)} placeholder="Ver parceria profissional" />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Descrição</Label>
          <Textarea value={section.content?.partners_description || ""} onChange={(e) => updateContentField(section.id, "partners_description", e.target.value)} rows={2} />
        </div>
      </div>

      {renderSaveButton(section)}
    </div>
  );

  const renderSectionContent = (section: ContentSection) => {
    switch (section.section) {
      case "hero": return renderHeroFields(section);
      case "identification": return renderIdentificationFields(section);
      case "journey": return renderJourneyFields(section);
      case "essence_code": return renderEssenceCodeFields(section);
      case "testimonials": return renderTestimonialsFields(section);
      case "faq": return renderFaqFields(section);
      case "final_cta": return renderFinalCtaFields(section);
      case "social_media": return renderSocialMediaFields(section);
      case "pricing": return renderPricingFields(section);
      case "professionals": return renderProfessionalsFields(section);
      default:
        return (
          <div className="text-center py-8 text-muted-foreground">
            Editor não disponível para esta seção
          </div>
        );
    }
  };

  if (loading || permLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!hasPermission('can_manage_settings') && !isSuperAdmin) {
    return (
      <Card className="p-8 text-center max-w-md mx-auto mt-12">
        <Shield className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Acesso Restrito</h3>
        <p className="text-muted-foreground text-sm">
          Edição da landing page requer permissão de configurações.
        </p>
      </Card>
    );
  }

  const availableSections = sections.filter(s => SECTION_CONFIG[s.section]);

  const getPreviewUrl = () => {
    switch (selectedLanguage) {
      case "en": return "/en";
      case "pt-pt": return "/pt-pt";
      default: return "/";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <FileEdit className="w-8 h-8" />
            Landing Page
          </h2>
          <p className="text-muted-foreground mt-1">Gerencie todo o conteúdo da página inicial do Identity</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <AdminLanguageSelector 
            value={selectedLanguage} 
            onChange={setSelectedLanguage}
          />
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchContent}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href={getPreviewUrl()} target="_blank" rel="noopener noreferrer">
                <Eye className="w-4 h-4 mr-2" />
                Ver Site
              </a>
            </Button>
          </div>
        </div>
      </div>

      <Alert className="bg-amber-500/5 border-amber-500/20">
        <Info className="h-4 w-4 text-amber-600" />
        <AlertDescription>
          Todas as alterações salvas aqui serão refletidas na landing page pública. 
          <strong> Recarregue a página inicial</strong> após salvar para ver as mudanças.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="flex flex-wrap h-auto gap-1 p-1 bg-muted/50">
          {Object.entries(SECTION_CONFIG).map(([key, config]) => {
            const Icon = config.icon;
            const sectionExists = availableSections.find(s => s.section === key);
            return (
              <TabsTrigger 
                key={key} 
                value={key} 
                className="gap-2 data-[state=active]:bg-background"
                disabled={!sectionExists}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{config.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {availableSections.map((section) => {
          const config = SECTION_CONFIG[section.section];
          return (
            <TabsContent key={section.id} value={section.section}>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${config?.color || 'bg-muted'}`}>
                      {config?.icon && <config.icon className="w-5 h-5" />}
                    </div>
                    <div>
                      <CardTitle>{config?.label || section.section}</CardTitle>
                      <CardDescription>{config?.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {renderSectionContent(section)}
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};
