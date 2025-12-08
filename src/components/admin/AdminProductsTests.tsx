import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Package, FileText, DollarSign, CheckCircle, X } from "lucide-react";
import { testPrices, bundlePrices } from "@/lib/priceConfig";

interface Test {
  id: string;
  name: string;
  type: string;
  price_brl: number | null;
  is_free: boolean;
  active: boolean;
  questions_count: number;
  estimated_minutes: number;
  stripe_price_id: string | null;
}

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  active: boolean;
}

const PRODUCTS = [
  { 
    slug: "jornada_completa", 
    name: "Jornada Completa", 
    type: "bundle",
    brl: bundlePrices.brl.price,
    usd: bundlePrices.usd.price,
    eur: bundlePrices.eur.price,
    active: true,
  },
  { 
    slug: "codigo_da_essencia", 
    name: "Código da Essência", 
    type: "premium",
    brl: testPrices.codigo_da_essencia?.brl.price || 397,
    usd: testPrices.codigo_da_essencia?.usd.price || 97,
    eur: testPrices.codigo_da_essencia?.eur.price || 97,
    active: true,
  },
];

const TEST_SLUGS_MAP: Record<string, string> = {
  arquetipos_proposito: "arquetipos_proposito",
  arquetipos: "arquetipos_proposito",
  disc: "disc",
  mbti: "nello16",
  eneagrama: "eneagrama",
  temperamentos: "temperamentos",
  linguagens_amor: "estilos_conexao",
  inteligencias_multiplas: "inteligencias_multiplas",
};

export const AdminProductsTests = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [testsRes, plansRes] = await Promise.all([
        supabase.from("tests").select("*").eq("language", "pt").order("created_at"),
        supabase.from("pricing_plans").select("id, name, price, active"),
      ]);

      if (testsRes.error) throw testsRes.error;
      setTests(testsRes.data || []);
      setPlans(plansRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  const getPriceInfo = (testType: string) => {
    const slug = TEST_SLUGS_MAP[testType] || testType;
    const price = testPrices[slug];
    if (!price) return null;
    return {
      brl: price.brl,
      usd: price.usd,
      eur: price.eur,
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 max-w-6xl">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight">Produtos & Testes</h1>
        <p className="text-muted-foreground text-xs md:text-sm">Catálogo de produtos e testes do sistema</p>
      </div>

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Produtos</TabsTrigger>
          <TabsTrigger value="tests">Testes</TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-4">
          <div className="grid gap-4">
            {PRODUCTS.map((product) => (
              <Card key={product.slug} className="border-border/50">
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {product.type === "bundle" ? (
                          <Package className="w-5 h-5 text-primary" />
                        ) : (
                          <FileText className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{product.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {product.type === "bundle" ? "Bundle" : "Premium"}
                          </Badge>
                          {product.active ? (
                            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">Ativo</Badge>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground text-xs">Inativo</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">Slug: {product.slug}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <div className="bg-muted/50 px-3 py-1.5 rounded-lg">
                        <span className="text-muted-foreground">BRL:</span>
                        <span className="ml-1 font-medium">R$ {product.brl}</span>
                      </div>
                      <div className="bg-muted/50 px-3 py-1.5 rounded-lg">
                        <span className="text-muted-foreground">USD:</span>
                        <span className="ml-1 font-medium">${product.usd}</span>
                      </div>
                      <div className="bg-muted/50 px-3 py-1.5 rounded-lg">
                        <span className="text-muted-foreground">EUR:</span>
                        <span className="ml-1 font-medium">€{product.eur}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tests Tab */}
        <TabsContent value="tests" className="space-y-4">
          <div className="grid gap-3">
            {tests.filter(t => t.type !== 'solis').map((test) => {
              const priceInfo = getPriceInfo(test.type);
              const journeySlug = TEST_SLUGS_MAP[test.type] || test.type;
              
              return (
                <Card key={test.id} className={`border-border/50 ${!test.active ? "opacity-50" : ""}`}>
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${test.active ? 'bg-emerald-500' : 'bg-muted'}`} />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-sm">{test.name}</h3>
                            {test.is_free && <Badge variant="outline" className="text-xs">Grátis</Badge>}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {test.questions_count} perguntas • {test.estimated_minutes} min • {journeySlug}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        {priceInfo && !test.is_free && (
                          <>
                            <span className="bg-muted/50 px-2 py-1 rounded">R$ {priceInfo.brl.price}</span>
                            <span className="bg-muted/50 px-2 py-1 rounded">${priceInfo.usd.price}</span>
                            <span className="bg-muted/50 px-2 py-1 rounded">€{priceInfo.eur.price}</span>
                          </>
                        )}
                        <Badge variant={test.stripe_price_id ? "outline" : "secondary"} className="text-xs">
                          {test.stripe_price_id ? "Stripe ✓" : "Sem Stripe ID"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="p-4 bg-muted/30 border-dashed">
            <p className="text-xs text-muted-foreground text-center">
              Os preços são definidos em <code className="bg-muted px-1 rounded">src/lib/priceConfig.ts</code> e sincronizados com o Stripe.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};