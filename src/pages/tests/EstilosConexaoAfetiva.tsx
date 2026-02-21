import { TestDetailLayout } from "@/components/tests/TestDetailLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { testContent } from "@/lib/testContent";

const EstilosConexaoAfetiva = () => {
  const { language } = useLanguage();
  const contentSource = testContent.estilos_conexao_afetiva || testContent.linguagens_amor;
  const content = contentSource[language as keyof typeof contentSource] || contentSource.pt;

  return (
    <TestDetailLayout
      title={content.title}
      subtitle={content.subtitle}
      storytelling={content.storytelling}
      benefits={content.benefits}
      audience={content.audience}
      testType="estilos_conexao_afetiva"
      about={content.about}
    />
  );
};

export default EstilosConexaoAfetiva;
