import { TestDetailLayout } from "@/components/tests/TestDetailLayout";

const MBTI = () => {
  return (
    <TestDetailLayout
      title="MBTI"
      subtitle="Compreenda sua forma única de pensar e decidir"
      storytelling="Cada mente é uma combinação única entre razão e intuição.
O MBTI (Myers-Briggs) revela como você processa o mundo e toma decisões.
No Essentia, ele é usado para compreender como sua essência pensa, sente e age diante da vida."
      benefits={[
        "Seu tipo psicológico (ex: INFP, ESTJ etc.)",
        "Como equilibrar razão, emoção e propósito",
        "Como se posicionar com clareza em decisões profissionais e pessoais",
      ]}
      audience="Quem busca autoconhecimento profundo e alinhamento entre mente e fé."
    />
  );
};

export default MBTI;
