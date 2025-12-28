import { TestDetailLayout } from "@/components/tests/TestDetailLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { testContent } from "@/lib/testContent";

const DISC = () => {
  const { language } = useLanguage();
  const content = testContent.disc[language as keyof typeof testContent.disc] || testContent.disc.pt;

  return (
    <TestDetailLayout
      title={content.title}
      subtitle={content.subtitle}
      storytelling={content.storytelling}
      benefits={content.benefits}
      audience={content.audience}
      testType="disc"
      about={content.about}
    />
  );
};

export default DISC;
