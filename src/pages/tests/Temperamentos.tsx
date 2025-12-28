import { TestDetailLayout } from "@/components/tests/TestDetailLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { testContent } from "@/lib/testContent";

const Temperamentos = () => {
  const { language } = useLanguage();
  const content = testContent.temperamentos[language as keyof typeof testContent.temperamentos] || testContent.temperamentos.pt;

  return (
    <TestDetailLayout
      title={content.title}
      subtitle={content.subtitle}
      storytelling={content.storytelling}
      benefits={content.benefits}
      audience={content.audience}
      testType="temperamentos"
      about={content.about}
    />
  );
};

export default Temperamentos;
