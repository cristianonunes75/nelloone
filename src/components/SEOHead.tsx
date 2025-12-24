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
      title: "NELLO ONE | Autoconhecimento Guiado por IA",
      description: "Descubra seus padrões, forças e caminhos de evolução com o sistema completo de autoconhecimento guiado por IA. 7 testes profissionais + Mapa de Identidade personalizado.",
      ogTitle: "NELLO ONE — Conheça quem você é. Transforme o que importa.",
      ogDescription: "O sistema completo de autoconhecimento que revela seus padrões emocionais, forças e desafios com profundidade e simplicidade. Comece grátis.",
    },
    en: {
      title: "NELLO ONE | AI-Guided Self-Knowledge",
      description: "Discover your patterns, strengths and growth pathways with the complete AI-guided self-knowledge system. 7 professional tests + Personalized Identity Map.",
      ogTitle: "NELLO ONE — Know who you are. Transform what matters.",
      ogDescription: "The complete self-knowledge system that reveals your emotional patterns, strengths and challenges with depth and simplicity. Start free.",
    },
  },
  pricing: {
    pt: {
      title: "Planos e Preços | NELLO ONE",
      description: "Escolha o plano ideal para sua jornada de autoconhecimento. Teste gratuito disponível. Acesso completo aos 7 testes e Mapa NELLO ONE.",
      ogTitle: "Planos NELLO ONE — Invista em clareza",
      ogDescription: "Acesso completo ao sistema de autoconhecimento guiado por IA. 7 testes profissionais + Mapa de Identidade personalizado.",
    },
    en: {
      title: "Plans & Pricing | NELLO ONE",
      description: "Choose the ideal plan for your self-knowledge journey. Free test available. Full access to 7 tests and NELLO ONE Map.",
      ogTitle: "NELLO ONE Plans — Invest in clarity",
      ogDescription: "Full access to the AI-guided self-knowledge system. 7 professional tests + Personalized Identity Map.",
    },
  },
  auth: {
    pt: {
      title: "Entrar | NELLO ONE",
      description: "Acesse sua conta NELLO ONE e continue sua jornada de autoconhecimento.",
      ogTitle: "Entrar no NELLO ONE",
      ogDescription: "Acesse sua conta e continue sua jornada de autoconhecimento guiado por IA.",
    },
    en: {
      title: "Sign In | NELLO ONE",
      description: "Access your NELLO ONE account and continue your self-knowledge journey.",
      ogTitle: "Sign In to NELLO ONE",
      ogDescription: "Access your account and continue your AI-guided self-knowledge journey.",
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
