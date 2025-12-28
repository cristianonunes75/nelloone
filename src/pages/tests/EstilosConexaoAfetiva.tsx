import { TestDetailLayout } from "@/components/tests/TestDetailLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { testContent } from "@/lib/testContent";

const EstilosConexaoAfetiva = () => {
  const { language } = useLanguage();
  const content = testContent.linguagens_amor[language as keyof typeof testContent.linguagens_amor] || testContent.linguagens_amor.pt;

  return (
    <TestDetailLayout
      title={content.title}
      subtitle={content.subtitle}
      storytelling={content.storytelling}
      benefits={content.benefits}
      audience={content.audience}
      testType="linguagens_amor"
      about={content.about}
    />
  );
};

export default EstilosConexaoAfetiva;
