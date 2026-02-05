import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LandingNav } from "@/components/landing/LandingNav";
import { NelloGlobalFooter } from "@/components/global/NelloGlobalFooter";
import { SEOHead } from "@/components/SEOHead";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, Shield, Mail } from "lucide-react";

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isEn = language === "en";

  const content = {
    pt: {
      title: "Privacidade e LGPD",
      subtitle: "Compromisso com transparência, segurança e respeito aos seus dados",
      intro: "O Nello Identity respeita profundamente a privacidade de cada usuário. Esta página explica, de forma clara, como coletamos, utilizamos e protegemos informações pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD, Lei nº 13.709/2018).",
      lastUpdate: "Última atualização: 2025",
      backButton: "Voltar",
      backToSite: "Voltar para o site",
      sections: [
        {
          title: "1. Quem somos",
          content: [
            "O Nello Identity é uma plataforma de autoconhecimento e desenvolvimento humano.",
            "Para fins da LGPD, somos o Controlador dos dados pessoais tratados dentro do sistema.",
            "Se você tiver qualquer dúvida sobre privacidade ou quiser exercer seus direitos, entre em contato pelo canal oficial:",
          ],
          email: "suporte@nello.one",
        },
        {
          title: "2. Quais dados coletamos",
          content: ["Ao utilizar o Nello Identity, podemos coletar informações como:"],
          list: [
            "nome e e-mail para criação e acesso à conta",
            "respostas fornecidas nos mapas de autoconhecimento",
            "informações necessárias para gerar relatórios e o Código da Essência",
            "dados técnicos básicos, como navegador, dispositivo e registros de acesso",
            "dados de pagamento, quando aplicável (processados por plataformas seguras de terceiros)",
          ],
          footer: "Coletamos apenas o necessário para funcionamento e melhoria da experiência.",
        },
        {
          title: "3. Dados de autoconhecimento e dados sensíveis",
          content: [
            "As respostas fornecidas nos mapas podem envolver aspectos emocionais, comportamentais e de identidade pessoal.",
            "Em alguns casos, esses dados podem ser considerados dados pessoais sensíveis, conforme definido pela LGPD.",
            "Por isso, tratamos essas informações com cuidado reforçado e utilizamos apenas para finalidades de autoconhecimento e desenvolvimento pessoal, sempre de forma reflexiva e não clínica.",
          ],
          highlight: "O Nello Identity não possui finalidade diagnóstica e não substitui acompanhamento psicológico ou terapêutico profissional.",
        },
        {
          title: "4. Base legal para o tratamento dos dados",
          content: ["Tratamos dados pessoais com fundamento nas bases legais previstas na LGPD, especialmente:"],
          list: [
            "consentimento do usuário, ao aceitar esta política e utilizar a plataforma",
            "execução do serviço contratado, para permitir acesso e geração dos relatórios",
            "legítimo interesse, quando necessário para melhorias de segurança e experiência, sempre respeitando direitos do usuário",
          ],
        },
        {
          title: "5. Para que usamos os dados",
          content: ["Utilizamos os dados para:"],
          list: [
            "permitir acesso seguro à plataforma",
            "gerar os mapas e relatórios reflexivos",
            "compor o Código da Essência como síntese integrativa",
            "oferecer suporte quando solicitado",
            "melhorar funcionalidades, usabilidade e segurança",
            "cumprir obrigações legais, quando necessário",
          ],
          highlight: "O Nello Identity nunca vende dados pessoais.",
        },
        {
          title: "6. Cookies e dados de navegação",
          content: ["Podemos utilizar cookies e tecnologias semelhantes para:"],
          list: [
            "funcionamento adequado do site",
            "análise de desempenho e melhoria da experiência",
            "segurança e prevenção de fraude",
          ],
          footer: "Caso ferramentas de analytics ou tráfego sejam utilizadas, elas seguem padrões de mercado e não têm como objetivo identificar usuários de forma indevida. Você pode ajustar cookies diretamente no seu navegador.",
        },
        {
          title: "7. Compartilhamento de informações",
          content: [
            "O Nello Identity não compartilha dados pessoais com terceiros para fins comerciais.",
            "Podemos utilizar fornecedores de infraestrutura (como hospedagem, banco de dados e pagamento), que tratam informações apenas para viabilizar o serviço, sob confidencialidade e segurança.",
          ],
        },
        {
          title: "8. Armazenamento e retenção",
          content: ["Mantemos os dados apenas pelo tempo necessário para:"],
          list: [
            "prestação do serviço",
            "cumprimento de obrigações legais",
            "proteção e segurança da plataforma",
          ],
          footer: "O usuário pode solicitar exclusão da conta e dos dados a qualquer momento, conforme seus direitos.",
        },
        {
          title: "9. Segurança e proteção",
          content: ["Adotamos medidas técnicas e organizacionais compatíveis com padrões modernos de segurança digital, incluindo:"],
          list: [
            "autenticação segura",
            "controle de acesso interno",
            "armazenamento protegido",
            "boas práticas de infraestrutura e monitoramento",
          ],
          footer: "Nenhum sistema é totalmente isento de riscos, mas nosso compromisso é manter um nível elevado de proteção e resposta responsável.",
        },
        {
          title: "10. Seus direitos garantidos pela LGPD",
          content: ["Você tem direito de solicitar, a qualquer momento:"],
          list: [
            "confirmação de tratamento dos seus dados",
            "acesso às informações armazenadas",
            "correção de dados incompletos ou desatualizados",
            "exclusão da conta e dados pessoais",
            "revogação do consentimento",
            "informações sobre uso e finalidade",
          ],
          footer: "Para exercer seus direitos, entre em contato:",
          email: "suporte@nello.one",
        },
        {
          title: "11. Atualizações desta política",
          content: [
            "Esta política pode ser atualizada periodicamente para refletir melhorias e obrigações legais.",
            "A versão mais recente estará sempre disponível nesta página.",
          ],
        },
      ],
      disclaimer: "O Nello Identity é uma ferramenta de autoconhecimento e desenvolvimento humano. Ele não possui finalidade diagnóstica e não substitui avaliação psicológica clínica ou acompanhamento terapêutico profissional.",
    },
    en: {
      title: "Privacy & LGPD",
      subtitle: "Commitment to transparency, security and respect for your data",
      intro: "Nello Identity deeply respects the privacy of each user. This page clearly explains how we collect, use and protect personal information, in compliance with the General Data Protection Law (LGPD, Law No. 13.709/2018).",
      lastUpdate: "Last update: 2025",
      backButton: "Back",
      backToSite: "Back to site",
      sections: [
        {
          title: "1. Who we are",
          content: [
            "Nello Identity is a self-knowledge and human development platform.",
            "For LGPD purposes, we are the Controller of personal data processed within the system.",
            "If you have any questions about privacy or want to exercise your rights, contact us through the official channel:",
          ],
          email: "suporte@nello.one",
        },
        {
          title: "2. What data we collect",
          content: ["When using Nello Identity, we may collect information such as:"],
          list: [
            "name and email for account creation and access",
            "responses provided in self-knowledge maps",
            "information necessary to generate reports and the Essence Code",
            "basic technical data, such as browser, device and access logs",
            "payment data, when applicable (processed by secure third-party platforms)",
          ],
          footer: "We only collect what is necessary for operation and experience improvement.",
        },
        {
          title: "3. Self-knowledge data and sensitive data",
          content: [
            "The responses provided in the maps may involve emotional, behavioral and personal identity aspects.",
            "In some cases, this data may be considered sensitive personal data, as defined by LGPD.",
            "Therefore, we treat this information with reinforced care and use it only for self-knowledge and personal development purposes, always in a reflective and non-clinical manner.",
          ],
          highlight: "Nello Identity has no diagnostic purpose and does not replace psychological or professional therapeutic support.",
        },
        {
          title: "4. Legal basis for data processing",
          content: ["We process personal data based on the legal bases provided for in LGPD, especially:"],
          list: [
            "user consent, by accepting this policy and using the platform",
            "execution of the contracted service, to allow access and report generation",
            "legitimate interest, when necessary for security and experience improvements, always respecting user rights",
          ],
        },
        {
          title: "5. How we use data",
          content: ["We use data to:"],
          list: [
            "allow secure access to the platform",
            "generate reflective maps and reports",
            "compose the Essence Code as an integrative synthesis",
            "offer support when requested",
            "improve features, usability and security",
            "comply with legal obligations, when necessary",
          ],
          highlight: "Nello Identity never sells personal data.",
        },
        {
          title: "6. Cookies and browsing data",
          content: ["We may use cookies and similar technologies for:"],
          list: [
            "proper website functioning",
            "performance analysis and experience improvement",
            "security and fraud prevention",
          ],
          footer: "If analytics or traffic tools are used, they follow market standards and are not intended to improperly identify users. You can adjust cookies directly in your browser.",
        },
        {
          title: "7. Information sharing",
          content: [
            "Nello Identity does not share personal data with third parties for commercial purposes.",
            "We may use infrastructure providers (such as hosting, database and payment), who process information only to enable the service, under confidentiality and security.",
          ],
        },
        {
          title: "8. Storage and retention",
          content: ["We keep data only for the time necessary for:"],
          list: [
            "service provision",
            "compliance with legal obligations",
            "platform protection and security",
          ],
          footer: "The user can request account and data deletion at any time, according to their rights.",
        },
        {
          title: "9. Security and protection",
          content: ["We adopt technical and organizational measures compatible with modern digital security standards, including:"],
          list: [
            "secure authentication",
            "internal access control",
            "protected storage",
            "infrastructure and monitoring best practices",
          ],
          footer: "No system is completely risk-free, but our commitment is to maintain a high level of protection and responsible response.",
        },
        {
          title: "10. Your rights guaranteed by LGPD",
          content: ["You have the right to request, at any time:"],
          list: [
            "confirmation of data processing",
            "access to stored information",
            "correction of incomplete or outdated data",
            "account and personal data deletion",
            "consent revocation",
            "information about use and purpose",
          ],
          footer: "To exercise your rights, contact:",
          email: "suporte@nello.one",
        },
        {
          title: "11. Updates to this policy",
          content: [
            "This policy may be updated periodically to reflect improvements and legal obligations.",
            "The most recent version will always be available on this page.",
          ],
        },
      ],
      disclaimer: "Nello Identity is a self-knowledge and human development tool. It has no diagnostic purpose and does not replace clinical psychological evaluation or professional therapeutic support.",
    },
  };

  const t = isEn ? content.en : content.pt;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={isEn ? "Privacy & LGPD | Nello Identity" : "Privacidade e LGPD | Nello Identity"}
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
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">LGPD</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              {t.title}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-2">
              {t.subtitle}
            </p>
            <p className="text-sm text-muted-foreground">{t.lastUpdate}</p>
          </div>

          {/* Intro */}
          <div className="bg-muted/30 rounded-2xl p-8 mb-10">
            <p className="text-foreground leading-relaxed text-lg">
              {t.intro}
            </p>
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

                {section.email && (
                  <a 
                    href={`mailto:${section.email}`}
                    className="inline-flex items-center gap-2 text-primary hover:underline mb-4"
                  >
                    <Mail className="w-4 h-4" />
                    {section.email}
                  </a>
                )}

                {section.list && (
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                    {section.list.map((item, lIndex) => (
                      <li key={lIndex}>{item}</li>
                    ))}
                  </ul>
                )}

                {section.footer && (
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    {section.footer}
                  </p>
                )}

                {section.highlight && (
                  <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-lg mt-4">
                    <p className="text-foreground font-medium italic">
                      {section.highlight}
                    </p>
                  </div>
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
            <Button
              onClick={() => navigate("/")}
              className="px-8"
            >
              {t.backToSite}
            </Button>
          </div>
        </div>
      </div>

      <NelloGlobalFooter currentApp="identity" />
    </div>
  );
};

export default PrivacyPolicy;
