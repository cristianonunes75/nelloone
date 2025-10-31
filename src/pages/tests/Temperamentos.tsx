import { TestDetailLayout } from "@/components/tests/TestDetailLayout";

const Temperamentos = () => {
  return (
    <TestDetailLayout
      title="Temperamentos"
      subtitle="Conheça sua natureza essencial"
      storytelling="Desde Hipócrates, o ser humano busca entender as quatro formas fundamentais de ser: sanguíneo, colérico, melancólico e fleumático.
Esse teste revela a base da sua personalidade — e como harmonizar suas tendências naturais com propósito e equilíbrio."
      benefits={[
        "Seu temperamento dominante e secundário",
        "Como sua natureza influencia decisões e relacionamentos",
        "Como desenvolver suas forças e harmonizar suas tendências",
      ]}
      audience="Líderes, empreendedores, profissionais de saúde e todos que buscam autoconhecimento profundo baseado em tradição milenar."
      testType="temperamentos"
    />
  );
};

export default Temperamentos;
