import { SEOHead } from "@/components/SEOHead";
import {
  LandingShell,
  LandingHero,
  LandingProblem,
  LandingPillars,
  LandingHow,
  LandingForWho,
  LandingAuthority,
  LandingPricing,
  LandingDisclaimer,
} from "@/components/landings/LandingSections";
import {
  HelpCircle,
  Users,
  GraduationCap,
  TrendingDown,
  Telescope,
  Lightbulb,
  Compass,
  Sparkles,
} from "lucide-react";

const LandingEscolhaVocacional = () => (
  <>
    <SEOHead
      page="landing"
      title="Escolha Vocacional | Nello Identity"
      description="Descubra qual faculdade, curso ou caminho profissional combina com quem o jovem é de verdade. Relatório de identidade gerado por IA, em minutos."
    />
    <LandingShell>
      <LandingHero
        eyebrow="Pra quem está escolhendo o futuro"
        title="Antes de escolher a faculdade,"
        highlight="é preciso conhecer quem está escolhendo."
        subtitle="Um relatório de identidade vocacional gerado por IA, que mostra qual caminho combina com o jovem real, não com o jovem idealizado."
        paragraphs={[
          "Escolher curso aos 17, 18 anos, com pressão da família e dos amigos, é uma das decisões mais difíceis da vida. Errar custa caro: tempo, dinheiro, autoestima.",
          "O Nello Identity dá ao jovem (e à família) um mapa claro de talentos, valores e padrões de funcionamento, antes da prova do vestibular ou da matrícula.",
        ]}
        ctaText="Quero o relatório vocacional"
      />

      <LandingProblem
        title="Escolher a faculdade no escuro"
        highlight="é o caminho mais curto pra desistir no segundo semestre."
        items={[
          { icon: HelpCircle, text: "Não sei o que eu gosto de verdade" },
          { icon: Users, text: "Pressão da família por uma área específica" },
          { icon: GraduationCap, text: "Medo de escolher errado e perder anos" },
          { icon: TrendingDown, text: "Trancar a faculdade depois de 1 ano custa caro" },
        ]}
      />

      <LandingAuthority
        title="Teste vocacional de revista não decide o futuro de ninguém."
        paragraphs={[
          "A maioria dos testes vocacionais devolve uma resposta genérica baseada em interesses superficiais. O jovem chega no curso, descobre que aquilo não é dele, e tranca.",
          "O Nello Identity faz o oposto. Lê o jovem em camadas profundas: temperamento, padrões de pensamento, valores, talentos naturais. E devolve um mapa que faz sentido pra quem ele é, não pra quem ele acha que deveria ser.",
        ]}
      />

      <LandingPillars
        title="O que o relatório vai mostrar"
        intro="Não é lista de cursos quentes do mercado. É leitura de quem o jovem é, e quais áreas conversam com isso."
        blocks={[
          {
            icon: Telescope,
            title: "Direções vocacionais compatíveis",
            desc: "Áreas profissionais que combinam com o perfil real, com explicação de por que cada uma faz sentido.",
          },
          {
            icon: Lightbulb,
            title: "Talentos e zonas de brilho",
            desc: "O que vem fácil pra ele, mesmo que ainda não tenha nome de profissão.",
          },
          {
            icon: Compass,
            title: "Padrões de aprendizado",
            desc: "Como ele aprende melhor, decide melhor, se motiva, e onde vai travar se ignorar isso.",
          },
          {
            icon: Sparkles,
            title: "Ativação do Código",
            desc: "Processo guiado pra ele e a família entenderem juntos, sem briga, sem palpite, com base no mesmo mapa.",
          },
        ]}
      />

      <LandingHow
        title="Como funciona"
        steps={[
          {
            num: "01",
            title: "Leitura Inicial",
            desc: "Questionário estruturado, respondido em poucos minutos. Tranquilo, sem pegadinha, sem prova.",
          },
          {
            num: "02",
            title: "7 Mapas integrados por IA",
            desc: "DISC, Temperamentos, Eneagrama, Nello16, Estilos de Conexão, Valores e Inteligência Emocional, costurados em uma leitura única.",
          },
          {
            num: "03",
            title: "Conversa em família com base no mapa",
            desc: "O relatório vira ponto de partida pra uma conversa madura entre pais e filho sobre faculdade, ao invés de palpite versus teimosia.",
          },
        ]}
      />

      <LandingForWho
        title="Pra quem é"
        items={[
          "Estudantes do 2º e 3º ano do ensino médio decidindo o vestibular",
          "Jovens cursando o pré-vestibular com dúvida sobre a área",
          "Universitários no 1º ou 2º período em crise com a escolha feita",
          "Pais que querem apoiar a escolha sem impor, com informação concreta",
          "Pré-vestibulandos do ENEM querendo evitar o erro caro de trancar",
        ]}
      />

      <LandingPricing
        badge="Decisão antes do vestibular"
        urgencyText="Cada semestre na faculdade errada custa em torno de R$ 6 mil em mensalidade e um ano de vida."
        ctaText="Quero clareza pra escolher"
      />

      <LandingDisclaimer />
    </LandingShell>
  </>
);

export default LandingEscolhaVocacional;
