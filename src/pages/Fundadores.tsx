import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Star, Heart, Users, Sparkles, Gift, Smartphone, Crown, ArrowRight, Loader2, Wrench, Brain, Compass, BookOpen, Zap, Tag, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AboutCreator } from "@/components/landing/AboutCreator";

const Fundadores = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [showCouponField, setShowCouponField] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState<number | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const autoCheckoutTriggered = useRef(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Auto-trigger checkout when coming from auth with autoCheckout=true
  useEffect(() => {
    const autoCheckout = searchParams.get("autoCheckout");
    
    if (autoCheckout === "true" && user && !isAuthLoading && !autoCheckoutTriggered.current) {
      autoCheckoutTriggered.current = true;
      // Clear the param from URL
      setSearchParams({});
      // Trigger checkout
      triggerCheckout();
    }
  }, [user, isAuthLoading, searchParams]);

  const triggerCheckout = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          testIds: [],
          isFundadores: true,
          language: "pt",
          currency: "brl",
          couponCode: couponApplied ? couponCode.trim().toUpperCase() : undefined,
        },
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("URL de checkout não recebida");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Erro ao iniciar checkout",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setIsValidatingCoupon(true);
    try {
      const { data: coupon, error } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", couponCode.trim().toUpperCase())
        .eq("is_active", true)
        .single();

      if (error || !coupon) {
        toast({
          title: "Cupom inválido",
          description: "Este código de cupom não existe ou está inativo.",
          variant: "destructive",
        });
        setCouponApplied(false);
        setCouponDiscount(null);
        return;
      }

      // Check if coupon is for Fundadores or all products
      if (coupon.allowed_product_type && coupon.allowed_product_type !== "fundadores") {
        toast({
          title: "Cupom não aplicável",
          description: "Este cupom não é válido para o plano Fundadores.",
          variant: "destructive",
        });
        setCouponApplied(false);
        setCouponDiscount(null);
        return;
      }

      // Check expiration
      if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
        toast({
          title: "Cupom expirado",
          description: "Este cupom já não está mais válido.",
          variant: "destructive",
        });
        setCouponApplied(false);
        setCouponDiscount(null);
        return;
      }

      // Check max uses
      if (coupon.max_uses && coupon.times_used >= coupon.max_uses) {
        toast({
          title: "Cupom esgotado",
          description: "Este cupom já atingiu o limite máximo de utilizações.",
          variant: "destructive",
        });
        setCouponApplied(false);
        setCouponDiscount(null);
        return;
      }

      setCouponApplied(true);
      setCouponDiscount(coupon.discount_value);
      toast({
        title: "Cupom aplicado!",
        description: coupon.discount_value === 100 
          ? "Desconto de 100% aplicado. Você terá acesso gratuito!" 
          : `Desconto de ${coupon.discount_value}% aplicado.`,
      });
    } catch (error) {
      console.error("Coupon validation error:", error);
      toast({
        title: "Erro ao validar cupom",
        description: "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setCouponCode("");
    setCouponApplied(false);
    setCouponDiscount(null);
  };

  const handleCTA = async () => {
    if (!user) {
      toast({
        title: "Faça login primeiro",
        description: "Para se tornar Fundador, você precisa criar uma conta.",
      });
      navigate("/auth?redirect=/fundadores");
      return;
    }

    await triggerCheckout();
  };

  const CTAButton = ({ className = "", size = "lg" }: { className?: string; size?: "default" | "lg" }) => (
    <Button 
      onClick={handleCTA}
      disabled={isLoading}
      size={size}
      className={`bg-[hsl(252,47%,40%)] hover:bg-[hsl(252,47%,35%)] text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all ${className}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 w-5 h-5 animate-spin" />
          Processando...
        </>
      ) : (
        <>
          Quero entrar para os Fundadores
          <ArrowRight className="ml-2 w-5 h-5" />
        </>
      )}
    </Button>
  );

  // Founder Badge Component
  const FounderBadge = () => (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-[hsl(42,70%,55%)] bg-[hsl(252,47%,40%)] text-white">
      <Crown className="w-4 h-4 text-[hsl(42,70%,55%)]" />
      <span className="text-sm font-medium">Fundador Nello One</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-[hsl(216,28%,20%)]">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(210,36%,96%)] to-white" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <FounderBadge />
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-6 mb-6 tracking-tight leading-tight">
                Torne-se um Fundador do{" "}
                <span className="text-[hsl(252,47%,40%)]">Nello One</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed mb-8">
                Faça parte da primeira geração que terá acesso completo à Jornada Nello One, 
                ao Código da Essência e às atualizações exclusivas. Seja parte da construção 
                deste projeto que une ciência, inteligência artificial e propósito.
              </p>
              
              {/* Coupon Field */}
              <div className="mb-6">
                {!showCouponField ? (
                  <button
                    onClick={() => setShowCouponField(true)}
                    className="text-sm text-muted-foreground hover:text-[hsl(252,47%,40%)] flex items-center gap-2 transition-colors"
                  >
                    <Tag className="w-4 h-4" />
                    Possui um cupom de desconto?
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Digite o código do cupom"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        disabled={couponApplied || isValidatingCoupon}
                        className="max-w-[240px] uppercase"
                      />
                      {!couponApplied ? (
                        <Button
                          variant="outline"
                          onClick={validateCoupon}
                          disabled={isValidatingCoupon || !couponCode.trim()}
                        >
                          {isValidatingCoupon ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            "Aplicar"
                          )}
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={removeCoupon}
                          className="text-destructive hover:text-destructive"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    {couponApplied && couponDiscount !== null && (
                      <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                        <Check className="w-4 h-4" />
                        {couponDiscount === 100 
                          ? "Cupom 100% aplicado - Acesso gratuito!" 
                          : `Cupom de ${couponDiscount}% aplicado`}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <CTAButton className="text-lg px-8 py-6" />
              
              <p className="text-sm text-muted-foreground mt-6 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[hsl(42,70%,55%)]" />
                Vagas limitadas. Oferta única e nunca repetida.
              </p>
            </div>

            {/* Right visual - Concentric circles representing depth */}
            <div className={`relative flex items-center justify-center transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              <div className="relative w-80 h-80 md:w-96 md:h-96">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border-2 border-[hsl(252,47%,40%)/0.1] animate-pulse" />
                {/* Middle rings */}
                <div className="absolute inset-6 rounded-full border-2 border-[hsl(252,47%,40%)/0.2]" />
                <div className="absolute inset-12 rounded-full border-2 border-[hsl(252,47%,40%)/0.3]" />
                <div className="absolute inset-20 rounded-full border-2 border-[hsl(252,47%,40%)/0.4]" />
                {/* Core */}
                <div className="absolute inset-28 rounded-full bg-gradient-to-br from-[hsl(252,47%,40%)] to-[hsl(252,50%,25%)] flex items-center justify-center shadow-2xl">
                  <div className="text-center">
                    <Sparkles className="w-10 h-10 text-[hsl(42,70%,55%)] mx-auto mb-2" />
                    <span className="text-white font-semibold text-sm">Essência</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* O que é o Nello One */}
      <section className="py-16 md:py-24 px-4 bg-[hsl(210,20%,97%)]">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">O que é o Nello One</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                O Nello One é um sistema completo de autoconhecimento que combina <strong className="text-foreground">psicologia aplicada</strong>, 
                <strong className="text-foreground"> inteligência artificial</strong> e uma linguagem simples e profunda.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                Ele foi criado para ajudar pessoas a entender quem são, reconhecer seus padrões emocionais e encontrar direção interior.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                É moderno, intuitivo e guiado em cada etapa pelo <strong className="text-[hsl(252,47%,40%)]">Miguel</strong>, 
                a IA emocional do Nello One.
              </p>
            </div>
            
            {/* Visual card with layers */}
            <div className="bg-white rounded-2xl p-8 border shadow-lg">
              <div className="space-y-4">
                {[
                  { icon: Brain, label: "Psicologia Aplicada", color: "hsl(252,47%,40%)" },
                  { icon: Sparkles, label: "Inteligência Artificial", color: "hsl(42,70%,55%)" },
                  { icon: Heart, label: "Linguagem Humana", color: "hsl(252,40%,50%)" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-[hsl(210,20%,97%)] rounded-xl">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${item.color}20` }}>
                      <item.icon className="w-6 h-6" style={{ color: item.color }} />
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* O que significa ser Fundador */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
            O que significa ser Fundador
          </h2>
          
          <div className="text-center mb-12">
            <p className="text-xl text-muted-foreground leading-relaxed">
              Ser Fundador é entrar no Nello One <strong className="text-foreground">antes do lançamento oficial</strong>.<br />
              É caminhar junto. É participar da construção.<br />
              É ter acesso exclusivo a tudo antes de todos.
            </p>
          </div>
          
          {/* Cards grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {[
              { icon: Gift, text: "Recebe tudo que será lançado publicamente" },
              { icon: BookOpen, text: "Recebe o Código da Essência completo" },
              { icon: Users, text: "Acesso ao grupo fechado com Cristiano Nunes" },
              { icon: Wrench, text: "Participa do processo de aprimoramento" },
              { icon: Zap, text: "Atualizações da versão 1.0 e 2.0" },
              { icon: Crown, text: "Menor preço da história do Nello One" },
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3 bg-white rounded-xl p-4 border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-[hsl(252,47%,40%)/0.1] flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-[hsl(252,47%,40%)]" />
                </div>
                <span className="text-sm text-muted-foreground leading-relaxed">{item.text}</span>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <p className="text-xl font-medium text-foreground">É um lugar de honra.</p>
            <p className="text-xl font-medium text-[hsl(252,47%,40%)]">E de construção real.</p>
          </div>
        </div>
      </section>

      {/* A Verdade - Construção */}
      <section className="py-16 md:py-24 px-4 bg-[hsl(210,20%,97%)]">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Wrench className="w-8 h-8 text-[hsl(252,47%,40%)]" />
            <h2 className="text-2xl md:text-3xl font-bold text-center">
              A Verdade
            </h2>
          </div>
          
          <p className="text-lg text-center text-[hsl(252,47%,40%)] font-medium mb-8">
            Esta versão ainda não está 100% perfeita — e é por isso que os Fundadores existem
          </p>
          
          <div className="bg-white rounded-2xl p-8 border shadow-sm">
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              O Nello One está pronto para uso, mas ainda está em expansão. Algumas partes podem 
              receber melhorias, ajustes e refinamentos. Pequenos bugs podem aparecer. E é 
              exatamente por isso que esta turma existe.
            </p>
            
            <div className="bg-[hsl(252,47%,40%)/0.05] rounded-xl p-6 border-l-4 border-[hsl(252,47%,40%)]">
              <p className="text-muted-foreground mb-2">
                Você não entra em um produto finalizado.
              </p>
              <p className="text-lg font-semibold text-foreground">
                Você entra na construção.
              </p>
              <p className="text-muted-foreground mt-2">
                Seu olhar, seu uso e seu feedback fazem parte da evolução desta obra.
              </p>
            </div>
            
            <p className="text-muted-foreground mt-6 text-center">
              Os Fundadores são essenciais porque ajudam a moldar o futuro do sistema — e por isso 
              recebem acesso privilegiado e o <strong className="text-foreground">menor preço que o Nello One 
              terá em toda sua história</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* O que você recebe */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            O que você recebe como Fundador
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            Acesso completo e vitalício
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Jornada Completa */}
            <div className="bg-white rounded-2xl p-6 border-2 border-[hsl(252,47%,40%)/0.2] shadow-sm hover:border-[hsl(252,47%,40%)/0.4] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[hsl(252,47%,40%)] flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-[hsl(42,70%,55%)]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Jornada Completa</h3>
              <p className="text-muted-foreground text-sm mb-4">Os sete testes oficiais:</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {["Arquétipos", "Inteligências Múltiplas", "Estilos de Conexão", "Nello 16", "DISC", "Eneagrama", "Temperamentos"].map((test, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[hsl(252,47%,40%)]" />
                    {test}
                  </li>
                ))}
              </ul>
              <p className="text-sm font-medium text-[hsl(42,70%,55%)] mt-4">+ Todos os PDFs Premium</p>
            </div>

            {/* Código da Essência */}
            <div className="bg-white rounded-2xl p-6 border-2 border-[hsl(42,70%,55%)/0.3] shadow-sm hover:border-[hsl(42,70%,55%)/0.5] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[hsl(42,70%,55%)] flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Código da Essência</h3>
              <p className="text-muted-foreground text-sm mb-4">
                O relatório final mais profundo do Nello One.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(42,70%,55%)/0.1] text-[hsl(42,60%,40%)] text-xs font-medium mb-4">
                <Crown className="w-3 h-3" />
                Exclusivo Fundadores
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {["Mapa emocional completo", "Forças essenciais", "Zonas de sombra", "Padrões ocultos", "Direcionamento prático"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[hsl(42,70%,55%)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Comunidade Fechada */}
            <div className="bg-white rounded-2xl p-6 border shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[hsl(252,47%,40%)/0.1] flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-[hsl(252,47%,40%)]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Comunidade Fechada</h3>
              <p className="text-muted-foreground text-sm">
                Grupo exclusivo no WhatsApp para os Fundadores.
                Caminho junto, suporte direto e partilha com Cristiano Nunes.
              </p>
            </div>

            {/* Atualizações */}
            <div className="bg-white rounded-2xl p-6 border shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[hsl(252,47%,40%)/0.1] flex items-center justify-center mb-4">
                <Gift className="w-6 h-6 text-[hsl(252,47%,40%)]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Atualizações 2.0</h3>
              <p className="text-muted-foreground text-sm">
                Os Fundadores recebem todas as atualizações futuras.
                Sem pagar nada a mais.
              </p>
            </div>

            {/* Bônus Espiritual */}
            <div className="bg-white rounded-2xl p-6 border shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[hsl(252,47%,40%)/0.1] flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-[hsl(252,47%,40%)]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Bônus Espiritual</h3>
              <p className="text-muted-foreground text-sm">
                Série "Discernimento e Propósito" — 7 dias de clareza interior.
              </p>
            </div>

            {/* Acesso antecipado */}
            <div className="bg-white rounded-2xl p-6 border shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[hsl(252,47%,40%)/0.1] flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6 text-[hsl(252,47%,40%)]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Acesso ao App</h3>
              <p className="text-muted-foreground text-sm">
                Quando o app sair, Fundadores desbloqueiam primeiro.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tabela Comparativa */}
      <section className="py-16 md:py-24 px-4 bg-[hsl(210,20%,97%)]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Fundadores x Público Geral
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl border overflow-hidden shadow-sm">
              <thead>
                <tr className="border-b bg-[hsl(210,20%,97%)]">
                  <th className="text-left p-4 font-semibold">Recurso</th>
                  <th className="text-center p-4">
                    <div className="flex items-center justify-center gap-2">
                      <Crown className="w-4 h-4 text-[hsl(42,70%,55%)]" />
                      <span className="font-semibold text-[hsl(252,47%,40%)]">Fundadores</span>
                    </div>
                  </th>
                  <th className="text-center p-4 font-semibold text-muted-foreground">Público Geral</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { resource: "Jornada Completa", founders: "Incluída", public: "R$ 597" },
                  { resource: "Código da Essência", founders: "Incluído", public: "R$ 397 (à parte)" },
                  { resource: "PDFs Premium", founders: "Incluídos", public: "Incluídos" },
                  { resource: "Suporte direto", founders: "Sim", public: "Limitado" },
                  { resource: "Grupo fechado", founders: "Sim", public: "Não" },
                  { resource: "Atualizações 2.0", founders: "Gratuitas", public: "Pagas" },
                  { resource: "Preço Total", founders: "R$ 197", public: "R$ 994" },
                  { resource: "Presença na História", founders: "Sim", public: "Não" },
                ].map((row, index) => (
                  <tr key={index} className="border-b last:border-0 hover:bg-[hsl(210,20%,98%)] transition-colors">
                    <td className="p-4 font-medium">{row.resource}</td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[hsl(252,47%,40%)] font-medium">
                        {(row.founders === "Sim" || row.founders === "Incluída" || row.founders === "Incluído" || row.founders === "Incluídos" || row.founders === "Gratuitas") && (
                          <Check className="w-4 h-4" />
                        )}
                        {row.founders}
                      </span>
                    </td>
                    <td className="p-4 text-center text-muted-foreground">{row.public}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Valor Especial */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Valor Especial de Fundador
          </h2>
          
          <div className="bg-white rounded-2xl p-8 md:p-12 border-2 border-[hsl(252,47%,40%)/0.2] shadow-xl">
            <p className="text-muted-foreground mb-2">Preço oficial no lançamento:</p>
            <p className="text-2xl text-muted-foreground line-through mb-6">R$ 597</p>
            
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(42,70%,55%)/0.1] text-[hsl(42,60%,40%)] font-medium mb-4">
              <Crown className="w-4 h-4" />
              Preço exclusivo Fundadores
            </div>
            
            <p className="text-5xl md:text-6xl font-bold text-[hsl(252,47%,40%)] mb-2">R$ 197</p>
            <p className="text-muted-foreground mb-8">à vista</p>
            
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px bg-border flex-1" />
              <span className="text-muted-foreground text-sm">ou</span>
              <div className="h-px bg-border flex-1" />
            </div>
            
            <p className="text-2xl font-semibold mb-8">3x de R$ 79</p>
            
            <CTAButton className="w-full text-lg py-6" />
            
            <p className="text-sm text-muted-foreground mt-6 italic">
              Entre apenas se sentir o chamado interior.<br />
              Este movimento não é sobre pressa. É sobre verdade.
            </p>
          </div>
        </div>
      </section>

      {/* Para quem é */}
      <section className="py-16 md:py-24 px-4 bg-[hsl(210,20%,97%)]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Para quem é
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Para quem busca clareza emocional",
              "Para quem precisa entender sua identidade",
              "Para quem está atravessando transição",
              "Para pais que querem se conhecer melhor",
              "Para jovens que desejam discernir vocação",
              "Para quem Deus está movendo para um novo ciclo",
              "Para quem sente que chegou a hora de olhar para dentro"
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3 bg-white rounded-xl p-4 border shadow-sm">
                <Heart className="w-5 h-5 text-[hsl(252,47%,40%)] mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* O que acontece depois */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            O que acontece depois que você entra
          </h2>
          
          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[hsl(252,47%,40%)/0.2]" />
            
            {[
              { step: 1, title: "Acesso imediato", desc: "Sua Jornada Completa é liberada na hora" },
              { step: 2, title: "Primeiro teste", desc: "Comece pelo Arquétipos com Propósito" },
              { step: 3, title: "Grupo Fundadores", desc: "Receba o convite para o WhatsApp exclusivo" },
              { step: 4, title: "Código da Essência", desc: "Acesso desbloqueado ao completar a jornada" },
              { step: 5, title: "Suporte", desc: "Acompanhamento diário durante os primeiros 7 dias" },
            ].map((item, index) => (
              <div key={index} className="relative pl-16 pb-8 last:pb-0">
                <div className="absolute left-0 w-12 h-12 rounded-full bg-[hsl(252,47%,40%)] flex items-center justify-center text-white font-bold shadow-lg">
                  {item.step}
                </div>
                <div className="bg-white rounded-xl p-4 border shadow-sm">
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Creator Section */}
      <AboutCreator />

      {/* CTA Final */}
      <section className="py-20 md:py-32 px-4 bg-[hsl(252,47%,40%)]">
        <div className="max-w-3xl mx-auto text-center">
          <Crown className="w-12 h-12 text-[hsl(42,70%,55%)] mx-auto mb-6" />
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Seja parte da primeira geração do Nello One
          </h2>
          
          <p className="text-xl text-white/80 mb-8">
            A clareza começa com um passo. O seu passo é agora.
          </p>
          
          <Button 
            onClick={handleCTA}
            disabled={isLoading}
            size="lg"
            className="bg-[hsl(42,70%,55%)] hover:bg-[hsl(42,70%,50%)] text-[hsl(252,50%,25%)] font-semibold text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                Quero entrar para os Fundadores
                <ArrowRight className="ml-2 w-5 h-5" />
              </>
            )}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="max-w-4xl mx-auto text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Nello One. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Fundadores;