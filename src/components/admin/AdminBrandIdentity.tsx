import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Download, Sun, Moon, Sparkles, Loader2, Copy, Check } from "lucide-react";
import { NelloSymbol, NelloSymbolN, NelloSymbolOne } from "@/components/brand/NelloSymbol";
import { NelloWordmark } from "@/components/brand/NelloWordmark";
import { SocialCardPreview } from "@/components/brand/SocialCardTemplate";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import { supabase } from "@/integrations/supabase/client";

type CardFormat = "instagram-feed" | "instagram-portrait" | "stories" | "linkedin";
type CardType = "institutional" | "educational" | "quote" | "cta" | "feature";

export const AdminBrandIdentity = () => {
  const [activeSymbol, setActiveSymbol] = useState<"portal" | "n" | "one">("one");
  const [cardFormat, setCardFormat] = useState<CardFormat>("instagram-feed");
  const [cardType, setCardType] = useState<CardType>("institutional");
  const [cardTheme, setCardTheme] = useState<"light" | "dark">("light");
  const [cardTitle, setCardTitle] = useState("Descubra quem você é");
  const [cardSubtitle, setCardSubtitle] = useState("Autoconhecimento");
  const [cardContent, setCardContent] = useState("O caminho começa dentro. Descubra sua essência através de uma jornada guiada por ciência e propósito.");
  const [cardScripture, setCardScripture] = useState("Conhecereis a verdade, e a verdade vos libertará");
  const [cardScriptureRef, setCardScriptureRef] = useState("João 8:32");
  const [cardCta, setCardCta] = useState("Começar agora");
  const [postCaption, setPostCaption] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [captionCopied, setCaptionCopied] = useState(false);
  
  const cardRef = useRef<HTMLDivElement>(null);

  const generateNelloSuggestion = async () => {
    setIsGenerating(true);
    
    try {
      const typeDescriptions: Record<CardType, string> = {
        institutional: "Um card institucional sobre a marca NELLO ONE - plataforma de autoconhecimento cristão",
        educational: "Um card educativo sobre autoconhecimento, personalidade ou psicologia",
        quote: "Uma reflexão profunda sobre identidade, propósito ou autoconhecimento com passagem bíblica",
        cta: "Um card com chamada para ação convidando a pessoa a iniciar sua jornada de autoconhecimento",
        feature: "Um card destacando uma funcionalidade do NELLO ONE (testes de personalidade, Código da Essência, etc)"
      };

      const { data, error } = await supabase.functions.invoke("nello-brand-suggestion", {
        body: {
          cardType,
          typeDescription: typeDescriptions[cardType]
        }
      });

      if (error) throw error;

      if (data) {
        if (data.title) setCardTitle(data.title);
        if (data.subtitle) setCardSubtitle(data.subtitle);
        if (data.content) setCardContent(data.content);
        if (data.scripture) setCardScripture(data.scripture);
        if (data.scriptureRef) setCardScriptureRef(data.scriptureRef);
        if (data.cta) setCardCta(data.cta);
        if (data.caption) setPostCaption(data.caption);
        
        toast.success("Sugestão do Nello aplicada!");
      }
    } catch (error) {
      console.error("Erro ao gerar sugestão:", error);
      toast.error("Erro ao gerar sugestão. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadElement = async (element: HTMLElement | null, filename: string) => {
    if (!element) return;
    
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: null,
        scale: 2
      });
      
      const link = document.createElement("a");
      link.download = `${filename}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      
      toast.success("Download iniciado");
    } catch (error) {
      toast.error("Erro ao gerar imagem");
    }
  };

  const renderSymbol = (variant: "default" | "light" | "dark" | "gradient", size: number) => {
    const props = { variant, size };
    switch (activeSymbol) {
      case "portal": return <NelloSymbol {...props} />;
      case "n": return <NelloSymbolN {...props} />;
      case "one": return <NelloSymbolOne {...props} />;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-heading text-foreground mb-2">Identidade Visual</h2>
        <p className="text-muted-foreground font-sans">
          Logomarcas, símbolos e templates para redes sociais
        </p>
      </div>

      <Tabs defaultValue="logos" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="logos">Logos</TabsTrigger>
          <TabsTrigger value="symbols">Símbolos</TabsTrigger>
          <TabsTrigger value="cards">Cards Sociais</TabsTrigger>
        </TabsList>

        {/* LOGOS TAB */}
        <TabsContent value="logos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Wordmarks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* NELLO ONE - Institucional */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-sans font-medium">NELLO ONE</h4>
                    <p className="text-sm text-muted-foreground">Institucional, produto, header</p>
                  </div>
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

              {/* Nello One - Social/Editorial */}
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

              {/* NELLO - Avatar */}
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

              {/* nello.one - Technical */}
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

        {/* SOCIAL CARDS TAB */}
        <TabsContent value="cards" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Editor Panel */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="font-heading">Editor de Cards</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Formato</Label>
                    <Select value={cardFormat} onValueChange={(v) => setCardFormat(v as CardFormat)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instagram-feed">Feed 1:1</SelectItem>
                        <SelectItem value="instagram-portrait">Portrait 4:5</SelectItem>
                        <SelectItem value="stories">Stories 9:16</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Tipo</Label>
                    <Select value={cardType} onValueChange={(v) => setCardType(v as CardType)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="institutional">Institucional</SelectItem>
                        <SelectItem value="educational">Educativo</SelectItem>
                        <SelectItem value="quote">Frase/Reflexão</SelectItem>
                        <SelectItem value="cta">Chamada p/ Ação</SelectItem>
                        <SelectItem value="feature">Funcionalidade</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant={cardTheme === "light" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCardTheme("light")}
                    className="flex-1"
                  >
                    <Sun className="h-4 w-4 mr-1" /> Claro
                  </Button>
                  <Button
                    variant={cardTheme === "dark" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCardTheme("dark")}
                    className="flex-1"
                  >
                    <Moon className="h-4 w-4 mr-1" /> Escuro
                  </Button>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  {cardType !== "institutional" && (
                    <>
                      <div>
                        <Label className="text-xs">Título</Label>
                        <Input 
                          value={cardTitle} 
                          onChange={(e) => setCardTitle(e.target.value)}
                          placeholder="Título do card"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Subtítulo / Categoria</Label>
                        <Input 
                          value={cardSubtitle} 
                          onChange={(e) => setCardSubtitle(e.target.value)}
                          placeholder="Categoria"
                        />
                      </div>
                    </>
                  )}
                  
                  {cardType !== "institutional" && (
                    <div>
                      <Label className="text-xs">Conteúdo</Label>
                      <Textarea 
                        value={cardContent} 
                        onChange={(e) => setCardContent(e.target.value)}
                        placeholder="Texto principal"
                        rows={3}
                      />
                    </div>
                  )}

                  {cardType === "quote" && (
                    <>
                      <div>
                        <Label className="text-xs">Passagem Bíblica</Label>
                        <Input 
                          value={cardScripture} 
                          onChange={(e) => setCardScripture(e.target.value)}
                          placeholder="Texto bíblico"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Referência</Label>
                        <Input 
                          value={cardScriptureRef} 
                          onChange={(e) => setCardScriptureRef(e.target.value)}
                          placeholder="Ex: João 8:32"
                        />
                      </div>
                    </>
                  )}

                  {cardType === "cta" && (
                    <div>
                      <Label className="text-xs">Texto do Botão</Label>
                      <Input 
                        value={cardCta} 
                        onChange={(e) => setCardCta(e.target.value)}
                        placeholder="Call to action"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="outline"
                    className="flex-1"
                    onClick={generateNelloSuggestion}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    Sugestão do Nello
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={() => downloadElement(cardRef.current, `nello-${cardType}-${cardFormat}`)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Baixar PNG
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Preview Panel */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="font-heading">Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center p-4 bg-muted/30 rounded-lg min-h-[500px]">
                  <div ref={cardRef}>
                    <SocialCardPreview
                      format={cardFormat}
                      type={cardType}
                      theme={cardTheme}
                      title={cardTitle}
                      subtitle={cardSubtitle}
                      content={cardContent}
                      scripture={cardScripture}
                      scriptureRef={cardScriptureRef}
                      ctaText={cardCta}
                    />
                  </div>
                </div>

                {/* Caption Suggestion */}
                {postCaption && (
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs font-medium">Legenda sugerida para a postagem</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(postCaption);
                          setCaptionCopied(true);
                          toast.success("Legenda copiada!");
                          setTimeout(() => setCaptionCopied(false), 2000);
                        }}
                      >
                        {captionCopied ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{postCaption}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Card Examples Gallery */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Galeria de Exemplos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <SocialCardPreview
                  format="instagram-feed"
                  type="institutional"
                  theme="light"
                  subtitle="O caminho começa dentro"
                />
                <SocialCardPreview
                  format="instagram-feed"
                  type="institutional"
                  theme="dark"
                  subtitle="O caminho começa dentro"
                />
                <SocialCardPreview
                  format="instagram-feed"
                  type="quote"
                  theme="light"
                  content="Quem és tu? Esta é a pergunta que define o resto da tua vida."
                />
                <SocialCardPreview
                  format="instagram-feed"
                  type="educational"
                  theme="dark"
                  title="O que é o Código da Essência?"
                  subtitle="Autoconhecimento"
                  content="Um mapa profundo da sua personalidade baseado em ciência e propósito."
                />
                <SocialCardPreview
                  format="instagram-feed"
                  type="cta"
                  theme="light"
                  title="Comece sua jornada"
                  content="Descubra quem você realmente é."
                  ctaText="Iniciar grátis"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
