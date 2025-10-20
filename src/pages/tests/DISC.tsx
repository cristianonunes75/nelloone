import { TestDetailLayout } from "@/components/tests/TestDetailLayout";

const DISC = () => {
  return (
    <TestDetailLayout
      title="DISC"
      subtitle="Entenda como o mundo percebe sua energia"
      storytelling="Cada pessoa tem um ritmo e uma forma de agir.
O DISC revela como você reage, decide e influencia os outros.
No Essentia, esse teste te ajuda a compreender o que move suas atitudes e como gerar impacto com equilíbrio e autenticidade."
      benefits={[
        "Seu perfil comportamental predominante",
        "Como usar sua energia natural sem se sobrecarregar",
        "Como fortalecer relacionamentos e liderança",
      ]}
      audience="Profissionais, gestores, mentores e missionários que desejam liderar com empatia e propósito."
    />
  );
};

export default DISC;
