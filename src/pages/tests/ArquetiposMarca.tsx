import { TestDetailLayout } from "@/components/tests/TestDetailLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { testContent } from "@/lib/testContent";

const ArquetiposMarca = () => {
  const { language } = useLanguage();
  const content = testContent.arquetipos[language as keyof typeof testContent.arquetipos] || testContent.arquetipos.pt;

  return (
    <TestDetailLayout
      title={content.title}
      subtitle={content.subtitle}
      storytelling={content.storytelling}
      benefits={content.benefits}
      audience={content.audience}
      testType="arquetipos"
      about={content.about}
    />
  );
};

export default ArquetiposMarca;
