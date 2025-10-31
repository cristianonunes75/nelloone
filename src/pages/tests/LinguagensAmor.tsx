import { TestDetailLayout } from "@/components/tests/TestDetailLayout";

const LinguagensAmor = () => {
  return (
    <TestDetailLayout
      title="Linguagens do Amor"
      subtitle="Como você ama e se sente amado?"
      storytelling="Cada pessoa expressa e recebe amor de formas diferentes: palavras, tempo, presentes, ajuda prática ou toque físico.
Esse teste revela como o amor fala em sua alma — e como você pode comunicar e receber afeto de forma mais verdadeira."
      benefits={[
        "Sua linguagem primária e secundária de amor",
        "Como melhorar seus relacionamentos afetivos",
        "Recomendações práticas de comunicação e convivência",
      ]}
      audience="Pessoas em relacionamentos, famílias, profissionais que trabalham com pessoas e todos que desejam aprofundar conexões verdadeiras."
      testType="linguagens_amor"
    />
  );
};

export default LinguagensAmor;
