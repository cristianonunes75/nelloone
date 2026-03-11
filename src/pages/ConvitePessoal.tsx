import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { Heart, Star, BookOpen, Users, ArrowRight, Quote, CheckCircle2, Cross, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Section = ({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  return (
    <section
      ref={ref}
      id={id}
      className={cn(
        "transition-all duration-700 ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        className
      )}
    >
      {children}
    </section>
  );
};

const Verse = ({ text, reference }: { text: string; reference: string }) => (
  <div className="border-l-2 border-amber-400 pl-5 my-6">
    <p className="font-serif text-lg italic text-stone-700 leading-relaxed">"{text}"</p>
    <p className="text-sm text-amber-700 mt-2 font-medium">{reference}</p>
  </div>
);

const SaintQuote = ({ text, author }: { text: string; author: string }) => (
  <div className="flex gap-3 items-start my-5">
    <Quote className="h-5 w-5 text-amber-400 flex-shrink-0 mt-1" />
    <div>
      <p className="font-serif italic text-stone-600 leading-relaxed">{text}</p>
      <p className="text-xs text-amber-700 mt-1 font-semibold">— {author}</p>
    </div>
  </div>
);

interface Testimonial {
  id: string;
  display_name: string;
  content: string;
  test_slug: string | null;
}

const TestimonialCard = ({ name, role, text }: { name: string; role?: string; text: string }) => (
  <div className="bg-white rounded-2xl p-6 shadow-md border border-amber-100 flex flex-col gap-3">
    <Quote className="h-5 w-5 text-amber-300" />
    <p className="text-stone-600 leading-relaxed text-sm italic flex-1">"{text}"</p>
    <div>
      <p className="font-semibold text-stone-800 text-sm">{name}</p>
      {role && <p className="text-xs text-amber-700">{role}</p>}
    </div>
  </div>
);

const getTestLabel = (slug: string | null): string => {
  const map: Record<string, string> = {
    arquetipos: "Arquétipos",
    disc: "DISC",
    temperamentos: "Temperamentos",
    "estilos-conexao-afetiva": "Estilos de Conexão",
    inteligencias: "Inteligências Múltiplas",
    eneagrama: "Eneagrama",
    "nello-16": "Nello 16",
    externo: "Externo",
  };
  return slug ? map[slug] || "Jornada Identity" : "Jornada Identity";
};

export default function ConvitePessoal() {
  const navigate = useNavigate();
  const [addCruzamento, setAddCruzamento] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data: testimonials = [] } = useQuery<Testimonial[]>({
    queryKey: ["approved-testimonials-landing"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("id, display_name, content, test_slug")
        .eq("status", "approved")
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      return (data || []) as Testimonial[];
    },
    staleTime: 1000 * 60 * 5,
  });

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // Salva intenção e redireciona para login
        sessionStorage.setItem("convite_checkout_intent", "codigo_essencia_express");
        navigate("/auth?redirect=/convite#comecar");
        return;
      }

      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { productType: "codigo_essencia_express", language: "pt" },
      });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("URL de checkout não retornada");
      }
    } catch (e: any) {
      toast.error("Erro ao iniciar pagamento. Tente novamente.");
      console.error("[CONVITE] checkout error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-800">

      {/* HERO */}
      <div className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-950/75 via-stone-900/65 to-amber-950/85 z-0" />
        <div
          className="absolute inset-0 z-[-1] bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/cristiano-nunes.png')",
            backgroundPosition: "center top",
          }}
        />
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-amber-200 text-sm font-medium">
            <Cross className="h-3.5 w-3.5" />
            Um convite pessoal de Cristiano Nunes
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Onde a sua Identidade<br />
            <span className="text-amber-300">encontra o Plano de Deus</span>
          </h1>
          <p className="text-lg text-white/80 leading-relaxed max-w-xl mx-auto">
            Se você chegou até aqui, provavelmente me conhece de alguma fase da vida.
            Esta carta é para você.
          </p>
          <Button
            size="lg"
            onClick={handleCheckout}
            disabled={loading}
            className="bg-amber-500 hover:bg-amber-400 text-white font-semibold px-8 py-4 rounded-full text-base shadow-lg hover:shadow-amber-500/30 transition-all duration-300"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Começar minha jornada
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent animate-bounce" />
        </div>
      </div>

      {/* QUEM SOU */}
      <Section className="max-w-3xl mx-auto px-5 py-20 space-y-8">
        <p className="font-serif text-2xl text-stone-700 leading-relaxed">
          Alguns me conheceram como o <strong>professor de Educação Física</strong>, sempre em movimento nas academias. Outros como o <strong>fotógrafo</strong> atento atrás das lentes, buscando captar a alma em um clique. Muitos me conhecem da <strong>Igreja, do ECC</strong>, ou pelos inúmeros projetos que tentei construir ao longo das décadas.
        </p>
        <p className="text-stone-500 leading-relaxed">
          DJ · professor de Educação Física · fitness · dança · fotografia · violeiro · percussionista · marqueteiro · empresário · editor · coach · pai · marido · filho · amigo · produtor de eventos musicais.
        </p>
        <p className="font-serif text-xl text-stone-700 leading-relaxed">
          Minha vida sempre foi uma <strong>explosão de intensidades</strong>. E por muito tempo, eu penei para entender que podia conviver com todos esses talentos <em>sem culpa</em>.
        </p>
      </Section>

      {/* PERGUNTA SILENCIOSA */}
      <Section className="bg-amber-950 text-white">
        <div className="max-w-3xl mx-auto px-5 py-20 space-y-8">
          <h2 className="font-serif text-3xl md:text-4xl font-bold leading-tight">
            "Por que algumas coisas dão certo para os outros e para mim parecem sempre um deserto?"
          </h2>
          <p className="text-white/70 leading-relaxed text-lg">
            Durante <strong className="text-amber-300">50 anos</strong>, essa pergunta silenciosa me perseguia em cada novo início.
          </p>
          <div className="border-l-2 border-amber-500 pl-5 text-white/80 leading-relaxed italic font-serif text-lg">
            "Cristiano, você não é burro, você é inteligente! O que se passa contigo? Por que você fica o ano inteiro sem estudar, chega no fim do ano, estuda, passa em seis e sobram sempre duas?"
          </div>
          <p className="text-white/70 leading-relaxed">
            Eu fui rotulado como "Bombril", "desfocado", "desorganizado". Fui cobrado o tempo todo por ser o que eu não era. Mas a verdade libertadora só apareceu aos 50 anos.
          </p>
        </div>
      </Section>

      {/* A VIRADA */}
      <Section className="max-w-3xl mx-auto px-5 py-20 space-y-8">
        <div className="flex items-center gap-3 mb-2">
          <Star className="h-5 w-5 text-amber-500" />
          <span className="text-amber-700 font-semibold text-sm uppercase tracking-wider">A virada de chave</span>
        </div>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-800 leading-tight">
          Aos 50 anos, descobri que nunca fui o problema.
        </h2>
        <p className="text-stone-600 leading-relaxed text-lg">
          Através de um grande amigo diagnosticado com TDAH, me vi espelhado de uma forma que nenhuma terapia anterior tinha alcançado. O cansaço contínuo, a procrastinação como peso de chumbo, a mente que nunca desliga... era eu.
        </p>
        <p className="text-stone-600 leading-relaxed">
          Quando busquei ajuda especializada e confirmei o diagnóstico, entendi: <strong>não era falta de vontade. Era um padrão de funcionamento.</strong> Passei a vida tentando consertar o motor sem ter o manual de instruções original.
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <p className="font-serif text-xl text-amber-900 leading-relaxed">
            E foi aí que Deus colocou um desejo ardente no meu coração: <strong>ninguém mais deveria levar 50 anos para descobrir quem é e como funciona.</strong>
          </p>
        </div>
      </Section>

      {/* O AUTOCONHECIMENTO CRISTÃO */}
      <Section className="bg-stone-50 border-y border-stone-100">
        <div className="max-w-3xl mx-auto px-5 py-20 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="h-5 w-5 text-amber-500" />
            <span className="text-amber-700 font-semibold text-sm uppercase tracking-wider">Autoconhecimento e Fé</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-stone-800">
            Olhar para si não é vaidade. É reverência ao Criador.
          </h2>
          <p className="text-stone-600 leading-relaxed">
            Muitos acham que o autoconhecimento é egocêntrico. Mas o autoconhecimento cristão é o oposto disso.
          </p>

          <SaintQuote
            text="Senhor, que eu me conheça para que eu Te conheça."
            author="Santo Agostinho"
          />
          <Verse
            text="Conhecereis a verdade, e a verdade vos libertará."
            reference="João 8,32"
          />
          <Verse
            text="Se, pois, o Filho vos libertar, verdadeiramente sereis livres."
            reference="João 8,36"
          />
          <SaintQuote
            text="O autoconhecimento é o pão que deve acompanhar todos os manjares da vida espiritual. Sem ele, a gente se perde no caminho."
            author="Santa Teresa de Ávila"
          />

          <p className="text-stone-600 leading-relaxed">
            Como você pode ser livre se não conhece a verdade sobre como Deus te desenhou? Como pode servir ao Senhor com seus talentos se você vive fugindo deles ou se sentindo culpado por ter tantos?
          </p>
          <p className="font-serif text-xl text-stone-700">
            O sistema <strong>IDENTITY - NELLO ONE</strong> nasceu para ser esse pão — uma ferramenta inspirada por Deus para ajudar mais pessoas a serem <strong>DELE</strong>.
          </p>
        </div>
      </Section>

      {/* O CÓDIGO DA ESSÊNCIA */}
      <Section className="max-w-3xl mx-auto px-5 py-20 space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
            <Star className="h-5 w-5 text-amber-600" />
          </div>
          <span className="text-amber-700 font-semibold text-sm uppercase tracking-wider">O Sistema</span>
        </div>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-800 leading-tight">
          O Código da Essência:<br />
          <span className="text-amber-600">Seu mapa de clareza</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white border border-amber-100 rounded-xl p-4">
            <p className="font-semibold text-stone-700 mb-1">NELLO</p>
            <p className="text-stone-500">Nele — O reconhecimento de que sua identidade está guardada no coração do Pai. É o Elo que nos liga à nossa origem divina.</p>
          </div>
          <div className="bg-white border border-amber-100 rounded-xl p-4">
            <p className="font-semibold text-stone-700 mb-1">ONE</p>
            <p className="text-stone-500">Único — A prova de que Deus não faz cópias. Ele só faz o "Um". Você é o projeto original que Ele planejou.</p>
          </div>
        </div>

        <p className="text-stone-600 leading-relaxed">
          Dediquei os últimos <strong>8 meses</strong> a treinar e desenvolver um sistema que integra tudo o que estudei sobre o funcionamento humano com o poder da Inteligência Artificial. O resultado é uma <strong>leitura integrada de como você está funcionando neste momento da sua vida</strong>: seus talentos naturais, padrões de decisão, tensões internas e riscos emocionais.
        </p>

        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 text-sm text-stone-500 italic leading-relaxed">
          <strong className="text-stone-700 not-italic">Lembrete humano:</strong> Este relatório reflete as respostas que você ofereceu com a verdade do seu coração. O ser humano é um todo composto de corpo, mente e espírito. Use este diagnóstico como uma ferramenta de autoconhecimento — não como uma sentença definitiva. O Código da Essência não substitui diagnóstico clínico. Nosso objetivo é que você tenha a fundamentação necessária para buscar ajuda profissional especializada.
        </div>
      </Section>

      {/* CÓDIGO DO CASAL */}
      <Section className="bg-gradient-to-br from-amber-50 to-rose-50 border-y border-amber-100">
        <div className="max-w-3xl mx-auto px-5 py-20 space-y-8">
          <div className="flex items-center gap-3">
            <Heart className="h-5 w-5 text-rose-500" />
            <span className="text-rose-600 font-semibold text-sm uppercase tracking-wider">Para Casais</span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-800 leading-tight">
            O Código do Casal:<br />
            <span className="text-rose-600">Onde a Empatia Floresce</span>
          </h2>
          <p className="text-stone-600 leading-relaxed text-lg">
            No ECC (Encontro de Casais com Cristo), onde tenho a alegria de dar palestras ao lado da minha esposa Lisa, percebo que a maioria dos conflitos não nasce da falta de amor — mas da <strong>ignorância sobre o funcionamento do outro</strong>.
          </p>
          <div className="bg-white rounded-2xl p-6 border border-rose-100 shadow-sm">
            <p className="font-serif text-lg text-stone-700 leading-relaxed italic">
              "Quando você conhece o código do outro, a empatia, a tolerância e o amor aumentam. Você entende que o silêncio dele não é desprezo, ou que a agitação dela não é cobrança — são apenas formas diferentes de processar a vida."
            </p>
            <p className="text-sm text-rose-600 mt-3 font-medium">— Cristiano Nunes</p>
          </div>
          <p className="text-stone-600 leading-relaxed">
            Também ideal para <strong>pais e filhos</strong> — entender o código do seu filho para direcioná-lo — e para <strong>sócios e colaboradores</strong> — saber que tipo de pessoa combina com você em uma futura sociedade.
          </p>
        </div>
      </Section>

      {/* TESTEMUNHOS */}
      {testimonials.length > 0 && (
        <Section className="max-w-5xl mx-auto px-5 py-20 space-y-10" id="testemunhos">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-3">
              <Users className="h-5 w-5 text-amber-500" />
              <span className="text-amber-700 font-semibold text-sm uppercase tracking-wider">Quem já fez a jornada</span>
            </div>
            <h2 className="font-serif text-3xl font-bold text-stone-800">
              Palavras de quem se encontrou
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {testimonials.map((t) => (
              <TestimonialCard
                key={t.id}
                name={t.display_name}
                role={getTestLabel(t.test_slug)}
                text={t.content}
              />
            ))}
          </div>
        </Section>
      )}

      {/* PRICING / CTA */}
      <Section className="bg-amber-950 text-white" id="comecar">
        <div className="max-w-2xl mx-auto px-5 py-20 text-center space-y-10">
          <h2 className="font-serif text-3xl md:text-4xl font-bold leading-tight">
            Comece sua jornada agora
          </h2>
          <p className="text-white/70 text-lg">A vida necessita de pausas. Esta é a sua.</p>

          {/* Produto 1 */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-left space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-serif text-xl font-bold text-white">Código da Essência</p>
                <p className="text-white/60 text-sm mt-1">Autoconhecimento integrado • Jovens em escolha de carreira • Marketing pessoal</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-3xl font-bold text-amber-300">R$ 99</p>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-white/80">
              {["7 testes de personalidade integrados", "Relatório com IA personalizado", "Seus talentos, riscos e padrões de decisão", "Acesso vitalício ao seu mapa"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Produto 2 — add-on */}
          <div
            className={cn(
              "border rounded-2xl p-6 text-left space-y-4 cursor-pointer transition-all duration-200",
              addCruzamento
                ? "bg-rose-900/60 border-rose-400/60 shadow-lg shadow-rose-900/30"
                : "bg-rose-900/20 border-rose-400/20 opacity-80"
            )}
            onClick={() => setAddCruzamento((v) => !v)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="cruzamento"
                  checked={addCruzamento}
                  onCheckedChange={(v) => setAddCruzamento(!!v)}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-1 border-rose-300 data-[state=checked]:bg-rose-500 data-[state=checked]:border-rose-500"
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Heart className="h-4 w-4 text-rose-300" />
                    <Label htmlFor="cruzamento" className="text-rose-300 text-xs font-semibold uppercase tracking-wider cursor-pointer">
                      Adicional
                    </Label>
                  </div>
                  <p className="font-serif text-xl font-bold text-white">Cruzamento dos Códigos</p>
                  <p className="text-white/60 text-sm mt-1">Casais • Pais e filhos • Futuros sócios</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-3xl font-bold text-rose-300">+ R$ 47</p>
              </div>
            </div>
            <p className="text-sm text-white/70">
              Cruza dois Códigos da Essência e gera a leitura de conexão entre duas pessoas. Requer que ambos tenham feito o Código da Essência. Será oferecido logo após sua jornada inicial.
            </p>
          </div>

          {/* Total */}
          {addCruzamento && (
            <div className="flex items-center justify-between bg-white/5 rounded-xl px-5 py-3 border border-white/10">
              <span className="text-white/70 text-sm">Total</span>
              <span className="font-bold text-white text-xl">R$ 146</span>
            </div>
          )}

          <Button
            size="lg"
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 text-white font-bold py-5 rounded-full text-lg shadow-xl hover:shadow-amber-500/30 transition-all duration-300 disabled:opacity-60"
          >
            {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {loading ? "Aguarde..." : "Finalizar meu pedido"}
            {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
          </Button>

          <p className="text-white/40 text-xs">
            Pagamento seguro via Stripe · Cartão de crédito ou débito · Acesso imediato
          </p>
        </div>
      </Section>

      {/* FOOTER SIMPLES */}
      <div className="text-center py-10 text-stone-400 text-sm px-5">
        <p>© {new Date().getFullYear()} Nello One — Identity</p>
        <p className="mt-1 text-xs">Desenvolvido com fé e propósito por Cristiano Nunes</p>
      </div>
    </div>
  );
}
