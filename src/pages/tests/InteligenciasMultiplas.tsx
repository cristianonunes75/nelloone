import { TestDetailLayout } from "@/components/tests/TestDetailLayout";

const InteligenciasMultiplas = () => {
  return (
    <TestDetailLayout
      title="Inteligências Múltiplas"
      subtitle="Reconheça seus dons e talentos"
      storytelling="Cada pessoa tem formas únicas de expressar inteligência: musical, emocional, lógica, corporal, interpessoal…
Esse teste revela o modo como você manifesta os dons que Deus te confiou."
      benefits={[
        "Suas inteligências dominantes",
        "Como desenvolver talentos ainda ocultos",
        "Como usar suas habilidades para servir e prosperar",
      ]}
      audience="Profissionais, educadores, artistas e empreendedores que desejam alinhar talento, propósito e fé."
    />
  );
};

export default InteligenciasMultiplas;
