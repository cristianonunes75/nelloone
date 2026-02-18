import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Download, Sun, Moon, Upload, Save, CalendarDays, Copy, Check, Shield, Loader2, MessageSquareHeart } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import { supabase } from "@/integrations/supabase/client";
import { NelloSymbol, NelloSymbolN, NelloSymbolOne } from "@/components/brand/NelloSymbol";
import { NelloWordmark } from "@/components/brand/NelloWordmark";
import {
  ProductSelector,
  AIGeneratorPanel,
  PostCalendar,
  PostGallery,
  ScheduleDialog,
  ProductCardTemplate,
  NelloProduct,
  CardFormat,
  CardType,
  CardTheme,
  CardLanguage,
  CardLogoVariant,
  AICopySuggestion,
  PRODUCT_CONFIGS,
  FORMAT_DIMENSIONS,
  TYPE_LABELS,
  LOGO_OPTIONS,
  SocialMediaPost,
} from "./post-factory";
import { AIImageGenerator } from "./post-factory/AIImageGenerator";
import { useAdminPermissions } from "@/hooks/useAdminPermissions";

// Component protected by AdminGuard at route level - can_manage_settings
export const AdminPostFactory = () => {
  const { hasPermission, isSuperAdmin, isLoading: permLoading } = useAdminPermissions();
  // Symbol state for brand identity
  const [activeSymbol, setActiveSymbol] = useState<"portal" | "n" | "one">("one");
  
  // Product & Card state
  const [product, setProduct] = useState<NelloProduct>("identity");
  const [cardFormat, setCardFormat] = useState<CardFormat>("instagram-feed");
  const [cardType, setCardType] = useState<CardType>("institutional");
  const [cardTheme, setCardTheme] = useState<CardTheme>("light");
  const [cardLanguage, setCardLanguage] = useState<CardLanguage>("pt");
  const [cardLogo, setCardLogo] = useState<CardLogoVariant>("nello-one-identity");
  
  // Content state
  const [cardTitle, setCardTitle] = useState("Descubra quem você é");
  const [cardSubtitle, setCardSubtitle] = useState("Autoconhecimento");
  const [cardContent, setCardContent] = useState("O caminho começa dentro. Descubra sua essência através de uma jornada guiada por ciência e propósito.");
  const [cardScripture, setCardScripture] = useState("Conhecereis a verdade, e a verdade vos libertará");
  const [cardScriptureRef, setCardScriptureRef] = useState("João 8:32");
  const [cardCta, setCardCta] = useState("Começar agora");
  const [postCaption, setPostCaption] = useState("");
  
  // Image state
  const [useImage, setUseImage] = useState(false);
  const [cardImage, setCardImage] = useState<string | null>(null);
  const [imageOpacity, setImageOpacity] = useState(0.4);
  
  // UI state
  const [captionCopied, setCaptionCopied] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Testimonial state
  const [testimonials, setTestimonials] = useState<Array<{ id: string; display_name: string; content: string }>>([]);
  const [selectedTestimonialId, setSelectedTestimonialId] = useState<string>("none");
  const [testimonialAuthor, setTestimonialAuthor] = useState("");
  
  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch approved testimonials
  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data } = await supabase
        .from("testimonials")
        .select("id, display_name, content")
        .eq("consent_given", true)
        .eq("status", "approved")
        .order("created_at", { ascending: false });
      if (data) setTestimonials(data);
    };
    fetchTestimonials();
  }, []);

  const renderSymbol = (variant: "default" | "light" | "dark" | "gradient", size: number) => {
    const props = { variant, size };
    switch (activeSymbol) {
      case "portal": return <NelloSymbol {...props} />;
      case "n": return <NelloSymbolN {...props} />;
      case "one": return <NelloSymbolOne {...props} />;
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCardImage(reader.result as string);
        setUseImage(true);
        toast.success("Imagem carregada!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSuggestionSelect = (suggestion: AICopySuggestion) => {
    if (suggestion.title) setCardTitle(suggestion.title);
    if (suggestion.subtitle) setCardSubtitle(suggestion.subtitle);
    if (suggestion.content) setCardContent(suggestion.content);
    if (suggestion.scripture) setCardScripture(suggestion.scripture);
    if (suggestion.scriptureRef) setCardScriptureRef(suggestion.scriptureRef);
    if (suggestion.cta) setCardCta(suggestion.cta);
    if (suggestion.caption) setPostCaption(suggestion.caption);
  };

  const downloadCard = async () => {
    if (!cardRef.current) return;
    
    try {
      const dimensions = FORMAT_DIMENSIONS[cardFormat];
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        width: dimensions.width,
        height: dimensions.height,
        useCORS: true,
      });
      
      const link = document.createElement("a");
      link.download = `${product}-${cardType}-${cardFormat}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      
      if (postCaption) {
        await navigator.clipboard.writeText(postCaption);
        toast.success("Imagem baixada e legenda copiada!");
      } else {
        toast.success("Imagem baixada!");
      }
    } catch (error) {
      toast.error("Erro ao baixar imagem");
    }
  };

  const copyCaption = async () => {
    if (!postCaption) return;
    await navigator.clipboard.writeText(postCaption);
    setCaptionCopied(true);
    toast.success("Legenda copiada!");
    setTimeout(() => setCaptionCopied(false), 2000);
  };

  const savePost = async (status: 'draft' | 'scheduled' = 'draft', scheduledAt?: Date, platforms?: string[]) => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const postData = {
        product,
        content_type: cardType,
        format: cardFormat,
        copy: postCaption || cardContent,
        title: cardTitle,
        subtitle: cardSubtitle,
        scripture: cardScripture,
        scripture_ref: cardScriptureRef,
        cta_text: cardCta,
        theme: cardTheme,
        background_image_url: useImage ? cardImage : null,
        image_opacity: imageOpacity,
        status,
        scheduled_at: scheduledAt?.toISOString(),
        platforms: platforms || [],
        ai_generated: false,
        created_by: user?.id,
      };

      const { error } = await supabase.from("social_media_posts").insert(postData);
      
      if (error) throw error;
      toast.success(status === 'scheduled' ? "Post agendado!" : "Post salvo como rascunho!");
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error("Erro ao salvar post");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSchedule = (date: Date, platforms: string[]) => {
    savePost('scheduled', date, platforms);
  };

  const handleEditPost = (post: SocialMediaPost) => {
    setProduct(post.product);
    setCardType(post.content_type as CardType);
    setCardFormat(post.format as CardFormat);
    setCardTheme(post.theme as CardTheme);
    if (post.title) setCardTitle(post.title);
    if (post.subtitle) setCardSubtitle(post.subtitle);
    if (post.copy) setPostCaption(post.copy);
    if (post.scripture) setCardScripture(post.scripture);
    if (post.scripture_ref) setCardScriptureRef(post.scripture_ref);
    if (post.cta_text) setCardCta(post.cta_text);
    if (post.background_image_url) {
      setCardImage(post.background_image_url);
      setUseImage(true);
    }
    toast.success("Post carregado para edição");
  };

  const handleDuplicatePost = (post: SocialMediaPost) => {
    handleEditPost(post);
    toast.success("Post duplicado - edite e salve como novo");
  };

  // Loading state
  if (permLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Component level guard (after all hooks)
  if (!hasPermission('can_manage_settings') && !isSuperAdmin) {
    return (
      <Card className="p-8 text-center max-w-md mx-auto mt-12">
        <Shield className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Acesso Restrito</h3>
        <p className="text-muted-foreground text-sm">
          Identidade visual requer permissão de configurações.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading text-foreground mb-2">Identidade Visual & Posts</h2>
        <p className="text-muted-foreground">Logomarcas, símbolos e criação de conteúdo para redes sociais</p>
      </div>

      <Tabs defaultValue="posts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 max-w-lg">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="logos">Logos</TabsTrigger>
          <TabsTrigger value="symbols">Símbolos</TabsTrigger>
          <TabsTrigger value="gallery">Galeria</TabsTrigger>
        </TabsList>

        {/* POSTS TAB (former Editor + Calendar) */}
        <TabsContent value="posts" className="space-y-6">
          <ProductSelector value={product} onChange={setProduct} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Editor Panel */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Configurações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label className="text-xs">Formato</Label>
                    <Select value={cardFormat} onValueChange={(v) => setCardFormat(v as CardFormat)}>
                      <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instagram-feed">Feed 1:1</SelectItem>
                        <SelectItem value="instagram-portrait">Retrato 4:5</SelectItem>
                        <SelectItem value="stories">Stories</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Tipo</Label>
                    <Select value={cardType} onValueChange={(v) => setCardType(v as CardType)}>
                      <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {PRODUCT_CONFIGS[product].contentTypes.map(type => (
                          <SelectItem key={type} value={type}>{TYPE_LABELS[cardLanguage][type]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Idioma</Label>
                    <Select value={cardLanguage} onValueChange={(v) => setCardLanguage(v as CardLanguage)}>
                      <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt">PT</SelectItem>
                        <SelectItem value="en">EN</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-xs">Tema</Label>
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4" />
                    <Switch checked={cardTheme === "dark"} onCheckedChange={(c) => setCardTheme(c ? "dark" : "light")} />
                    <Moon className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <Label className="text-xs">Logo</Label>
                  <Select value={cardLogo} onValueChange={(v) => setCardLogo(v as CardLogoVariant)}>
                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {LOGO_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Imagem de fundo</Label>
                    <Switch checked={useImage} onCheckedChange={setUseImage} />
                  </div>
                  {useImage && (
                    <>
                      <Button variant="outline" size="sm" className="w-full" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="w-4 h-4 mr-2" />Upload
                      </Button>
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      <div>
                        <Label className="text-xs">Opacidade: {Math.round(imageOpacity * 100)}%</Label>
                        <Slider value={[imageOpacity]} onValueChange={([v]) => setImageOpacity(v)} min={0.1} max={0.8} step={0.05} />
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-3 pt-2 border-t">
                  {cardType === "testimonial" && (
                    <div className="space-y-2">
                      <Label className="text-xs flex items-center gap-1">
                        <MessageSquareHeart className="w-3 h-3" />
                        Depoimento aprovado
                      </Label>
                      <Select 
                        value={selectedTestimonialId} 
                        onValueChange={(v) => {
                          setSelectedTestimonialId(v);
                          const t = testimonials.find(t => t.id === v);
                          if (t) {
                            setCardContent(t.content);
                            setTestimonialAuthor(t.display_name);
                          }
                        }}
                      >
                        <SelectTrigger className="h-9"><SelectValue placeholder="Selecionar depoimento" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Selecionar depoimento...</SelectItem>
                          {testimonials.map(t => (
                            <SelectItem key={t.id} value={t.id}>
                              {t.display_name} — {t.content.slice(0, 50)}…
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div><Label className="text-xs">Autor</Label><Input value={testimonialAuthor} onChange={(e) => setTestimonialAuthor(e.target.value)} /></div>
                    </div>
                  )}
                  <div><Label className="text-xs">Título</Label><Input value={cardTitle} onChange={(e) => setCardTitle(e.target.value)} /></div>
                  <div><Label className="text-xs">Subtítulo</Label><Input value={cardSubtitle} onChange={(e) => setCardSubtitle(e.target.value)} /></div>
                  <div><Label className="text-xs">Conteúdo</Label><Textarea value={cardContent} onChange={(e) => setCardContent(e.target.value)} rows={3} /></div>
                  {cardType === "quote" && (
                    <>
                      <div><Label className="text-xs">Versículo</Label><Input value={cardScripture} onChange={(e) => setCardScripture(e.target.value)} /></div>
                      <div><Label className="text-xs">Referência</Label><Input value={cardScriptureRef} onChange={(e) => setCardScriptureRef(e.target.value)} /></div>
                    </>
                  )}
                  {(cardType === "cta" || cardType === "feature") && (
                    <div><Label className="text-xs">CTA</Label><Input value={cardCta} onChange={(e) => setCardCta(e.target.value)} /></div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Preview Panel */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Preview</CardTitle></CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                <div ref={cardRef}>
                  <ProductCardTemplate
                    product={product}
                    format={cardFormat}
                    type={cardType}
                    theme={cardTheme}
                    title={cardTitle}
                    subtitle={cardSubtitle}
                    content={cardContent}
                    scripture={cardScripture}
                    scriptureRef={cardScriptureRef}
                    ctaText={cardCta}
                    backgroundImage={useImage ? cardImage || undefined : undefined}
                    imageOpacity={imageOpacity}
                    logoVariant={cardLogo}
                    testimonialAuthor={testimonialAuthor}
                  />
                </div>
                <div className="flex gap-2 w-full">
                  <Button onClick={downloadCard} className="flex-1"><Download className="w-4 h-4 mr-2" />Baixar</Button>
                  <Button variant="outline" onClick={() => savePost('draft')} disabled={isSaving}><Save className="w-4 h-4" /></Button>
                  <Button variant="outline" onClick={() => setShowScheduleDialog(true)}><CalendarDays className="w-4 h-4" /></Button>
                </div>
              </CardContent>
            </Card>

            {/* AI & Caption Panel */}
            <div className="space-y-4">
              <AIGeneratorPanel product={product} cardType={cardType} format={cardFormat} language={cardLanguage} onSuggestionSelect={handleSuggestionSelect} />
              
              <AIImageGenerator onImageGenerated={(url) => { setCardImage(url); setUseImage(true); }} />
              
              <Card>
                <CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Legenda</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <Textarea value={postCaption} onChange={(e) => setPostCaption(e.target.value)} rows={6} placeholder="Cole ou gere a legenda com IA..." />
                  <Button variant="outline" className="w-full" onClick={copyCaption} disabled={!postCaption}>
                    {captionCopied ? <><Check className="w-4 h-4 mr-2" />Copiado!</> : <><Copy className="w-4 h-4 mr-2" />Copiar Legenda</>}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Calendar Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6 border-t">
            <PostCalendar onPostClick={handleEditPost} />
            <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground text-center">Selecione uma data no calendário para ver os posts agendados</p></CardContent></Card>
          </div>
        </TabsContent>

        {/* LOGOS TAB - ECOSSISTEMA COMPLETO */}
        <TabsContent value="logos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Wordmarks do Ecossistema</CardTitle>
              <p className="text-sm text-muted-foreground">Todas as logos dos produtos Nello</p>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* NELLO IDENTITY */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-sans font-medium">NELLO IDENTITY</h4>
                    <p className="text-sm text-muted-foreground">Código da Essência - Marca principal</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-6 rounded-lg bg-background border flex items-center justify-center">
                    <NelloWordmark variant="nello-one-identity" colorVariant="dark" size="md" />
                  </div>
                  <div className="p-6 rounded-lg bg-ink-deep flex items-center justify-center">
                    <NelloWordmark variant="nello-one-identity" colorVariant="light" size="md" />
                  </div>
                  <div className="p-6 rounded-lg bg-white border flex items-center justify-center">
                    <NelloWordmark variant="nello-one-identity" colorVariant="mono-dark" size="md" />
                  </div>
                  <div className="p-6 rounded-lg bg-black flex items-center justify-center">
                    <NelloWordmark variant="nello-one-identity" colorVariant="mono-light" size="md" />
                  </div>
                </div>
              </div>

              {/* NELLO LIFE */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-sans font-medium">NELLO LIFE</h4>
                  <p className="text-sm text-muted-foreground">Jornada de Vida</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-6 rounded-lg bg-background border flex items-center justify-center">
                    <NelloWordmark variant="nello-one-life" colorVariant="dark" size="md" />
                  </div>
                  <div className="p-6 rounded-lg bg-ink-deep flex items-center justify-center">
                    <NelloWordmark variant="nello-one-life" colorVariant="light" size="md" />
                  </div>
                  <div className="p-6 rounded-lg bg-white border flex items-center justify-center">
                    <NelloWordmark variant="nello-one-life" colorVariant="mono-dark" size="md" />
                  </div>
                  <div className="p-6 rounded-lg bg-black flex items-center justify-center">
                    <NelloWordmark variant="nello-one-life" colorVariant="mono-light" size="md" />
                  </div>
                </div>
              </div>

              {/* NELLO FLOW */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-sans font-medium">NELLO FLOW</h4>
                  <p className="text-sm text-muted-foreground">Inteligência Adaptativa</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-6 rounded-lg bg-background border flex items-center justify-center">
                    <NelloWordmark variant="nello-one-flow" colorVariant="dark" size="md" />
                  </div>
                  <div className="p-6 rounded-lg bg-ink-deep flex items-center justify-center">
                    <NelloWordmark variant="nello-one-flow" colorVariant="light" size="md" />
                  </div>
                  <div className="p-6 rounded-lg bg-white border flex items-center justify-center">
                    <NelloWordmark variant="nello-one-flow" colorVariant="mono-dark" size="md" />
                  </div>
                  <div className="p-6 rounded-lg bg-black flex items-center justify-center">
                    <NelloWordmark variant="nello-one-flow" colorVariant="mono-light" size="md" />
                  </div>
                </div>
              </div>

              {/* NELLO BUSINESS */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-sans font-medium">NELLO BUSINESS</h4>
                  <p className="text-sm text-muted-foreground">Inteligência Empresarial</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-6 rounded-lg bg-background border flex items-center justify-center">
                    <NelloWordmark variant="nello-one-business" colorVariant="dark" size="md" />
                  </div>
                  <div className="p-6 rounded-lg bg-ink-deep flex items-center justify-center">
                    <NelloWordmark variant="nello-one-business" colorVariant="light" size="md" />
                  </div>
                  <div className="p-6 rounded-lg bg-white border flex items-center justify-center">
                    <NelloWordmark variant="nello-one-business" colorVariant="mono-dark" size="md" />
                  </div>
                  <div className="p-6 rounded-lg bg-black flex items-center justify-center">
                    <NelloWordmark variant="nello-one-business" colorVariant="mono-light" size="md" />
                  </div>
                </div>
              </div>

              {/* NELLO PRAXIS */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-sans font-medium">NELLO PRAXIS</h4>
                  <p className="text-sm text-muted-foreground">Prática Integrada</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-6 rounded-lg bg-background border flex items-center justify-center">
                    <NelloWordmark variant="nello-one-praxis" colorVariant="dark" size="md" />
                  </div>
                  <div className="p-6 rounded-lg bg-ink-deep flex items-center justify-center">
                    <NelloWordmark variant="nello-one-praxis" colorVariant="light" size="md" />
                  </div>
                  <div className="p-6 rounded-lg bg-white border flex items-center justify-center">
                    <NelloWordmark variant="nello-one-praxis" colorVariant="mono-dark" size="md" />
                  </div>
                  <div className="p-6 rounded-lg bg-black flex items-center justify-center">
                    <NelloWordmark variant="nello-one-praxis" colorVariant="mono-light" size="md" />
                  </div>
                </div>
              </div>

              {/* Separador */}
              <div className="border-t pt-8">
                <h3 className="font-heading text-lg mb-6">Marcas Base</h3>
              </div>

              {/* NELLO ONE - Marca Mãe */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-sans font-medium">NELLO ONE</h4>
                  <p className="text-sm text-muted-foreground">Marca mãe institucional</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-6 rounded-lg bg-background border flex items-center justify-center">
                    <NelloWordmark variant="nello-one" colorVariant="dark" size="lg" />
                  </div>
                  <div className="p-6 rounded-lg bg-ink-deep flex items-center justify-center">
                    <NelloWordmark variant="nello-one" colorVariant="light" size="lg" />
                  </div>
                  <div className="p-6 rounded-lg bg-white border flex items-center justify-center">
                    <NelloWordmark variant="nello-one" colorVariant="mono-dark" size="lg" />
                  </div>
                  <div className="p-6 rounded-lg bg-black flex items-center justify-center">
                    <NelloWordmark variant="nello-one" colorVariant="mono-light" size="lg" />
                  </div>
                </div>
              </div>

              {/* Nello One Mixed */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-sans font-medium">Nello One</h4>
                  <p className="text-sm text-muted-foreground">Social, apresentações, materiais editoriais</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-6 rounded-lg bg-background border flex items-center justify-center">
                    <NelloWordmark variant="nello-one-mixed" colorVariant="dark" size="lg" />
                  </div>
                  <div className="p-6 rounded-lg bg-ink-deep flex items-center justify-center">
                    <NelloWordmark variant="nello-one-mixed" colorVariant="light" size="lg" />
                  </div>
                  <div className="p-6 rounded-lg bg-white border flex items-center justify-center">
                    <NelloWordmark variant="nello-one-mixed" colorVariant="mono-dark" size="lg" />
                  </div>
                  <div className="p-6 rounded-lg bg-black flex items-center justify-center">
                    <NelloWordmark variant="nello-one-mixed" colorVariant="mono-light" size="lg" />
                  </div>
                </div>
              </div>

              {/* NELLO Avatar */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-sans font-medium">NELLO</h4>
                  <p className="text-sm text-muted-foreground">Avatar, app, favicon</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-6 rounded-lg bg-background border flex items-center justify-center">
                    <NelloWordmark variant="nello" colorVariant="dark" size="lg" />
                  </div>
                  <div className="p-6 rounded-lg bg-ink-deep flex items-center justify-center">
                    <NelloWordmark variant="nello" colorVariant="light" size="lg" />
                  </div>
                  <div className="p-6 rounded-lg bg-white border flex items-center justify-center">
                    <NelloWordmark variant="nello" colorVariant="mono-dark" size="lg" />
                  </div>
                  <div className="p-6 rounded-lg bg-black flex items-center justify-center">
                    <NelloWordmark variant="nello" colorVariant="mono-light" size="lg" />
                  </div>
                </div>
              </div>

              {/* nello.one */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-sans font-medium">nello.one</h4>
                  <p className="text-sm text-muted-foreground">Técnico, rodapé, cards informativos</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-6 rounded-lg bg-background border flex items-center justify-center">
                    <NelloWordmark variant="nello-dot-one" colorVariant="dark" size="lg" />
                  </div>
                  <div className="p-6 rounded-lg bg-ink-deep flex items-center justify-center">
                    <NelloWordmark variant="nello-dot-one" colorVariant="light" size="lg" />
                  </div>
                  <div className="p-6 rounded-lg bg-white border flex items-center justify-center">
                    <NelloWordmark variant="nello-dot-one" colorVariant="mono-dark" size="lg" />
                  </div>
                  <div className="p-6 rounded-lg bg-black flex items-center justify-center">
                    <NelloWordmark variant="nello-dot-one" colorVariant="mono-light" size="lg" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SYMBOLS TAB */}
        <TabsContent value="symbols" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-heading">Símbolos da Marca</CardTitle>
                <Select value={activeSymbol} onValueChange={(v) => setActiveSymbol(v as typeof activeSymbol)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="portal">Portal</SelectItem>
                    <SelectItem value="n">N Geométrico</SelectItem>
                    <SelectItem value="one">Circle One</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-8 rounded-xl bg-background border flex items-center justify-center">
                    {renderSymbol("default", 80)}
                  </div>
                  <span className="text-xs text-muted-foreground">Padrão</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="p-8 rounded-xl bg-ink-deep flex items-center justify-center">
                    {renderSymbol("light", 80)}
                  </div>
                  <span className="text-xs text-muted-foreground">Claro</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="p-8 rounded-xl bg-white border flex items-center justify-center">
                    {renderSymbol("dark", 80)}
                  </div>
                  <span className="text-xs text-muted-foreground">Escuro</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="p-8 rounded-xl bg-gradient-to-br from-background to-secondary flex items-center justify-center">
                    {renderSymbol("gradient", 80)}
                  </div>
                  <span className="text-xs text-muted-foreground">Gradiente</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t">
                <h4 className="font-sans font-medium mb-4">Tamanhos</h4>
                <div className="flex items-end gap-6">
                  {[24, 32, 48, 64, 96].map((size) => (
                    <div key={size} className="flex flex-col items-center gap-2">
                      {renderSymbol("default", size)}
                      <span className="text-xs text-muted-foreground">{size}px</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* GALLERY TAB */}
        <TabsContent value="gallery">
          <PostGallery onEditPost={handleEditPost} onDuplicatePost={handleDuplicatePost} />
        </TabsContent>
      </Tabs>

      <ScheduleDialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog} onSchedule={handleSchedule} onDownload={downloadCard} />
    </div>
  );
};
