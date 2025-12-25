import { TestDetailLayout } from "@/components/tests/TestDetailLayout";

const Nello16Personality = () => {
  return (
    <TestDetailLayout
      title="Nello 16 Personality Map"
      subtitle="Descubra seu perfil psicológico único"
      storytelling="O Nello 16 Personality Map é um sistema exclusivo do Nello One que traduz as teorias de Carl Jung em um modelo moderno de 16 perfis psicológicos. Ele identifica como você percebe o mundo, processa informações, toma decisões e se relaciona com diferentes ambientes."
      benefits={[
        "Seu tipo psicológico com código exclusivo Nello",
        "Como seu comportamento molda suas relações e decisões",
        "Mapa visual com forças, desafios e orientações práticas",
      ]}
      audience="Quem busca autoconhecimento profundo e clareza sobre como pensa, decide e se relaciona."
      testType="mbti"
    />
  );
};

export default Nello16Personality;
