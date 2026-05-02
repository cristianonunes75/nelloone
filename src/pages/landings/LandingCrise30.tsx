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
  Hourglass,
  CloudRain,
  Search,
  Repeat,
  Eye,
  Layers,
  Heart,
  Sparkles,
} from "lucide-react";

const LandingCrise30 = () => (
  <>
    <SEOHead
      page="landing"
      title="Crise dos 30 | Nello Identity"
      description="Se você sente que está perdendo tempo e não sabe quem você é de verdade, o Nello Identity te dá clareza em minutos."
    />
    <LandingShell>
      <LandingHero
        eyebrow="Pra quem chegou nos 30 e travou"
        title="Não é crise."
        highlight="É a primeira vez que você se ouve."
        subtitle="Um relatório de identidade gerado por IA pra quem sente que tudo aparentemente está certo, mas algo por dentro não fecha."
        paragraphs={[
          "Você fez o que combinaram com você. Faculdade, emprego, relacionamento, talvez filho. E mesmo assim acorda às vezes com a sensação de estar vivendo a vida de outra pessoa.",
          "Não é depressão. Não é falta de gratidão. É a primeira vez na vida que você está em silêncio o suficiente pra escutar o que a sua identidade real está pedindo.",
        ]}
        ctaText="Quero entender o que está acontecendo"
      />

      <LandingProblem
        title="A crise dos 30 não é um problema."
        highlight="É um sinal de que você está pronto pra se conhecer de verdade."
        items={[
          { icon: Hourglass, text: "Sensação de estar perdendo tempo" },
          { icon: CloudRain, text: "Tudo aparentemente certo, mas vazio por dentro" },
          { icon: Search, text: "Não sei mais o que eu quero, e isso assusta" },
          { icon: Repeat, text: "Vontade de mudar tudo, sem saber por onde começar" },
        ]}
      />

      <LandingAuthority
        title="O problema não é a sua vida. É que você nunca te conheceu de verdade."
        paragraphs={[
          "A maioria das pessoas chega aos 30 carregando escolhas que foram feitas por reflexo da família, da escola, da religião, do mercado. Aos 17, 22, 26, ninguém te ensinou a se ouvir, então você fez o que parecia certo.",
          "O Nello Identity faz o que ninguém fez: te entrega um mapa profundo de quem você é, em camadas que vão muito além de personalidade. Padrões emocionais, valores reais, conflitos internos, talentos invisíveis. A leitura que faltava pra você decidir os próximos 10 anos com lucidez.",
        ]}
      />

      <LandingPillars
        title="O que o seu relatório vai te devolver"
        intro="Não é coaching de motivação. É um diagnóstico técnico de identidade que serve de chão pras próximas decisões grandes da sua vida."
        blocks={[
          {
            icon: Eye,
            title: "Seus padrões emocionais profundos",
            desc: "O que move você de verdade, e o que você passou anos tentando silenciar achando que era frescura.",
          },
          {
            icon: Layers,
            title: "Conflitos internos mapeados",
            desc: "Por que você quer mudar e ao mesmo tempo trava. As duas vozes têm nome e o relatório mostra de onde vêm.",
          },
          {
            icon: Heart,
            title: "Seus valores reais",
            desc: "O que de fato importa pra você, separado do que te ensinaram a achar que deveria importar.",
          },
          {
            icon: Sparkles,
            title: "Ativação do Código",
            desc: "Processo guiado pra aplicar a leitura na vida real: carreira, relacionamento, escolhas adiadas.",
          },
        ]}
      />

      <LandingHow
        title="Como funciona"
        steps={[
          {
            num: "01",
            title: "Leitura Inicial",
            desc: "Questionário estruturado, respondido em poucos minutos. Quanto mais honesto, mais fundo a IA enxerga.",
          },
          {
            num: "02",
            title: "Código da Essência por IA",
            desc: "7 mapas de autoconhecimento integrados em uma única narrativa sobre quem você é. Disponível no seu painel pra reler quantas vezes quiser.",
          },
          {
            num: "03",
            title: "Ativação aplicada às decisões reais",
            desc: "Trilha guiada pra traduzir o que você descobriu em decisões concretas, no seu tempo, sem pressão de virar outra pessoa em 30 dias.",
          },
        ]}
      />

      <LandingForWho
        title="Pra quem é"
        items={[
          "Quem está entre 28 e 38 anos sentindo que algo precisa mudar, mas não sabe o quê",
          "Quem fez tudo certo no roteiro e mesmo assim sente que falta algo",
          "Quem já está em terapia e quer aprofundar com uma leitura estruturada de identidade",
          "Quem está pensando em mudar de carreira, cidade, ou relacionamento, e quer decidir com lucidez",
          "Quem cansou de ler livro de autoajuda e quer um diagnóstico real, com nome e direção",
        ]}
      />

      <LandingPricing
        badge="Acesso imediato · vitalício"
        urgencyText="Daqui a um ano você vai estar em algum lugar. A diferença começa em alguns minutos de leitura."
        ctaText="Quero meu Código da Essência"
      />

      <LandingDisclaimer />
    </LandingShell>
  </>
);

export default LandingCrise30;
