import { TestDetailLayout } from "@/components/tests/TestDetailLayout";

const EstilosConexaoAfetiva = () => {
  return (
    <TestDetailLayout
      title="Estilos de Conexão Afetiva"
      subtitle="Como você se conecta emocionalmente?"
      storytelling="Cada pessoa se conecta emocionalmente de formas diferentes: através da presença, das palavras, do cuidado prático, de gestos simbólicos ou do contato físico.
Este teste revela seu estilo primário de conexão afetiva — e como você pode cultivar relacionamentos mais profundos e autênticos."
      benefits={[
        "Seu estilo primário e secundário de conexão afetiva",
        "Como fortalecer seus relacionamentos",
        "Recomendações práticas para conexões mais profundas",
      ]}
      audience="Pessoas em relacionamentos, famílias, profissionais que trabalham com pessoas e todos que desejam cultivar conexões mais verdadeiras."
      testType="linguagens_amor"
    />
  );
};

export default EstilosConexaoAfetiva;
