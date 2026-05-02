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
  AlarmClock,
  Compass,
  Briefcase,
  HeartCrack,
  Brain,
  Layers,
  Map,
  Sparkles,
} from "lucide-react";

const LandingMudancaCarreira = () => (
  <>
    <SEOHead
      page="landing"
      title="Mudança de Carreira | Nello Identity"
      description="Descubra em minutos qual carreira combina com quem você é de verdade. Relatório de identidade profissional gerado por IA."
    />
    <LandingShell>
      <LandingHero
        eyebrow="Para quem quer mudar de carreira"
        title="Você não está perdido."
        highlight="Você está no lugar errado."
        subtitle="Descubra qual carreira combina com quem você é de verdade, com um relatório de identidade profissional gerado por IA."
        paragraphs={[
          "Mais de uma década escolhendo pelo salário, pela moda ou pela opinião dos outros leva a uma sensação difícil de descrever. Você não está sozinho nisso.",
          "O que você precisa não é mais motivação. É um diagnóstico claro de quem você é profissionalmente, antes de dar o próximo passo.",
        ]}
        ctaText="Quero meu relatório agora"
      />

      <LandingProblem
        title="Mudar de carreira sem se conhecer é"
        highlight="trocar de avião no meio do voo, sem mapa."
        items={[
          { icon: AlarmClock, text: "Acordar de segunda já cansado, contando os dias" },
          { icon: HeartCrack, text: "Sentir que cada ano passa fazendo o que não te representa" },
          { icon: Compass, text: "Não saber pra onde mudar, só saber que precisa sair" },
          { icon: Briefcase, text: "Ter medo de errar de novo e perder mais 5 anos" },
        ]}
      />

      <LandingAuthority
        title="A maioria erra na mudança porque escolhe pela cabeça dos outros."
        paragraphs={[
          "Pelo salário, pela moda do momento, pelo conselho da família, pelo curso que estava em promoção. Dois anos depois, está infeliz de novo, agora com mais idade e menos paciência.",
          "O Nello Identity resolve isso de raiz. Uma análise profunda, gerada por IA, que cruza seus padrões de pensamento, valores, talentos naturais e zonas de bloqueio. Não é teste de personalidade que te coloca em caixinha. É um mapa que te tira dela.",
        ]}
      />

      <LandingPillars
        title="O que o seu relatório vai te entregar"
        intro="Não é horóscopo profissional. É leitura estruturada do seu funcionamento real, em 7 mapas integrados."
        blocks={[
          {
            icon: Brain,
            title: "Mapa da sua identidade central",
            desc: "O que move você de verdade quando ninguém está vendo, com base em DISC, Eneagrama, Temperamentos, Nello16 e Valores.",
          },
          {
            icon: Map,
            title: "Direções de carreira compatíveis",
            desc: "Caminhos profissionais que combinam com seu perfil real, não com o perfil que você acha que tem.",
          },
          {
            icon: Layers,
            title: "Diagnóstico de bloqueios",
            desc: "O que está te travando hoje na mudança e onde é só ruído de superfície versus padrão profundo.",
          },
          {
            icon: Sparkles,
            title: "Ativação do Código",
            desc: "Processo guiado pra aplicar o autoconhecimento na vida real, com clareza dos próximos passos.",
          },
        ]}
      />

      <LandingHow
        title="Como funciona"
        steps={[
          {
            num: "01",
            title: "Leitura Inicial",
            desc: "Você responde a um questionário estruturado em poucos minutos. Sem pergunta certa ou errada, a IA lê padrões, não respostas.",
          },
          {
            num: "02",
            title: "Análise integrada por IA",
            desc: "Os 7 mapas de autoconhecimento são cruzados em uma narrativa única, o Código da Essência, entregue no seu painel.",
          },
          {
            num: "03",
            title: "Ativação aplicada à carreira",
            desc: "Processo guiado pra traduzir o relatório em decisões reais sobre área, posicionamento e próximos passos.",
          },
        ]}
      />

      <LandingForWho
        title="Pra quem é"
        items={[
          "Quem está há tempos sentindo que está no lugar errado, mas não sabe onde é o lugar certo",
          "Quem já tentou se motivar com cursos, livros e podcasts, e a sensação volta",
          "Quem viu pessoas trocando de área e ficou se perguntando se também consegue",
          "Quem quer decidir com clareza, não com impulso, antes de pedir demissão",
          "Quem está em transição forçada (demissão, fim de ciclo) e precisa de mapa pra próxima",
        ]}
      />

      <LandingPricing
        badge="Acesso imediato"
        urgencyText="A cada mês parado na carreira errada, você perde renda e energia que não voltam."
        ctaText="Quero descobrir minha próxima carreira"
      />

      <LandingDisclaimer />
    </LandingShell>
  </>
);

export default LandingMudancaCarreira;
