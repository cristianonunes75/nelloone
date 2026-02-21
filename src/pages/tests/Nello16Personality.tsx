import { TestDetailLayout } from "@/components/tests/TestDetailLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { testContent } from "@/lib/testContent";

const Nello16Personality = () => {
  const { language } = useLanguage();
  const content = testContent.mbti[language as keyof typeof testContent.mbti] || testContent.mbti.pt;

  return (
    <TestDetailLayout
      title={content.title}
      subtitle={content.subtitle}
      storytelling={content.storytelling}
      benefits={content.benefits}
      audience={content.audience}
      testType="nello16"
      about={content.about}
    />
  );
};

export default Nello16Personality;
