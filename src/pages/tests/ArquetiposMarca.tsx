import { TestDetailLayout } from "@/components/tests/TestDetailLayout";

const ArquetiposMarca = () => {
  return (
    <TestDetailLayout
      title="Arquétipos de Marca"
      subtitle="Descubra o símbolo que habita em você"
      storytelling="Antes de qualquer palavra, o mundo já sente quem você é.
Essa presença é o reflexo do seu arquétipo — a energia que comunica sua verdade antes mesmo que você fale.

No Essentia, esse teste revela as forças simbólicas que movem sua personalidade, sua imagem e sua missão.
Mais do que marketing, é um mapa espiritual da sua comunicação."
      benefits={[
        "Seu arquétipo principal e o complementar",
        "Como traduzir propósito em presença",
        "Como alinhar sua imagem à sua verdade interior",
      ]}
      audience="Líderes, empreendedores e comunicadores que desejam se posicionar com fé, autoridade e autenticidade."
    />
  );
};

export default ArquetiposMarca;
