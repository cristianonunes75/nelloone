import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { getNelloAppUrl, NelloApp, useSubdomain } from "@/hooks/useSubdomain";
import { useNavigate, useLocation } from "react-router-dom";
import { Instagram, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface NelloGlobalFooterProps {
  currentApp?: NelloApp;
  variant?: 'light' | 'dark';
}

/**
 * Global Footer for the entire Nello ecosystem (4-column structure)
 * Used across all 5 modules: Identity, Life, Flow, Business, Praxis
 */
export const NelloGlobalFooter = ({ currentApp, variant = 'light' }: NelloGlobalFooterProps) => {
  const { language } = useLanguage();
  const { app: detectedApp } = useSubdomain();
  const navigate = useNavigate();
  const location = useLocation();

  const activeApp = currentApp || detectedApp;
  const isDark = variant === 'dark';
  
  // Feature flag to hide ecosystem column (starting with Identity only)
  const SHOW_ECOSYSTEM_COLUMN = false;
  
  // Brand names per app
  const appBranding: Record<NelloApp, { name: string; tagline: { pt: string; en: string } }> = {
    main: {
      name: 'ONE',
      tagline: {
        pt: 'Uma Vida. Um Ecossistema. A solução definitiva para a fragmentação da vida moderna.',
        en: 'One Life. One Ecosystem. The definitive solution for modern life fragmentation.',
      },
    },
    identity: {
      name: 'IDENTITY',
      tagline: {
        pt: 'Descubra quem você é. Uma jornada de autoconhecimento guiada.',
        en: 'Discover who you are. A guided self-discovery journey.',
      },
    },
    life: {
      name: 'LIFE',
      tagline: {
        pt: 'Fé aplicada. Hábitos que transformam. Uma vida com propósito.',
        en: 'Applied faith. Transforming habits. A life with purpose.',
      },
    },
    flow: {
      name: 'FLOW',
      tagline: {
        pt: 'Ideias em movimento. Da dispersão à ação focada.',
        en: 'Ideas in motion. From dispersion to focused action.',
      },
    },
    business: {
      name: 'HIRING',
      tagline: {
        pt: 'Avaliação comportamental para contratações mais assertivas.',
        en: 'Behavioral assessment for better hiring decisions.',
      },
    },
    praxis: {
      name: 'PRAXIS',
      tagline: {
        pt: 'Ferramentas para profissionais de desenvolvimento humano.',
        en: 'Tools for human development professionals.',
      },
    },
    discernir: {
      name: 'DISCERNIR',
      tagline: {
        pt: 'Experiência assistida de escuta pastoral.',
        en: 'Pastoral listening assisted experience.',
      },
    },
  };

  const currentBranding = appBranding[activeApp] || appBranding.identity;
  
  // Module links with proper URLs (Ecosystem column)
  const ecosystemLinks = [
    { name: language === 'en' ? 'Ecosystem' : 'Ecossistema', app: 'main' as NelloApp, tagline: language === 'en' ? 'The whole ecosystem' : 'Todo o ecossistema', isPortal: true },
    { name: 'Identity', app: 'identity' as NelloApp, tagline: language === 'en' ? 'Where it all begins' : 'Onde tudo começa' },
    { name: 'Life', app: 'life' as NelloApp, tagline: language === 'en' ? 'Faith and habits' : 'Fé e hábitos' },
    { name: 'Flow', app: 'flow' as NelloApp, tagline: language === 'en' ? 'Ideas and action' : 'Ideias e ação' },
    { name: 'Hiring', app: 'business' as NelloApp, tagline: language === 'en' ? 'Better hiring decisions' : 'Contratação assertiva' },
    { name: 'Praxis', app: 'business' as NelloApp, href: '/praxis', tagline: language === 'en' ? 'For professionals' : 'Área do profissional' },
  ];

  // Support links
  const supportLinks = [
    { 
      label: language === 'en' ? 'Help Center' : 'Central de Ajuda', 
      href: language === 'en' ? '/en/help' : language === 'pt-pt' ? '/pt-pt/ajuda' : '/ajuda',
      external: false 
    },
    { 
      label: 'WhatsApp', 
      href: '/whatsapp',
      external: false,
      icon: MessageCircle
    },
    { 
      label: language === 'en' ? 'Contact' : 'Contato', 
      href: 'mailto:contato@nello.one',
      external: true 
    },
  ];

  // Institutional links (Identity)
  const mapsHref = language === 'en' ? '/en/the-7-maps' : language === 'pt-pt' ? '/pt-pt/os-7-mapas' : '/os-7-mapas';
  const professionalsHref = language === 'en' ? '/en/for-professionals' : language === 'pt-pt' ? '/pt-pt/para-profissionais' : '/para-profissionais';

  // Legal + institutional links
  const legalLinks = [
    { label: language === 'en' ? 'The 7 Maps' : 'Os 7 Mapas', href: mapsHref },
    { label: language === 'en' ? 'For Professionals' : 'Para Profissionais', href: professionalsHref },
    { label: language === 'en' ? 'Terms of Use' : 'Termos de Uso', href: '/termos-de-servico' },
    { label: language === 'en' ? 'Privacy Policy' : 'Política de Privacidade', href: '/politica-de-privacidade' },
  ];

  // Social links (apenas Instagram por enquanto)
  const socialLinks = [
    { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/identity.nello?igsh=YzdvaXdzbHp0ZW1k&utm_source=qr' },
  ];

  const getModuleUrl = (link: typeof ecosystemLinks[0]) => {
    const isPreview = window.location.hostname.includes('lovable') || 
                      window.location.hostname === 'localhost';
    
    if (isPreview) {
      const params = new URLSearchParams(location.search);
      params.set('app', link.app);
      return `/?${params.toString()}${link.href || ''}`;
    }
    
    if (link.href) {
      return `${getNelloAppUrl(link.app)}${link.href}`;
    }
    return getNelloAppUrl(link.app);
  };

  const isActiveModule = (link: typeof ecosystemLinks[0]) => {
    if (link.href === '/praxis') {
      return location.pathname.includes('/praxis');
    }
    return activeApp === link.app && !location.pathname.includes('/praxis');
  };

  return (
    <footer className={cn(
      "py-16 md:py-20 border-t",
      isDark 
        ? "bg-nello-graphite border-white/10" 
        : "bg-background border-border/40"
    )}>
      <div className="container px-6">
        <div className="max-w-6xl mx-auto">
          {/* 4-Column Grid Layout */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 mb-12">
            
            {/* Column 1: About (Sobre) */}
            <div className="col-span-2 md:col-span-1">
              {/* Brand - Dynamic per app */}
              <div className="inline-flex items-center gap-1.5 mb-4">
                <span className={cn(
                  "font-serif text-lg font-bold",
                  isDark ? "text-white" : "text-ink-deep"
                )}>
                  NELLO
                </span>
                <span className={cn(
                  "font-serif text-lg font-light",
                  isDark ? "text-nello-gold" : "text-nello-gold-deep"
                )}>
                  {currentBranding.name}
                </span>
              </div>
              
              {/* Description - Dynamic per app */}
              <p className={cn(
                "text-sm leading-relaxed mb-5",
                isDark ? "text-white/60" : "text-muted-foreground"
              )}>
                {language === 'en' 
                  ? currentBranding.tagline.en
                  : currentBranding.tagline.pt}
              </p>
              
              {/* Social Links */}
              <div className="flex items-center gap-3 mb-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center transition-colors",
                      isDark 
                        ? "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                        : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                    )}
                    aria-label={social.name}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
              
              <LanguageToggle variant="minimal" />
            </div>

            {/* Column 2: Ecosystem (Ecossistema) - Hidden when starting with Identity only */}
            {SHOW_ECOSYSTEM_COLUMN && <div>
              <h4 className={cn(
                "text-xs font-semibold uppercase tracking-widest mb-4",
                isDark ? "text-white" : "text-foreground"
              )}>
                {language === 'en' ? 'Ecosystem' : 'Ecossistema'}
              </h4>
              <ul className="space-y-3">
                {ecosystemLinks.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={getModuleUrl(link)}
                      className={cn(
                        "text-sm transition-colors group flex items-center gap-2",
                        isActiveModule(link) 
                          ? (isDark ? 'text-nello-gold font-medium' : 'text-nello-gold-deep font-medium')
                          : (isDark ? 'text-white/60 hover:text-white' : 'text-muted-foreground hover:text-foreground')
                      )}
                    >
                      <span>{link.name}</span>
                      {isActiveModule(link) && (
                        <span className="w-1.5 h-1.5 rounded-full bg-nello-gold" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>}

            {/* Column 3: Support (Suporte) */}
            <div>
              <h4 className={cn(
                "text-xs font-semibold uppercase tracking-widest mb-4",
                isDark ? "text-white" : "text-foreground"
              )}>
                {language === 'en' ? 'Support' : 'Suporte'}
              </h4>
              <ul className="space-y-3">
                {supportLinks.map((link) => (
                  <li key={link.label}>
                    <a 
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      className={cn(
                        "text-sm transition-colors flex items-center gap-2",
                        isDark ? 'text-white/60 hover:text-white' : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {link.icon && <link.icon className="w-4 h-4" />}
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Legal */}
            <div>
              <h4 className={cn(
                "text-xs font-semibold uppercase tracking-widest mb-4",
                isDark ? "text-white" : "text-foreground"
              )}>
                Legal
              </h4>
              <ul className="space-y-3">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <a 
                      href={link.href}
                      className={cn(
                        "text-sm transition-colors",
                        isDark ? 'text-white/60 hover:text-white' : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className={cn(
            "pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4",
            isDark ? "border-white/10" : "border-border/40"
          )}>
            <p className={cn(
              "text-xs",
              isDark ? "text-white/40" : "text-muted-foreground/60"
            )}>
              © {new Date().getFullYear()} Nello One. {language === 'en' ? 'All rights reserved.' : 'Todos os direitos reservados.'}
            </p>
            <p className={cn(
              "text-xs font-serif italic",
              isDark ? "text-white/40" : "text-muted-foreground/60"
            )}>
              {language === 'en' 
                ? 'Life from the inside out. With Christ at the center.' 
                : 'Vida de dentro para fora. Com Cristo no centro.'}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
