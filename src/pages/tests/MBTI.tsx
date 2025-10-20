import { TestDetailLayout } from "@/components/tests/TestDetailLayout";

const MBTI = () => {
  return (
    <TestDetailLayout
      title="MBTI"
      subtitle="Compreenda sua forma única de pensar e decidir"
      storytelling="Descubra como você percebe o mundo, toma decisões e se relaciona com a vida. Este teste identifica o seu tipo psicológico segundo a teoria dos tipos de Carl Jung e adapta-o à linguagem simbólica do Essentia."
      benefits={[
        "Seu tipo psicológico (ex: INFP, ESTJ etc.)",
        "Como equilibrar razão, emoção e propósito",
        "Como se posicionar com clareza em decisões profissionais e pessoais",
      ]}
      audience="Quem busca autoconhecimento profundo e alinhamento entre mente e fé."
      testType="mbti"
    />
  );
};

export default MBTI;
