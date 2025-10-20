import { TestDetailLayout } from "@/components/tests/TestDetailLayout";

const LinguagensAmor = () => {
  return (
    <TestDetailLayout
      title="Linguagens do Amor"
      subtitle="A forma como você dá e recebe amor"
      storytelling="Todos amam, mas nem todos falam a mesma linguagem.
Esse teste, inspirado em Gary Chapman, ajuda você a compreender como expressa e percebe amor, seja em relacionamentos, família ou missão."
      benefits={[
        "Sua linguagem principal e as secundárias",
        "Como comunicar afeto e cuidado de forma verdadeira",
        "Como fortalecer vínculos com empatia e equilíbrio",
      ]}
      audience="Casais, pais, líderes e qualquer pessoa que deseja amar melhor."
    />
  );
};

export default LinguagensAmor;
