import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LandingNav } from "@/components/landing/LandingNav";
import { NelloGlobalFooter } from "@/components/global/NelloGlobalFooter";
import { SEOHead } from "@/components/SEOHead";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, FileText, Mail } from "lucide-react";

const TermsOfService = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isEn = language === "en";

  const content = {
    pt: {
      title: "Termos de Uso",
      subtitle: "Condições de uso da plataforma Nello Identity",
      lastUpdate: "Última atualização: 2025",
      backButton: "Voltar",
      backToSite: "Voltar para o site",
      sections: [
        {
          title: "1. Aceitação",
          content: [
            "Ao acessar ou utilizar o Nello Identity, você concorda com estes Termos de Uso e com nossa Política de Privacidade.",
            "Se você não concordar, recomendamos não utilizar a plataforma.",
          ],
        },
        {
          title: "2. O que é o Nello Identity",
          content: [
            "O Nello Identity é uma ferramenta de autoconhecimento e desenvolvimento humano baseada em mapas reflexivos e modelos amplamente utilizados em contextos educacionais e de desenvolvimento pessoal.",
          ],
          highlight: "O Nello Identity:",
          list: [
            "não é diagnóstico psicológico",
            "não é laudo clínico",
            "não substitui terapia ou acompanhamento profissional",
          ],
          footer: "O conteúdo gerado é interpretativo, educativo e reflexivo.",
        },
        {
          title: "3. Responsabilidade do usuário",
          content: [
            "O usuário compreende que os resultados apresentados são tendências e leituras de autoconhecimento, não verdades absolutas.",
            "O uso do Nello deve ser feito com maturidade e responsabilidade, como apoio à reflexão pessoal.",
          ],
        },
        {
          title: "4. Limitação de responsabilidade",
          content: [
            "O Nello Identity não se responsabiliza por decisões tomadas exclusivamente com base nos relatórios ou mapas apresentados.",
            "Em casos de sofrimento emocional intenso, recomenda-se buscar apoio profissional habilitado.",
          ],
        },
        {
          title: "5. Conta e acesso",
          content: [
            "Para utilizar algumas funcionalidades, o usuário deve criar uma conta com informações verdadeiras e manter seus dados atualizados.",
            "O usuário é responsável pela confidencialidade de seu login.",
          ],
        },
        {
          title: "6. Propriedade intelectual",
          content: [
            "Todo o conteúdo da plataforma, incluindo textos, relatórios, design e sistema, pertence ao Nello Identity.",
            "O usuário não pode copiar, reproduzir ou comercializar materiais sem autorização.",
          ],
        },
        {
          title: "7. Cancelamento e exclusão",
          content: [
            "O usuário pode solicitar a exclusão de sua conta e dados a qualquer momento, conforme previsto na LGPD.",
          ],
          link: {
            text: "Acesse sua área de privacidade para gerenciar seus dados.",
            href: "/me",
          },
        },
        {
          title: "8. Atualizações",
          content: [
            "Estes Termos podem ser atualizados periodicamente.",
            "A versão mais recente estará sempre disponível nesta página.",
          ],
        },
        {
          title: "9. Contato",
          content: ["Em caso de dúvidas, entre em contato:"],
          email: "suporte@nello.one",
        },
      ],
      disclaimer: "O Nello Identity é uma ferramenta de autoconhecimento e desenvolvimento humano. Não possui finalidade diagnóstica e não substitui avaliação psicológica clínica.",
    },
    en: {
      title: "Terms of Use",
      subtitle: "Terms and conditions for using the Nello Identity platform",
      lastUpdate: "Last update: 2025",
      backButton: "Back",
      backToSite: "Back to site",
      sections: [
        {
          title: "1. Acceptance",
          content: [
            "By accessing or using Nello Identity, you agree to these Terms of Use and our Privacy Policy.",
            "If you do not agree, we recommend not using the platform.",
          ],
        },
        {
          title: "2. What is Nello Identity",
          content: [
            "Nello Identity is a self-knowledge and human development tool based on reflective maps and models widely used in educational and personal development contexts.",
          ],
          highlight: "Nello Identity:",
          list: [
            "is not a psychological diagnosis",
            "is not a clinical report",
            "does not replace therapy or professional support",
          ],
          footer: "The generated content is interpretive, educational and reflective.",
        },
        {
          title: "3. User responsibility",
          content: [
            "The user understands that the results presented are tendencies and self-knowledge readings, not absolute truths.",
            "Nello should be used with maturity and responsibility, as support for personal reflection.",
          ],
        },
        {
          title: "4. Limitation of liability",
          content: [
            "Nello Identity is not responsible for decisions made solely based on the reports or maps presented.",
            "In cases of intense emotional distress, it is recommended to seek qualified professional support.",
          ],
        },
        {
          title: "5. Account and access",
          content: [
            "To use some features, the user must create an account with true information and keep their data updated.",
            "The user is responsible for the confidentiality of their login.",
          ],
        },
        {
          title: "6. Intellectual property",
          content: [
            "All platform content, including texts, reports, design and system, belongs to Nello Identity.",
            "The user may not copy, reproduce or commercialize materials without authorization.",
          ],
        },
        {
          title: "7. Cancellation and deletion",
          content: [
            "The user can request the deletion of their account and data at any time, as provided by LGPD.",
          ],
          link: {
            text: "Access your privacy area to manage your data.",
            href: "/me",
          },
        },
        {
          title: "8. Updates",
          content: [
            "These Terms may be updated periodically.",
            "The most recent version will always be available on this page.",
          ],
        },
        {
          title: "9. Contact",
          content: ["If you have any questions, contact us:"],
          email: "suporte@nello.one",
        },
      ],
      disclaimer: "Nello Identity is a self-knowledge and human development tool. It has no diagnostic purpose and does not replace clinical psychological evaluation.",
    },
  };

  const t = isEn ? content.en : content.pt;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={isEn ? "Terms of Use | Nello Identity" : "Termos de Uso | Nello Identity"}
        description={t.subtitle}
      />
      <LandingNav />

      <div className="pt-24 pb-16">
        <div className="container max-w-4xl mx-auto px-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-8 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.backButton}
          </Button>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">{isEn ? "Legal" : "Legal"}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              {t.title}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-2">
              {t.subtitle}
            </p>
            <p className="text-sm text-muted-foreground">{t.lastUpdate}</p>
          </div>

          {/* Sections */}
          <div className="space-y-10">
            {t.sections.map((section, index) => (
              <section key={index} className="border-b border-border pb-8 last:border-0">
                <h2 className="text-xl font-semibold text-foreground mb-4 font-serif">
                  {section.title}
                </h2>

                {section.content.map((paragraph, pIndex) => (
                  <p key={pIndex} className="text-muted-foreground leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}

                {section.highlight && (
                  <p className="text-foreground font-medium mb-2">{section.highlight}</p>
                )}

                {section.list && (
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                    {section.list.map((item, lIndex) => (
                      <li key={lIndex}>{item}</li>
                    ))}
                  </ul>
                )}

                {section.footer && (
                  <p className="text-muted-foreground leading-relaxed mb-4 italic">
                    {section.footer}
                  </p>
                )}

                {section.link && (
                  <Button
                    variant="link"
                    className="p-0 h-auto text-primary"
                    onClick={() => navigate(section.link.href)}
                  >
                    {section.link.text}
                  </Button>
                )}

                {section.email && (
                  <a
                    href={`mailto:${section.email}`}
                    className="inline-flex items-center gap-2 text-primary hover:underline"
                  >
                    <Mail className="w-4 h-4" />
                    {section.email}
                  </a>
                )}
              </section>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="mt-12 p-6 bg-muted/50 rounded-xl border border-border">
            <p className="text-sm text-muted-foreground text-center italic">
              "{t.disclaimer}"
            </p>
          </div>

          {/* Back button */}
          <div className="mt-12 text-center">
            <Button onClick={() => navigate("/")} className="px-8">
              {t.backToSite}
            </Button>
          </div>
        </div>
      </div>

      <NelloGlobalFooter currentApp="identity" />
    </div>
  );
};

export default TermsOfService;
