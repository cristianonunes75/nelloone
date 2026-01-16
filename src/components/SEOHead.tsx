import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SEOConfig {
  pt: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
  };
  en: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
  };
}

interface SEOHeadProps {
  page?: "landing" | "pricing" | "auth";
  // Custom overrides for external apps (Flow, Life, etc.)
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  siteUrl?: string;
}

const seoConfig: Record<string, SEOConfig> = {
  landing: {
    pt: {
      title: "Nello One | Autoconhecimento humano a serviço de uma vida com sentido",
      description: "Descubra seus padrões, talentos e propósitos com uma jornada guiada de autoconhecimento. 7 testes comportamentais + Código da Essência personalizado.",
      ogTitle: "Nello One — Clareza para entender quem você é",
      ogDescription: "Uma jornada de autoconhecimento em 7 etapas. Descubra seus padrões, talentos e propósitos. Parte do ecossistema Nello.",
    },
    en: {
      title: "Nello One | Self-knowledge for a meaningful life",
      description: "Discover your patterns, talents and purpose with a guided self-knowledge journey. 7 behavioral tests + Personalized Essence Code.",
      ogTitle: "Nello One — Clarity to understand who you are",
      ogDescription: "A self-knowledge journey in 7 stages. Discover your patterns, talents and purpose. Part of the Nello ecosystem.",
    },
  },
  pricing: {
    pt: {
      title: "Planos e Preços | Nello One",
      description: "Escolha o plano ideal para sua jornada de autoconhecimento. Acesso completo aos 7 testes e Código da Essência.",
      ogTitle: "Planos Nello One — Invista em clareza",
      ogDescription: "Acesso completo à jornada de autoconhecimento. 7 testes comportamentais + Código da Essência personalizado.",
    },
    en: {
      title: "Plans & Pricing | Nello One",
      description: "Choose the ideal plan for your self-knowledge journey. Full access to 7 tests and Essence Code.",
      ogTitle: "Nello One Plans — Invest in clarity",
      ogDescription: "Full access to the self-knowledge journey. 7 behavioral tests + Personalized Essence Code.",
    },
  },
  auth: {
    pt: {
      title: "Entrar | Nello One",
      description: "Acesse sua conta Nello One e continue sua jornada de autoconhecimento.",
      ogTitle: "Entrar no Nello One",
      ogDescription: "Acesse sua conta e continue sua jornada de autoconhecimento.",
    },
    en: {
      title: "Sign In | Nello One",
      description: "Access your Nello One account and continue your self-knowledge journey.",
      ogTitle: "Sign In to Nello One",
      ogDescription: "Access your account and continue your self-knowledge journey.",
    },
  },
};

export const SEOHead = ({ 
  page = "landing",
  title: customTitle,
  description: customDescription,
  keywords,
  ogTitle: customOgTitle,
  ogDescription: customOgDescription,
  siteUrl: customSiteUrl,
}: SEOHeadProps) => {
  const { language } = useLanguage();
  const pageConfig = seoConfig[page]?.[language] || seoConfig.landing.pt;
  
  // Use custom props if provided, otherwise fall back to page config
  const config = {
    title: customTitle || pageConfig.title,
    description: customDescription || pageConfig.description,
    ogTitle: customOgTitle || customTitle || pageConfig.ogTitle,
    ogDescription: customOgDescription || customDescription || pageConfig.ogDescription,
  };
  
  const siteUrl = customSiteUrl || "https://nelloone.com";
  const currentUrl = `${siteUrl}${language === "en" ? "/en" : ""}`;

  useEffect(() => {
    // Update title
    document.title = config.title;

    // Helper to update or create meta tags
    const setMetaTag = (name: string, content: string, property?: boolean) => {
      const attr = property ? "property" : "name";
      let element = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Standard meta tags
    setMetaTag("description", config.description);
    setMetaTag("author", "NELLO ONE");

    // Open Graph tags
    setMetaTag("og:type", "website", true);
    setMetaTag("og:url", currentUrl, true);
    setMetaTag("og:title", config.ogTitle, true);
    setMetaTag("og:description", config.ogDescription, true);
    setMetaTag("og:image", `${siteUrl}/og-image.png`, true);
    setMetaTag("og:site_name", "NELLO ONE", true);
    setMetaTag("og:locale", language === "en" ? "en_US" : "pt_BR", true);

    // Twitter Card tags
    setMetaTag("twitter:card", "summary_large_image");
    setMetaTag("twitter:title", config.ogTitle);
    setMetaTag("twitter:description", config.ogDescription);
    setMetaTag("twitter:image", `${siteUrl}/og-image.png`);

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", currentUrl);

    // Alternate language links
    const setAlternateLink = (lang: string, href: string) => {
      let link = document.querySelector(`link[hreflang="${lang}"]`) as HTMLLinkElement;
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "alternate");
        link.setAttribute("hreflang", lang);
        document.head.appendChild(link);
      }
      link.setAttribute("href", href);
    };

    setAlternateLink("pt", siteUrl);
    setAlternateLink("en", `${siteUrl}/en`);
    setAlternateLink("x-default", siteUrl);

  }, [config, currentUrl, language]);

  return null;
};
