import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Download, Sun, Moon, Upload, Languages, Save, CalendarDays, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import { supabase } from "@/integrations/supabase/client";
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
  AICopySuggestion,
  PRODUCT_CONFIGS,
  FORMAT_DIMENSIONS,
  TYPE_LABELS,
  SocialMediaPost,
} from "./post-factory";

export const AdminPostFactory = () => {
  // Product & Card state
  const [product, setProduct] = useState<NelloProduct>("identity");
  const [cardFormat, setCardFormat] = useState<CardFormat>("instagram-feed");
  const [cardType, setCardType] = useState<CardType>("institutional");
  const [cardTheme, setCardTheme] = useState<CardTheme>("light");
  const [cardLanguage, setCardLanguage] = useState<CardLanguage>("pt");
  
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
  
  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      
      // Copy caption to clipboard
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading text-foreground mb-2">Fábrica de Posts</h2>
        <p className="text-muted-foreground">Crie conteúdo para todos os produtos Nello em um só lugar</p>
      </div>

      {/* Product Selector */}
      <ProductSelector value={product} onChange={setProduct} />

      <Tabs defaultValue="editor" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="calendar">Calendário</TabsTrigger>
          <TabsTrigger value="gallery">Galeria</TabsTrigger>
        </TabsList>

        {/* EDITOR TAB */}
        <TabsContent value="editor" className="space-y-6">
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
        </TabsContent>

        {/* CALENDAR TAB */}
        <TabsContent value="calendar">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PostCalendar onPostClick={handleEditPost} />
            <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground text-center">Selecione uma data no calendário para ver os posts agendados</p></CardContent></Card>
          </div>
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
