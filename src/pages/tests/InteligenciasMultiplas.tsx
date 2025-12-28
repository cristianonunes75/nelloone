import { TestDetailLayout } from "@/components/tests/TestDetailLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { testContent } from "@/lib/testContent";

const InteligenciasMultiplas = () => {
  const { language } = useLanguage();
  const content = testContent.inteligencias_multiplas[language as keyof typeof testContent.inteligencias_multiplas] || testContent.inteligencias_multiplas.pt;

  return (
    <TestDetailLayout
      title={content.title}
      subtitle={content.subtitle}
      storytelling={content.storytelling}
      benefits={content.benefits}
      audience={content.audience}
      testType="inteligencias_multiplas"
      about={content.about}
    />
  );
};

export default InteligenciasMultiplas;
