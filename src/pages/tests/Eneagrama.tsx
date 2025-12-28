import { TestDetailLayout } from "@/components/tests/TestDetailLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { testContent } from "@/lib/testContent";

const Eneagrama = () => {
  const { language } = useLanguage();
  const content = testContent.eneagrama[language as keyof typeof testContent.eneagrama] || testContent.eneagrama.pt;

  return (
    <TestDetailLayout
      title={content.title}
      subtitle={content.subtitle}
      storytelling={content.storytelling}
      benefits={content.benefits}
      audience={content.audience}
      testType="eneagrama"
      about={content.about}
    />
  );
};

export default Eneagrama;
