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
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Upload,
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
  Globe
} from "lucide-react";

interface ContentSection {
  id: string;
  section: string;
  title: string | null;
  content: any;
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
    description: "Título principal, subtítulo e botões de ação",
    color: "bg-gold/10 text-gold"
  },
  about: { 
    label: "Sobre", 
    icon: Info, 
    description: "Seção explicativa sobre o Identity",
    color: "bg-blue-500/10 text-blue-500"
  },
  for_who: { 
    label: "Para Quem", 
    icon: Users, 
    description: "Perfis de público-alvo",
    color: "bg-green-500/10 text-green-500"
  },
  testimonials: { 
    label: "Depoimentos", 
    icon: MessageSquare, 
    description: "Depoimentos de clientes",
    color: "bg-purple-500/10 text-purple-500"
  },
  faq: { 
    label: "FAQ", 
    icon: HelpCircle, 
    description: "Perguntas frequentes",
    color: "bg-orange-500/10 text-orange-500"
  },
  final_cta: { 
    label: "CTA Final", 
    icon: Sparkles, 
    description: "Chamada final para ação",
    color: "bg-pink-500/10 text-pink-500"
  },
  social_media: { 
    label: "Redes Sociais", 
    icon: Share2, 
    description: "Links de redes sociais e contato",
    color: "bg-rose-500/10 text-rose-500"
  },
  pricing: { 
    label: "Preços", 
    icon: CreditCard, 
    description: "Seção de preços da Jornada Identity",
    color: "bg-emerald-500/10 text-emerald-500"
  },
};

const ICON_OPTIONS = [
  "Heart", "Target", "Lightbulb", "Sparkles", "Award", "Users", "Zap", "Star",
  "Crown", "Shield", "Globe", "BookOpen", "Compass", "Flame", "Gem", "Sun"
];

// Component protected by AdminGuard at route level - can_manage_settings
export const AdminLandingPage = () => {
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("hero");
  const [updatingStripe, setUpdatingStripe] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("home_content")
        .select("*")
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
      toast.success("Conteúdo salvo com sucesso! Recarregue a landing page para ver as alterações.");
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

  const renderSaveButton = (section: ContentSection) => (
    <div className="flex items-center gap-3 pt-6 border-t">
      <Button
        variant="outline"
        size="sm"
        asChild
      >
        <a href="/" target="_blank" rel="noopener noreferrer">
          <ExternalLink className="w-4 h-4 mr-2" />
          Ver Landing Page
        </a>
      </Button>
      <div className="flex-1" />
      <Button 
        onClick={() => handleSave(section)} 
        disabled={saving === section.id}
        className="bg-gold hover:bg-gold-dark"
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
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Título Principal</Label>
          <Input
            value={section.title || ""}
            onChange={(e) => updateSection(section.id, "title", e.target.value)}
            placeholder="Sua imagem pode comunicar"
          />
          <p className="text-xs text-muted-foreground">Primeira linha do título do hero</p>
        </div>
        <div className="space-y-2">
          <Label>Subtítulo (em dourado)</Label>
          <Input
            value={section.content?.subtitle || ""}
            onChange={(e) => updateContentField(section.id, "subtitle", e.target.value)}
            placeholder="verdade, fé e autoridade"
          />
          <p className="text-xs text-muted-foreground">Segunda linha destacada em gold</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Descrição</Label>
        <Textarea
          value={section.content?.description || ""}
          onChange={(e) => updateContentField(section.id, "description", e.target.value)}
          rows={3}
          placeholder="Uma experiência completa de autoconhecimento..."
        />
      </div>
      
      <Separator />
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Botão Primário</Label>
          <Input
            value={section.content?.primaryButtonText || ""}
            onChange={(e) => updateContentField(section.id, "primaryButtonText", e.target.value)}
            placeholder="Revelar meu Código da Essência"
          />
        </div>
        <div className="space-y-2">
          <Label>Botão Secundário</Label>
          <Input
            value={section.content?.secondaryButtonText || ""}
            onChange={(e) => updateContentField(section.id, "secondaryButtonText", e.target.value)}
            placeholder="Conheça o Identity"
          />
        </div>
      </div>

      <Alert className="bg-muted/50">
        <ImageIcon className="h-4 w-4" />
        <AlertDescription>
          Para alterar a imagem do Hero, substitua o arquivo <code className="bg-background px-1 rounded">src/assets/hero-image.jpg</code> no código.
        </AlertDescription>
      </Alert>

      {renderSaveButton(section)}
    </div>
  );

  // ========== ABOUT SECTION ==========
  const renderAboutFields = (section: ContentSection) => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Título da Seção</Label>
        <Input
          value={section.title || ""}
          onChange={(e) => updateSection(section.id, "title", e.target.value)}
          placeholder="O que é o"
        />
        <p className="text-xs text-muted-foreground">O texto "Identity" será adicionado automaticamente em dourado</p>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Parágrafos</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newParagraphs = [...(section.content?.paragraphs || []), ""];
              updateContentField(section.id, "paragraphs", newParagraphs);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar
          </Button>
        </div>

        <div className="space-y-3">
          {(section.content?.paragraphs || []).map((p: string, i: number) => (
            <div key={i} className="flex gap-2">
              <div className="flex items-center text-muted-foreground">
                <GripVertical className="w-4 h-4" />
              </div>
              <Textarea
                value={p}
                onChange={(e) => {
                  const newParagraphs = [...(section.content?.paragraphs || [])];
                  newParagraphs[i] = e.target.value;
                  updateContentField(section.id, "paragraphs", newParagraphs);
                }}
                rows={2}
                className="flex-1"
                placeholder={`Parágrafo ${i + 1}`}
              />
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive"
                onClick={() => {
                  const newParagraphs = (section.content?.paragraphs || []).filter((_: any, idx: number) => idx !== i);
                  updateContentField(section.id, "paragraphs", newParagraphs);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">O último parágrafo será exibido em destaque dourado</p>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label>Texto de Localização</Label>
        <Input
          value={section.content?.location || ""}
          onChange={(e) => updateContentField(section.id, "location", e.target.value)}
          placeholder="Atendemos exclusivamente em Brasília-DF..."
        />
        <p className="text-xs text-muted-foreground">Exibido em itálico no final da seção</p>
      </div>

      <Alert className="bg-muted/50">
        <ImageIcon className="h-4 w-4" />
        <AlertDescription>
          Para alterar a imagem da seção Sobre, substitua o arquivo <code className="bg-background px-1 rounded">src/assets/concept-image.jpg</code> no código.
        </AlertDescription>
      </Alert>

      {renderSaveButton(section)}
    </div>
  );

  // ========== FOR WHO SECTION ==========
  const renderForWhoFields = (section: ContentSection) => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Título da Seção</Label>
          <Input
            value={section.title || ""}
            onChange={(e) => updateSection(section.id, "title", e.target.value)}
            placeholder="Para quem é o"
          />
        </div>
        <div className="space-y-2">
          <Label>Descrição</Label>
          <Textarea
            value={section.content?.description || ""}
            onChange={(e) => updateContentField(section.id, "description", e.target.value)}
            rows={2}
            placeholder="Para todos que buscam uma imagem autêntica..."
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Perfis ({(section.content?.profiles || []).length})</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addArrayItem(section.id, "profiles", { icon: "Heart", title: "", description: "" })}
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Perfil
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {(section.content?.profiles || []).map((profile: any, i: number) => (
            <Card key={i} className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => removeArrayItem(section.id, "profiles", i)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-xs">#{i + 1}</Badge>
                  <select
                    value={profile.icon || "Heart"}
                    onChange={(e) => updateArrayItem(section.id, "profiles", i, "icon", e.target.value)}
                    className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                  >
                    {ICON_OPTIONS.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>
                <Input
                  value={profile.title || ""}
                  onChange={(e) => updateArrayItem(section.id, "profiles", i, "title", e.target.value)}
                  placeholder="Título do perfil"
                />
                <Textarea
                  value={profile.description || ""}
                  onChange={(e) => updateArrayItem(section.id, "profiles", i, "description", e.target.value)}
                  placeholder="Descrição..."
                  rows={2}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {renderSaveButton(section)}
    </div>
  );

  // ========== TESTIMONIALS SECTION ==========
  const renderTestimonialsFields = (section: ContentSection) => (
    <div className="space-y-6">
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => addArrayItem(section.id, "items", { name: "", role: "", text: "", image: "👤" })}
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Depoimento
          </Button>
        </div>

        <div className="space-y-4">
          {(section.content?.items || []).map((testimonial: any, i: number) => (
            <Card key={i} className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => removeArrayItem(section.id, "items", i)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <CardContent className="pt-4 space-y-4">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">#{i + 1}</Badge>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Emoji/Avatar</Label>
                    <Input
                      value={testimonial.image || ""}
                      onChange={(e) => updateArrayItem(section.id, "items", i, "image", e.target.value)}
                      placeholder="👤"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Nome</Label>
                    <Input
                      value={testimonial.name || ""}
                      onChange={(e) => updateArrayItem(section.id, "items", i, "name", e.target.value)}
                      placeholder="Nome da pessoa"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Cargo/Função</Label>
                    <Input
                      value={testimonial.role || ""}
                      onChange={(e) => updateArrayItem(section.id, "items", i, "role", e.target.value)}
                      placeholder="Empresário"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Depoimento</Label>
                  <Textarea
                    value={testimonial.text || ""}
                    onChange={(e) => updateArrayItem(section.id, "items", i, "text", e.target.value)}
                    placeholder="O que a pessoa disse sobre o Identity..."
                    rows={3}
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

  // ========== FAQ SECTION ==========
  const renderFaqFields = (section: ContentSection) => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Título</Label>
          <Input
            value={section.title || ""}
            onChange={(e) => updateSection(section.id, "title", e.target.value)}
            placeholder="Perguntas"
          />
        </div>
        <div className="space-y-2">
          <Label>WhatsApp de Contato</Label>
          <Input
            value={section.content?.whatsapp || ""}
            onChange={(e) => updateContentField(section.id, "whatsapp", e.target.value)}
            placeholder="5511999999999"
          />
          <p className="text-xs text-muted-foreground">Número completo com código do país</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Descrição</Label>
        <Textarea
          value={section.content?.description || ""}
          onChange={(e) => updateContentField(section.id, "description", e.target.value)}
          rows={2}
          placeholder="Tire suas dúvidas sobre o Identity"
        />
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Perguntas ({(section.content?.items || []).length})</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addArrayItem(section.id, "items", { question: "", answer: "" })}
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Pergunta
          </Button>
        </div>

        <div className="space-y-4">
          {(section.content?.items || []).map((item: any, i: number) => (
            <Card key={i} className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => removeArrayItem(section.id, "items", i)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <CardContent className="pt-4 space-y-3">
                <Badge variant="outline" className="text-xs">Pergunta #{i + 1}</Badge>
                <div className="space-y-2">
                  <Label className="text-xs">Pergunta</Label>
                  <Input
                    value={item.question || ""}
                    onChange={(e) => updateArrayItem(section.id, "items", i, "question", e.target.value)}
                    placeholder="Qual é a pergunta?"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Resposta</Label>
                  <Textarea
                    value={item.answer || ""}
                    onChange={(e) => updateArrayItem(section.id, "items", i, "answer", e.target.value)}
                    placeholder="Resposta detalhada..."
                    rows={3}
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

  // ========== FINAL CTA SECTION ==========
  const renderFinalCtaFields = (section: ContentSection) => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Título</Label>
          <Input
            value={section.title || ""}
            onChange={(e) => updateSection(section.id, "title", e.target.value)}
            placeholder="Pronto para revelar sua"
          />
          <p className="text-xs text-muted-foreground">A palavra "Essência" será adicionada em dourado</p>
        </div>
        <div className="space-y-2">
          <Label>Badge</Label>
          <Input
            value={section.content?.badge || ""}
            onChange={(e) => updateContentField(section.id, "badge", e.target.value)}
            placeholder="Comece sua Jornada"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Descrição</Label>
        <Textarea
          value={section.content?.description || ""}
          onChange={(e) => updateContentField(section.id, "description", e.target.value)}
          rows={3}
          placeholder="Combine autoconhecimento profundo com fotografia de alta qualidade..."
        />
      </div>

      <Separator />

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Botão Principal</Label>
          <Input
            value={section.content?.primaryButtonText || ""}
            onChange={(e) => updateContentField(section.id, "primaryButtonText", e.target.value)}
            placeholder="Revelar meu Código da Essência"
          />
        </div>
        <div className="space-y-2">
          <Label>Botão Secundário</Label>
          <Input
            value={section.content?.secondaryButtonText || ""}
            onChange={(e) => updateContentField(section.id, "secondaryButtonText", e.target.value)}
            placeholder="Entrar na Plataforma"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Texto do Rodapé</Label>
        <Input
          value={section.content?.footer || ""}
          onChange={(e) => updateContentField(section.id, "footer", e.target.value)}
          placeholder="✝️ Atendimento exclusivo em Brasília-DF..."
        />
      </div>

      {renderSaveButton(section)}
    </div>
  );

  // ========== SOCIAL MEDIA SECTION ==========
  const renderSocialMediaFields = (section: ContentSection) => (
    <div className="space-y-6">
      <Alert className="bg-muted/50">
        <Share2 className="h-4 w-4" />
        <AlertDescription>
          Configure as redes sociais e links de contato exibidos no rodapé e em toda a landing page.
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Instagram className="w-4 h-4" />
            Instagram
          </Label>
          <Input
            value={section.content?.instagram || ""}
            onChange={(e) => updateContentField(section.id, "instagram", e.target.value)}
            placeholder="https://instagram.com/identity.nello"
          />
          <p className="text-xs text-muted-foreground">Link completo do perfil do Instagram</p>
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Instagram Username
          </Label>
          <Input
            value={section.content?.instagramUsername || ""}
            onChange={(e) => updateContentField(section.id, "instagramUsername", e.target.value)}
            placeholder="@identity.nello"
          />
          <p className="text-xs text-muted-foreground">Exibido no rodapé</p>
        </div>
      </div>

      <Separator />

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>WhatsApp</Label>
          <Input
            value={section.content?.whatsapp || ""}
            onChange={(e) => updateContentField(section.id, "whatsapp", e.target.value)}
            placeholder="5561992430090"
          />
          <p className="text-xs text-muted-foreground">Número completo com código do país (sem +)</p>
        </div>
        <div className="space-y-2">
          <Label>WhatsApp Display</Label>
          <Input
            value={section.content?.whatsappDisplay || ""}
            onChange={(e) => updateContentField(section.id, "whatsappDisplay", e.target.value)}
            placeholder="(61) 99243-0090"
          />
          <p className="text-xs text-muted-foreground">Formato de exibição para usuários</p>
        </div>
      </div>

      <Separator />

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Email de Contato</Label>
          <Input
            type="email"
            value={section.content?.email || ""}
            onChange={(e) => updateContentField(section.id, "email", e.target.value)}
            placeholder="contato@nello.one"
          />
        </div>
        <div className="space-y-2">
          <Label>LinkedIn (opcional)</Label>
          <Input
            value={section.content?.linkedin || ""}
            onChange={(e) => updateContentField(section.id, "linkedin", e.target.value)}
            placeholder="https://linkedin.com/company/nello-identity"
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label>Texto do Rodapé</Label>
        <Input
          value={section.content?.footerText || ""}
          onChange={(e) => updateContentField(section.id, "footerText", e.target.value)}
          placeholder="NELLO IDENTITY • O caminho começa dentro."
        />
      </div>

      {renderSaveButton(section)}
    </div>
  );

  // ========== PRICING SECTION ==========
  const handleUpdateStripePrice = async (currency: 'brl' | 'usd' | 'eur', newPrice: number, originalPrice: number) => {
    setUpdatingStripe(true);
    try {
      const productId = "prod_TbYEfQotxBF6yQ"; // NELLO ONE Jornada Completa
      const currentPriceId = bundlePrices[currency].priceId;
      
      const { data, error } = await supabase.functions.invoke('update-stripe-price', {
        body: {
          priceId: currentPriceId,
          newAmount: newPrice,
          originalPrice: originalPrice,
          currency: currency.toUpperCase(),
          productId,
          description: `Jornada Identity - ${currency.toUpperCase()}`,
        },
      });

      if (error) throw error;
      
      toast.success(`Preço ${currency.toUpperCase()} atualizado no Stripe!`, {
        description: `Novo Price ID: ${data.newPriceId}. Atualize o priceConfig.ts com o novo ID.`,
      });

      return data.newPriceId;
    } catch (error: any) {
      console.error("Error updating Stripe price:", error);
      toast.error("Erro ao atualizar preço no Stripe", {
        description: error.message,
      });
    } finally {
      setUpdatingStripe(false);
    }
  };

  const renderPricingFields = (section: ContentSection) => (
    <div className="space-y-6">
      <Alert className="bg-gold/5 border-gold/20">
        <CreditCard className="h-4 w-4 text-gold" />
        <AlertDescription>
          <strong>Atenção:</strong> Ao alterar preços, o sistema criará novos Price IDs no Stripe. 
          Você precisará atualizar o arquivo <code className="bg-background px-1 rounded">src/lib/priceConfig.ts</code> com os novos IDs.
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Título da Seção</Label>
          <Input
            value={section.title || ""}
            onChange={(e) => updateSection(section.id, "title", e.target.value)}
            placeholder="Inicie a Jornada Identity"
          />
        </div>
        <div className="space-y-2">
          <Label>Subtítulo</Label>
          <Input
            value={section.content?.subtitle || ""}
            onChange={(e) => updateContentField(section.id, "subtitle", e.target.value)}
            placeholder="Tudo que você precisa para se libertar do que não é você"
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <Label className="text-base font-semibold flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          Preços por Moeda
        </Label>

        <div className="grid md:grid-cols-3 gap-4">
          {/* BRL Pricing */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Badge variant="outline">BRL</Badge>
                Brasil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label className="text-xs">Preço Original (De)</Label>
                <Input
                  type="number"
                  value={section.content?.brl?.original || 597}
                  onChange={(e) => updateContentField(section.id, "brl", {
                    ...section.content?.brl,
                    original: Number(e.target.value),
                  })}
                  placeholder="597"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Preço Atual (Por)</Label>
                <Input
                  type="number"
                  value={section.content?.brl?.price || 297}
                  onChange={(e) => updateContentField(section.id, "brl", {
                    ...section.content?.brl,
                    price: Number(e.target.value),
                  })}
                  placeholder="297"
                />
              </div>
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                disabled={updatingStripe}
                onClick={() => handleUpdateStripePrice(
                  'brl',
                  section.content?.brl?.price || 297,
                  section.content?.brl?.original || 597
                )}
              >
                {updatingStripe ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
                Atualizar no Stripe
              </Button>
            </CardContent>
          </Card>

          {/* USD Pricing */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Badge variant="outline">USD</Badge>
                Internacional
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label className="text-xs">Preço Original (De)</Label>
                <Input
                  type="number"
                  value={section.content?.usd?.original || 147}
                  onChange={(e) => updateContentField(section.id, "usd", {
                    ...section.content?.usd,
                    original: Number(e.target.value),
                  })}
                  placeholder="147"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Preço Atual (Por)</Label>
                <Input
                  type="number"
                  value={section.content?.usd?.price || 97}
                  onChange={(e) => updateContentField(section.id, "usd", {
                    ...section.content?.usd,
                    price: Number(e.target.value),
                  })}
                  placeholder="97"
                />
              </div>
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                disabled={updatingStripe}
                onClick={() => handleUpdateStripePrice(
                  'usd',
                  section.content?.usd?.price || 97,
                  section.content?.usd?.original || 147
                )}
              >
                {updatingStripe ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
                Atualizar no Stripe
              </Button>
            </CardContent>
          </Card>

          {/* EUR Pricing */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Badge variant="outline">EUR</Badge>
                Europa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label className="text-xs">Preço Original (De)</Label>
                <Input
                  type="number"
                  value={section.content?.eur?.original || 184}
                  onChange={(e) => updateContentField(section.id, "eur", {
                    ...section.content?.eur,
                    original: Number(e.target.value),
                  })}
                  placeholder="184"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Preço Atual (Por)</Label>
                <Input
                  type="number"
                  value={section.content?.eur?.price || 89}
                  onChange={(e) => updateContentField(section.id, "eur", {
                    ...section.content?.eur,
                    price: Number(e.target.value),
                  })}
                  placeholder="89"
                />
              </div>
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                disabled={updatingStripe}
                onClick={() => handleUpdateStripePrice(
                  'eur',
                  section.content?.eur?.price || 89,
                  section.content?.eur?.original || 184
                )}
              >
                {updatingStripe ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
                Atualizar no Stripe
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <Label className="text-base font-semibold">Benefícios da Jornada</Label>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Lista de benefícios exibida na seção de preços</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newBenefits = [...(section.content?.benefits || []), ""];
              updateContentField(section.id, "benefits", newBenefits);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar
          </Button>
        </div>
        <div className="space-y-2">
          {(section.content?.benefits || []).map((benefit: string, i: number) => (
            <div key={i} className="flex gap-2">
              <Input
                value={benefit}
                onChange={(e) => {
                  const newBenefits = [...(section.content?.benefits || [])];
                  newBenefits[i] = e.target.value;
                  updateContentField(section.id, "benefits", newBenefits);
                }}
                placeholder={`Benefício ${i + 1}`}
              />
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive"
                onClick={() => {
                  const newBenefits = (section.content?.benefits || []).filter((_: any, idx: number) => idx !== i);
                  updateContentField(section.id, "benefits", newBenefits);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Texto do CTA</Label>
          <Input
            value={section.content?.ctaText || ""}
            onChange={(e) => updateContentField(section.id, "ctaText", e.target.value)}
            placeholder="Revelar meu Código da Essência"
          />
        </div>
        <div className="space-y-2">
          <Label>Texto Abaixo do CTA</Label>
          <Input
            value={section.content?.ctaSubtext || ""}
            onChange={(e) => updateContentField(section.id, "ctaSubtext", e.target.value)}
            placeholder="Acesso vitalício à sua jornada de identidade."
          />
        </div>
      </div>

      {renderSaveButton(section)}
    </div>
  );

  const renderSectionContent = (section: ContentSection) => {
    switch (section.section) {
      case "hero":
        return renderHeroFields(section);
      case "about":
        return renderAboutFields(section);
      case "for_who":
        return renderForWhoFields(section);
      case "testimonials":
        return renderTestimonialsFields(section);
      case "faq":
        return renderFaqFields(section);
      case "final_cta":
        return renderFinalCtaFields(section);
      case "social_media":
        return renderSocialMediaFields(section);
      case "pricing":
        return renderPricingFields(section);
      default:
        return (
          <div className="text-center py-8 text-muted-foreground">
            Editor não disponível para esta seção
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const availableSections = sections.filter(s => SECTION_CONFIG[s.section]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <FileEdit className="w-8 h-8" />
            Landing Page
          </h2>
          <p className="text-muted-foreground mt-1">Gerencie todo o conteúdo da página inicial do Identity</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchContent}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href="/" target="_blank" rel="noopener noreferrer">
              <Eye className="w-4 h-4 mr-2" />
              Ver Site
            </a>
          </Button>
        </div>
      </div>

      {/* Alert */}
      <Alert className="bg-gold/5 border-gold/20">
        <Info className="h-4 w-4 text-gold" />
        <AlertDescription>
          Todas as alterações salvas aqui serão refletidas na landing page pública. 
          <strong> Recarregue a página inicial</strong> após salvar para ver as mudanças.
        </AlertDescription>
      </Alert>

      {/* Tabs */}
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
