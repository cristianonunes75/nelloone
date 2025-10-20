import { TestDetailLayout } from "@/components/tests/TestDetailLayout";

const DISC = () => {
  return (
    <TestDetailLayout
      title="DISC"
      subtitle="Descubra seu perfil comportamental"
      storytelling="Este teste identifica o seu perfil comportamental natural. A metodologia DISC revela como você reage, decide, comunica e contribui em diferentes contextos da vida e do trabalho.

Cada pessoa tem um ritmo único de ação. O DISC mostra como você se expressa, toma decisões e se relaciona. No Essentia, esse teste ajuda você a compreender o que move suas atitudes e como gerar impacto com equilíbrio e autenticidade."
      benefits={[
        "Seu perfil comportamental predominante (D, I, S ou C)",
        "Como usar sua energia natural sem se sobrecarregar",
        "Como fortalecer relacionamentos e liderança",
        "Seu caminho de crescimento pessoal"
      ]}
      audience="Profissionais, gestores, mentores e missionários que desejam liderar com empatia e propósito."
      testType="disc"
    />
  );
};

export default DISC;
