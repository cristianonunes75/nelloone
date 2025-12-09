import { Button } from "@/components/ui/button";
import { Check, Star, Heart, Users, Sparkles, Gift, Smartphone, Crown, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Fundadores = () => {
  const navigate = useNavigate();

  const handleCTA = () => {
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-8">
            <Crown className="w-4 h-4" />
            <span className="text-sm font-medium">Oferta Exclusiva de Lançamento</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Torne-se um Fundador do<br />
            <span className="text-primary">Nello One</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Faça parte da primeira geração que terá acesso completo à Jornada Nello One, 
            ao Código da Essência e às atualizações exclusivas. Seja parte da construção 
            deste projeto que une ciência, inteligência artificial e propósito.
          </p>
          
          <Button 
            onClick={handleCTA}
            size="lg" 
            className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            Quero entrar para os Fundadores
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          
          <p className="text-sm text-muted-foreground mt-6">
            Vagas limitadas. Oferta única e nunca repetida.
          </p>
        </div>
      </section>

      {/* O que é o Nello One */}
      <section className="py-16 md:py-24 px-4 bg-muted/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">O que é o Nello One</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            O Nello One é um sistema completo de autoconhecimento que combina psicologia aplicada, 
            inteligência artificial e uma linguagem simples e profunda. Ele foi criado para ajudar 
            pessoas a entender quem são, reconhecer seus padrões emocionais e encontrar direção interior.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed mt-4">
            É moderno, intuitivo e guiado em cada etapa pelo <strong className="text-foreground">Miguel</strong>, 
            a IA emocional do Nello One.
          </p>
        </div>
      </section>

      {/* O que significa ser Fundador */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            O que significa ser Fundador
          </h2>
          
          <div className="bg-card rounded-2xl p-8 md:p-12 border shadow-sm mb-8">
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Ser Fundador é entrar no Nello One antes do lançamento oficial.<br />
              É caminhar junto.<br />
              É participar da construção.<br />
              É ter acesso exclusivo a tudo antes de todos.
            </p>
            
            <h3 className="text-xl font-semibold mb-4">Os Fundadores são a geração que:</h3>
            
            <ul className="space-y-3">
              {[
                "Recebe tudo que será lançado publicamente futuramente",
                "Recebe o Código da Essência completo",
                "Têm acesso ao grupo fechado com o criador",
                "Participam do processo de aprimoramento",
                "Recebem atualizações da versão 1.0 e 2.0",
                "Garantem o menor preço da história do Nello One",
                "São lembrados como a primeira geração"
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="text-center">
            <p className="text-xl font-medium text-foreground">É um lugar de honra.</p>
            <p className="text-xl font-medium text-primary">E de construção real.</p>
          </div>
        </div>
      </section>

      {/* A Verdade */}
      <section className="py-16 md:py-24 px-4 bg-muted/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            A Verdade: Esta versão ainda não está 100% perfeita — 
            <span className="text-primary"> e é por isso que os Fundadores existem</span>
          </h2>
          
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            O Nello One está pronto para uso, mas ainda está em expansão. Algumas partes podem 
            receber melhorias, ajustes e refinamentos. Pequenos bugs podem aparecer. E é 
            exatamente por isso que esta turma existe.
          </p>
          
          <div className="bg-card rounded-xl p-6 border text-left">
            <p className="text-muted-foreground mb-4">
              Você não entra em um produto finalizado.<br />
              <strong className="text-foreground">Você entra na construção.</strong>
            </p>
            <p className="text-muted-foreground">
              Seu olhar, seu uso e seu feedback fazem parte da evolução desta obra.
            </p>
          </div>
          
          <p className="text-muted-foreground mt-6">
            Os Fundadores são essenciais porque ajudam a moldar o futuro do sistema — e por isso 
            recebem acesso privilegiado e o <strong className="text-foreground">menor preço que o Nello One 
            terá em toda sua história</strong>.
          </p>
        </div>
      </section>

      {/* O que você recebe */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            O que você recebe como Fundador
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Jornada Completa */}
            <div className="bg-card rounded-2xl p-6 border shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Jornada Completa Nello One</h3>
              <p className="text-muted-foreground text-sm mb-4">Os sete testes oficiais:</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {["Arquétipos", "Inteligências Múltiplas", "Estilos de Conexão", "Nello 16 (MBTI reescrito)", "DISC", "Eneagrama", "Temperamentos"].map((test, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    {test}
                  </li>
                ))}
              </ul>
              <p className="text-sm font-medium text-primary mt-4">Tudo com PDF Premium.</p>
            </div>

            {/* Código da Essência */}
            <div className="bg-card rounded-2xl p-6 border shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">O Código da Essência</h3>
              <p className="text-muted-foreground text-sm mb-4">
                O relatório final mais profundo do Nello One.
                <br /><strong className="text-foreground">Exclusivo para Fundadores.</strong>
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {["Mapa emocional", "Forças essenciais", "Zonas de sombra", "Padrões ocultos", "Direcionamento prático e espiritual"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Comunidade Fechada */}
            <div className="bg-card rounded-2xl p-6 border shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Comunidade Fechada</h3>
              <p className="text-muted-foreground text-sm">
                Grupo exclusivo no WhatsApp para os Fundadores.
                Caminho junto, suporte direto e partilha.
              </p>
            </div>

            {/* Atualizações */}
            <div className="bg-card rounded-2xl p-6 border shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Gift className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Atualizações da Versão 2.0</h3>
              <p className="text-muted-foreground text-sm">
                Os Fundadores recebem tudo antes.
                E sem pagar nada a mais.
              </p>
            </div>

            {/* Bônus Espiritual */}
            <div className="bg-card rounded-2xl p-6 border shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Bônus Espiritual</h3>
              <p className="text-muted-foreground text-sm">
                Série "Discernimento e Propósito, 7 dias de clareza interior".
              </p>
            </div>

            {/* Acesso antecipado */}
            <div className="bg-card rounded-2xl p-6 border shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Acesso antecipado ao App</h3>
              <p className="text-muted-foreground text-sm">
                Quando o app sair, Fundadores desbloqueiam primeiro.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tabela Comparativa */}
      <section className="py-16 md:py-24 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Fundadores x Público Geral
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full bg-card rounded-2xl border overflow-hidden">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-semibold">Recurso</th>
                  <th className="text-center p-4 font-semibold text-primary">Fundadores</th>
                  <th className="text-center p-4 font-semibold text-muted-foreground">Público Geral</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { resource: "Jornada Completa", founders: "Incluída", public: "Paga" },
                  { resource: "Código da Essência", founders: "Incluído", public: "Pago à parte" },
                  { resource: "PDFs Premium", founders: "Incluídos", public: "Incluídos" },
                  { resource: "Suporte direto", founders: "Sim", public: "Limitado" },
                  { resource: "Grupo fechado", founders: "Sim", public: "Não" },
                  { resource: "Atualizações 2.0", founders: "Gratuitas", public: "Pagas" },
                  { resource: "Preço", founders: "R$ 197", public: "R$ 597" },
                  { resource: "Presença na História do Nello", founders: "Sim", public: "Não" },
                ].map((row, index) => (
                  <tr key={index} className="border-b last:border-0">
                    <td className="p-4 font-medium">{row.resource}</td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center gap-1 text-primary font-medium">
                        {row.founders === "Sim" || row.founders === "Incluída" || row.founders === "Incluído" || row.founders === "Incluídos" || row.founders === "Gratuitas" ? (
                          <Check className="w-4 h-4" />
                        ) : null}
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
          
          <div className="bg-card rounded-2xl p-8 md:p-12 border shadow-lg">
            <p className="text-muted-foreground mb-2">Preço oficial no lançamento:</p>
            <p className="text-2xl text-muted-foreground line-through mb-6">R$ 597</p>
            
            <p className="text-sm text-primary font-medium mb-2">Preço exclusivo Fundadores:</p>
            <p className="text-5xl md:text-6xl font-bold text-primary mb-2">R$ 197</p>
            <p className="text-muted-foreground mb-8">à vista</p>
            
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px bg-border flex-1" />
              <span className="text-muted-foreground text-sm">ou</span>
              <div className="h-px bg-border flex-1" />
            </div>
            
            <p className="text-2xl font-semibold mb-8">3x de R$ 79</p>
            
            <Button 
              onClick={handleCTA}
              size="lg" 
              className="w-full text-lg py-6 rounded-full"
            >
              Quero ser Fundador agora
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            
            <p className="text-sm text-muted-foreground mt-6 italic">
              Entre apenas se sentir o chamado interior. Este movimento não é sobre pressa. É sobre verdade.
            </p>
          </div>
        </div>
      </section>

      {/* Para quem é */}
      <section className="py-16 md:py-24 px-4 bg-muted/30">
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
              <div key={index} className="flex items-start gap-3 bg-card rounded-xl p-4 border">
                <Heart className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* O que acontece depois */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            O que acontece depois que você entra
          </h2>
          
          <div className="text-left bg-card rounded-2xl p-8 border shadow-sm">
            <p className="text-lg font-medium mb-6">Você recebe:</p>
            <ul className="space-y-4">
              {[
                "Acesso imediato à Jornada",
                "Primeiro teste liberado na hora",
                "Convite para o grupo Fundadores",
                "Acesso ao Código da Essência",
                "Suporte diário durante os primeiros 7 dias"
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 md:py-32 px-4 bg-foreground text-background">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Seja parte da primeira geração do Nello One
          </h2>
          
          <p className="text-lg opacity-80 mb-8">
            A clareza começa com um passo. O seu passo é agora.
          </p>
          
          <Button 
            onClick={handleCTA}
            size="lg" 
            variant="secondary"
            className="text-lg px-8 py-6 rounded-full"
          >
            Quero entrar para os Fundadores
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Nello One. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Fundadores;
