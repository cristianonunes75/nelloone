import { TestDetailLayout } from "@/components/tests/TestDetailLayout";

const InteligenciasMultiplas = () => {
  return (
    <TestDetailLayout
      title="Inteligências Múltiplas"
      subtitle="Reconheça seus dons e talentos"
      storytelling="Cada pessoa tem uma combinação única de talentos e formas de pensar. O teste das Inteligências Múltiplas mostra quais áreas da sua mente têm mais energia — e como usá-las no trabalho, na vocação e na vida."
      benefits={[
        "40 perguntas para revelar como sua mente aprende, cria e realiza",
        "Relatório de 10 páginas com leitura simbólica + plano de ação pessoal",
        "Gráfico com suas 8 inteligências mapeadas",
        "Recomendações personalizadas de desenvolvimento",
        "Acesso completo ao seu perfil de inteligências"
      ]}
      audience="Profissionais, educadores, artistas e empreendedores que desejam alinhar talento, propósito e fé."
      testType="inteligencias_multiplas"
    />
  );
};

export default InteligenciasMultiplas;
