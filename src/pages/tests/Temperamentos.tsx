import { TestDetailLayout } from "@/components/tests/TestDetailLayout";

const Temperamentos = () => {
  return (
    <TestDetailLayout
      title="Temperamentos"
      subtitle="As raízes clássicas da personalidade"
      storytelling="Desde os antigos, o ser humano é estudado por seus temperamentos.
Sanguíneo, colérico, melancólico ou fleumático — cada um revela uma forma de sentir, agir e servir.
No Essentia, esse teste conecta sabedoria tradicional e espiritualidade para uma leitura integral da sua personalidade."
      benefits={[
        "Seu temperamento predominante",
        "Como harmonizar emoções e decisões",
        "Como usar seus dons naturais em missão e convivência",
      ]}
      audience="Quem deseja compreender suas reações e encontrar equilíbrio emocional com base na fé."
    />
  );
};

export default Temperamentos;
