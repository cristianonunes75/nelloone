import { TestDetailLayout } from "@/components/tests/TestDetailLayout";

const Eneagrama = () => {
  return (
    <TestDetailLayout
      title="Eneagrama"
      subtitle="O mapa das motivações da alma"
      storytelling="Por trás de cada atitude, existe uma motivação. O Eneagrama revela o que move seu coração — as virtudes e desafios que moldam seu modo de amar, trabalhar e viver. No Essentia, ele é uma chave para a liberdade interior."
      benefits={[
        "Seu tipo de personalidade entre os 9 perfis do Eneagrama",
        "Como transformar feridas em virtudes através do autoconhecimento",
        "Compreender padrões emocionais profundos que guiam suas ações",
        "O caminho de crescimento espiritual único do seu tipo",
      ]}
      audience="Para quem busca compreender as motivações profundas da alma e viver com mais equilíbrio interior."
    />
  );
};

export default Eneagrama;
