import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Copy, Check, Download, MessageCircle, Instagram, Linkedin, Image, FileText, Megaphone, Loader2 } from "lucide-react";

interface MarketingMaterial {
  id: string;
  title: string;
  description: string | null;
  type: string;
  category: string;
  content: string;
  file_name: string | null;
  sort_order: number;
}

interface AffiliateMarketingKitProps {
  affiliateLink: string;
}

const categoryConfig: Record<string, { label: string; icon: React.ElementType }> = {
  whatsapp: { label: "WhatsApp", icon: MessageCircle },
  instagram: { label: "Instagram", icon: Instagram },
  linkedin: { label: "LinkedIn", icon: Linkedin },
  banner: { label: "Banners", icon: Image },
  general: { label: "Geral", icon: Megaphone },
};

export const AffiliateMarketingKit = ({ affiliateLink }: AffiliateMarketingKitProps) => {
  const { toast } = useToast();
  const [materials, setMaterials] = useState<MarketingMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from("affiliate_marketing_materials")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setMaterials(data || []);
    } catch (error) {
      console.error("Error fetching materials:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyText = (id: string, text: string) => {
    const processed = text.replace(/\{LINK\}/g, affiliateLink);
    navigator.clipboard.writeText(processed);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast({ title: "Copiado!", description: "Texto copiado para a área de transferência." });
  };

  const downloadFile = async (url: string, fileName: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch {
      toast({ title: "Erro ao baixar", description: "Tente novamente.", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (materials.length === 0) return null;

  // Group by category
  const grouped = materials.reduce<Record<string, MarketingMaterial[]>>((acc, m) => {
    const cat = m.category || "general";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(m);
    return acc;
  }, {});

  return (
    <div className="space-y-4 pt-4 border-t border-border">
      <div className="flex items-center gap-2">
        <Megaphone className="w-4 h-4 text-primary" />
        <Label className="text-sm font-medium">Kit de Divulgação</Label>
      </div>
      <p className="text-xs text-muted-foreground">
        Copie os textos prontos ou baixe os materiais. Seu link já é inserido automaticamente!
      </p>

      {Object.entries(grouped).map(([category, items]) => {
        const config = categoryConfig[category] || categoryConfig.general;
        const Icon = config.icon;

        return (
          <div key={category} className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
              <Icon className="w-3.5 h-3.5" />
              {config.label}
            </div>

            <div className="space-y-2">
              {items.map((material) => (
                <div key={material.id} className="bg-background/50 rounded-lg p-3 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{material.title}</p>
                      {material.description && (
                        <p className="text-xs text-muted-foreground">{material.description}</p>
                      )}
                    </div>

                    {material.type === "copy" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="shrink-0"
                        onClick={() => copyText(material.id, material.content)}
                      >
                        {copiedId === material.id ? (
                          <Check className="w-3.5 h-3.5 mr-1" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 mr-1" />
                        )}
                        {copiedId === material.id ? "Copiado" : "Copiar"}
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="shrink-0"
                        onClick={() => downloadFile(material.content, material.file_name || material.title)}
                      >
                        <Download className="w-3.5 h-3.5 mr-1" />
                        Baixar
                      </Button>
                    )}
                  </div>

                  {material.type === "copy" && (
                    <div className="bg-muted/50 rounded p-2 text-xs text-muted-foreground whitespace-pre-wrap break-words max-h-32 overflow-y-auto">
                      {material.content.replace(/\{LINK\}/g, affiliateLink)}
                    </div>
                  )}

                  {material.type === "image" && (
                    <img
                      src={material.content}
                      alt={material.title}
                      className="rounded-md max-h-40 w-full object-contain bg-muted/30"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
