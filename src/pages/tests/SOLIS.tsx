import { TestDetailLayout } from "@/components/tests/TestDetailLayout";

const SOLIS = () => {
  return (
    <TestDetailLayout
      title="SOLIS"
      subtitle="A Luz Interior como expressão de estilo"
      storytelling="O SOLIS é exclusivo do Essentia.
Inspirado no conceito da luz interior, ele revela como a sua alma se manifesta através da estética, das cores e da presença.
É a ponte entre espiritualidade e expressão visual."
      benefits={[
        "O brilho único da sua presença",
        "Como traduzir fé e personalidade em estilo",
        "Como tornar sua imagem uma mensagem viva",
      ]}
      audience="Quem deseja alinhar imagem, espiritualidade e propósito de vida."
      testType="solis"
    />
  );
};

export default SOLIS;
